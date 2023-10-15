import WebSocket from 'ws';
import http from 'http';
import {getItemInRoomAndPlayer, getItemsInRoom, putItemInRoomAndPlayer, updateItemInRoomAndPlayer} from "./aws";

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WebSocket server running');
});

const wss = new WebSocket.Server({server});

wss.on('connection', async (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log(`Received message: ${message}`);
        const messageObject = JSON.parse(message.toString());
        const existingPlayer = await getItemInRoomAndPlayer(messageObject.roomId, messageObject.playerTimestamp);
        if (existingPlayer.Item) {
            console.log('Player already exists');
            await updateItemInRoomAndPlayer(messageObject.roomId, messageObject.playerTimestamp, messageObject.cardNumber);
        } else {
            console.log('Player does not exist');
            await putItemInRoomAndPlayer(messageObject.roomId, messageObject.playerId, messageObject.playerTimestamp, messageObject.cardNumber);
        }
        const itemsInRoom = await getItemsInRoom(messageObject.roomId);
        broadcastData(JSON.stringify(itemsInRoom.Items));
    });
});

const broadcastData = (data: any) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
