import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBuildings,
  deleteBuilding,
  updateBuilding,
  addBuilding,
  clearError,
} from "../../../features/building/BuildingSlice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Settings, Pencil } from "lucide-react";
import AddBuildingForm from "./AddBuildingForm";
import axios from "axios";
import EditBuildingForm from "./EditBuildingForm";
import logo from "../../../assets/logo.png";
import ConfirmDelete from "../../common/deletrconfirmation/ConfirmDelete";
import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";

interface Building {
  id: number;
  name: string;
  branchId: number;
  branchName?: string;
  type: string;
  floors: number;
  address: string;
  status?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
}

const BuildingsPage = () => {
  const dispatch = useDispatch();
  const { buildings, loading, error } = useSelector(
    (state: any) => state.buildings
  );

  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [modalMode, setModalMode] = useState("add");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings() as any);

    axios
      .get("http://localhost:3001/branches")
      .then((res) => setBranchesData(res.data))
      .catch((err) => console.error("Failed to fetch branches:", err));
  }, [dispatch]);

  useEffect(() => {
    fetch("http://localhost:3001/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error("Error loading branches:", err));
  }, []);

  const filteredBuildings =
    buildings?.filter((b: Building) => {
      const name = b?.name?.toLowerCase() || "";
      const type = b?.type?.toLowerCase() || "";
      const searchNameLower = searchName.toLowerCase();
      const searchTypeLower = searchType.toLowerCase();

      return name.includes(searchNameLower) && type.includes(searchTypeLower);
    }) || [];

  const handleDelete = (building: Building) => {
    setBuildingToDelete(building);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteBuilding = async () => {
    if (!buildingToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBuilding(buildingToDelete.id) as any).unwrap();
      await dispatch(fetchBuildings() as any);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
      setBuildingToDelete(null);
    }
  };
  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setBuildingToDelete(null);
  };

  const handleAddClick = () => {
    setModalMode("add");
    setSelectedBuilding(null);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleEditClick = (building: Building) => {
    setModalMode("edit");
    setSelectedBuilding(building);
    setIsModalOpen(true);
    dispatch(clearError());
  };

  const handleFormSubmit = async (formData: any) => {
    const apiData = {
      name: formData.buildingName,
      branchId: Number(formData.branchId),
      branchName: formData.branchName,
      type: formData.buildingType,
      floors: Number(formData.totalFloors),
      address: formData.fullAddress,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    try {
      if (modalMode === "add") {
        await dispatch(addBuilding(apiData) as any).unwrap();
        await dispatch(fetchBuildings() as any);
      } else if (modalMode === "edit" && selectedBuilding) {
        await dispatch(
          updateBuilding({
            id: selectedBuilding.id,
            data: apiData,
          }) as any
        ).unwrap();
        await dispatch(fetchBuildings() as any);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving building:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBuilding(null);
    dispatch(clearError());
  };

  const modalConfig = {
    add: {
      title: "Add Building",
      submitButtonText: "Add Building",
    },
    edit: {
      title: "Edit Building in system",
      submitButtonText: "Update Building",
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-3">
        <div className="text-sm text-[#0F766E] flex items-center gap-2">
          <img src={logo} alt="Settings" className="w-10 h-10" />
          Administration &gt; Settings &gt;{" "}
          <span className="text-[#0F766E] font-medium">Building</span>
        </div>
      </div>

      <div className="pl-3 pr-14">
        <div className="bg-[#005C5C] rounded-lg items-center">
          <div className="p-2 flex justify-between">
            <div className="flex gap-2">
              <Settings size={20} className="text-white items-center" />
              <h1 className="text-1xl font-semibold text-white">Buildings</h1>
            </div>
            <button
              className="bg-blue-600 text-white text-xs px-3 rounded hover:bg-blue-700 flex items-center gap-2"
              onClick={handleAddClick}
            >
              <FaPlus /> Add New Building
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
          <button
            onClick={() => dispatch(clearError())}
            className="float-right text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="pl-7 pr-14">
        <div className="flex gap-4 p-3 rounded-sm bg-white">
          <SearchBar  
            placeholder="Search Building Name"
            value={searchName}
            onChange={setSearchName}
            showDropdownIcon={true}
          />
         
          <SearchBar
              placeholder="Search Building Type"
              value={searchType}
              onChange={setSearchType}
              showDropdownIcon={true}
           />
        </div>
      </div>

      <div className="pl-7 pr-14">
      <div className="overflow-x-auto  bg-white rounded-2xl shadow">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-[#FFFFFF] text-left">
            <tr>
              <th className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold">
                Building Name
              </th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">
                Branch
              </th>
              <th className="px-4 py-3 border-r truncate max-w-[180px] border-[#E0E5F2] font-semibold">
                Building Type
              </th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">
                Floors
              </th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">
                Address
              </th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading buildings...</span>
                  </div>
                </td>
              </tr>
            ) : filteredBuildings.length > 0 ? (
              filteredBuildings.map((building: Building) => (
                <tr
                  key={building.id}
                  className="border-t border-[#E0E5F2] hover:bg-gray-50"
                >
                  <td className="px-4 py-3 truncate max-w-[180px]">{building.name}</td>
                  <td className="px-4 py-3 truncate max-w-[180px]">
                    {building.branchName || `Branch ${building.branchId}`}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[150px]">{building.type}</td>
                  <td className="px-4 py-3">{building.floors}</td>
                  <td className="px-4 py-3 truncate max-w-[180px]">{building.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="bg-[#BBF7D0] text-blue-600 rounded-md p-1 hover:bg-[#A7F3D0] transition-colors"                        onClick={() => handleEditClick(building)}
                        title="Edit Building"
                      >
                      <Pencil size={13} className="text-gray-600 cursor-pointer" />
                      </button>
                      <button
                        className="bg-[#FECACA] text-red-600 rounded-md p-1 hover:bg-[#FCA5A5] transition-colors"                        onClick={() => handleDelete(building)}
                        title="Delete Building"
                      >
                        <FaTrash size={13}  />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  {buildings.length === 0
                    ? "No buildings available. Add your first building!"
                    : "No buildings match your search criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {isModalOpen && modalMode === "add" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <AddBuildingForm
            branches={branchesData}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
          />
        </div>
      )}

      <EditBuildingForm
        isOpen={isModalOpen && modalMode === "edit"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        branches={branches}
        selectedBuilding={selectedBuilding}
      />

      <ConfirmDelete
        isOpen={isDeleteConfirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteBuilding}
        title="Delete Building"
        message={`Are you sure you want to delete "${buildingToDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  );
};

export default BuildingsPage;
