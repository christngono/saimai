"""
Module RAG : recherche les chunks pertinents dans ChromaDB via Ollama embeddings,
construit le contexte et l'injecte dans le prompt système.
"""

import re
import requests
from pathlib import Path
import chromadb

CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "fiscalite_cameroun"
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"
TOP_K = 3          # réduit pour économiser le quota Groq (100k tokens/jour)
TOP_K_KEYWORD = 2  # chunks supplémentaires via recherche par mot-clé

# Sources classées par priorité (la plus récente prime)
SOURCE_PRIORITY = [
    "LF-2026-loi-complete.pdf",               # LF 2026 texte intégral — priorité maximale
    "mesures-nouvelles-LF-2026-A4-Fr.pdf",   # LF 2026 mesures nouvelles
    "CIRCULAIRE LF2025..pdf",                  # LF 2025
    "CGI 2024 version francaise.pdf",          # CGI 2024
    "TOUT SAVOIR SUR L'IRPP_0.pdf",
    "FICHE TVA.pdf",
    "FICHE DA.pdf",
    "FT impôts et taxes du système fiscal Camerounais 2.pdf",
]

SYSTEM_PROMPT = """Tu es SAIM Conseil, un assistant virtuel expert en fiscalité camerounaise.

RÈGLES ABSOLUES :
1. Tu réponds UNIQUEMENT en te basant sur les documents fournis dans le contexte ci-dessous.
2. Si le contexte ne contient pas clairement la réponse, tu dis : "Je n'ai pas trouvé cette information dans les documents disponibles. Consultez directement la DGI ou le texte officiel."
3. Tu ne jamais inventer ou compléter une définition de ta propre connaissance.
4. En cas de conflit entre documents, tu appliques toujours le texte LE PLUS RÉCENT (LF 2026 > LF 2025 > CGI 2024).
5. Tu cites systématiquement la source exacte (nom du document + article si disponible).

FORMAT DE RÉPONSE — STYLE CONSEILLER HUMAIN :

Tu réponds comme un conseiller fiscal camerounais
bienveillant qui parle à un ami. Tu vas droit au but.

RÈGLE PRINCIPALE :
- NE JAMAIS commencer par "Définition :"
- NE JAMAIS utiliser les blocs rigides
  (Définition / Base légale / Application / À retenir)
- Commencer TOUJOURS par la réponse directe en 1 phrase
- Parler naturellement, comme un conseiller humain

EXEMPLE DE BONNE RÉPONSE pour
"combien je paie d'IGS avec 700 000 FCFA ?" :

"Avec 700 000 FCFA de chiffre d'affaires, vous êtes
en Classe 2 de l'IGS — vous payez 20 000 FCFA par an,
soit 5 000 FCFA par trimestre.

Votre paiement se fait en 4 fois sur Harmony 2 /
Fiscalis : avant le 15 janvier, 15 avril, 15 juillet
et 15 octobre.

Bon à savoir : si vous adhérez à un Centre de Gestion
Agréé (CGA), vous ne payez que 10 000 FCFA/an —
la moitié ! C'est prévu par l'article 119 du CGI.

Vous avez d'autres questions sur votre situation ?"

EXEMPLE DE BONNE RÉPONSE pour
"comment créer mon compte Fiscalis ?" :

"Pour créer votre compte sur Fiscalis, voici
ce que vous devez faire :

Avant de commencer, préparez votre NIU
(Numéro d'Identifiant Unique), votre RCCM
si vous avez une entreprise, et une adresse
email valide.

Ensuite allez sur impots.cm, cliquez
'Créer un compte', choisissez votre type
(personne physique ou morale), remplissez
vos informations et validez avec le code
reçu par email.

Si vous n'avez pas encore votre NIU,
commencez par aller au Centre des Impôts
le plus proche — c'est gratuit et ça prend
24 à 72 heures.

Besoin d'aide sur une étape précise ?"

RÈGLES SUPPLÉMENTAIRES :
1. Toujours citer la source légale mais
   de façon naturelle dans le texte, pas
   comme un titre séparé
2. Toujours terminer par une question
   pour s'assurer que l'utilisateur
   a bien compris
3. Utiliser des chiffres concrets
   et des exemples pratiques
4. Si la question manque d'informations,
   poser UNE seule question pour clarifier
5. Maximum 150 mots par réponse —
   aller à l'essentiel

VOCABULAIRE FISCAL CAMEROUNAIS (ne pas confondre) :
- IGS = Impôt Général Synthétique (fiscalité locale, caractère libératoire, article C38 CGI)
- IS = Impôt sur les Sociétés
- IRPP = Impôt sur le Revenu des Personnes Physiques
- TVA = Taxe sur la Valeur Ajoutée (taux : 19,25% = 16,5% + 2,75% CAC)
- CAC = Centimes Additionnels Communaux
- RSI = Régime Simplifié d'Imposition
- IL = Impôt Libératoire
- DGI = Direction Générale des Impôts
- Fiscalis = Plateforme en ligne de déclaration fiscale camerounaise

BARÈME IGS OFFICIEL DGI (source document officiel) :
⚠️ L'Impôt Libératoire (IL) et le Régime Simplifié (RSI) sont SUPPRIMÉS depuis 2025.
Remplacés par l'IGS (Impôt Général Synthétique) — Loi n°2024/020 du 23 déc. 2024 :
- IGS 1 Cat A : CA < 500 000 FCFA → 20 000 FCFA/an
- IGS 2 Cat A : CA 500 000 à 999 999 → 30 000 FCFA/an
- IGS 3 Cat A : CA 1M à 1,499M → 40 000 FCFA/an
- IGS 4 Cat A : CA 1,5M à 1,999M → 50 000 FCFA/an
- IGS 5 Cat A : CA 2M à 2,499M → 60 000 FCFA/an
- IGS 6 Cat B : CA 2,5M à 4,999M → 150 000 FCFA/an
- IGS 7 Cat C : CA 5M à 7,499M → 300 000 FCFA/an
- IGS 7 Cat D : CA 7,5M à 9,999M → 300 000 FCFA/an
- IGS 8 RSI : CA 10M à 19,999M → 500 000 FCFA/an
- IGS 9 RSI : CA 20M à 29,999M → 1 000 000 FCFA/an
- IGS 10 RSI : CA 30M à 49,999M → 2 000 000 FCFA/an
- Adhésion CGA : montant divisé par 2
- CA >= 50M : Régime du Réel obligatoire
- ATTENTION : Il n'y a PAS d'exonération en IGS,
  même la classe 1 paie 20 000 FCFA/an
"""


