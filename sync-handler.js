// sync-handler.js - 同期機能のためのサーバー側ハンドラー
const syncSessions = new Map(); // セッションID -> { questioner: false, answerer: false, nextUrl: null }

// 共通処理：sessionIdに該当するセッションデータを取得 ----------------------------------------------------------------------
function getSessionData(sessionId) {
	return syncSessions.get(sessionId);
}

// 共通処理：同期状態をクライアントに送信 ----------------------------------------------------------------------
function emitSyncStatus(io, sessionId, sessionData) {
	io.to(sessionId).emit('sync-status', {
		questionerReady: sessionData.questionerReady,
		answererReady: sessionData.answererReady
	});
}

// 共通処理：プレイヤーの準備状態をリセット ----------------------------------------------------------------------
function resetPlayerState(sessionData, role) {
	if (role === 'questioner') {
		sessionData.questionerReady = false;
	} else if (role === 'answerer') {
		sessionData.answererReady = false;
	}
}

// セッション参加処理 ----------------------------------------------------------------------
function handleJoinSession(io, socket, { sessionId, role }) {
	socket.join(sessionId);
	socket.sessionId = sessionId;
	socket.role = role;

	// セッションの初期化
	if (!syncSessions.has(sessionId)) {
		syncSessions.set(sessionId, {
			questionerReady: false,
			answererReady: false,
			nextUrl: null
		});
	}

	// 現在の状態をクライアントに送信
	const sessionData = getSessionData(sessionId);
	emitSyncStatus(io, sessionId, sessionData);
}

// プレイヤー準備完了処理 ----------------------------------------------------------------------
function handlePlayerReady(io, socket, { sessionId, nextUrl }) {
	if (!syncSessions.has(sessionId)) return;

	const sessionData = getSessionData(sessionId);

	// 役割に応じて状態を更新
	if (socket.role === 'questioner') {
		sessionData.questionerReady = true;
	} else if (socket.role === 'answerer') {
		sessionData.answererReady = true;
	}

	// nextUrlを保存
	if (nextUrl) {
		sessionData.nextUrl = nextUrl;
	}

	// セッション内の全てのクライアントに状態を送信
	emitSyncStatus(io, sessionId, sessionData);

	// 両方が準備完了の場合、次のページに進む
	if (sessionData.questionerReady && sessionData.answererReady) {
		if (sessionData.nextUrl) {
			io.to(sessionId).emit('proceed-to-next', {
				nextUrl: sessionData.nextUrl
			});
		} else {
			console.warn(`[sync-handler] セッションID '${sessionId}' で同期が完了しましたが、nextUrlが指定されていません。クライアントへの遷移指示を中止します。`);
		}

		// セッションデータをリセット
		sessionData.questionerReady = false;
		sessionData.answererReady = false;
		sessionData.nextUrl = null;
	}
}

// プレイヤー状態リセット処理 ----------------------------------------------------------------------
function handleResetState(io, socket, { sessionId }) {
	if (!syncSessions.has(sessionId)) return;

	const sessionData = getSessionData(sessionId);

	// プレイヤーの準備状態をリセット
	resetPlayerState(sessionData, socket.role);

	// 状態をクライアントに送信
	emitSyncStatus(io, sessionId, sessionData);
}

// 切断処理 ----------------------------------------------------------------------
function handleDisconnect(io, socket) {
	if (!socket.sessionId || !socket.role || !syncSessions.has(socket.sessionId)) {
		return;
	}

	const sessionData = getSessionData(socket.sessionId);

	// 切断されたプレイヤーの準備状態をリセット
	resetPlayerState(sessionData, socket.role);

	// 他のクライアントに状態を通知
	socket.to(socket.sessionId).emit('sync-status', {
		questionerReady: sessionData.questionerReady,
		answererReady: sessionData.answererReady
	});
}

// メインのイベントハンドラー登録 ----------------------------------------------------------------------
const handleSyncEvents = (io) => {
	io.on('connection', (socket) => {
		socket.on('join-sync-session', (data) => handleJoinSession(io, socket, data));
		socket.on('player-ready', (data) => handlePlayerReady(io, socket, data));
		socket.on('reset-ready-state', (data) => handleResetState(io, socket, data));
		socket.on('disconnect', () => handleDisconnect(io, socket));
	});
};

module.exports = { handleSyncEvents };
