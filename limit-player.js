// グローバルセッションの参加者リスト
let globalParticipants = [];
// 最大参加可能人数（2人制限）
const MAX_PARTICIPANTS = 2;

// 全クライアントに現在のセッション状態を送信
function emitGlobalStatus(io) {
	io.emit('global-status', {
		participantCount: globalParticipants.length,
		maxParticipants: MAX_PARTICIPANTS
	});
}

// グローバルセッションへの参加処理
function handleJoinGlobalSession(io, socket) {
	// 人数制限チェック：2人を超える場合はエラーを返す
	if (globalParticipants.length >= MAX_PARTICIPANTS) {
		socket.emit('session-full', {
			message: 'このゲームは満員です（2人制限）',
			currentCount: globalParticipants.length
		});
		return;
	}

	// 参加者リストに新しいクライアントを追加
	globalParticipants.push({
		id: socket.id,
		joinedAt: new Date()
	});

	// 全クライアントに更新された状態を送信
	emitGlobalStatus(io);
	// 参加成功をクライアントに通知
	socket.emit('join-success');
}

// グローバルセッションからの退出処理
function handleLeaveGlobalSession(io, socket) {
	const initialLength = globalParticipants.length;
	// 退出するクライアントを参加者リストから除外
	globalParticipants = globalParticipants.filter(p => p.id !== socket.id);

	// 参加者数に変化があった場合のみ状態を更新
	if (globalParticipants.length !== initialLength) {
		emitGlobalStatus(io);
	}
}

// Socket.IOイベントハンドラーの設定
const handleLimitPlayer = (io) => {
	io.on('connection', (socket) => {
		// クライアントからのセッション参加要求
		socket.on('join-global-session', () => handleJoinGlobalSession(io, socket));
		// クライアントからのセッション退出要求
		socket.on('leave-global-session', () => handleLeaveGlobalSession(io, socket));
		// 接続切断時の自動退出処理
		socket.on('disconnect', () => handleLeaveGlobalSession(io, socket));
	});
};

module.exports = { handleLimitPlayer };
