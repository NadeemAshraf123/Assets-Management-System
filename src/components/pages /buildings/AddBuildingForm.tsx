import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCog } from "react-icons/fa";


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
  branchName: string;
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

const AddBuildingForm: React.FC<AddBuildingFormProps> = ({
  branches,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BuildingFormData>({
    branchId: "",
    branchName: "",
    buildingName: "",
    buildingType: "",
    totalFloors: 0,
    fullAddress: "",
    latitude: 31.582045, 
    longitude: 74.329376,
  });

  
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });
    return (
      <Marker
        draggable
        position={[formData.latitude, formData.longitude]}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setFormData((prev) => ({
              ...prev,
              latitude: position.lat,
              longitude: position.lng,
            }));
          },
        }}
      />
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "branchId") {
      const selectedBranch = branches.find((b) => b.id === value);
      setFormData((prev) => ({
        ...prev,
        branchName: selectedBranch ? selectedBranch.name : "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <div className="bg-[#d7e7e2] px-6 py-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Add Building</h2>
          <p className="text-sm text-gray-600">Add Building in system</p>
        </div>
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Building Information
        </h3>

  
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Branch Name</label>
          <select
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Building Name</label>
          <input
            type="text"
            name="buildingName"
            placeholder="Branch Name"
            value={formData.buildingName}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Building Type
            </label>
            <input
              type="text"
              name="buildingType"
              placeholder="Restaurant, institute, healthcare center, museum etc"
              value={formData.buildingType}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Total Floors</label>
            <input
              type="number"
              name="totalFloors"
              value={formData.totalFloors}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            placeholder="Add Full Address"
            value={formData.fullAddress}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <FaCog className="absolute right-3 top-10 text-gray-500" />
        </div>

      
        <div className="mt-4 border rounded overflow-hidden">
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={13}
            style={{ height: "220px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
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
