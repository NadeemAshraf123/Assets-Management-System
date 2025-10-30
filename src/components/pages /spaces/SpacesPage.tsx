import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../app/Store";
import {
  fetchSpaces,
  deleteSpace,
  selectSpaceManagers,
  selectSpaceNames,
} from "../../../features/spaces/SpacesSlice";
import type { Space } from "../../../features/spaces/SpacesSlice";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Settings, Pencil } from "lucide-react";
import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../common/deletrconfirmation/ConfirmDelete";

const SpacesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { spaces, loading } = useSelector((state: RootState) => state.spaces);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const spaceNames = useSelector(selectSpaceNames);
  const spaceManagers = useSelector(selectSpaceManagers);

  // Fetch spaces when page loads
  useEffect(() => {
    dispatch(fetchSpaces());
  }, [dispatch]);

  const handleDelete = (space: Space) => {
    setSpaceToDelete(space);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteSpace = async () => {
    if (!spaceToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteSpace(spaceToDelete.id) as any).unwrap();
      await dispatch(fetchSpaces() as any);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
      setSpaceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSpaceToDelete(null);
  };
  const handleAddSpacePage = () => {
    navigate("/addspacepage");
  };

  const handleEditSpacePage = (space: Space) => {
    navigate(`/spaces/edit/${space.id}`);
  };

  const filteredSpaces = spaces.filter(
    (space: Space) =>
      (space.spaceName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedManager ? space.spaceManager === selectedManager : true)
  );

  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="text-sm text-[#0F766E] flex items-center gap-2">
          <img src={logo} alt="Settings" className="w-10 h-10" />
          Administration &gt; Settings &gt;{" "}
          <span className="text-[#0F766E] font-medium">Space</span>
        </div>
      </div>

      <div className="pl-6 pr-6 pb-3 pt-6">
        <div className="bg-[#005C5C] rounded-lg p-2.5 items-center">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Settings size={20} className="text-white" />
              <h1 className="text-1xl font-semibold text-white">Spaces</h1>
            </div>
            <button
              onClick={handleAddSpacePage}
              className="bg-blue-600 text-white text-xs px-3 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add New Space
            </button>
          </div>
        </div>
      </div>

      <div className="pl-6 pr-6 pt-0 pb-3">
        <div className="flex flex-col md:flex-row gap-4 p-3 rounded-sm bg-white">
          <SearchBar
            placeholder="Search Space Name"
            value={searchTerm}
            onChange={setSearchTerm}
            showDropdownIcon={true}
            suggestions={spaceNames}
          />

          <SearchBar
            placeholder="Search Space Manager"
            value={selectedManager}
            onChange={setSelectedManager}
            showDropdownIcon={true}
            suggestions={spaceManagers}
          />
        </div>
      </div>

      <div className="pl-6 pr-6 pt-0">
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-[#FFFFFF] text-left truncate max-w-[180px]">
              <tr>
                {[
                  "Space Name",
                  "Branch",
                  "Building",
                  "Floor",
                  "Space Area",
                  "Meta Type",
                  "Parent Space",
                  "Space Manager",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 border-r border-[#E0E5F2] font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading spaces...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSpaces.length > 0 ? (
                filteredSpaces.map((space) => (
                  <tr
                    key={space.id}
                    className="border-t border-[#E0E5F2] hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 max-w-[180px] flex items-center gap-2">
                      {space.spaceImage && (
                        <img
                          src={space.spaceImage}
                          alt="Space"
                          className="w-8 h-8 object-cover rounded-sm border"
                        />
                      )}
                      <span className="truncate max-w-[180px]">{space.spaceName}</span>
                    </td>

                    <td className="px-4 py-3  truncate max-w-[180px]">{space.branchName}</td>
                    <td className="px-4 py-3  truncate max-w-[180px]">{space.buildingName}</td>
                    <td className="px-4 py-3  truncate max-w-[180px]">{space.floorName}</td>
                    <td className="px-4 py-3  truncate max-w-[180px]">{space.spaceArea}</td>
                    <td className="px-4 py-3  truncate max-w-[180px]">{space.metaType}</td>
                    <td className="px-4 py-3  truncate max-w-[180px]">
                      {space.parentSpaceName || "None"}
                    </td>
                    <td className="px-4 py-3 truncate max-w-[180px]">{space.spaceManager}</td>

                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEditSpacePage(space)}
                        className="bg-[#BBF7D0] text-blue-600 rounded-md p-1 hover:bg-[#A7F3D0] transition-colors"
                      >
                        <Pencil size={13} className="text-gray-600" />
                      </button>

                      <button
                        onClick={() => handleDelete(space)}
                        className="bg-[#FECACA] text-red-600 rounded-md p-1 hover:bg-[#FCA5A5] transition-colors"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No spaces found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDelete
        isOpen={isDeleteConfirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteSpace}
        title="Delete Space"
        message={`Are you sure you want to delete "${spaceToDelete?.spaceName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  );
};

export default SpacesPage;
