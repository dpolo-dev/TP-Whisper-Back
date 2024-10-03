import { generateToken } from "../services/twilioService.js";

export const getToken = (req, res) => {
  const { identity, roomSid } = req.body;
  const token = generateToken(identity, roomSid);
  res.json({ accessToken: token });
};
