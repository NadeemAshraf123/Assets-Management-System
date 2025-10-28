import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../app/Store";
import type { Branch } from "../../../features/branches/BranchesSlice";
import {
  fetchBranches,
  deleteBranch,
  fetchBranchNames,
} from "../../../features/branches/BranchesSlice";
import { FaCog, FaEdit, FaTrash } from "react-icons/fa";
import AddBranchForm from "./AddBranchForm";
import EditBranchModal from "./EditBranchModal";
import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";
import { useConfirmDelete } from "../../../hooks/useConfirmDelete";
import ConfirmDelete from "../../common/deletrconfirmation/ConfirmDelete";
import { Settings } from "lucide-react";
import logo from "../../../assets/logo.png";

const BranchesPage: React.FC = () => {
  const dispatch = useDispatch();
const branchNames = useSelector((state: RootState) => state.branches.branchNames || []);
  const { branches, loading, error } = useSelector(
    (state: RootState) => state.branches
);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState("");



  const { isOpen, title, message, showConfirm, hideConfirm, handleConfirm } =
    useConfirmDelete();
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchBranchNames());
  }, [dispatch]);

  const filteredBranches = branches.filter((branch) => 
  branch.name.toLocaleLowerCase().includes(selectedBranchName.toLocaleLowerCase()));



  const handleDeleteBranch = async (branchId: string) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBranch(branchId));
    } catch (error) {
      console.error("Failed to delete branch :", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const promptDeleteBranch = (branch: Branch) => {
    showConfirm(() => handleDeleteBranch(branch.id), {
      title: "Delete Branch?",
      message: `Are you sure you want to delete branch "${branch.name}"? This action be undone.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-[#0F766E] bg-white p-3 flex items-center gap-2">
        <img src={logo} alt="Company Logo" className="w-10 h-10" />
        Administration &gt; Settings &gt;{" "}
        <span className="text-[#0F766E] font-medium">Branches</span>
      </div>

      <div className="pl-3 pr-14">
        <div className="flex items-center rounded-xl p-2 bg-[#005C5C] justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings size={20} className="text-white" />
            <span>Branches</span>
          </div>

          <button
            onClick={openModal}
            className="bg-blue-600 cursor-pointer text-white text-xs px-4 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            + Add New Branch
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed h-screen inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl p-6 relative">
            <AddBranchForm onClose={closeModal} />
          </div>
        </div>
      )}
      {selectedBranch && (
        <div className="fixed h-screen inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl relativ">
            <EditBranchModal
              branch={selectedBranch}
              onClose={() => setSelectedBranch(null)}
            />
          </div>
        </div>
      )}
      <div className="pl-7 pr-14">
        <div className="bg-white rounded-lg p-3 ">
          <SearchBar
            placeholder="Search Branch Name"
            value={selectedBranchName}
            onChange={(value) => setSelectedBranchName(value)}
            showDropdownIcon={true}
            className="w-sm"
            suggestions={branchNames}
            readOnly={true}
          />
        </div>
      </div>

      <div className="pl-7 pr-14">
        <div className="overflow-x-auto bg-white rounded-xl">
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading branches...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">Error: {error}</div>
          ) : (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-white text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Branch Name</th>
                  <th className="px-4 py-2 text-left truncate max-w-[150px]">
                    Branch Manager
                  </th>
                  <th className="px-4 py-2 text-left">Branch Email</th>
                  <th className="px-4 py-2 text-left truncate max-w-[200px]">
                    Branch Phone Number
                  </th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.map((branch) => (
                  <tr key={branch.id} className="border-t border-[#E0E5F2]">
                    <td
                      className="px-4 py-2 truncate max-w-[180px]"
                      title={branch.name}
                    >
                      {branch.name}
                    </td>
                    <td className="px-4 py-2">{branch.manager}</td>
                    <td
                      className="px-4 py-2 truncate max-w-[180px]"
                      title={branch.email}
                    >
                      {branch.email}
                    </td>
                    <td className="px-4 py-2">{branch.phone}</td>
                    <td
                      className="px-4 py-2 truncate max-w-[180px] text-ellipsis overflow-hidden whitespace-nowrap "
                      title={branch.address}
                    >
                      {branch.address}
                    </td>
                    <td className="px-4 py-2 truncate max-w-[180px] flex gap-2">
                      <button
                        onClick={() => setSelectedBranch(branch)}
                        className="bg-[#d0f7dd] rounded-md p-1 hover:bg-[#A7F3D0] transition-colors"
                      >
                        <Pencil
                          size={13}
                          className="text-gray-600 cursor-pointer"
                        />
                      </button>

                      <button
                        onClick={() => promptDeleteBranch(branch)}
                        className="bg-[#FECACA] text-red-600 cursor-pointer rounded-md p-1 hover:bg-[#FCA5A5] transition-colors"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBranches.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No branches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDelete
        isOpen={isOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  );
};

export default BranchesPage;
