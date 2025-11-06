# # backend/transcribe.py
# import sys
# import whisper

# def transcribe_audio(audio_path):
#     # Load the Whisper model (choose size based on your needs: tiny, base, small, medium, large)
#     model = whisper.load_model("base")
    
#     # Transcribe the audio
#     result = model.transcribe(audio_path)
    
#     # Return the transcribed text
#     return result["text"]

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Please provide an audio file path")
#         sys.exit(1)
    
#     audio_path = sys.argv[1]
#     text = transcribe_audio(audio_path)
#     print(text)

# transcribe.py
import sys
from faster_whisper import WhisperModel

def transcribe_audio(audio_path):
    model = WhisperModel("base", compute_type="int8", device="cpu")
    segments, _ = model.transcribe(audio_path, beam_size=5)
    return " ".join(segment.text for segment in segments)

if __name__ == "__main__":
    print(transcribe_audio(sys.argv[1]))
