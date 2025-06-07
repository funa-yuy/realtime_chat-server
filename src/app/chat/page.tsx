'use client'

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatApp() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000');
		setSocket(newSocket);

		//chat messageイベントが発生し、msgを受信したら
		newSocket.on('chat message', (msg: string) => {
			//過去のメッセージに追加する
			setMessages(prev => [...prev, msg]);
		});

		return () => {
			newSocket.close();
		};
	}, []);

	useEffect(() => {
		// 自動スクロール
		window.scrollTo(0, document.body.scrollHeight);
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		//messageもsocketもあれば、messageを送信する
		if (message && socket) {
			socket.emit('chat message', message);
			setMessage('');
		}
	};

	return (
		<div>
			<ul id="messages">
				{messages.map((msg, index) => (
					<li key={index} > {msg}</li>
				))}
			</ul>
			<form id="form" onSubmit={handleSubmit}>
				<input
					type="text"
					id="input"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete='off'
				/>
				<button type='submit'>Send</button>
			</form>
		</div >
	);
}
