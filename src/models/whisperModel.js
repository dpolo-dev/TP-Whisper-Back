import { pipeline } from "@xenova/transformers";

let transcriber;

export async function initialize() {
  transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-small"
  );
}

export async function transcribe(audioData, language = "es") {
  const transcript = await transcriber(audioData, {
    language,
    task: "transcribe",
    condition_on_previous_text: true,
  });

  return transcript.text;
}
