import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFloors,
  deleteFloor,
  clearError,
  selectFloorNames,
  selectBuildingTypes,
  addFloor,
} from "../../../features/floors/FloorsSlice";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Settings, Pencil } from "lucide-react";
import ConfirmDelete from "../../common/deletrconfirmation/ConfirmDelete";
import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";
import logo from "../../../assets/logo.png";
import { Eye } from "lucide-react";
import AddFloorForm from "./AddFloorForm";
import { fetchBranches } from "../../../features/branches/BranchesSlice";
import EditFloorForm from "../floors/EditFloorForm";
import { useNavigate } from "react-router-dom";
import { fetchBuildings } from "../../../features/building/BuildingSlice";

const FloorsPage = () => {
  const dispatch = useDispatch();
  const { floors, loading, error } = useSelector((state: any) => state.floors);
  console.log("Floors after delete:", floors);

  const [searchName, setSearchName] = useState("");
  const [searchBuildingType, setSearchBuildingType] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const floorNames = useSelector(selectFloorNames);
  const buildingTypes = useSelector(selectBuildingTypes);
  const [floorToEdit, setFloorToEdit] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const navigate = useNavigate();

  const { branches } = useSelector((state: any) => state.branches);
  const { buildings } = useSelector((state: any) => state.buildings);
  useEffect(() => {
    dispatch(fetchFloors() as any);
    dispatch(fetchBranches() as any);
    dispatch(fetchBuildings() as any);
  }, [dispatch]);

  const filteredFloors =
    floors?.filter((f: any) => {
      const name = f?.floorName?.toLowerCase() || "";
      const type = f?.buildingName?.toLowerCase() || "";
      return (
        name.includes(searchName.toLowerCase()) &&
        type.includes(searchBuildingType.toLowerCase())
      );
    }) || [];

  const handleDelete = (floor: any) => {
    setFloorToDelete(floor);
    setIsDeleteConfirmOpen(true);
  };

  const handleViewFloorPlan = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${base64}" style="max-width:100%;"/>`);
    }
  };

  const handleAddClick = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEdit = (floor: any) => {
    setFloorToEdit(floor);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
//   const handleViewFloorPlan = (base64: string) => {
//   const win = window.open();
//   if (win) {
//     win.document.write(`<img src="${base64}" style="max-width:100%;"/>`);
//   }
// };


  const handleFormSubmit = async (formData: any) => {
    const selectedBranch = branches.find(
      (b) => b.id === Number(formData.branchId)
    );
    const selectedBuilding = buildings.find(
      (b) => b.id === Number(formData.buildingId)
    );

    const payload = {
      floorName: formData.floorName,
      branchId: Number(formData.branchId),
      branchName: selectedBranch?.name || "",
      buildingId: Number(formData.buildingId),
      buildingName: selectedBuilding?.name || "",
      floorNumber: formData.floorNumber,
      totalArea: formData.totalArea,
      floorPlan: formData.floorPlan,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      if (floorToEdit) {
        await dispatch(
          updateFloor({ id: floorToEdit.id, data: payload }) as any
        ).unwrap();
      } else {
        await dispatch(addFloor(payload) as any).unwrap();
      }
      await dispatch(fetchFloors() as any);
      setIsModalOpen(false);
      setFloorToEdit(null);
    } catch (error) {
      console.error("Error saving floor:", error);
    }
  };

  const confirmDeleteFloor = async () => {
    if (!floorToDelete) return;
    setIsDeleting(true);
    try {
      console.log("Deleting floor ID:", floorToDelete.id);
      await dispatch(deleteFloor(Number(floorToDelete.id)) as any).unwrap();
      await dispatch(fetchFloors() as any);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
      setFloorToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setFloorToDelete(null);
  };
  const handleclick = () => {
    navigate("/floors");
  };

  return (
    <div className="space-y">
      <div className="bg-white p-3">
        <div className="text-sm text-[#0F766E] flex items-center gap-2">
          <img src={logo} alt="Settings" className="w-10 h-10" />
          Administration &gt; Settings &gt;{" "}
          <span className="text-[#0F766E] font-medium">Floors</span>
        </div>
      </div>

      <div className="pl-6 pt-6 pr-6 pb-3 ">
        <div className="bg-[#005C5C] rounded-lg p-2.5 items-center">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Settings size={20} className="text-white items-center" />
              <h1 className="text-1xl font-semibold text-white">Floors</h1>
            </div>
            <button
              className="bg-blue-600 text-white text-xs px-3 rounded hover:bg-blue-700 flex items-center gap-2"
              onClick={handleAddClick}
            >
              <FaPlus /> Add New Floor
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

      <div className="pl-6 pr-6 pt-0 pb-3">
        <div className="flex flex-col md:flex md:flex-row gap-4 p-3 rounded-md bg-white">
          <SearchBar
            placeholder="Search Floors"
            value={searchName}
            onChange={setSearchName}
            showDropdownIcon={true}
            suggestions={floorNames}
          />
          <SearchBar
            placeholder="Search Building Type"
            value={searchBuildingType}
            onChange={setSearchBuildingType}
            showDropdownIcon={true}
            suggestions={buildingTypes}
          />
        </div>
      </div>

      <div className="pl-6 pr-6">
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-[#FFFFFF] text-left">
              <tr>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Floor Name
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Branch
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Building
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Floor Number
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Total Area
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Floor Plan
                </th>
                <th
                  className="px-4 py-3 truncate max-w-[180px] border-r border-[#E0E5F2] font-semibold"
                  title="Building Name"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading floors...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFloors.length > 0 ? (
                filteredFloors.map((floor: any) => (
                  <tr
                    key={floor.id}
                    className="border-t border-[#E0E5F2] hover:bg-gray-50"
                  >
                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      {floor.floorName}
                    </td>
                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      {floor.branchName}
                    </td>
                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      {floor.buildingName}
                    </td>
                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      {floor.floorNumber}
                    </td>
                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      {floor.totalArea} sq ft
                    </td>

                    <td
                      className="px-4 py-3 truncate max-w-[180px]"
                      title={floor.buildingName}
                    >
                      <a
                        onClick={() => handleViewFloorPlan(floor.floorPlan)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        title="View Floor Plan"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="bg-[#BBF7D0] text-blue-600 rounded-md p-1 hover:bg-[#A7F3D0]"
                          title="Edit Floor"
                          onClick={() => handleEdit(floor)}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          className="bg-[#FECACA] text-red-600 rounded-md p-1 hover:bg-[#FCA5A5]"
                          onClick={() => handleDelete(floor)}
                          title="Delete Floor"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No floors match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && modalMode === "add" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <AddFloorForm
            branches={branches}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            buildings={buildings}
          />
        </div>
      )}

      {isModalOpen && modalMode === "edit" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <EditFloorForm
            initialData={floorToEdit}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setFloorToEdit(null);
              setModalMode(null);
            }}
          />
        </div>
      )}

      <ConfirmDelete
        isOpen={isDeleteConfirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteFloor}
        title="Delete Floor"
        message={`Are you sure you want to delete "${floorToDelete?.floorName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  );
};

export default FloorsPage;
