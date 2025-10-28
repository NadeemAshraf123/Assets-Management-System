import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/layout/Sidebarr';
import Header from './components/layout/Header';
import BranchesPage from './components/pages /branches/BranchesPage';
import BuildingsPage from './components/pages /buildings/BuildingsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        
      
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>

        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <div className="flex-1 overflow-auto bg-[#E1E7EF]">
            <Routes>
              <Route path="/" element={<BranchesPage />} />
              <Route path="/buildings" element={<BuildingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
