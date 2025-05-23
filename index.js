const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		//Vercelでデプロイした時のURLか、Next.jsのデフォルトポート
		origin: process.env.CLIENT_URL || "http://localhost:3001", // Next.jsのデフォルトポート
		methods: ["GET", "POST"]
	}
});

app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
	//接続されたら
	console.log('接続されました');

	//chat messageイベントが発生し、msgを受信したら
	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	//接続が切れたら
	socket.on('disconnect', () => {
		console.log('接続が切れました');
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`server running at http://localhost:${PORT}`);
});
