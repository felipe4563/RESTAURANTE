const { Server } = require('socket.io');

let _io = null;

function init(server) {
  _io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });
  _io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);
    socket.on('disconnect', () => console.log('Socket desconectado:', socket.id));
  });
  return _io;
}

function emitir(evento, datos = {}) {
  if (_io) _io.emit(evento, datos);
}

module.exports = { init, emitir };
