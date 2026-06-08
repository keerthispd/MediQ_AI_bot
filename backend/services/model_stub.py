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

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        print("Response object:", response)

        return response.text

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==================================")

        return f"AI Error: {type(e).__name__}: {str(e)}"