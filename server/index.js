import connection from './db/db.js'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 5000
import { getDocument, updateDocument } from './controller/documentController.js'
const io = new Server(PORT, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
connection()
io.on('connection', (socket) => {
  socket.on('get-document', async (documentId) => {
    const document = await getDocument(documentId)
    socket.join(documentId)
    socket.emit('load-document', document.data)
    socket.on('send-change', (delta) => {
      socket.broadcast.to(documentId).emit('receive-change', delta)
    })
    socket.on('save-document', async (data) => {
      await updateDocument(documentId, data)
    })
  })
})
