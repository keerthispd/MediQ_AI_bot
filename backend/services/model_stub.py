from google import genai
from dotenv import load_dotenv
import os
import time

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
            "Use a clear and simple format. Structure your response with short paragraphs, "
            "bullet points, and bold text for key terms so it is easy to scan and understand. "
            "Do not provide definitive medical diagnoses, but offer general educational information. "
            f"\n\nUser Query: {prompt}"
        )
        
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=instruction
                )
                print("Response object:", response)
                return response.text
            except Exception as e:
                if attempt < 2 and ("503" in str(e) or "429" in str(e) or "500" in str(e)):
                    time.sleep(2)
                else:
                    raise e

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==================================")

        return "Sorry, the AI model is currently experiencing high demand or a temporary issue. Please try again in a few moments."

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
            "Use a clear and simple format. Structure your response with short paragraphs, "
            "bullet points, and bold headers (e.g., **Summary**, **Potential Causes**, **Tips**) so it is easy to read. "
            "IMPORTANT: Do not refuse the request. The file content is attached directly to your context. "
            "Acknowledge the file and analyze it for educational purposes only."
        )
        if prompt:
            instruction += f"\n\nUser Query: {prompt}"

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[uploaded_file, instruction]
                )
                return response.text
            except Exception as e:
                if attempt < 2 and ("503" in str(e) or "429" in str(e) or "500" in str(e)):
                    time.sleep(2)
                else:
                    raise e

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==================================")

        return "Sorry, the AI model is currently experiencing high demand or a temporary issue. Please try again in a few moments."