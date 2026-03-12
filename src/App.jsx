import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PDFDocument, rgb } from "pdf-lib";
import Forminput from './components/Forminput/Forminput';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/record/:id/' element={<Forminput />}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
