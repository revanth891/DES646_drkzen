// Keeps one `python emotion_detector.py --serve` process alive and sends it
// one JSON line per message. Python, NLTK and TextBlob then load once at
// start-up instead of once per message (about 2 s each time).
//
// Settings (environment):
//   EMOTION_PYTHON      interpreter to run (default "python", as before)
//   EMOTION_TIMEOUT_MS  per-request limit before the worker is restarted (default 20000)
import { spawn } from "child_process";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PYTHON = process.env.EMOTION_PYTHON || "python";
const TIMEOUT_MS = Number(process.env.EMOTION_TIMEOUT_MS || 20000);

let worker = null;
let nextId = 1;

function failAll(w, reason) {
  for (const p of w.pending.values()) {
    clearTimeout(p.timer);
    p.reject(new Error(reason));
  }
  w.pending.clear();
}

export function startEmotionWorker() {
  if (worker) return worker;
  const proc = spawn(PYTHON, ["emotion_detector.py", "--serve"], {
    cwd: HERE,
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUNBUFFERED: "1" },
    windowsHide: true,
  });
  const w = { proc, pending: new Map() };
  worker = w;

  readline.createInterface({ input: proc.stdout }).on("line", (line) => {
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return; // not a protocol line
    }
    const p = w.pending.get(msg.id);
    if (!p) return; // the ready line, or a reply that already timed out
    w.pending.delete(msg.id);
    clearTimeout(p.timer);
    if (msg.error) p.reject(new Error(msg.error));
    else p.resolve(msg.result);
  });
  proc.stderr.on("data", () => {}); // NLTK notices; drained so the pipe never fills
  proc.stdin.on("error", () => {}); // reported through "exit" instead

  const onGone = (reason) => {
    if (worker === w) worker = null;
    failAll(w, reason);
  };
  proc.on("exit", (code) => onGone(`emotion worker exited (code ${code})`));
  proc.on("error", (err) => onGone(`emotion worker could not start: ${err.message}`));
  return w;
}

export function detectEmotionWithWorker(text) {
  const w = startEmotionWorker();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      w.pending.delete(id);
      reject(new Error(`emotion worker timed out after ${TIMEOUT_MS} ms`));
      w.proc.kill(); // a stuck worker is replaced on the next request
    }, TIMEOUT_MS);
    w.pending.set(id, { resolve, reject, timer });
    w.proc.stdin.write(JSON.stringify({ id, text: String(text ?? "") }) + "\n");
  });
}

export function stopEmotionWorker() {
  if (!worker) return;
  const w = worker;
  worker = null;
  w.proc.stdin.end();
  w.proc.kill();
  failAll(w, "emotion worker stopped");
}
