import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import fetch, { Blob, FormData } from "node-fetch";
import OpenAI from "openai";
import { spawn } from "child_process";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT || 3000;

const upload = multer(); // memory storage

const IO_API_KEY= "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjZmNTIwMTE3LTY4YmQtNDk3MC05YzExLThmMjMwODBlZTk3ZiIsImV4cCI6NDkwNTU1Nzk5NH0.JEzj8-x3o2e7eLWXlW196UWgdRWqYlgcl3_l92gIMt3atDHZIWXiuCwJtdR9LAg5Rul2Nd48N71jeAiOPdGOkw"

const SARVAM_API_KEY= "sk_mcokpe7o_nQJ8Rg7TSAjJ2gEL24dozCay"
// ---------- IO Intelligence Client ----------
const ioClient = new OpenAI({
  apiKey: IO_API_KEY,
  baseURL: "https://api.intelligence.io.solutions/api/v1/",
});

// ---------- Generate Chat Messages ----------
const generateMessages = async (userInput) => {
  try {
    // Detect emotion from user input
    let emotionData;
    try {
      emotionData = await detectEmotion(userInput);
      console.log('Detected emotion:', emotionData);
    } catch (emotionError) {
      console.error('Emotion detection failed:', emotionError);
      emotionData = { emotion: 'neutral', confidence: 0 };
    }

    // Map emotions to appropriate responses
    const emotionMappings = {
      happy: {
        style: "respond in a cheerful, enthusiastic way",
        expressions: ["smile", "funnyFace"],
        animations: ["Talking", "Funny_Dance"]
      },
      sad: {
        style: "respond with empathy and comfort",
        expressions: ["sad", "default"],
        animations: ["Idle", "Talking"]
      },
      angry: {
        style: "respond calmly and helpfully to diffuse tension",
        expressions: ["default", "smile"],
        animations: ["Talking", "Idle"]
      },
      surprised: {
        style: "respond with wonder and excitement",
        expressions: ["surprised", "smile"],
        animations: ["Talking", "Funny_Dance"]
      },
      excited: {
        style: "respond with matching enthusiasm and energy",
        expressions: ["smile", "surprised"],
        animations: ["Talking", "Funny_Dance"]
      },
      calm: {
        style: "respond thoughtfully and peacefully",
        expressions: ["default", "smile"],
        animations: ["Talking", "Idle"]
      },
      neutral: {
        style: "respond in a friendly and balanced way",
        expressions: ["smile", "default"],
        animations: ["Talking", "Idle"]
      }
    };

    const userEmotion = emotionData.emotion;
    const emotionConfig = emotionMappings[userEmotion] || emotionMappings.neutral;

    const response = await ioClient.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
Your name is Kino. You are a friendly AI who explains things in a fun and cheerful way.
Avoid roleplaying actions like *wags tail* or *hugs*. Just use happy and kind language.
Keep answers short, clear, and exciting.

The user seems to be feeling ${userEmotion}. ${emotionConfig.style}.
Adapt your response to match their emotional state appropriately.

IMPORTANT: You must ALWAYS reply with a pure and single JSON array, nothing else. And NO EMOJIS.
The outermost structure MUST be [ ... ], even if there is only one message.
Never wrap inside an object like {"messages":[...]} and never return a single object.
Each item must look like this:
{
  "text": "reply text",
  "facialExpression": "smile",
  "animation": "Talking"
}

Allowed facial expressions: smile, sad, angry, surprised, funnyFace, default.
Allowed animations: Talking, Secret, Idle, Rapping, Funny_Dance, Angry.

For ${userEmotion} input, prefer these expressions: ${emotionConfig.expressions.join(', ')}
For ${userEmotion} input, prefer these animations: ${emotionConfig.animations.join(', ')}
          `,
        },
        { role: "user", content: userInput },
      ],
      temperature: 0.8,
      max_tokens: 300,
      stream: false,
    });

    let content = response.choices[0].message.content.trim();

    if (content.startsWith("```")) {
      content = content.replace(/```(json)?/g, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse failed, raw content:", content);
      throw new Error("Invalid JSON from model");
    }

    // ✅ Always normalize to array
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.messages)) {
      return parsed.messages;
    } else {
      return [parsed];
    }
  } catch (e) {
    return [
      {
        text: `An error occurred: ${e.message}`,
        facialExpression: "smile",
        animation: "Idle",
      },
    ];
  }
};


// ---------- Sarvam TTS ----------
const sarvamApiKey = SARVAM_API_KEY;
const sarvamTextToSpeech = async (text) => {
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "api-subscription-key": sarvamApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_language_code: "en-IN",
      speaker: "karun",
    }),
  });

  const json = await res.json();
  const base64 = Array.isArray(json.audios) ? json.audios[0] : json.audios;
  return base64;
};

// ---------- Sarvam STT (multipart upload) ----------
const sarvamSpeechToText = async (audioBuffer, originalName) => {
  const formData = new FormData();
  formData.append("file", new Blob([audioBuffer]), originalName || "audio.webm");

  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: {
      "api-subscription-key": sarvamApiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const errTxt = await res.text();
    throw new Error(`Sarvam STT failed: ${res.status} ${errTxt}`);
  }

  const data = await res.json();
  return data.transcript || data.text || "";
};

// ---------- Emotion Detection ----------
const detectEmotion = (text) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['emotion_detector.py', text], {
      cwd: process.cwd()
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${error}`));
      } else {
        try {
          const emotionData = JSON.parse(result.trim());
          resolve(emotionData);
        } catch (err) {
          reject(new Error(`Failed to parse emotion data: ${err.message}`));
        }
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Text chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Detect emotion first to return it
  let emotionData;
  try {
    emotionData = await detectEmotion(userMessage);
  } catch (emotionError) {
    console.error('Emotion detection failed:', emotionError);
    emotionData = { emotion: 'neutral', confidence: 0 };
  }

  let messages = await generateMessages(userMessage);

  await Promise.all(
    messages.map(async (msg) => {
      msg.audio = await sarvamTextToSpeech(msg.text);
      msg.lipsync = { mouthCues: [] };
    })
  );

  res.send({ messages, emotion: emotionData });
});

