import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PDFDocument, rgb } from "pdf-lib";
import Forminput from './components/Forminput/Forminput';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Forminput />
    </>
  )
}

export default App
