import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/Store";
import { addBranch, updateBranch, fetchBranches } from "../../../features/branches/BranchesSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { branchSchema, BranchFormData } from "../../../schemas/BranchSchemas";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

interface BranchModalFormProps {
  mode: "add" | "edit";
  existingBranch?: BranchFormData & { id: string };
  onClose: () => void;
}

const BranchModalForm: React.FC<BranchModalFormProps> = ({
  mode,
  existingBranch,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onClose());

  const { branches } = useSelector((state: RootState) => state.branches);

  const [marker, setMarker] = useState<[number, number] | null>(
    existingBranch
      ? [existingBranch.latitude || 0, existingBranch.longitude || 0]
      : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues:
      mode === "edit" && existingBranch
        ? existingBranch
        : {
            name: "",
            manager: "",
            email: "",
            phone: "",
            branchaddress: "",
            city: "",
            country: "",
            latitude: 0,
            longitude: 0,
          },
  });

  useEffect(() => {
    if (branches.length === 0) {
      dispatch(fetchBranches());
    }
  }, [dispatch, branches]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        setValue("latitude", lat);
        setValue("longitude", lng);

        axios
          .get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              lat,
              lon: lng,
              format: "json",
            },
          })
          .then((res) => {
            const { address } = res.data;
            setValue("city", address.city || address.town || address.village || "");
            setValue("country", address.country || "");
            setValue("branchaddress", res.data.display_name || "");
          })
          .catch((err) => console.error("Reverse geocode error:", err));
      },
    });
    return marker ? (
      <Marker position={marker} icon={L.icon({ iconUrl: "/marker-icon.png" })}></Marker>
    ) : null;
  };

  const onSubmit = async (data: BranchFormData) => {
    try {
      if (mode === "add") {
        await dispatch(addBranch(data)).unwrap();
      } else if (mode === "edit" && existingBranch) {
        await dispatch(updateBranch({ id: existingBranch.id, data })).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-md shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between bg-[#0F766E33] p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "add" ? "Add New Branch" : "Edit Branch"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "add"
                ? "Add New Branch in system"
                : "Edit existing branch details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Branch Name</label>
            <select
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Manager Name</label>
            <input
              type="text"
              {...register("manager")}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.manager ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Manager Name"
            />
            {errors.manager && (
              <p className="text-red-500 text-xs mt-1">{errors.manager.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              {...register("phone")}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Phone Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="h-64 border rounded-md overflow-hidden">
            <MapContainer
              center={marker || [31.5204, 74.3587]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <LocationMarker />
            </MapContainer>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              {...register("branchaddress")}
              rows={2}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                {...register("city")}
                type="text"
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                {...register("country")}
                type="text"
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
            >
              {isSubmitting
                ? mode === "add"
                  ? "Adding..."
                  : "Updating..."
                : mode === "add"
                ? "Add Branch"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModalForm;
