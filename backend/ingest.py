"""
Charge les PDFs du dossier impot-data, les découpe en chunks et les indexe dans ChromaDB.
Utilise nomic-embed-text via Ollama pour les embeddings — 100% local, sans internet.
"""

import sys
import requests
from pathlib import Path
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb

PDF_DIR = Path(__file__).parent.parent / "impot-data"
CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "fiscalite_cameroun"
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"


def get_embedding(text: str) -> list[float]:
    resp = requests.post(
        OLLAMA_EMBED_URL,
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


class OllamaEmbeddingFunction:
    def name(self) -> str:
        return "ollama-nomic-embed-text"

    def __call__(self, input: list[str]) -> list[list[float]]:
        embeddings = []
        for text in input:
            embeddings.append(get_embedding(text))
        return embeddings


def extract_text_from_pdf(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages)


def ingest():
    if not PDF_DIR.exists():
        print(f"Erreur : dossier introuvable → {PDF_DIR}")
        sys.exit(1)

    pdfs = list(PDF_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"Aucun PDF trouvé dans {PDF_DIR}")
        sys.exit(1)

    print(f"PDFs trouvés : {len(pdfs)}")
    for p in pdfs:
        print(f"  - {p.name}")

    # Vérifier qu'Ollama répond
    try:
        test_emb = get_embedding("test")
        print(f"\nOllama embeddings OK (dim={len(test_emb)})")
    except Exception as e:
        print(f"\nErreur Ollama : {e}")
        print("Assurez-vous qu'Ollama tourne et que nomic-embed-text est installé.")
        sys.exit(1)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ".", " "],
    )

    embed_fn = OllamaEmbeddingFunction()
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Recréer la collection
    try:
        client.delete_collection(COLLECTION_NAME)
        print("Ancienne collection supprimée.")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )

    total_chunks = 0

    for pdf_path in pdfs:
        source = pdf_path.name
        print(f"\nTraitement : {source}")
        try:
            raw_text = extract_text_from_pdf(pdf_path)
            if not raw_text.strip():
                print(f"  → PDF vide ou non lisible, ignoré.")
                continue

            chunks = splitter.split_text(raw_text)
            print(f"  → {len(chunks)} chunks, calcul des embeddings...")

            ids = [f"{source}::chunk_{i}" for i in range(len(chunks))]
            metadatas = [{"source": source, "chunk": i} for i in range(len(chunks))]

            # Insérer par lots de 50 (embeddings locaux = plus lent)
            batch_size = 50
            for start in range(0, len(chunks), batch_size):
                end = min(start + batch_size, len(chunks))
                batch_docs = chunks[start:end]
                batch_ids = ids[start:end]
                batch_metas = metadatas[start:end]
                batch_embeds = embed_fn(batch_docs)
                collection.add(
                    documents=batch_docs,
                    embeddings=batch_embeds,
                    ids=batch_ids,
                    metadatas=batch_metas,
                )
                print(f"  → {end}/{len(chunks)} chunks indexés", end="\r")

            print(f"  → {len(chunks)} chunks indexés ✅")
            total_chunks += len(chunks)

        except Exception as e:
            print(f"  Erreur : {e}")

    print(f"\n✅ Ingestion terminée — {total_chunks} chunks dans ChromaDB")
    print(f"   Base stockée dans : {CHROMA_DIR}")


if __name__ == "__main__":
    ingest()
