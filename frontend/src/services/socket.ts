import { io } from "socket.io-client";

// cria uma conexão com o servidor Socket.IO
const socket = io(import.meta.env.API);

// exporta a conexão
export default socket;