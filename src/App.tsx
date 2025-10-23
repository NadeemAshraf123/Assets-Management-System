import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Sidebar from './components/layout/Sidebar'

function App() {

  return (
    <>
    <BrowserRouter>
     <Sidebar />

    <Routes>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
