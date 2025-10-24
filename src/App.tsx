import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Sidebar from './components/layout/Sidebarr';
import Header from './components/layout/Header';
import BranchesPage from './components/pages /branches/BranchesPage';
import AddBranchForm from './components/pages /branches/AddBranchForm';

function App() {

  return (
    <>
    <BrowserRouter>
    <div className='flex h-screen'>
     <Sidebar />

    <div className='flex-1 flex flex-col   '>
     <Header />

    <div className='flex-1 overflow-auto bg-[#E1E7EF]'>
    <Routes>
      <Route path='/' element={ <BranchesPage /> } />

    </Routes>
    </div>
    </div>
    </div>

    </BrowserRouter>
    </>
  )
}

export default App