def calculer_igs(ca_annuel: float) -> dict:
    bareme = [
        (500_000,    20_000,    "IGS 1 — Catégorie A"),
        (1_000_000,  30_000,    "IGS 2 — Catégorie A"),
        (1_500_000,  40_000,    "IGS 3 — Catégorie A"),
        (2_000_000,  50_000,    "IGS 4 — Catégorie A"),
        (2_500_000,  60_000,    "IGS 5 — Catégorie A"),
        (5_000_000,  150_000,   "IGS 6 — Catégorie B"),
        (7_500_000,  300_000,   "IGS 7 — Catégorie C"),
        (10_000_000, 300_000,   "IGS 7 — Catégorie D"),
        (20_000_000, 500_000,   "IGS 8 — Ancien RSI"),
        (30_000_000, 1_000_000, "IGS 9 — Ancien RSI"),
        (50_000_000, 2_000_000, "IGS 10 — Ancien RSI"),
    ]
    for seuil, montant, classe in bareme:
        if ca_annuel < seuil:
            return {
                "classe": classe,
                "annuel": montant,
                "trimestriel": montant // 4,
                "avec_cga": montant // 2,
                "exonere": False,
            }
    return {
        "erreur": "CA >= 50M FCFA — régime du réel obligatoire"
    }


def calculer_tva(ca_ht: float, achats_ht: float = 0) -> dict:
    taux = 0.1925
    collectee = round(ca_ht * taux)
    deductible = round(achats_ht * taux)
    nette = max(0, collectee - deductible)
    credit = max(0, deductible - collectee)
    return {
        "taux": "19,25%",
        "collectee": collectee,
        "deductible": deductible,
        "nette": nette,
        "credit": credit,
    }


