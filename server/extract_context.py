# extract_context.py
import sys
import json
import pdfplumber
import os

def extract_context(file_path, current_page):
    pages = []
    with pdfplumber.open(file_path) as pdf:
        start = max(0, current_page - 4)
        end = min(current_page, len(pdf.pages))

        for i in range(start, end):
            page = pdf.pages[i]
            text = page.extract_text()
            if text:
                pages.append(f"--- Page {i + 1} ---\n{text}")
    
    return "\n\n".join(pages)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_context.py <filePath> <currentPage>")
        sys.exit(1)

    file_path = sys.argv[1]
    current_page = int(sys.argv[2])

    if not os.path.exists(file_path):
        print(json.dumps({ "error": "File not found." }))
        sys.exit(1)

    try:
        context = extract_context(file_path, current_page)
        print(json.dumps({ "context": context }))
    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)
