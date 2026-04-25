"""
OCR des images CGI 2025 + ingestion dans ChromaDB.
Pipeline: image -> pytesseract (texte) -> chunks -> embeddings Ollama -> ChromaDB
Reprend automatiquement si interrompu.
"""

import sys
import time
import requests
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb

try:
    from PIL import Image
    import pytesseract
except ImportError:
    print("Installez d'abord : pip install pillow pytesseract")
    sys.exit(1)

IMAGES_DIR = Path(__file__).parent.parent / "impot-data" / "CGI-2025-images"
CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "fiscalite_cameroun"
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"
LANG = "fra"  # Francais pour tesseract


# ── Helpers ──────────────────────────────────────────────────────────────────

def get_embedding(text: str, retries: int = 5) -> list[float]:
    for attempt in range(retries):
        try:
            resp = requests.post(
                OLLAMA_EMBED_URL,
                json={"model": EMBED_MODEL, "prompt": text},
                timeout=60,
            )
            resp.raise_for_status()
            return resp.json()["embedding"]
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise


class OllamaEmbeddingFunction:
    def name(self) -> str:
        return "ollama-llama3.1"

    def __call__(self, input: list[str]) -> list[list[float]]:
        return [get_embedding(text) for text in input]


def ocr_image(img_path: Path) -> str:
    """Extrait le texte d'une image via tesseract (langue francaise)."""
    img = Image.open(img_path)
    # Convertir en niveaux de gris pour ameliorer l'OCR
    if img.mode != "L":
        img = img.convert("L")
    text = pytesseract.image_to_string(img, lang=LANG, config="--psm 6")
    return text.strip()


def is_ollama_ready() -> bool:
    try:
        get_embedding("test")
        return True
    except Exception:
        return False


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    images = sorted(IMAGES_DIR.glob("cgi2025-*.jpg"))
    if not images:
        print(f"Aucune image trouvee dans {IMAGES_DIR}")
        print("Lancez d'abord : python download_cgi2025.py")
        sys.exit(1)

    print(f"Images trouvees : {len(images)}")

    # Verifier Ollama
    if not is_ollama_ready():
        print("\nOllama n'est pas accessible.")
        print("Lancez : ollama serve")
        sys.exit(1)

    emb_test = get_embedding("test fiscal")
    print(f"Ollama [{EMBED_MODEL}] OK -- dim={len(emb_test)}")

    # Verifier tesseract
    try:
        pytesseract.get_tesseract_version()
        langs = pytesseract.get_languages()
        if "fra" not in langs:
            print("Attention : langue francaise non installee pour tesseract.")
            print("Installez : brew install tesseract-lang")
            LANG_USE = "eng"
        else:
            LANG_USE = "fra"
        print(f"Tesseract OK -- langue: {LANG_USE}")
    except Exception as e:
        print(f"Tesseract non disponible : {e}")
        sys.exit(1)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " "],
    )

    embed_fn = OllamaEmbeddingFunction()
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # get_or_create supporte la reprise sans conflit
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    existing_ids = set(collection.get()["ids"])
    print(f"\nCollection : {len(existing_ids)} chunks deja indexes.")

    total_added = 0
    total_empty = 0
    total_skipped = 0

    print(f"\nDebut OCR + indexation de {len(images)} images...\n")

    for idx, img_path in enumerate(images, 1):
        source = f"CGI-2025/{img_path.name}"
        progress = f"[{idx}/{len(images)}]"

        # Verifier si deja indexe
        first_chunk_id = f"{source}::chunk_0"
        if first_chunk_id in existing_ids:
            total_skipped += 1
            print(f"  {progress} SKIP {img_path.name}", end="\r")
            continue

        print(f"  {progress} OCR {img_path.name}...", end="\r", flush=True)

        # OCR
        try:
            text = ocr_image(img_path)
        except Exception as e:
            print(f"  {progress} ERREUR OCR {img_path.name}: {e}")
            continue

        if not text or len(text) < 50:
            total_empty += 1
            print(f"  {progress} VIDE {img_path.name} (texte trop court, ignore)")
            continue

        # Decouper en chunks
        chunks = splitter.split_text(text)
        if not chunks:
            continue

        ids = [f"{source}::chunk_{i}" for i in range(len(chunks))]
        metas = [{"source": source, "image": img_path.name, "page": idx, "chunk": i} for i in range(len(chunks))]

        # Filtrer chunks deja indexes
        new_data = [(c, i, m) for c, i, m in zip(chunks, ids, metas) if i not in existing_ids]
        if not new_data:
            continue

        nc, ni, nm = zip(*new_data)

        # Embeddings + insertion
        try:
            batch_embeds = embed_fn(list(nc))
            collection.add(
                documents=list(nc),
                embeddings=batch_embeds,
                ids=list(ni),
                metadatas=list(nm),
            )
            total_added += len(nc)
            print(f"  {progress} OK  {img_path.name} -- {len(nc)} chunks | total: {total_added}")
        except Exception as e:
            print(f"  {progress} ERREUR index {img_path.name}: {e}")
            print("  Relancez le script pour reprendre.")
            break

    total_db = collection.count()
    print(f"\n\nOCR + Ingestion terminee !")
    print(f"  Images traitees    : {len(images)}")
    print(f"  Chunks ajoutes     : {total_added}")
    print(f"  Images vides/short : {total_empty}")
    print(f"  Deja indexes       : {total_skipped}")
    print(f"  Total dans ChromaDB: {total_db} chunks")


if __name__ == "__main__":
    main()