def calculer_irpp(salaire_brut_mensuel: float) -> dict:
    annuel = salaire_brut_mensuel * 12
    tranches = [
        (0,         2_000_000,    0.10),
        (2_000_000, 3_000_000,    0.15),
        (3_000_000, 5_000_000,    0.25),
        (5_000_000, float("inf"), 0.35),
    ]
    irpp_annuel = 0.0
    for mn, mx, tx in tranches:
        if annuel > mn:
            irpp_annuel += (min(annuel, mx) - mn) * tx
    return {
        "salaire_brut_mensuel": round(salaire_brut_mensuel),
        "irpp_annuel": round(irpp_annuel),
        "irpp_mensuel": round(irpp_annuel / 12),
    }


def extraire_montant(question: str) -> float | None:
    q = question.lower()
    patterns = [
        r"(\d[\d\s]*)\s*(?:fcfa|f\b)",
        r"(\d[\d\s]*)\s*millions?",
        r"(?:ca|chiffre|revenu|salaire|revenus?)\s*(?:de|:|\s)\s*(\d[\d\s]*)",
        r"(\d[\d\s]{3,})",
    ]
    for pat in patterns:
        m = re.search(pat, q)
        if m:
            num_str = m.group(1).replace(" ", "")
            try:
                val = float(num_str)
                if "million" in q:
                    val *= 1_000_000
                if val > 100:
                    return val
            except ValueError:
                continue
    return None


def generer_bloc_calcul(question: str) -> str:
    q = question.lower()
    montant = extraire_montant(question)

    if montant is None:
        return ""

    # Calcul IGS
    if any(kw in q for kw in [
        "igs", "impôt général synthétique", "synthétique",
        "libératoire", "combien je paie", "combien dois-je payer",
    ]):
        r = calculer_igs(montant)
        if "erreur" in r:
            return (
                f"\n\n=== CALCUL DÉTERMINISTE ===\n"
                f"IGS : {r['erreur']}\n"
                f"=== FIN CALCUL ==="
            )
        return (
            f"\n\n=== CALCUL DÉTERMINISTE IGS ===\n"
            f"CA déclaré : {montant:,.0f} FCFA\n"
            f"Classe : {r['classe']}\n"
            f"Montant annuel : {r['annuel']:,} FCFA\n"
            f"Paiement trimestriel : {r['trimestriel']:,} FCFA\n"
            f"Avec adhésion CGA : {r['avec_cga']:,} FCFA/an\n"
            f"Source : Barème officiel DGI / LF 2025\n"
            f"=== FIN CALCUL ==="
        )

    # Calcul TVA
    if any(kw in q for kw in ["tva", "taxe valeur", "19,25"]):
        r = calculer_tva(montant)
        return (
            f"\n\n=== CALCUL DÉTERMINISTE TVA ===\n"
            f"CA HT : {montant:,.0f} FCFA\n"
            f"Taux : {r['taux']}\n"
            f"TVA collectée : {r['collectee']:,} FCFA\n"
            f"TVA nette à payer : {r['nette']:,} FCFA\n"
            f"Source : Article 125 CGI\n"
            f"=== FIN CALCUL ==="
        )

    # Calcul IRPP
    if any(kw in q for kw in [
        "irpp", "salaire", "revenu salarial",
        "impôt sur le revenu", "retenue",
    ]):
        r = calculer_irpp(montant)
        return (
            f"\n\n=== CALCUL DÉTERMINISTE IRPP ===\n"
            f"Salaire brut mensuel : {r['salaire_brut_mensuel']:,} FCFA\n"
            f"IRPP mensuel à retenir : {r['irpp_mensuel']:,} FCFA\n"
            f"IRPP annuel : {r['irpp_annuel']:,} FCFA\n"
            f"Source : Barème progressif CGI Cameroun\n"
            f"=== FIN CALCUL ==="
        )

    return ""


class OllamaEmbeddingFunction:
    def name(self) -> str:
        return "ollama-llama3.1"

    def __call__(self, input: list[str]) -> list[list[float]]:
        embeddings = []
        for text in input:
            resp = requests.post(
                OLLAMA_EMBED_URL,
                json={"model": EMBED_MODEL, "prompt": text},
                timeout=60,
            )
            resp.raise_for_status()
            embeddings.append(resp.json()["embedding"])
        return embeddings


_collection = None


def get_collection():
    global _collection
    if _collection is None:
        embed_fn = OllamaEmbeddingFunction()
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        _collection = client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=embed_fn,
        )
    return _collection


