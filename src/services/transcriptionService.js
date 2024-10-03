import { getAudioDataFromBuffer } from "./audioProcessing.js";
import * as Whisper from "../models/whisperModel.js";

const models = {
  Whisper,
};

export async function initializeModels() {
  for (const modelName in models) {
    if (models[modelName].initialize) {
      await models[modelName].initialize();
    }
  }
}

export async function transcribeAudioBuffer(
  buffer,
  language = "en",
  model = "Whisper"
) {
  try {
    const audioData = await getAudioDataFromBuffer(buffer);

    if (!models[model]) {
      throw new Error(`Modelo de transcripción no encontrado: ${model}`);
    }

    const transcript = await models[model].transcribe(audioData, language);

    return transcript;
  } catch (error) {
    console.error("Error durante la transcripción:", error);
    throw error;
  }
}
