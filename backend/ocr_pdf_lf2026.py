"""
OCR de la Loi des Finances 2026 (PDF scanné, 151 pages).
Pipeline : PDF -> images (pdf2image/poppler) -> tesseract fra -> chunks -> embeddings -> ChromaDB
Reprend automatiquement si interrompu (skip des IDs déjà présents).
"""

import sys
import time
import requests
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb

try:
    from pdf2image import convert_from_path
except ImportError:
    print("Installez : pip install pdf2image")
    sys.exit(1)

try:
    from PIL import Image
    import pytesseract
except ImportError:
    print("Installez : pip install pillow pytesseract")
    sys.exit(1)

PDF_PATH = Path(__file__).parent.parent / "impot-data" / "loi-des-finances-2026" / "Loi du 17 décembre 2025 portant loi des Finances de la République du Cameroun pour lexercice 2026.pdf"
CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "fiscalite_cameroun"
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"
SOURCE_NAME = "LF-2026-loi-complete.pdf"
POPPLER_PATH = "/opt/homebrew/Cellar/poppler/26.04.0/bin"
LANG = "fra"
DPI = 200


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


def ocr_page(image: Image.Image) -> str:
    if image.mode != "L":
        image = image.convert("L")
    return pytesseract.image_to_string(image, lang=LANG, config="--psm 6").strip()


def is_ollama_ready() -> bool:
    try:
        get_embedding("test")
        return True
    except Exception:
        return False


def main():
    if not PDF_PATH.exists():
        print(f"PDF introuvable : {PDF_PATH}")
        sys.exit(1)

    print(f"PDF : {PDF_PATH.name}")

    if not is_ollama_ready():
        print("Ollama non accessible. Lancez : ollama serve")
        sys.exit(1)

    emb_test = get_embedding("test fiscal")
    print(f"Ollama [{EMBED_MODEL}] OK — dim={len(emb_test)}")

    try:
        pytesseract.get_tesseract_version()
        langs = pytesseract.get_languages()
        lang_use = "fra" if "fra" in langs else "eng"
        print(f"Tesseract OK — langue: {lang_use}")
    except Exception as e:
        print(f"Tesseract non disponible : {e}")
        sys.exit(1)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " "],
    )

    embed_fn = OllamaEmbeddingFunction()
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    existing_ids = set(collection.get()["ids"])
    print(f"Collection : {len(existing_ids)} chunks déjà indexés.")

    print(f"\nConversion PDF → images (DPI={DPI})...")
    try:
        pages = convert_from_path(str(PDF_PATH), dpi=DPI, poppler_path=POPPLER_PATH)
    except Exception as e:
        print(f"Erreur conversion PDF : {e}")
        sys.exit(1)

    print(f"Pages converties : {len(pages)}")
    print(f"\nDébut OCR + indexation...\n")

    total_added = 0
    total_empty = 0
    total_skipped = 0

    for idx, image in enumerate(pages, 1):
        progress = f"[{idx}/{len(pages)}]"
        first_chunk_id = f"{SOURCE_NAME}::page_{idx}::chunk_0"

        if first_chunk_id in existing_ids:
            total_skipped += 1
            print(f"  {progress} SKIP page {idx}", end="\r")
            continue

        print(f"  {progress} OCR page {idx}...", end="\r", flush=True)

        try:
            text = ocr_page(image)
        except Exception as e:
            print(f"  {progress} ERREUR OCR page {idx}: {e}")
            continue

        if not text or len(text) < 50:
            total_empty += 1
            print(f"  {progress} VIDE page {idx} (texte trop court, ignoré)")
            continue

        chunks = splitter.split_text(text)
        if not chunks:
            continue

        ids = [f"{SOURCE_NAME}::page_{idx}::chunk_{i}" for i in range(len(chunks))]
        metas = [{"source": SOURCE_NAME, "page": idx, "chunk": i} for i in range(len(chunks))]

        new_data = [(c, i, m) for c, i, m in zip(chunks, ids, metas) if i not in existing_ids]
        if not new_data:
            continue

        nc, ni, nm = zip(*new_data)

        try:
            batch_embeds = embed_fn(list(nc))
            collection.add(
                documents=list(nc),
                embeddings=batch_embeds,
                ids=list(ni),
                metadatas=list(nm),
            )
            total_added += len(nc)
            print(f"  {progress} OK page {idx} — {len(nc)} chunks | total ajoutés: {total_added}")
        except Exception as e:
            print(f"  {progress} ERREUR index page {idx}: {e}")
            print("  Relancez le script pour reprendre là où ça s'est arrêté.")
            break

    total_db = collection.count()
    print(f"\n\nOCR + Ingestion terminée !")
    print(f"  Pages traitées     : {len(pages)}")
    print(f"  Chunks ajoutés     : {total_added}")
    print(f"  Pages vides/courtes: {total_empty}")
    print(f"  Déjà indexées      : {total_skipped}")
    print(f"  Total dans ChromaDB: {total_db} chunks")


if __name__ == "__main__":
    main()
