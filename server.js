import app from "./src/app.js";
import { Server } from "socket.io";
import { initializeModels } from "./src/services/transcriptionService.js";
import { setupWebSocket } from "./src/socket/webSocket.js";
import { connectToDatabase } from "./src/db/db.js";

const port = process.env.PORT || 5000;
let io;

async function startServer() {
  try {
    await connectToDatabase();

    const server = app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });

    io = new Server(server);

    initializeModels();

    setupWebSocket(io);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

export { io };
