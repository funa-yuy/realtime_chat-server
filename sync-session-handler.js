let sessionState = {
	players: {},
	currentPageIndex: 0,
	readyPlayers: new Set()
};

const MAX_PLAYERS = 2;
const ROLES = ['questioner', 'answerer'];

function emitSessionState(io) {
	const playerCount = Object.keys(sessionState.players).length;
	io.emit('session-state', {
		playerCount,
		maxPlayers: MAX_PLAYERS,
		currentPageIndex: sessionState.currentPageIndex,
		readyPlayers: Array.from(sessionState.readyPlayers),
		players: sessionState.players
	});
}

function resetSession() {
	sessionState.currentPageIndex = 0;
	sessionState.readyPlayers = new Set();
}

function handleJoinSession(io, socket) {
	const playerCount = Object.keys(sessionState.players).length;

	if (playerCount >= MAX_PLAYERS) {
		socket.emit('session-full');
		return;
	}

	sessionState.players[socket.id] = {
		id: socket.id,
		role: null
	};

	socket.emit('session-joined');
	emitSessionState(io);
}

function handleRoleSelection(io, socket, { role }) {
	if (!sessionState.players[socket.id]) return;

	const existingRoles = Object.values(sessionState.players).map(p => p.role);
	if (existingRoles.includes(role)) {
		socket.emit('role-taken');
		return;
	}

	sessionState.players[socket.id].role = role;
	socket.emit('role-assigned', { role });
	emitSessionState(io);
}

function handlePlayerReady(io, socket, { waitType, pageIndex }) {
	if (!sessionState.players[socket.id]) return;

	const playerId = socket.id;
	const playerRole = sessionState.players[socket.id].role;

	if (sessionState.readyPlayers.has(playerId)) {
		sessionState.readyPlayers.delete(playerId);
	} else {
		sessionState.readyPlayers.add(playerId);
	}

	const shouldAdvance = checkShouldAdvancePage(waitType, playerRole);

	if (shouldAdvance) {
		sessionState.currentPageIndex = pageIndex + 1;
		sessionState.readyPlayers.clear();
	}

	emitSessionState(io);
}

function checkShouldAdvancePage(waitType, playerRole) {
	const readyCount = sessionState.readyPlayers.size;

	switch (waitType) {
		case 'both':
			return readyCount === MAX_PLAYERS;
		case 'questioner':
			return sessionState.readyPlayers.has(getPlayerIdByRole('questioner'));
		case 'answerer':
			return sessionState.readyPlayers.has(getPlayerIdByRole('answerer'));
		case 'individual':
			return true;
		default:
			return false;
	}
}

function getPlayerIdByRole(role) {
	return Object.keys(sessionState.players).find(
		id => sessionState.players[id].role === role
	);
}

function handleLeaveSession(io, socket) {
	delete sessionState.players[socket.id];
	sessionState.readyPlayers.delete(socket.id);

	if (Object.keys(sessionState.players).length === 0) {
		resetSession();
	}

	emitSessionState(io);
}

function handleResetSession(io) {
	resetSession();
	emitSessionState(io);
}

const handleSyncSession = (io) => {
	io.on('connection', (socket) => {
		socket.on('join-session', () => handleJoinSession(io, socket));
		socket.on('select-role', (data) => handleRoleSelection(io, socket, data));
		socket.on('player-ready', (data) => handlePlayerReady(io, socket, data));
		socket.on('reset-session', () => handleResetSession(io));
		socket.on('disconnect', () => handleLeaveSession(io, socket));
	});
};

module.exports = { handleSyncSession };
