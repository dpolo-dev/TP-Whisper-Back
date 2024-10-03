import { createRoom as createTwilioRoom, listActiveRooms as listTwilioActiveRooms } from '../services/twilioService.js';
import db from '../db/db.js';

export const createRoom = async (req, res) => {
  const roomName = req.body.roomName || "";
  try {
    const room = await createTwilioRoom(roomName);
    const mainRoom = { _id: room.sid, _rev: "", breakouts: [] };

    try {
      await db.put(mainRoom);
      res.status(200).send({
        message: `New video room ${room.uniqueName} created`,
        room: mainRoom,
      });
      req.io.emit("Main room created");
    } catch (error) {
      res.status(400).send({ message: `Error saving room`, error });
    }
  } catch (error) {
    res.status(400).send({ message: `Unable to create room`, error });
  }
};

export const createBreakoutRoom = async (req, res) => {
  const { roomName = "", parentSid } = req.body;

  if (!parentSid) {
    return res
      .status(400)
      .send({ message: `No parentSid provided for breakout room` });
  }

  try {
    const breakoutRoom = await createTwilioRoom(roomName);
    try {
      const mainRoom = await db.get(parentSid);
      mainRoom.breakouts.push(breakoutRoom.sid);
      await db.put(mainRoom);

      res.status(200).send({
        message: `Breakout room ${breakoutRoom.uniqueName} created`,
        room: mainRoom,
      });
      req.io.emit("Breakout room created");
    } catch (error) {
      res.status(400).send({ message: `Error saving breakout room`, error });
    }
  } catch (error) {
    res.status(400).send({ message: `Unable to create breakout room`, error });
  }
};

export const listActiveRooms = async (req, res) => {
  try {
    const rooms = await listTwilioActiveRooms();
    const activeRoomSids = rooms.map((room) => room.sid);

    try {
      const dbRooms = await db.allDocs({ include_docs: true });
      const dbActiveRooms = dbRooms.rows.filter((row) =>
        activeRoomSids.includes(row.id)
      );

      const videoRooms = dbActiveRooms.map((row) => {
        const activeMainRoom = rooms.find((room) => room.sid === row.doc._id);
        const breakoutSids = row.doc.breakouts;
        const activeBreakoutRooms = rooms.filter((room) =>
          breakoutSids.includes(room.sid)
        );

        const breakouts = activeBreakoutRooms.map((room) => ({
          _id: room.sid,
          name: room.uniqueName,
        }));

        return {
          _id: activeMainRoom.sid,
          name: activeMainRoom.uniqueName,
          breakouts,
        };
      });

      res.status(200).send({ rooms: videoRooms });
    } catch (error) {
      res.status(400).send({ message: `Error retrieving video rooms`, error });
    }
  } catch (error) {
    res.status(400).send({ message: `Unable to list rooms`, error });
  }
};
