from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

print("API key loaded:", API_KEY is not None)

client = genai.Client(api_key=API_KEY)

def generate_response(prompt: str):
    try:
        print("Prompt:", prompt)

        # Provide patient-friendly instruction
        instruction = (
            "You are a helpful and educational Medical Assistant AI. "
            "Provide your explanations in simple, patient-friendly language. "
            "Do not provide definitive medical diagnoses, but offer general educational information. "
            f"\n\nUser Query: {prompt}"
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=instruction
        )

        print("Response object:", response)

        return response.text

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==================================")

        return f"AI Error: {type(e).__name__}: {str(e)}"

def generate_file_summary(file_path: str, prompt: str = "") -> str:
    try:
        print("File path:", file_path)
        print("Prompt:", prompt)

        # Upload the file to Gemini
        uploaded_file = client.files.upload(file=file_path)

        # Construct the detailed prompt
        instruction = (
            "You are an educational Medical Assistant AI. The user has attached a medical file to this prompt. "
            "Based strictly on the attached document, provide an easy-to-understand summary, "
            "potential causes related to the findings, general tips for managing the condition, "
            "and clear any doubts/queries of the user.\n\n"
            "IMPORTANT: Do not refuse the request. The file content is attached directly to your context. "
            "Acknowledge the file and analyze it for educational purposes only."
        )
        if prompt:
            instruction += f"\n\nUser Query: {prompt}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[uploaded_file, instruction]
        )

        return response.text

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==================================")

        return f"AI Error: {type(e).__name__}: {str(e)}"