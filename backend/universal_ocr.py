import os
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import docx
import mimetypes

# Path to Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\DELL\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_path):
    return pytesseract.image_to_string(Image.open(image_path)).strip()

def extract_text_from_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    text = ''
    for img in images:
        text += pytesseract.image_to_string(img)
    return text.strip()

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def extract_text(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)

    if not mime_type:
        return "[ERROR] Unknown file type."

    if mime_type.startswith("image/"):
        return extract_text_from_image(file_path)
    elif mime_type == "application/pdf":
        return extract_text_from_pdf(file_path)
    elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return extract_text_from_docx(file_path)
    else:
        return "[ERROR] Unsupported file format."
