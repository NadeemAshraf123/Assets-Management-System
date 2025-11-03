import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches } from "../../../features/branches/BranchesSlice";
import { fetchBuildings } from "../../../features/building/BuildingSlice";
import {
  fetchFloors,
  selectFloorNames,
} from "../../../features/floors/FloorsSlice";
import type { RootState } from "../../../app/Store";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const floorSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  buildingId: z.string().min(1, "Building is required"),
  floorName: z.string().min(3, "Floor name is required"),
  floorNumber: z.coerce.number().min(0, "Floor number must be 0 or higher"),
  totalArea: z.coerce.number().min(1, "Area must be at least 1 sq ft"),
  floorPlan: z.any().optional(),
  status: z.boolean().optional(),
  groundMaintenance: z.boolean().optional(),
});

const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface EditFloorFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditFloorForm: React.FC<EditFloorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onCancel?.());

  const { branches } = useSelector((state: RootState) => state.branches);
  const { buildings } = useSelector((state: RootState) => state.buildings);
  const { floors } = useSelector((state: RootState) => state.floors);
  const floorNames = useSelector(selectFloorNames);

  const [fileName, setFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );

  const customIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
  });

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchBuildings());
    dispatch(fetchFloors());

    if (initialData?.floorPlan) {
      setFileName("liberty_groundfloor.pdf");
    }
  }, [dispatch, initialData]);

  // 🧩 Auto-select coordinates when modal opens with building
  useEffect(() => {
    if (initialData?.buildingId && buildings.length > 0) {
      const foundBuilding = buildings.find(
        (b) => b.id.toString() === initialData.buildingId.toString()
      );
      if (foundBuilding && foundBuilding.latitude && foundBuilding.longitude) {
        setSelectedCoords([
          Number(foundBuilding.latitude),
          Number(foundBuilding.longitude),
        ]);
      }
    }
  }, [initialData, buildings]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof floorSchema>>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      branchId: initialData?.branchId?.toString() || "",
      buildingId: initialData?.buildingId?.toString() || "",
      floorName: initialData?.floorName || "",
      floorNumber: initialData?.floorNumber || 0,
      totalArea: initialData?.totalArea || 4500,
      status: initialData?.status || false,
      groundMaintenance: initialData?.groundMaintenance || false,
      floorPlan: undefined,
    },
  });

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setValue("buildingId", selectedId);
    const selectedBuilding = buildings.find(
      (b) => b.id.toString() === selectedId
    );
    if (
      selectedBuilding &&
      selectedBuilding.latitude &&
      selectedBuilding.longitude
    ) {
      setSelectedCoords([
        Number(selectedBuilding.latitude),
        Number(selectedBuilding.longitude),
      ]);
    } else {
      setSelectedCoords(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("floorPlan", e.target.files);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const branch = branches.find((b) => b.id.toString() === data.branchId);
      const building = buildings.find(
        (b) => b.id.toString() === data.buildingId
      );

      const payload = {
        ...data,
        branchName: branch?.name || "",
        buildingName: building?.name || "",
        floorPlan: data.floorPlan?.[0]
          ? await convertToBase64(data.floorPlan[0])
          : initialData?.floorPlan,
        status: data.status ?? false,
        groundMaintenance: data.groundMaintenance ?? false,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ToggleSwitch = ({ name, checked, register, label }: any) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          {...register(name)}
          defaultChecked={checked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  );

  const floorNameValue = watch("floorName") || "";
  const filteredSuggestions = floorNames.filter((name: string) =>
    name.toLowerCase().includes(floorNameValue.toLowerCase())
  );

  return (
    <div className="fixed inset-0 max-h-screen overflow-y-auto bg-black/10 flex items-center justify-center md:p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg mx-auto"
      >
        <div className="px-6 py-4 bg-green-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Floor</h2>
            <p className="text-sm text-gray-600">Edit Floor in system</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Floor Information
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Name
            </label>
            <select
              {...register("branchId")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branchId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.branchId.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Name
            </label>
            <select
              {...register("buildingId")}
              onChange={handleBuildingChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Select Building</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
            {errors.buildingId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.buildingId.message}
              </p>
            )}
          </div>

          

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor Name
            </label>
            <select
              {...register("floorName")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Select Floor</option>
              {Array.isArray(floors) && floors.length > 0 ? (
                floors.map((floor) => (
                  <option key={floor.id} value={floor.floorName}>
                    {floor.floorName}
                  </option>
                ))
              ) : (
                <option disabled>No floors available</option>
              )}
            </select>
            {errors.floorName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.floorName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                {...register("floorNumber")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              {errors.floorNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.floorNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Area (sq ft)
              </label>
              <input
                type="number"
                {...register("totalArea")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              {errors.totalArea && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.totalArea.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Floor Plan
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
              <input
                type="file"
                id="floorPlan"
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="floorPlan"
                className="cursor-pointer text-sm text-gray-600"
              >
                Click to upload a file (PDF, JPG, PNG)
              </label>
            </div>

            {fileName && (
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 mt-2">
                <span className="text-sm text-gray-700">{fileName}</span>
                <button
                  type="button"
                  onClick={() => setFileName("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <ToggleSwitch
            name="status"
            checked={initialData?.status}
            register={register}
            label="Status"
          />
          <ToggleSwitch
            name="groundMaintenance"
            checked={initialData?.groundMaintenance}
            register={register}
            label="Ground Maintenance"
          />

          {selectedCoords ? (
            <MapContainer
              center={selectedCoords}
              zoom={16}
              className="h-48 w-full mb-4 rounded-lg shadow-md"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={selectedCoords} icon={customIcon}>
                <Popup>Building Location</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p className="text-gray-500 mb-4">
              Select a building to view its location on map
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFloorForm;
