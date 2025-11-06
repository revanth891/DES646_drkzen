# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

# Load your IO Intelligence API key
api_key = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjZmNTIwMTE3LTY4YmQtNDk3MC05YzExLThmMjMwODBlZTk3ZiIsImV4cCI6NDkwNTU1Nzk5NH0.JEzj8-x3o2e7eLWXlW196UWgdRWqYlgcl3_l92gIMt3atDHZIWXiuCwJtdR9LAg5Rul2Nd48N71jeAiOPdGOkw"

# Initialize the IO Intelligence client
client = openai.OpenAI(
    api_key=api_key,
    base_url="https://api.intelligence.io.solutions/api/v1/"
)

# Store chat history per session (in-memory, basic example)
chat_history = [
    {
        "role": "system",
        "content": '''You are a helpful assistant. Your name is TexminGPT, who works in Texmin. You are TexminGPT and made by Vyomchara engineers in India.
        You will always reply with a JSON array of messages. With a maximum of 1 messages.
        Each message has a text, facialExpression, and animation property.
        The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
        The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.'''
    }
]

@app.route("/chat", methods=["POST"])
def chat():
    global chat_history
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    chat_history.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct",
            messages=chat_history,
            temperature=0.8,
            max_completion_tokens=150,
            stream=False,
        )

        assistant_response = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": assistant_response})

        # Trim history
        if len(chat_history) > 21:
            chat_history = [chat_history[0]] + chat_history[-20:]

        return jsonify({"reply": assistant_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
