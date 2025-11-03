import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addBranch, updateBranch } from "../../../features/branches/BranchesSlice";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useReverseGeocode from "../../../hooks/useReverseGeocode";
import type { Branch } from "../../../features/branches/BranchesSlice";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Common validation schema
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
  status: z.boolean().optional(),
  groundMaintenance: z.boolean().optional(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface Props {
  onClose: () => void;
  branch?: Branch; // if present => edit mode
}

const BranchFormModal: React.FC<Props> = ({ onClose, branch }) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const { getAddressFromCoords } = useReverseGeocode();
  useOutSideClick(modalRef, () => onClose?.());

  const isEditMode = !!branch;

  const [marker, setMarker] = useState<[number, number] | null>(
    branch?.latitude && branch?.longitude
      ? [branch.latitude, branch.longitude]
      : null
  );

  const [status, setStatus] = useState(branch?.status ?? true);
  const [groundMaintenance, setGroundMaintenance] = useState(
    branch?.groundMaintenance ?? true
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: isEditMode
      ? {
          name: branch?.name ?? "",
          manager: branch?.manager ?? "",
          email: branch?.email ?? "",
          phone: branch?.phone ?? "",
          branchaddress: branch?.branchaddress ?? "",
          city: branch?.city ?? "",
          country: branch?.country ?? "",
          latitude: branch?.latitude ?? 31.5204,
          longitude: branch?.longitude ?? 74.3587,
          status: branch?.status ?? true,
          groundMaintenance: branch?.groundMaintenance ?? true,
        }
      : {
          name: "",
          manager: "",
          email: "",
          phone: "",
          branchaddress: "",
          city: "",
          country: "",
          latitude: 31.5204,
          longitude: 74.3587,
          status: true,
          groundMaintenance: true,
        },
  });

  // ✅ Update marker when editing existing branch
  useEffect(() => {
    if (isEditMode && branch?.latitude && branch?.longitude) {
      setMarker([branch.latitude, branch.longitude]);
    }
  }, [branch, isEditMode]);

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        setValue("latitude", lat);
        setValue("longitude", lng);

        const address = await getAddressFromCoords(lat, lng);
        setValue("branchaddress", address);
      },
    });
    return null;
  };

  const onSubmit = async (data: BranchFormData) => {
    const payload = {
      ...data,
      status,
      groundMaintenance,
    };

    try {
      if (isEditMode && branch) {
        await dispatch(updateBranch({ id: branch.id, data: payload })).unwrap();
      } else {
        await dispatch(addBranch(payload)).unwrap();
      }
      onClose?.();
      reset();
    } catch (error) {
      console.error("Error submitting branch:", error);
    }
  };

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-md space-y-6 overflow-y-auto max-h-screen"
    >
      {/* Header */}
      <div className="flex items-center bg-[#0F766E33] justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Branch" : "Add New Branch"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditMode ? "Edit Branch in system" : "Add New Branch in system"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <h3 className="text-lg font-semibold text-gray-700">Branch Information</h3>

        {/* Branch Name */}
        <div>
          <label className="block text-xs">Branch Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Branch Name"
            className={`w-full px-4 py-2 border rounded-md text-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* City / Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">City</label>
            <input
              type="text"
              {...register("city")}
              placeholder="City"
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
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
              }`}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
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
            }`}
          />
          {errors.manager && (
            <p className="text-red-500 text-xs mt-1">{errors.manager.message}</p>
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
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs">Branch Address</label>
          <input
            type="text"
            {...register("branchaddress")}
            placeholder="Click on map to set Branch Address"
            className={`w-full px-4 py-2 border rounded-md text-sm ${
              errors.branchaddress ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.branchaddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.branchaddress.message}
            </p>
          )}
        </div>

        {/* Map */}
        <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
          <MapContainer
            center={[marker?.[0] || 31.5204, marker?.[1] || 74.3587]}
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

        {/* Toggle Controls (Edit mode only) */}
        {isEditMode && (
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <button
                type="button"
                onClick={() => setStatus((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  status ? "bg-[#0F766E]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    status ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  status ? "text-[#0F766E]" : "text-gray-600"
                }`}
              >
                {status ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex gap-3">
              <span className="text-sm font-medium text-gray-700">
                Ground Maintenance
              </span>
              <button
                type="button"
                onClick={() => setGroundMaintenance((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  groundMaintenance ? "bg-[#0F766E]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    groundMaintenance ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  groundMaintenance ? "text-[#0F766E]" : "text-gray-600"
                }`}
              >
                {groundMaintenance ? "Yes" : "No"}
              </span>
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-teal-600 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Save Changes"
              : "Add"}
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

export default BranchFormModal;
