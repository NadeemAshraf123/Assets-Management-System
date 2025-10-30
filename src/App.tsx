import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/layout/Sidebarr';
import Header from './components/layout/Header';
import BranchesPage from './components/pages /branches/BranchesPage';
import BuildingsPage from './components/pages /buildings/BuildingsPage';
import FloorsPage from './components/pages /floors/FloorsPage';
import SpacesPage from './components/pages /spaces/SpacesPage';
import AddSpacePage from './components/pages /spaces/AddSpacePage';
import { Toaster } from "react-hot-toast";
import EditSpacePage from './components/pages /spaces/EditSpacePage';
import { useState } from 'react';



function App() {

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
    <BrowserRouter>

         <Header setIsSidebarOpen={setIsSidebarOpen} />
        
      
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

          <div className="flex-1 flex flex-col min-w-0">
            <div className='flex-1 overflow-auto bg-[#E1E7E7]'>
            <Routes>
              <Route path="/" element={<BranchesPage />} />
              <Route path="/branches" element={<BranchesPage />} />

              <Route path="/buildings" element={<BuildingsPage />} />
              <Route path="/floors" element={<FloorsPage />} />

              <Route path="/spaces" element={<SpacesPage />  } />
              <Route path="/addspacepage" element={<AddSpacePage />  } />
              <Route path="/spaces/edit/:id" element={<EditSpacePage />  } />


            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
</>
  );
}

export default App;
