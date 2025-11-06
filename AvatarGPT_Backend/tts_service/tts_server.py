# from fastapi import FastAPI
# from pydantic import BaseModel
# from transformers import AutoTokenizer
# from parler_tts import ParlerTTSForConditionalGeneration
# import soundfile as sf
# import base64
# import io
# import torch
# import uvicorn

# app = FastAPI()

# # Pick device
# device = "cuda" if torch.cuda.is_available() else "cpu"

# # Load model & tokenizers
# print("Loading Indic Parler-TTS model...")
# model_id = "ai4bharat/indic-parler-tts"
# model = ParlerTTSForConditionalGeneration.from_pretrained(model_id).to(device)
# tokenizer = AutoTokenizer.from_pretrained(model_id)
# desc_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)

# class TTSRequest(BaseModel):
#     text: str
#     description: str = "Hindi female voice, warm and clear, natural Hinglish style"

# @app.post("/tts")
# def tts(req: TTSRequest):
#     # Tokenize description (voice style)
#     desc_ids = desc_tokenizer(req.description, return_tensors="pt").to(device)
#     # Tokenize actual message text
#     prompt_ids = tokenizer(req.text, return_tensors="pt").to(device)

#     # Generate audio
#     with torch.no_grad():
#         audio = model.generate(
#             input_ids=desc_ids.input_ids,
#             attention_mask=desc_ids.attention_mask,
#             prompt_input_ids=prompt_ids.input_ids,
#             prompt_attention_mask=prompt_ids.attention_mask
#         )

#     audio_arr = audio.cpu().numpy().squeeze()

#     # Convert to Base64 WAV
#     buf = io.BytesIO()
#     sf.write(buf, audio_arr, model.config.sampling_rate, format="WAV")
#     return {"audio": base64.b64encode(buf.getvalue()).decode()}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=5005)


from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer
from parler_tts import ParlerTTSForConditionalGeneration
import soundfile as sf
import base64
import io
import torch
import uvicorn

app = FastAPI()

# Pick device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load model & tokenizers
print("Loading Indic Parler-TTS model...")
model_id = "ai4bharat/indic-parler-tts"
model = ParlerTTSForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

tokenizer = AutoTokenizer.from_pretrained(model_id)
desc_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)

class TTSRequest(BaseModel):
    text: str
    description: str = "Hindi female voice, warm and clear, natural Hinglish style"
    max_new_tokens: int = 1024
    speed: float = 1.0  # future: implement speed control

@app.post("/tts")
def tts(req: TTSRequest):
    # Tokenize description (voice style)
    desc_ids = desc_tokenizer(req.description, return_tensors="pt").to(device)
    # Tokenize actual message text
    prompt_ids = tokenizer(req.text, return_tensors="pt").to(device)

    # Generate audio
    with torch.no_grad():
        audio = model.generate(
            input_ids=desc_ids.input_ids,
            attention_mask=desc_ids.attention_mask,
            prompt_input_ids=prompt_ids.input_ids,
            prompt_attention_mask=prompt_ids.attention_mask,
            do_sample=True,
            max_new_tokens=req.max_new_tokens
        )

    audio_arr = audio.cpu().numpy().squeeze()

    # Convert to Base64 WAV
    buf = io.BytesIO()
    sf.write(buf, audio_arr, model.config.sampling_rate, format="WAV")
    return {"audio": base64.b64encode(buf.getvalue()).decode()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5005)