// Voice chat (audio upload → Sarvam STT → chat → TTS)
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio provided" });

    // 🔥 Use Sarvam STT with multipart upload
    const transcript = await sarvamSpeechToText(req.file.buffer, req.file.originalname);

    // Detect emotion from transcript
    let emotionData;
    try {
      emotionData = await detectEmotion(transcript);
    } catch (emotionError) {
      console.error('Emotion detection failed:', emotionError);
      emotionData = { emotion: 'neutral', confidence: 0 };
    }

    let messages = await generateMessages(transcript);

    await Promise.all(
      messages.map(async (msg) => {
        msg.audio = await sarvamTextToSpeech(msg.text);
        msg.lipsync = { mouthCues: [] };
      })
    );

    res.send({ messages, emotion: emotionData });
  } catch (err) {
    console.error("Transcribe error:", err);
    res.status(500).json({ error: "Failed to process audio", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





















// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import multer from "multer";
// import fetch from "node-fetch";
// import OpenAI from "openai";

// dotenv.config();

// const app = express();
// app.use(express.json({ limit: "50mb" }));
// app.use(cors({ origin: true, credentials: true }));

// const port = process.env.PORT || 3000;

// const upload = multer(); // memory storage

// // ---------- IO Intelligence Client ----------
// const ioClient = new OpenAI({
//   apiKey: process.env.IO_API_KEY,
//   baseURL: "https://api.intelligence.io.solutions/api/v1/",
// });

// // ---------- Generate Chat Messages ----------
// const generateMessages = async (userInput) => {
//   try {
//     const response = await ioClient.chat.completions.create({
//       model: "openai/gpt-oss-120b",
//       messages: [
//         {
//           role: "system",
//           content: `
// Your name is Aesir. You are a friendly, kid-loving AI who explains things in a fun and cheerful way. 
// Avoid roleplaying actions like *wags tail* or *hugs*. Just use happy and kind language. 
// Keep answers short, clear, and exciting.
// Answer in the language of the user but the reply text should be in english. example: aap kaise ho? 

// IMPORTANT: You must ALWAYS reply with a pure JSON array, nothing else. And NO EMOJIS. 
// The outermost structure MUST be [ ... ], even if there is only one message. 
// Never wrap inside an object like {"messages":[...]} and never return a single object. 
// Each item must look like this:
// {
//   "text": "reply text",
//   "facialExpression": "smile",
//   "animation": "Talking"
// }

// Allowed facial expressions: smile, sad, angry, surprised, funnyFace, default.
// Allowed animations: Talking, Secret, Idle, Rapping, Funny_Dance, Angry.
//           `,
//         },
//         { role: "user", content: userInput },
//       ],
//       temperature: 0.8,
//       max_tokens: 300,
//       stream: false,
//       response_format: {
//         type: "json_object",
//         schema: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               text: { type: "string" },
//               facialExpression: { type: "string" },
//               animation: { type: "string" },
//             },
//             required: ["text", "facialExpression", "animation"],
//           },
//         },
//       },
//     });

//     let content = response.choices[0].message.content.trim();

//     if (content.startsWith("```")) {
//       content = content.replace(/```(json)?/g, "").trim();
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(content);
//     } catch (err) {
//       console.error("JSON parse failed, raw content:", content);
//       throw new Error("Invalid JSON from model");
//     }

//     // ✅ Always normalize to array
//     if (Array.isArray(parsed)) {
//       return parsed;
//     } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.messages)) {
//       return parsed.messages;
//     } else {
//       return [parsed];
//     }
//   } catch (e) {
//     return [
//       {
//         text: `An error occurred: ${e.message}`,
//         facialExpression: "smile",
//         animation: "Idle",
//       },
//     ];
//   }
// };

// // ---------- Sarvam TTS ----------
// const sarvamApiKey = process.env.SARVAM_API_KEY;
// const sarvamTextToSpeech = async (text) => {
//   const res = await fetch("https://api.sarvam.ai/text-to-speech", {
//     method: "POST",
//     headers: {
//       "api-subscription-key": sarvamApiKey,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       text,
//       target_language_code: "en-IN",
//       speaker: "karun",
//     }),
//   });

//   const json = await res.json();
//   const base64 = Array.isArray(json.audios) ? json.audios[0] : json.audios;
//   return base64;
// };

// // ---------- Sarvam STT ----------
// const sarvamSpeechToText = async (audioBuffer) => {
//   const res = await fetch("https://api.sarvam.ai/speech-to-text", {
//     method: "POST",
//     headers: {
//       "api-subscription-key": sarvamApiKey,
//     },
//     body: audioBuffer, // raw PCM/Opus/WebM/MP3 etc.
//   });

//   if (!res.ok) {
//     throw new Error(`Sarvam STT failed: ${res.status} ${res.statusText}`);
//   }

//   const data = await res.json();
//   // According to docs: { "transcript": "text here" }
//   return data.transcript;
// };

// // ---------- Routes ----------
// app.get("/", (req, res) => {
//   res.send("Backend is running!");
// });

// // Text chat
// app.post("/chat", async (req, res) => {
//   const userMessage = req.body.message;
//   let messages = await generateMessages(userMessage);

//   await Promise.all(
//     messages.map(async (msg) => {
//       msg.audio = await sarvamTextToSpeech(msg.text);
//       msg.lipsync = { mouthCues: [] };
//     })
//   );

//   res.send({ messages });
// });

// // Voice chat (audio upload → Sarvam STT → chat → TTS)
// app.post("/transcribe", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No audio provided" });

//     // 🔥 Use Sarvam STT instead of Whisper
//     const transcript = await sarvamSpeechToText(req.file.buffer);
//     let messages = await generateMessages(transcript);

//     await Promise.all(
//       messages.map(async (msg) => {
//         msg.audio = await sarvamTextToSpeech(msg.text);
//         msg.lipsync = { mouthCues: [] };
//       })
//     );

//     res.send({ messages });
//   } catch (err) {
//     console.error("Transcribe error:", err);
//     res.status(500).json({ error: "Failed to process audio", details: err.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

