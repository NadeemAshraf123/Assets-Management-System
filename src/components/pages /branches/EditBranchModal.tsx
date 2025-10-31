import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateBranch } from "../../../features/branches/BranchesSlice";
import type { Branch } from "../../../features/branches/BranchesSlice";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import useReverseGeocode from "../../../hooks/useReverseGeocode";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  branch: Branch;
  onClose: () => void;
}


const LocationMarker = ({
  setForm,
}: {
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      city: string;
      country: string;
      manager: string;
      email: string;
      phone: string;
      branchaddress: string;
      status: boolean;
      groundMaintenance: boolean;
      latitude: number;
      longitude: number;
    }>
  >;
}) => {
  const { getAddressFromCoords } = useReverseGeocode(); 

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      const readableAddress = await getAddressFromCoords(lat, lng);
      
      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        branchaddress: readableAddress,
      }));
    },
  });
  return null;
};

const EditBranchModal: React.FC<Props> = ({ branch, onClose }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: branch.name,
    city: branch.city ?? "",
    country: branch.country ?? "",
    manager: branch.manager,
    email: branch.email,
    phone: branch.phone,
    branchaddress: branch.branchaddress,
    status: branch.status ?? true,
    groundMaintenance: branch.groundMaintenance ?? true,
    latitude: branch.latitude ?? 33.6844,
    longitude: branch.longitude ?? 73.0479,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onClose?.());

  const validationRules = {
    name: { required: true, minLength: 2 },
    manager: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, pattern: /^[+]?[\d\s-()]{10,}$/ },
    branchaddress: { required: true, minLength: 5 },
    city: { required: true, minLength: 2 },
    country: { required: true, minLength: 2 },
  };

 const validateField = (name: string, value: string): string => {
  const rules = validationRules[name as keyof typeof validationRules];
  
  if (value === undefined || value === null) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }
  
  if (rules.required && !value.trim())
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  if (rules.minLength && value.length < rules.minLength)
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${
      rules.minLength
    } characters`;
  if (rules.pattern && !rules.pattern.test(value)) {
    if (name === "email") return "Please enter a valid email address";
    if (name === "phone") return "Please enter a valid phone number";
  }
  return "";
};

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, form[field as keyof typeof form]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const toggleStatus = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }));
  };

  const toggleGroundMaintenance = () => {
    setForm((prev) => ({ ...prev, groundMaintenance: !prev.groundMaintenance }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateBranch({ id: branch.id, data: form })).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update branch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={modalRef} className="max-w-3xl rounded-2xl mx-auto bg-white space-y-6 overflow-y-auto max-h-screen">
      <div className="flex items-center text-black bg-[#D5E7E0] justify-between p-5">
        <div>
          <h2 className="text-2xl font-bold">Edit Branch</h2>
          <p className="text-sm">Edit Branch in system</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 p-5 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Branch Information
          </h3>

          
          <div>
            <label className="block text-xs">Branch Name </label>
            <input
              type="text"
              name="name"
              placeholder="Branch Name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs">City </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-xs">Country </label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          
          <div>
            <label className="block text-xs">Branch Manager </label>
            <input
              type="text"
              name="manager"
              placeholder="Branch Manager"
              value={form.manager}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.manager ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.manager && (
              <p className="text-red-500 text-xs mt-1">{errors.manager}</p>
            )}
          </div>

        
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs">Branch Email </label>
              <input
                type="email"
                name="email"
                placeholder="Branch Email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-xs">Branch Phone Number </label>
              <input
                type="text"
                name="phone"
                placeholder="Branch Phone Number"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md text-sm ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          
          <div>
            <label className="block text-xs">Branch Address </label>
            <input
              type="text"
              name="branchaddress"
              placeholder="Branch Address"
              value={form.branchaddress}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-md text-sm ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.branchaddress && (
              <p className="text-red-500 text-xs mt-1">{errors.branchaddress}</p>
            )}
          </div>
        </div>

        
        <div>
          {/* <h3 className="text-lg font-semibold text-gray-700 mb-2">Location</h3> */}
          <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
            <MapContainer
              center={[form.latitude, form.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[form.latitude, form.longitude]}>
                <Popup>
                  {form.name} <br /> {form.branchaddress}
                </Popup>
              </Marker>

              
              <LocationMarker setForm={setForm} />
            </MapContainer>
          </div>
        </div>

      
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <button
              type="button"
              onClick={toggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.status ? "bg-[#0F766E]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.status ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                form.status ? "text-[#0F766E]" : "text-gray-600"
              }`}
            >
              {form.status ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex gap-3">
            <span className="text-sm font-medium text-gray-700">
              Ground Maintenance
            </span>
            <button
              type="button"
              onClick={toggleGroundMaintenance}
              className={`relative inline-flex h- w-11 items-center rounded-full transition-colors ${
                form.groundMaintenance ? "bg-[#0F766E]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.groundMaintenance ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                form.groundMaintenance ? "text-[#0F766E]" : "text-gray-600"
              }`}
            >
              {form.groundMaintenance ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

    
      <div className="flex justify-end gap-4 pb-4 pr-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`bg-[#005C5C] text-white px-5 py-2 rounded-md text-sm hover:bg-teal-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className={`border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditBranchModal;
