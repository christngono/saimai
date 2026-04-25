"""
Telecharge toutes les images du CGI 2025 depuis impots.cm
URL pattern: https://www.impots.cm/sites/default/files/inline-images/CGI 2025 OK-images-{N}.jpg
Sauvegarde dans impot-data/CGI-2025-images/
Reprend automatiquement si interrompu.
"""

import os
import time
import urllib.request
import urllib.parse
from pathlib import Path

BASE_URL = "https://www.impots.cm/sites/default/files/inline-images/"
IMAGE_NAME = "CGI 2025 OK-images-{n}.jpg"
OUTPUT_DIR = Path(__file__).parent.parent / "impot-data" / "CGI-2025-images"

# Plage de numeros a tester (on s'arrete automatiquement sur 10 echecs consecutifs)
START = 1
MAX = 1500
MAX_CONSECUTIVE_FAILS = 10

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.impots.cm/fr/code-general-des-impots-mis-jour-au-1er-janvier-2025",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}


def download_image(n: int, output_path: Path) -> bool:
    filename = IMAGE_NAME.format(n=n)
    encoded = urllib.parse.quote(filename)
    url = BASE_URL + encoded

    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status != 200:
                return False
            content_type = response.headers.get("Content-Type", "")
            if "image" not in content_type:
                return False
            data = response.read()
            if len(data) < 1000:  # ignore fichiers trop petits (erreur HTML)
                return False
            output_path.write_bytes(data)
            return True
    except Exception:
        return False


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Compter les images deja telechargees
    existing = set(int(f.stem.split("-")[-1]) for f in OUTPUT_DIR.glob("*.jpg") if f.stem.split("-")[-1].isdigit())
    if existing:
        print(f"Images deja presentes : {len(existing)} (max={max(existing)})")

    downloaded = 0
    skipped = 0
    failed = 0
    consecutive_fails = 0
    last_success = 0

    print(f"Dossier de sortie : {OUTPUT_DIR}")
    print(f"Debut du telechargement...\n")

    for n in range(START, MAX + 1):
        output_path = OUTPUT_DIR / f"cgi2025-{n:04d}.jpg"

        # Reprendre : ignorer si deja telecharge
        if n in existing:
            skipped += 1
            continue

        success = download_image(n, output_path)

        if success:
            downloaded += 1
            consecutive_fails = 0
            last_success = n
            size_kb = output_path.stat().st_size // 1024
            print(f"  [{n:04d}] OK  ({size_kb} KB) | total: {downloaded}", end="\r", flush=True)
        else:
            failed += 1
            consecutive_fails += 1
            print(f"  [{n:04d}] FAIL (consecutifs: {consecutive_fails}/{MAX_CONSECUTIVE_FAILS})", end="\r", flush=True)

            if consecutive_fails >= MAX_CONSECUTIVE_FAILS:
                print(f"\n\n{MAX_CONSECUTIVE_FAILS} echecs consecutifs -- fin des images detectee.")
                break

        # Pause courte pour ne pas surcharger le serveur
        time.sleep(0.3)

    total_images = len(list(OUTPUT_DIR.glob("*.jpg")))
    print(f"\n\nTelechargement termine !")
    print(f"  Telecharges cette session : {downloaded}")
    print(f"  Deja presents (ignores)   : {skipped}")
    print(f"  Echecs                    : {failed}")
    print(f"  Total images dans dossier : {total_images}")
    print(f"  Derniere image reussie    : {last_success}")
    print(f"  Dossier : {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
