# backend/app.py

import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from universal_ocr import extract_text

app = Flask(__name__)
CORS(app)

STORAGE_DIR = "stored_docs"
UPLOAD_DIR = "uploads"
USERS_FILE = "users.json"

os.makedirs(STORAGE_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 🔐 LOGIN ROUTE
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with open(USERS_FILE) as f:
        users = json.load(f)

    for user in users:
        if user["username"] == username and user["password"] == password:
            return jsonify({
                "status": "success",
                "role": user["role"],
                "username": username
            })
    return jsonify({"status": "failed"}), 401

# 🆕 🔐 REGISTER ROUTE
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = {
        "username": data.get("username"),
        "password": data.get("password"),
        "role": data.get("role")  # issuer or verifier
    }

    if not all(new_user.values()):
        return jsonify({"status": "failed", "message": "Missing fields"}), 400

    with open(USERS_FILE, "r") as f:
        users = json.load(f)

    if any(user["username"] == new_user["username"] for user in users):
        return jsonify({"status": "failed", "message": "Username already exists."}), 409

    users.append(new_user)

    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

    return jsonify({"status": "success", "message": "User registered successfully."})


# 📄 ISSUE DOCUMENT ROUTE
@app.route('/issue', methods=['POST'])
def issue_document():
    file = request.files['file']
    doc_type = request.form.get('documentType')
    issuer = request.form.get('issuer')  # New field (from frontend)

    filename = str(uuid.uuid4())[:8] + "_" + file.filename
    filepath = os.path.join(UPLOAD_DIR, filename)
    file.save(filepath)

    extracted_text = extract_text(filepath)
    doc_id = str(uuid.uuid4())[:8]

    # Save text file named as doc_id
    with open(os.path.join(STORAGE_DIR, f"{doc_id}.txt"), "w", encoding="utf-8") as f:
        f.write(extracted_text)

    return jsonify({
        "documentId": doc_id,
        "extractedText": extracted_text
    })


# ✅ VERIFY WITHOUT DOCUMENT ID
@app.route('/verify', methods=['POST'])
def verify_document_without_id():
    file = request.files['file']
    verifier_username = request.form.get('verifier')  # optional, can be logged

    filepath = os.path.join(UPLOAD_DIR, "verify_" + file.filename)
    file.save(filepath)

    extracted_text = extract_text(filepath).strip()

    for filename in os.listdir(STORAGE_DIR):
        stored_path = os.path.join(STORAGE_DIR, filename)
        with open(stored_path, "r", encoding="utf-8") as f:
            original_text = f.read().strip()
            if extracted_text == original_text:
                matched_id = filename.replace(".txt", "")
                return jsonify({
                    "message": "✅ Document verified successfully.",
                    "matched_id": matched_id
                })

    return jsonify({"message": "❌ Document tampered or not found in records."})


if __name__ == '__main__':
    app.run(debug=True)