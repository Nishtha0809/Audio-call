import { io } from "socket.io-client";

const socket = io(
  "https://new-project-1-cqlz.onrender.com",
  {
    transports: ["websocket"],
    withCredentials: true
  }
);

export default socket;