"""
Ingestion des 5 nouveaux documents dans fiscalite_cameroun.
Utilise nomic-embed-text via Ollama.
"""
import os
import re
import hashlib
import requests
import chromadb
from pathlib import Path

CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "fiscalite_cameroun"
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"
IMPOT_DATA = Path(__file__).parent.parent / "impot-data"

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100

DOCS = [
    "FT impôts et taxes du système fiscal Camerounais 2.pdf",
    "GUIDE UTILISATEUR DSF 2025 DU 03-03-2025.pdf",
    "manuel_contribuable.pdf",
    "PROCEDURE POUR GENERER SON ACF (2).pdf",
    "guide_fiscalis_cameroun.md",
]


def embed(text: str) -> list[float]:
    r = requests.post(OLLAMA_EMBED_URL, json={"model": EMBED_MODEL, "prompt": text})
    r.raise_for_status()
    return r.json()["embedding"]


def chunk_text(text: str, source: str) -> list[dict]:
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    chunks = []
    start = 0
    idx = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        if chunk.strip():
            doc_id = hashlib.md5(f"{source}_{idx}".encode()).hexdigest()
            chunks.append({"id": doc_id, "text": chunk, "source": source, "chunk": idx})
        start += CHUNK_SIZE - CHUNK_OVERLAP
        idx += 1
    return chunks


def extract_text_pdf(path: Path) -> str:
    try:
        import pdfplumber
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n\n"
        return text
    except Exception as e:
        print(f"  pdfplumber failed ({e}), trying PyPDF2...")
        try:
            import PyPDF2
            text = ""
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text += t + "\n\n"
            return text
        except Exception as e2:
            print(f"  PyPDF2 also failed: {e2}")
            return ""


def main():
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    col = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    existing = set(col.get(include=[])["ids"])
    print(f"Chunks existants: {len(existing)}")

    for doc_name in DOCS:
        path = IMPOT_DATA / doc_name
        if not path.exists():
            print(f"[MANQUANT] {doc_name}")
            continue

        print(f"\n[TRAITEMENT] {doc_name}")

        if doc_name.endswith(".md"):
            text = path.read_text(encoding="utf-8")
        else:
            text = extract_text_pdf(path)

        if not text.strip():
            print(f"  Texte vide — passage au suivant")
            continue

        print(f"  Texte extrait: {len(text)} caractères")
        chunks = chunk_text(text, doc_name)
        print(f"  Chunks générés: {len(chunks)}")

        new_chunks = [c for c in chunks if c["id"] not in existing]
        print(f"  Nouveaux chunks à ajouter: {len(new_chunks)}")

        if not new_chunks:
            print(f"  Déjà indexé, skip.")
            continue

        batch_size = 50
        for i in range(0, len(new_chunks), batch_size):
            batch = new_chunks[i:i + batch_size]
            ids = [c["id"] for c in batch]
            texts = [c["text"] for c in batch]
            metadatas = [{"source": c["source"], "chunk": c["chunk"]} for c in batch]

            embeddings = []
            for j, t in enumerate(texts):
                print(f"  Embedding {i+j+1}/{len(new_chunks)}...", end="\r")
                embeddings.append(embed(t))

            col.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)
            existing.update(ids)

        print(f"  OK — {len(new_chunks)} chunks ajoutés")

    print(f"\nTotal chunks dans la collection: {col.count()}")


if __name__ == "__main__":
    main()
