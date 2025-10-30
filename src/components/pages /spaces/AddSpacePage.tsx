import React, { useEffect,useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../app/Store";

import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";
import { fetchBranches } from "../../../features/branches/BranchesSlice";
import { fetchBuildings } from "../../../features/building/BuildingSlice";
import { fetchFloors } from "../../../features/floors/FloorsSlice";
import { fetchSpaces, addSpace } from "../../../features/spaces/SpacesSlice";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SpaceSchema = z.object({
  branchName: z.string().min(1, "Branch Name is required"),
  buildingName: z.string().min(1, "Building Name is required"),
  floorName: z.string().min(1, "Floor Name is required"),
  spaceName: z.string().min(1, "Space Name is required"),
  spaceArea: z.string().min(1, "Space Area is required"),
  metaType: z.string().min(1, "Meta Type is required"),
  parentSpace: z.string().optional(),
  spaceCondition: z.string().min(1, "Condition is required"),
  spaceManager: z.string().min(1, "Manager Name is required"),
});

type SpaceFormData = z.infer<typeof SpaceSchema>;

const AddSpacePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [spaceImage, setSpaceImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
    reset,
    clearErrors,
  } = useForm<SpaceFormData>({
    resolver: zodResolver(SpaceSchema),
    mode: "onChange",
    defaultValues: {
      branchName: "",
      buildingName: "",
      floorName: "",
      spaceName: "",
      spaceArea: "",
      metaType: "",
      parentSpace: "",
      spaceCondition: "",
      spaceManager: "",
    },
  });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/spaces");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const branchName = watch("branchName");
  const buildingName = watch("buildingName");
  const floorName = watch("floorName");
  const metaType = watch("metaType");
  const parentSpace = watch("parentSpace");
  const spaceCondition = watch("spaceCondition");

  const { branches } = useSelector((state: RootState) => state.branches);
  const { buildings } = useSelector((state: RootState) => state.buildings);
  const { floors } = useSelector((state: RootState) => state.floors);
  const { spaces } = useSelector((state: RootState) => state.spaces);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchBuildings());
    dispatch(fetchFloors());
    dispatch(fetchSpaces());
  }, [dispatch]);

  const branchNames = branches.map((b) => b.name);
  const buildingNames = buildings.map((b) => b.name);
  const floorNames = floors.map((f) => f.floorName);
  const spaceNames = spaces.map((s) => s.name);

const onSubmit = async (data: SpaceFormData) => {
  try {
    let imageString = "";
    if (spaceImage) {
      imageString = await convertToBase64(spaceImage);
    }

    const payload = {
      ...data,
      spaceImage: imageString,
    };

    await dispatch(addSpace(payload)).unwrap();
    toast.success("Space added successfully!");
    reset();
    setSpaceImage(null);
  } catch (err) {
    toast.error("Failed to add space!");
    console.error(err);
  }
};



  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6">
      <div className="max-w-5xl mx-auto">
        <button
          className="flex items-center text-sm text-gray-600 hover:text-[#0F766E] mb-1"
          onClick={handleBack}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">Add New Space</h1>
        <p className="text-sm text-gray-500 mb-2">
          Register a new Space to the system
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-sm p-5"
        >
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Space Information
          </h2>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <SearchBar
                placeholder="Select Branch"
                value={branchName}
                onChange={(val) => {
                  setValue("branchName", val, { shouldValidate: true });
                  clearErrors("branchName");
                }}
                showDropdownIcon
                suggestions={branchNames}
              />
              {errors.branchName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.branchName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Name
              </label>
              <SearchBar
                placeholder="Select Building"
                value={buildingName}
                onChange={(val) => setValue("buildingName", val)}
                showDropdownIcon
                suggestions={buildingNames}
              />
              {errors.buildingName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.buildingName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Name
              </label>
              <SearchBar
                placeholder="Select Floor"
                value={floorName}
                onChange={(val) => setValue("floorName", val)}
                showDropdownIcon
                suggestions={floorNames}
              />
              {errors.floorName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.floorName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Name
              </label>
              <input
                {...register("spaceName")}
                placeholder="Enter Space Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F766E]"
              />
              {errors.spaceName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.spaceName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Area (sq.ft)
                </label>
                <input
                  {...register("spaceArea")}
                  placeholder="Enter Space Area"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F766E]"
                />
                {errors.spaceArea && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.spaceArea.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Type
                </label>
                <SearchBar
                  placeholder="Select Meta Type"
                  value={metaType}
                  onChange={(val) => setValue("metaType", val)}
                  showDropdownIcon
                  suggestions={["Commercial", "Residential", "Storage"]}
                />
                {errors.metaType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.metaType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Image
              </label>
              <label
                htmlFor="spaceImageUpload"
                className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0F766E] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v16h16V4H4zm4 8l4 4m0 0l4-4m-4 4V8"
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  Upload New Image <br /> PNG, JPG, GIF up to 10MB
                </span>
                {spaceImage && (
                  <span className="mt-2 text-xs text-gray-600">
                    Selected: {spaceImage.name}
                  </span>
                )}
              </label>

              <input
                id="spaceImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSpaceImage(file);
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Space
              </label>
              <SearchBar
                placeholder="Select Parent Space"
                value={parentSpace}
                onChange={(val) => setValue("parentSpace", val)}
                showDropdownIcon
                suggestions={spaceNames}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <SearchBar
                placeholder="Select Condition"
                value={spaceCondition}
                onChange={(val) => setValue("spaceCondition", val)}
                showDropdownIcon
                suggestions={["Good", "Average", "Needs Maintenance"]}
              />
              {errors.spaceCondition && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.spaceCondition.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager
              </label>
              <input
                {...register("spaceManager")}
                placeholder="Enter Manager Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F766E]"
              />
              {errors.spaceManager && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.spaceManager.message}
                </p>
              )}
            </div>

            <div className="mt-4 border rounded overflow-hidden">
              <MapContainer
                center={[31.582045, 74.329376]}
                zoom={13}
                className="h-48 w-full rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[31.582045, 74.329376]} />
              </MapContainer>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F766E] text-white rounded-md text-sm hover:bg-[#0C615B] transition"
              >
                Add Space
              </button>
              <button
                type="button"
                onClick={() => handleBack()}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpacePage;
