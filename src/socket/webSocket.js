import { transcribeAudioBuffer } from "../services/transcriptionService.js";

export function setupWebSocket(io) {
  io.on("connection", (socket) => {
    console.info("New client connected");

    socket.on("transcribe_audio", async (data) => {
      const { participant, audioData, language, model } = data;

      try {
        const buffer = Buffer.from(audioData);
        const transcript = await transcribeAudioBuffer(buffer, language, model);

        socket.emit(`transcription_${participant}`, {
          transcription: transcript,
        });
      } catch (error) {
        console.error("Error during transcription:", error);
      }
    });

    socket.on("disconnect", () => {
      console.info("Client disconnected");
    });
  });
}
