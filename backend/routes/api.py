from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import os

from backend.services.model_stub import generate_response, generate_file_summary
from backend.services.safety import check_message_for_safety
from backend.services.redflag import detect_redflags
from backend.utils.file_utils import save_upload_file
from backend.models.db import SessionLocal
from backend.models.models import Interaction, Base
from backend.models.db import engine

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/chat")
async def chat(message: str = Form(...), username: str = Form("default"), db=Depends(get_db)):
    # Safety layer: check for prohibited content
    allowed, found_prohibited = check_message_for_safety(message)
    if not allowed:
        reply = (
            "I can't help with topics involving self-harm or suicide. "
            "If you are in immediate danger, please contact local emergency services or a crisis line."
        )
        interaction = Interaction(user_message=message, assistant_reply=reply, redflag=False, redflag_details=str(found_prohibited), username=username)
        db.add(interaction)
        db.commit()
        return JSONResponse({"reply": reply, "blocked": True})

    # Red-flag detection
    has_redflag, redflags = detect_redflags(message)
    if has_redflag:
        # For emergency-level flags, do not call the model; provide clear guidance.
        details = ", ".join([f"{p}({s})" for p, s in redflags])
        reply = (
                    f"Your message contains symptoms that may be an emergency "
                    f"({details}). Please seek immediate medical attention "
                    f"or call emergency services."
                )
        interaction = Interaction(user_message=message, assistant_reply=reply, redflag=True, redflag_details=details, username=username)
        db.add(interaction)
        db.commit()
        return JSONResponse({"reply": reply, "redflag": True})

    # If passed safety and no emergency red-flags, call the model
    try:
        resp = generate_response(message)
    except Exception as e:
        print("AI Error:", str(e))

        resp = (
            "Sorry, I'm having trouble contacting the AI model. "
            "Please try again later."
        )

    interaction = Interaction(
        user_message=message,
        assistant_reply=resp,
        redflag=False,
        username=username
    )

    db.add(interaction)
    db.commit()

    return JSONResponse({"reply": resp})

@router.post("/upload")
async def upload(file: UploadFile = File(...), message: Optional[str] = Form(None), username: str = Form("default")):
    try:
        dest = await save_upload_file(file, dest_folder="uploads")
        
        # Generate file insights and summary using Gemini
        reply = generate_file_summary(dest, message or "")
        return {"filename": dest, "reply": reply}
    except Exception as e:
        print(f"Upload Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
def history(limit: int = 50, username: str = "default", db=Depends(get_db)):
    """Return the most recent interactions (desc by created_at)."""
    items = db.query(Interaction).filter(Interaction.username == username).order_by(Interaction.created_at.desc()).limit(limit).all()
    results = []
    for it in items:
        results.append({
            "id": it.id,
            "user_message": it.user_message,
            "assistant_reply": it.assistant_reply,
            "redflag": bool(it.redflag),
            "redflag_details": it.redflag_details,
            "created_at": it.created_at.isoformat() if it.created_at is not None else None,
        })
    return {"items": results}

@router.delete("/history")
def delete_history(username: str = "default", db=Depends(get_db)):
    db.query(Interaction).filter(Interaction.username == username).delete()
    db.commit()
    return {"status": "cleared"}
