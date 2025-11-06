# 🤖 Emotion-Aware 3D Assistant (AvatarGPT)

An advanced AI-powered 3D avatar assistant that understands and responds to human emotions through both text and voice interactions. Built with cutting-edge emotion detection, natural language processing, and real-time 3D avatar animations.

![Emotion Detection](https://img.shields.io/badge/Emotion_Detection-Advanced-blue)
![3D Avatar](https://img.shields.io/badge/3D_Avatar-Interactive-green)
![Voice & Text](https://img.shields.io/badge/Input-Voice_&_Text-purple)
![Real-time](https://img.shields.io/badge/Processing-Real--time-orange)

## ✨ Features

### 🎭 Advanced Emotion Detection
- **10 Emotion Categories**: Joy, Sadness, Anger, Fear, Surprise, Disgust, Anticipation, Trust, Calm, Neutral
- **Multi-Layer Analysis**: Word-level, sentence-level, and contextual analysis
- **Intensity Scoring**: High/Medium/Low intensity detection with confidence scoring
- **Mixed Emotions**: Handles complex emotional states (e.g., "excited but nervous")
- **Negation Handling**: Correctly interprets "I'm not happy" vs "I'm happy"

### 🎨 Interactive 3D Avatar
- **Real-time Animations**: Facial expressions and gestures based on detected emotions
- **Multiple Avatar Models**: Female, Male, Shiba (dog), and Stylized variants
- **Camera Controls**: Zoom, pan, and rotate for immersive interaction
- **Lipsync Technology**: Precise mouth movements synchronized with speech

### 🎤 Dual Input Modes
- **Text Chat**: Type messages with instant emotion analysis
- **Voice Commands**: Speak naturally with real-time speech-to-text and emotion detection
- **Seamless Switching**: Toggle between text and voice modes instantly

### 🎯 Smart AI Responses
- **Emotion-Aware GPT**: Responses adapt to detected emotional state
- **Contextual Understanding**: Considers conversation history and emotional context
- **Personality Consistency**: Maintains character personality while adapting to emotions

### 🎪 Visual Feedback System
- **Emotion Display Panel**: Real-time emotion detection visualization
- **Processing Animation**: Step-by-step analysis display
- **Confidence Metrics**: Detailed emotion scores and confidence levels
- **Theme Support**: Light/Dark mode with automatic system detection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   (External)    │
│                 │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • 3D Avatar     │    │ • Emotion       │    │ • IO            │
│ • Emotion       │    │   Detection     │    │   Intelligence  │
│   Display       │    │ • API Routes    │    │ • Sarvam AI     │
│ • UI Controls   │    │ • TTS/STT       │    │ • GPT Models    │
│ • Theme System  │    │ • Message       │    │                 │
│                 │    │   Processing    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Three.js & React Three Fiber** - 3D graphics and avatar rendering
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Spline** - 3D scene creation and management

### Backend
- **Node.js + Express** - RESTful API server
- **Python** - Advanced emotion detection engine
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### AI & ML Services
- **IO Intelligence** - GPT model hosting (Llama-3.3-70B)
- **Sarvam AI** - Speech-to-Text and Text-to-Speech
- **NLTK** - Natural Language Processing
- **TextBlob** - Sentiment analysis
- **VADER** - Advanced sentiment scoring

### 3D & Audio
- **Spline 3D** - Avatar models and animations
- **Wawa Lipsync** - Lip synchronization technology
- **Web Audio API** - Audio processing and playback

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **Git** for version control
- **Modern web browser** with WebGL support

### 1. Clone the Repository
```bash
git clone https://github.com/revanth891/DES646_drkzen.git
cd DES646_drkzen
```

### 2. Backend Setup
```bash
cd AvatarGPT_Backend

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
yarn

# Set up environment variables
cp .env
# Edit .env with your API keys (see Configuration section)

# Start development server
yarn dev
```

### 3. Frontend Setup
```bash
cd ../AvatarGPT_Frontend

# Install dependencies
yarn

# Start development server
yarn dev
```

### 4. Start the Application
```bash
# Terminal 1: Start Backend
cd AvatarGPT_Backend
yarn dev

# Terminal 2: Start Frontend (if not already running)
cd AvatarGPT_Frontend
yarn dev
```

Visit `http://localhost:5173` to interact with the assistant!

## ⚙️ Configuration

### API Keys Required
Create a `.env` file in the `AvatarGPT_Backend` directory:

```env
# IO Intelligence API
IO_API_KEY=your_io_intelligence_api_key

# Sarvam AI API
SARVAM_API_KEY=your_sarvam_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Getting API Keys
1. **IO Intelligence**: Sign up at [intelligence.io](https://intelligence.io)
2. **Sarvam AI**: Register at [sarvam.ai](https://sarvam.ai)

## 📖 Usage

### Basic Interaction
1. **Text Mode**: Type messages in the input field
2. **Voice Mode**: Click the microphone button and speak
3. **Avatar Control**: Use camera controls to zoom and rotate
4. **Model Selection**: Choose different avatar models from the left panel

### Emotion Detection Features
- **Real-time Analysis**: Emotions are detected instantly as you type or speak
- **Visual Feedback**: Watch the emotion display panel for processing and results
- **Adaptive Responses**: The avatar's expressions and responses adapt to your emotions

### Advanced Features
- **Mixed Emotions**: Try saying "I'm excited but also a little scared"
- **Negation**: Test with "I'm not happy about this" vs "I'm happy about this"
- **Intensity**: Use words like "very", "so", "extremely" for stronger detection

## 🔌 API Endpoints

### Text Chat
```http
POST /chat
Content-Type: application/json

{
  "message": "Hello, I'm feeling excited!"
}
```

**Response:**
```json
{
  "messages": [
    {
      "text": "That's wonderful! I can sense your excitement...",
      "facialExpression": "smile",
      "animation": "Talking",
      "audio": "base64_audio_data",
      "lipsync": { "mouthCues": [...] }
    }
  ],
  "emotion": {
    "emotion": "excited",
    "confidence": 0.85,
    "polarity": 0.7,
    "subjectivity": 0.8
  }
}
```

### Voice Transcription
```http
POST /transcribe
Content-Type: multipart/form-data

audio: [audio_file]
```

**Response:** Same format as text chat with transcribed emotion analysis.

## 🎨 Customization

### Avatar Models
Add new avatar models in `/public/models/` and update the UI component:
```typescript
// In UI.tsx
const models = {
  "female": "Female Avatar",
  "male": "Male Avatar",
  "shiba": "Shiba Dog",
  "stylized": "Stylized Character",
  "your_custom": "Your Custom Model"
};
```

### Emotion Detection
Extend emotion detection in `emotion_detector.py`:
```python
# Add new emotions to emotion_lexicons
self.emotion_lexicons['new_emotion'] = {
    'high': ['word1', 'word2'],
    'medium': ['word3', 'word4'],
    'low': ['word5', 'word6']
}
```

### Theme Customization
Modify themes in `EmotionDisplay.tsx` and `UI.tsx`:
```css
/* Light theme colors */
--primary: #3b82f6;
--secondary: #6366f1;

/* Dark theme colors */
--primary: #60a5fa;
--secondary: #818cf8;
```

## 🧪 Testing

### Emotion Detection Testing
```bash
cd AvatarGPT_Backend
python emotion_detector.py "I'm so happy and excited!"
# Expected: {"emotion": "excited", "confidence": 0.73, ...}
```

### API Testing
```bash
# Test chat endpoint
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Test health
curl http://localhost:3000/
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Add JSDoc comments for new functions
- Test emotion detection with various inputs
- Ensure responsive design works on mobile
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IO Intelligence** for GPT model hosting
- **Sarvam AI** for exceptional TTS/STT services
- **Spline** for 3D avatar capabilities
- **Three.js** community for 3D web graphics
- **NLTK** and **TextBlob** for NLP foundations

*Transforming human-AI interaction through emotional intelligence and immersive 3D experiences.*
