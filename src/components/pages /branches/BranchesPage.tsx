import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import type { RootState } from '../../../app/Store';
import type { Branch } from '../../../features/branches/BranchesSlice'
import {
  fetchBranches,
  deleteBranch,
} from '../../../features/branches/BranchesSlice';
import { FaCog, FaEdit, FaTrash } from 'react-icons/fa';
import AddBranchForm from './AddBranchForm';
import EditBranchModal from './EditBranchModal';

const BranchesPage: React.FC = () => {

  const dispatch = useDispatch();
  const { branches, loading, error } = useSelector((state: RootState) => state.branches);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);



  const openModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);  


  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const filteredBranches = branches.filter((branch: Branch) =>
    branch.name.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="p-6 space-y-6">
    
      <div className="text-sm text-[#0F766E]">
        Administration &gt; Settings &gt; <span className="text-[#0F766E] font-medium">Branches</span>
      </div>

      
      <div className="flex items-center rounded-xl p-2 bg-[#005C5C] justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold text-white">
          <FaCog className="text-white" />
          <span>Branches</span>
        </div>
        <button
            onClick={openModal} 
            className="bg-blue-600 cursor-pointer text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
          + Add New Branch
        </button>
      </div>

      {showAddModal && (
        <div className='fixed h-screen inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-md shadow-lg w-full max-w-3xl p-6 relative'>
            <AddBranchForm  onClose={closeModal}/>
          </div>

        </div>
      )}
      {selectedBranch && (
        <div className='fixed h-screen inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-md shadow-lg w-full max-w-3xl p-6 relativ'>
            <EditBranchModal
               branch={selectedBranch}
               onClose={() => setSelectedBranch(null)}
               />

          </div>
        </div>
      )}

      
      <div className='bg-white rounded-lg p-4 '>
        <input
          type="text"
          placeholder="Search Branch Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      <div className="overflow-x-auto bg-white rounded-3xl">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading branches...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error: {error}</div>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-white text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Branch Name</th>
                <th className="px-4 py-2 text-left">Branch Manager</th>
                <th className="px-4 py-2 text-left">Branch Email</th>
                <th className="px-4 py-2 text-left">Branch Phone Number</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="border-t border-[#E0E5F2]">
                  <td className="px-4 py-2">{branch.name}</td>
                  <td className="px-4 py-2">{branch.manager}</td>
                  <td className="px-4 py-2">{branch.email}</td>
                  <td className="px-4 py-2">{branch.phone}</td>
                  <td className="px-4 py-2">{branch.address}</td>
                  <td className="px-4 py-2 flex gap-2">

                    <button 
                        onClick={() => setSelectedBranch(branch)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800">
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => dispatch(deleteBranch(branch.id))}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBranches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                    No branches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BranchesPage;
