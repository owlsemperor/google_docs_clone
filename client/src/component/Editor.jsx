import React, { useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import { Box } from '@mui/material'
import styled from '@emotion/styled'
import { io } from 'socket.io-client'

import { useParams } from 'react-router-dom'

const Component = styled.div`
  background: #f5f5f5;
`
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],

  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean'],
]
const Editor = () => {
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const { id } = useParams()
  useEffect(() => {
    const quillServer = new Quill('#container', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    })
    quillServer.on('ready', () => {
      quillServer.disable()
      quillServer.setText('Loading...')
      setQuill(quillServer)
    })

    return () => {
      quillServer.off('ready')
    }
  }, [])
  useEffect(() => {
    const socketServer = io(process.env.BASE_URL)
    setSocket(socketServer)
    return () => {
      socketServer.disconnect()
    }
  }, [])
  useEffect(() => {
    if (socket === null || quill === null) return
    const handleChange = (delta, oldData, source) => {
      if (source !== 'user') return
      socket && socket.emit('send-change', delta)
    }
    quill && quill.on('text-change', handleChange)
    return () => {
      quill && quill.off('text-change', handleChange)
    }
  }, [quill, socket])

  useEffect(() => {
    if (socket === null || quill === null) return
    const handleChange = (delta) => {
      quill.updateContents(delta)
    }

    socket && socket.on('receive-change', handleChange)

    return () => {
      socket && socket.off('receive-change', handleChange)
    }
  }, [quill, socket])
  useEffect(() => {
    if (quill === null || socket === null) return

    socket &&
      socket.once('load-document', (document) => {
        quill && quill.setContents(document)
        quill && quill.enable()
      })
    socket && socket.emit('get-document', id)
  }, [quill, socket, id])
  useEffect(() => {
    if (socket === null || quill === null) return

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])
  return (
    <Component>
      <Box id='container' className='container'></Box>
    </Component>
  )
}
export default Editor
