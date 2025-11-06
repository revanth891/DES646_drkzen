import sys
import wave
from piper import PiperVoice

def synthesize_text_to_wav(text: str, output_path: str, model_path: str, config_path: str):
    """
    Synthesizes text to a WAV file using a Piper TTS model.
    """
    try:
        voice = PiperVoice.load(model_path, config_path)
        sample_rate = voice.config.sample_rate

        with wave.open(output_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)

            for chunk in voice.synthesize(text):
                # Corrected line: Convert the AudioChunk object to a memoryview
                # This directly accesses the underlying buffer without an intermediate copy
                wf.writeframesraw(memoryview(chunk))

        print(f"Successfully synthesized audio to '{output_path}'")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python piper_tts.py \"<text>\" <output_path>")
        sys.exit(1)

    model_file = "models/hi_IN-pratham-medium.onnx"
    config_file = "models/hi_IN-pratham-medium.onnx.json"

    input_text = sys.argv[1]
    output_wav_path = sys.argv[2]
    
    synthesize_text_to_wav(input_text, output_wav_path, model_file, config_file)