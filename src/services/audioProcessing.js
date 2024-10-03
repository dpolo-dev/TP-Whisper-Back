import pkg from "wavefile";
const { WaveFile } = pkg;

export async function getAudioDataFromBuffer(buffer) {
  const wav = new WaveFile(buffer);

  wav.toBitDepth("32f");
  wav.toSampleRate(16000);

  let audioData = wav.getSamples();

  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] =
          (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
      }
    }
    audioData = audioData[0];
  }

  return audioData;
}
