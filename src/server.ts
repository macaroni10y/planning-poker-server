import WebSocket from 'ws';
import http from 'http';
import PlapoRepository from "./aws";

const plapoRepository = new PlapoRepository();

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
        try {
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
        } catch (e) {
            console.log(`Failed to treat message: ${rawData.toString()}`);
        }
    });

    ws.on('close', async () => {
        console.log('Client disconnected');
        if (!roomId || !userId) return;
        await plapoRepository.deleteUserInRoom(roomId, userId);
        roomClients.get(roomId)?.delete(ws);
        await multicastData('DISCONNECTED', roomId);
    });
});

const resetRoom = async (roomId: string) => {
    await plapoRepository.updateAllCardNumberInRoom(roomId, null);
    await multicastData('BE RESET', roomId);
}
const submitCard = async (message: any, roomId: string, userId: string) => {
    const existingUser = await plapoRepository.getItemInRoomAndUser(roomId, userId);
    if (existingUser.Item) {
        console.log('Player already exists');
        await plapoRepository.updateCardNumberInRoomAndUser(roomId, userId, message.cardNumber);
    } else {
        console.log('Player does not exist');
        await plapoRepository.putItemInRoomAndUser(roomId, message.userName, userId, message.cardNumber);
    }
    await multicastData('SUBMITTED', roomId);
}
const multicastData = async (type: string, roomId: string) => {
    const data = await plapoRepository.getItemsInRoom(roomId);
    console.log(`Multicasting data: ${JSON.stringify(data.Items)}`);
    roomClients.get(roomId)?.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: type, data: data.Items}));
        }
    });
};

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
