import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styleApp from './App.module.css'
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
      <div style={{width: '100%', display: 'flex', background: '#000', marginTop: '20px'}} className={styleApp.bottom}>
        <div className={styleApp.copy}>
          <img src={'https://image2url.com/r2/default/images/1772511676633-90db477a-ae53-4c5e-9c82-6ce0d9cd4dd3.png'} width={50} height={50} alt='logo poom relax'/>
          <p >© 2026 Poom Relax. All rights reserved</p>
        </div>
      </div>
    </>
  )
}

export default App
