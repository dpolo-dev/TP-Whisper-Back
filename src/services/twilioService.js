import twilio from "twilio";
import twilioConfig from "../config/twilio.js";

const twilioClient = new twilio(twilioConfig.apiKey, twilioConfig.apiSecret, {
  accountSid: twilioConfig.accountSid,
});

export const createRoom = (roomName) => {
  return twilioClient.video.rooms.create({
    uniqueName: roomName,
    type: "group",
  });
};

export const listActiveRooms = () => {
  return twilioClient.video.rooms.list({ status: "in-progress", limit: 20 });
};

export const generateToken = (identity, roomSid) => {
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(
    twilioConfig.accountSid,
    twilioConfig.apiKey,
    twilioConfig.apiSecret,
    { identity }
  );

  const grant = new VideoGrant({ room: roomSid });
  token.addGrant(grant);

  return token.toJwt();
};
