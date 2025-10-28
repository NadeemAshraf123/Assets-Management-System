import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addBranch } from "../../../features/branches/BranchesSlice";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix Leaflet marker icons (for Vite/React setups)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Validation schema
const branchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s-()]{10,}$/, "Enter a valid phone number"),
  branchaddress: z.string().min(5, "Branch address must be at least 5 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  country: z.string().min(2, "Country name must be at least 2 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type BranchFormData = z.infer<typeof branchSchema>;

// ✅ Helper function: lat/lng → readable address
const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Unknown address";
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Address not found";
  }
};

interface Props {
  onClose?: () => void;
}

const AddBranchForm: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onClose?.());

  const [marker, setMarker] = useState<[number, number] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      manager: "",
      email: "",
      phone: "",
      branchaddress: "",
      city: "",
      country: "",
    },
  });

  // ✅ Map click handler: updates lat, lng, and address field
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setMarker([lat, lng]);
        setValue("latitude", lat);
        setValue("longitude", lng);

        const address = await getAddressFromCoords(lat, lng);
        setValue("branchaddress", address); // 👈 updated field
      },
    });
    return null;
  };

  // ✅ Submit form
  const onSubmit = async (data: BranchFormData) => {
    try {
      await dispatch(addBranch(data)).unwrap();
      onClose?.();
    } catch (error) {
      console.error("Failed to add branch:", error);
    }
  };

  return (
    <div
      ref={modalRef}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center bg-[#0F766E33] justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Branch</h2>
          <p className="text-sm text-gray-500">Add New Branch in system</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Branch Information
        </h3>

        {/* Branch Name */}
        <div>
          <label className="block text-xs">Branch Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Branch Name"
            className={`w-full px-4 py-2 border rounded-md text-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* City & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">City</label>
            <input
              type="text"
              {...register("city")}
              placeholder="City"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.city ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs">Country</label>
            <input
              type="text"
              {...register("country")}
              placeholder="Country"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.country ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        {/* Manager */}
        <div>
          <label className="block text-xs">Branch Manager</label>
          <input
            type="text"
            {...register("manager")}
            placeholder="Branch Manager"
            className={`w-full px-4 py-2 border rounded-md text-sm ${
              errors.manager ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.manager && (
            <p className="text-red-500 text-xs mt-1">
              {errors.manager.message}
            </p>
          )}
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">Branch Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Branch Email"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs">Phone Number</label>
            <input
              type="text"
              {...register("phone")}
              placeholder="Branch Phone Number"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* ✅ Branch Address — updated to receive map address */}
        <div>
          <label className="block text-xs">Branch Address</label>
          <input
            type="text"
            {...register("branchaddress")}
            placeholder="Click on map to set Branch Address"
            className={`w-full px-4 py-2 border rounded-md text-sm ${
              errors.branchaddress ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.branchaddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.branchaddress.message}
            </p>
          )}
        </div>

        {/* Map */}
        <div className="w-full h-64 rounded-md overflow-hidden">
          <MapContainer
            center={[31.5204, 74.3587]} // Default Lahore
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />
            {marker && (
              <Marker position={marker}>
                <Popup>Selected Branch Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-teal-600 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBranchForm;
