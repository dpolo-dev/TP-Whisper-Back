import app from "./src/app.js";
import { Server } from "socket.io";
import { initializeModels } from "./src/services/transcriptionService.js";
import { setupWebSocket } from "./src/socket/webSocket.js";

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});

const io = new Server(server);

initializeModels();

setupWebSocket(io);

export { io };
