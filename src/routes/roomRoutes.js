import express from "express";
import {
  createRoom,
  createBreakoutRoom,
  listActiveRooms,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/main", createRoom);
router.post("/breakout", createBreakoutRoom);
router.get("/", listActiveRooms);

export default router;