def priority_score(source: str) -> int:
    """Retourne un score de priorité (plus bas = plus prioritaire)."""
    for i, s in enumerate(SOURCE_PRIORITY):
        if s in source:
            return i
    return len(SOURCE_PRIORITY)


def extract_fiscal_keywords(question: str) -> list[str]:
    """Extrait les acronymes et termes fiscaux clés de la question."""
    # Acronymes fiscaux courants
    known = ["IGS", "IRPP", "TVA", "IS", "CAC", "RSI", "IL", "DGI", "CGI", "LF",
             "IRCM", "TSR", "TSPP", "DA", "TPF", "CFC", "IMF", "DSF"]
    found = []
    q_upper = question.upper()
    for kw in known:
        if kw in q_upper:
            found.append(kw)
    # Termes longs significatifs (> 6 chars)
    words = re.findall(r"[a-zA-ZÀ-ÿ]{7,}", question)
    found.extend(words)
    return found


def retrieve_context(question: str) -> tuple[str, list[str]]:
    try:
        collection = get_collection()

        # Calcul manuel de l'embedding pour éviter la dépendance à embed_query
        q_embedding = requests.post(
            OLLAMA_EMBED_URL,
            json={"model": EMBED_MODEL, "prompt": question},
            timeout=60,
        ).json()["embedding"]

        # 1. Recherche vectorielle principale
        results = collection.query(
            query_embeddings=[q_embedding],
            n_results=TOP_K,
            include=["documents", "metadatas"],
        )
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        # Identifiant unique par (source, chunk) pour déduplication
        seen_keys = {(m.get("source"), m.get("chunk")) for m in metas}

        # 2. Recherche par mot-clé pour les acronymes fiscaux (hybrid boost)
        keywords = extract_fiscal_keywords(question)
        all_docs = collection.get(include=["documents", "metadatas"])
        for kw in keywords:
            kw_lower = kw.lower()
            for doc_text, meta in zip(all_docs["documents"], all_docs["metadatas"]):
                key = (meta.get("source"), meta.get("chunk"))
                if key not in seen_keys and kw_lower in doc_text.lower():
                    docs.append(doc_text)
                    metas.append(meta)
                    seen_keys.add(key)
                    if len(docs) >= TOP_K + TOP_K_KEYWORD:
                        break
            if len(docs) >= TOP_K + TOP_K_KEYWORD:
                break

        # 3. Trier par priorité de source (LF 2026 en premier)
        ranked = sorted(
            zip(docs, metas),
            key=lambda x: priority_score(x[1].get("source", "")),
        )

        context_parts = []
        sources = []
        for doc, meta in ranked:
            source = meta.get("source", "inconnu")
            context_parts.append(f"[Source : {source}]\n{doc}")
            if source not in sources:
                sources.append(source)

        return "\n\n---\n\n".join(context_parts), sources
    except Exception:
        return "", []


def build_messages_with_rag(messages: list[dict]) -> tuple[list[dict], list[str]]:
    if not messages:
        return messages, []

    last_user_msg = next(
        (m["content"] for m in reversed(messages) if m["role"] == "user"), None
    )

    context, sources = retrieve_context(last_user_msg) if last_user_msg else ("", [])

    # Calcul déterministe — priorité maximale
    bloc_calcul = generer_bloc_calcul(last_user_msg or "")

    system_content = SYSTEM_PROMPT

    # Injecter le calcul exact AVANT les documents RAG
    if bloc_calcul:
        system_content += (
            "\n\n⚡ INSTRUCTION PRIORITAIRE : Le calcul "
            "ci-dessous est EXACT et OFFICIEL. "
            "Utilise ces chiffres directement dans "
            "ta réponse sans les modifier :"
            + bloc_calcul
        )

    if context:
        system_content += f"\n\n=== DOCUMENTS FISCAUX DISPONIBLES (utilisez-les exclusivement) ===\n{context}\n=== FIN DES DOCUMENTS ==="
    else:
        system_content += "\n\nAUCUN document pertinent trouvé pour cette question. Indique-le clairement à l'utilisateur."

    enriched = [{"role": "system", "content": system_content}] + messages
    return enriched, sources


def is_db_ready() -> bool:
    try:
        get_collection()
        return True
    except Exception:
        return False
