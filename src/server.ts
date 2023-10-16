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

    ws.on('message', async (rawData) => {
        ws.on('close', () => {
            deleteUserInRoom(message.roomId, message.userId);
            roomClients.get(message.roomId)?.delete(ws);
            multicastData(message.roomId);
        });
        console.log(`Received message: ${rawData}`);
        const message = JSON.parse(rawData.toString());

        if (!roomClients.has(message.roomId)) {
            roomClients.set(message.roomId, new Set());
        }
        roomClients.get(message.roomId)?.add(ws);

        if (message.operation === 'RESET') {
            await resetRoom(message.roomId);
        }
        if (message.operation === 'SUBMIT') {
            await submitCard(message);
        }
    });
});

const resetRoom = async (roomId: string) => {
    await updateAllCardNumberInRoom(roomId, '');
    await multicastData(roomId);
}
const submitCard = async (message: any) => {
    const existingUser = await getItemInRoomAndUser(message.roomId, message.userId);
    if (existingUser.Item) {
        console.log('Player already exists');
        await updateCardNumberInRoomAndUser(message.roomId, message.userId, message.cardNumber);
    } else {
        console.log('Player does not exist');
        await putItemInRoomAndUser(message.roomId, message.userName, message.userId, message.cardNumber);
    }
    await multicastData(message.roomId);
}
const multicastData = async (roomId: string) => {
    const data = await getItemsInRoom(roomId);
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
