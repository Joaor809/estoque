import { io } from "socket.io-client";
import api from "./api";

// cria uma conexão com o servidor Socket.IO
const socket = io(api, {
    autoConnect: false
})

// exporta a conexão
export default socket;