import io
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader


ALLOWED_TYPES = {
    "application/pdf",
    "text/plain",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


async def extract_text(file: UploadFile) -> str:
    """Extract plain text from an uploaded PDF or TXT file."""

    content_type = file.content_type or ""

    # Validate type
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{content_type}'. Upload PDF or plain text.",
        )

    raw = await file.read()

    # Validate size
    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5 MB.")

    if content_type == "text/plain":
        try:
            return raw.decode("utf-8")
        except UnicodeDecodeError:
            return raw.decode("latin-1")

    # PDF extraction
    try:
        reader = PdfReader(io.BytesIO(raw))
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n".join(pages).strip()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {e}")

    if len(text) < 50:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from PDF. Make sure it is not a scanned image.",
        )

    return text
