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
import AddBuildingForm from "./AddBuildingForm";
import axios from "axios";
import EditBuildingForm from "./EditBuildingForm";

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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      dispatch(deleteBuilding(id) as any);
    }
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
    <div className=" space-y-6">
      <div className="bg-white p-6">
      <div className="text-sm text-[#0F766E]">
        Administration &gt; Settings &gt;{" "}
        <span className="text-[#0F766E] font-medium">Building</span>
      </div>
      </div>

      <div className="pl-5 pr-30">
      <div className="bg-[#005C5C] rounded-lg items-center">
        <div className="p-3 flex justify-between">
        <h1 className="text-2xl font-semibold text-white">Buildings</h1>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2"
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

      <div className="pl-5 pr-30">
      <div className="flex gap-4 p-5 rounded-xl bg-white">
        <input
          type="text"
          placeholder="Search Building Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border text-xs bg-gray-100 border-gray-300 px-3 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search Building Type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border text-xs bg-gray-100 border-gray-300 px-3 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-[#FFFFFF] text-left">
            <tr>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Building Name</th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Branch</th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Building Type</th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Floors</th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Address</th>
              <th className="px-4 py-3 border-r border-[#E0E5F2] font-semibold">Actions</th>
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
                <tr key={building.id} className="border-t border-[#E0E5F2] hover:bg-gray-50">
                  <td className="px-4 py-3">{building.name}</td>
                  <td className="px-4 py-3">
                    {building.branchName || `Branch ${building.branchId}`}
                  </td>
                  <td className="px-4 py-3">{building.type}</td>
                  <td className="px-4 py-3">{building.floors}</td>
                  <td className="px-4 py-3">{building.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        onClick={() => handleEditClick(building)}
                        title="Edit Building"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        onClick={() => handleDelete(building.id)}
                        title="Delete Building"
                      >
                        <FaTrash />
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
    </div>
  );
};

export default BuildingsPage;
