'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SyncComponentProps {
	sessionId: string;
	role: 'questioner' | 'answerer';
	nextUrl: string;
	onProceed?: (nextUrl: string) => void;
}

interface SyncStatus {
	questionerReady: boolean;
	answererReady: boolean;
}

// Socket接続とイベント処理を担当するカスタムフック  ----------------------------------------------------------------------
function useSocket(sessionId: string, role: string, nextUrl: string, onProceed?: (url: string) => void) {
	const [socket, setSocket] = useState<Socket | null>(null);
	//自分が「準備完了」ボタンを押したかどうか
	const [isReady, setIsReady] = useState(false);
	//相手が「準備完了」ボタンを押したかどうか
	const [otherReady, setOtherReady] = useState(false);
	//サーバーに接続できているかどうか
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// サーバーへ接続
		const newSocket = io('http://localhost:3000');

		// 接続イベントの設定
		newSocket.on('connect', () => {
			setIsConnected(true);
			newSocket.emit('join-sync-session', { sessionId, role });
		});

		newSocket.on('disconnect', () => {
			setIsConnected(false);
		});

		//server側から送られてきたstatusをもとに、準備OKかを更新
		newSocket.on('sync-status', (status: SyncStatus) => {
			if (role === 'questioner') {
				setIsReady(status.questionerReady);
				setOtherReady(status.answererReady);
			} else {
				setIsReady(status.answererReady);
				setOtherReady(status.questionerReady);
			}
		});

		//server側からお互いが準備完了になったと送られてきたら、次のページに遷移
		newSocket.on('proceed-to-next', ({ nextUrl: receivedNextUrl }) => {
			if (onProceed) {
				onProceed(receivedNextUrl);
			} else {
				window.location.href = receivedNextUrl;
			}
		});

		setSocket(newSocket);
		return () => {
			newSocket.disconnect();
		};
	}, [sessionId, role, onProceed]);

	return { socket, isReady, otherReady, isConnected };
}

// 準備完了ボタンの処理 ----------------------------------------------------------------------
function usePlayerActions(socket: Socket | null, isConnected: boolean, sessionId: string, nextUrl: string) {
	const handleReady = () => {
		if (!socket || !isConnected) return;
		socket.emit('player-ready', { sessionId, nextUrl });
	};

	const handleCancel = () => {
		if (!socket || !isConnected) return;
		socket.emit('reset-ready-state', { sessionId });
	};

	return { handleReady, handleCancel };
}

// メインのSyncComponentコンポーネント ----------------------------------------------------------------------
export default function SyncComponent({
	sessionId,
	role,
	nextUrl,
	onProceed,
}: SyncComponentProps) {
	const { socket, isReady, otherReady, isConnected } = useSocket(sessionId, role, nextUrl, onProceed);
	const { handleReady, handleCancel } = usePlayerActions(socket, isConnected, sessionId, nextUrl);

	const roleDisplayName = role === 'questioner' ? '質問者' : '回答者';

	const handleClick = () => {
		if (isReady) {
			//すでに準備完了だった場合、server側に「キャンセル」を通知
			handleCancel();
		} else {
			//まだ自分が準備完了ではなかった場合、server側に「準備完了」を通知
			handleReady();
		}
	};

	return (
		<div>
			<h2>{roleDisplayName}</h2>

			<div>
				<p>あなた: {isReady ? '準備完了' : '待機中'}</p>
				<p>相手: {otherReady ? '準備完了' : '待機中'}</p>
			</div>

			<button
				onClick={handleClick}
				disabled={!isConnected}
				className={`w-full py-2 px-4 rounded text-white ${!isConnected ? 'bg-gray-400' :
					isReady ? 'bg-red-500' : 'bg-blue-500'
					}`}
			>
				{!isConnected ? '接続中...' : isReady ? 'キャンセル' : '準備完了'}
			</button>
		</div >
	);
};
