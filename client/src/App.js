import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import Editor from './component/Editor.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`} />} />
        <Route path='/docs/:id' element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App
