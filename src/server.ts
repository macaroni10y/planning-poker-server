import WebSocket from 'ws';
import http from 'http';
import {
    deleteUserInRoom,
    getItemInRoomAndUser,
    getItemsInRoom,
    putItemInRoomAndUser,
    updateAllCardNumberInRoom,
    updateCardNumberInRoomAndUser
} from "./aws";

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WebSocket server running');
});

const wss = new WebSocket.Server({server});

const roomClients: Map<string, Set<WebSocket>> = new Map();

wss.on('connection', async (ws) => {
    console.log('Client connected');
    let roomId = '';
    let userId = '';

    ws.on('message', async (rawData) => {
        console.log(`Received message: ${rawData}`);
        const message = JSON.parse(rawData.toString());
        roomId = message.roomId;
        userId = message.userId;

        if (!roomClients.has(roomId)) {
            roomClients.set(roomId, new Set());
        }
        roomClients.get(roomId)?.add(ws);

        if (message.operation === 'RESET') {
            await resetRoom(roomId);
        }
        if (message.operation === 'SUBMIT') {
            await submitCard(message, roomId, userId);
        }
    });

    ws.on('close', async () => {
        console.log('Client disconnected');
        if (!roomId || !userId) return;
        await deleteUserInRoom(roomId, userId);
        roomClients.get(roomId)?.delete(ws);
        await multicastData(roomId);
    });
});

const resetRoom = async (roomId: string) => {
    await updateAllCardNumberInRoom(roomId, '');
    await multicastData(roomId);
}
const submitCard = async (message: any, roomId: string, userId: string) => {
    const existingUser = await getItemInRoomAndUser(roomId, userId);
    if (existingUser.Item) {
        console.log('Player already exists');
        await updateCardNumberInRoomAndUser(roomId, userId, message.cardNumber);
    } else {
        console.log('Player does not exist');
        await putItemInRoomAndUser(roomId, message.userName, userId, message.cardNumber);
    }
    await multicastData(roomId);
}
const multicastData = async (roomId: string) => {
    const data = await getItemsInRoom(roomId);
    console.log(`Multicasting data: ${JSON.stringify(data.Items)}`);
    roomClients.get(roomId)?.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data.Items));
        }
    });
};

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
