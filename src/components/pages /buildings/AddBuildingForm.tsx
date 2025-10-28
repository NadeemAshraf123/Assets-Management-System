import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCog } from "react-icons/fa";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { useReverseGeocode } from "../../../hooks/useReverseGeocode";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Branch {
  id: string;
  name: string;
}

interface BuildingFormData {
  branchId: string;
  branchName?: string;
  buildingName: string;
  buildingType: string;
  totalFloors: number;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

interface AddBuildingFormProps {
  branches: Branch[];
  onSubmit: (data: BuildingFormData) => void;
  onCancel: () => void;
}

const buildingSchema = z.object({
  branchId: z.string().min(1, "Branch selection is required"),
  buildingName: z.string().min(4, "Building name must be at least 4 characters"),
  buildingType: z.string().min(4, "Building type is required"),
  totalFloors: z.coerce.number().min(1, "Total floors must be at least 1"),
  fullAddress: z.string().min(5, "Full address is required"),
  latitude: z.number(),
  longitude: z.number(),
});

const AddBuildingForm: React.FC<AddBuildingFormProps> = ({
  branches,
  onSubmit,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onCancel?.());

  const { getAddressFromCoords, loading } = useReverseGeocode();

  // ✅ Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof buildingSchema>>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      branchId: "",
      buildingName: "",
      buildingType: "",
      totalFloors: 0,
      fullAddress: "",
      latitude: 31.582045,
      longitude: 74.329376,
    },
  });

  const handleMapClick = async (e: any) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    const address = await getAddressFromCoords(lat, lng);

    setValue("latitude", lat);
    setValue("longitude", lng);
    setValue("fullAddress", address);
  };

  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        await handleMapClick(e);
        map.setView(e.latlng, map.getZoom());
      },
    });
    return null;
  };

  
  const onFormSubmit = (data: z.infer<typeof buildingSchema>) => {
    const selectedBranch = branches.find((b) => b.id === data.branchId);
    onSubmit({
      ...data,
      branchName: selectedBranch ? selectedBranch.name : "",
    });
  };

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto"
    >
    
      <div className="bg-[#d7e7e2] px-6 py-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Add Building</h2>
          <p className="text-sm text-gray-600">Add Building in system</p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

    
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Building Information
        </h3>

      
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Branch Name
          </label>
          <select
            {...register("branchId")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Building Name
          </label>
          <input
            type="text"
            placeholder="Branch Name"
            {...register("buildingName")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.buildingName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.buildingName.message}
            </p>
          )}
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Building Type
            </label>
            <input
              type="text"
              placeholder="Restaurant, institute, etc."
              {...register("buildingType")}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.buildingType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.buildingType.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Total Floors
            </label>
            <input
              type="number"
              {...register("totalFloors", { valueAsNumber: true })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.totalFloors && (
              <p className="text-red-500 text-xs mt-1">
                {errors.totalFloors.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-700">
            Full Address
          </label>
          <input
            type="text"
            placeholder="Add Full Address"
            {...register("fullAddress")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.fullAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fullAddress.message}
            </p>
          )}
          <FaCog className="absolute right-3 top-10 text-gray-500" />
        </div>

        
        <div className="mt-4 border rounded overflow-hidden">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            className="h-48 w-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            
            <Marker position={[latitude, longitude]} />
            <MapClickHandler />
          </MapContainer>
          {loading && (
            <p className="text-sm text-emerald-700 mt-2 text-center">
              Fetching address...
            </p>
          )}
        </div>

        
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBuildingForm;
