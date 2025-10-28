import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { X, MapPin } from "lucide-react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface EditBuildingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  branches: { id: number; name: string }[];
  selectedBuilding: any;
}

const EditBuildingForm: React.FC<EditBuildingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  branches,
  selectedBuilding,
}) => {
  const [formData, setFormData] = useState({
    branchId: "",
    branchName: "",
    buildingName: "",
    buildingType: "",
    totalFloors: "",
    fullAddress: "",
    latitude: 31.582045,
    longitude: 74.329376,
    status: true,
    groundMaintenance: false,
  });

  useEffect(() => {
    if (selectedBuilding) {
      setFormData({
        branchId: selectedBuilding.branchId?.toString() || "",
        branchName: selectedBuilding.branchName || "",
        buildingName: selectedBuilding.name || "",
        buildingType: selectedBuilding.type || "",
        totalFloors: selectedBuilding.floors?.toString() || "",
        fullAddress: selectedBuilding.address || "",
        latitude: selectedBuilding.latitude || 31.582045,
        longitude: selectedBuilding.longitude || 74.329376,
        status: selectedBuilding.status ?? true,
        groundMaintenance: selectedBuilding.groundMaintenance ?? false,
      });
    }
  }, [selectedBuilding]);

  if (!isOpen) return null;

  const handleMapClick = (e: any) => {
    setFormData({
      ...formData,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    });
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[750px] max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between bg-[#d5e7e0] px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold">Edit Building</h2>
            <p className="text-sm text-gray-600">Edit Building in system</p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <h3 className="text-lg font-semibold">Building Information</h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Branch Name
            </label>
            <select
              value={formData.branchId}
              onChange={(e) => {
                const branch = branches.find(
                  (b) => b.id === Number(e.target.value)
                );
                setFormData({
                  ...formData,
                  branchId: e.target.value,
                  branchName: branch?.name || "",
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-200"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Building Name
              </label>
              <input
                type="text"
                value={formData.buildingName}
                onChange={(e) =>
                  setFormData({ ...formData, buildingName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Floors
              </label>
              <input
                type="number"
                value={formData.totalFloors}
                onChange={(e) =>
                  setFormData({ ...formData, totalFloors: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Building Type
            </label>
            <input
              type="text"
              value={formData.buildingType}
              onChange={(e) =>
                setFormData({ ...formData, buildingType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Full Address
            </label>
            <input
              type="text"
              value={formData.fullAddress}
              onChange={(e) =>
                setFormData({ ...formData, fullAddress: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
            />
            <MapPin className="absolute right-3 top-9 w-5 h-5 text-gray-600" />
          </div>

          <div>
            <MapContainer
              center={[formData.latitude, formData.longitude]}
              zoom={13}
              className="h-48 w-full rounded-lg z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[formData.latitude, formData.longitude]}
                icon={markerIcon}
              />
              <MapClickHandler />
            </MapContainer>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={() =>
                    setFormData({ ...formData, status: !formData.status })
                  }
                  className="toggle-checkbox"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>Ground Maintenance</span>
                <input
                  type="checkbox"
                  checked={formData.groundMaintenance}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      groundMaintenance: !formData.groundMaintenance,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-400 rounded-lg text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBuildingForm;
