import os
from fastapi import UploadFile

async def save_upload_file(upload_file: UploadFile, dest_folder: str = "uploads") -> str:
    os.makedirs(dest_folder, exist_ok=True)
    dest_path = os.path.join(dest_folder, upload_file.filename)
    with open(dest_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
    return dest_path
