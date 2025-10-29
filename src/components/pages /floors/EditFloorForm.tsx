import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches } from "../../../features/branches/BranchesSlice";
import { fetchBuildings } from "../../../features/building/BuildingSlice";
import type { RootState } from "../../../app/Store";

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

interface EditFloorFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditFloorForm: React.FC<EditFloorFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onCancel?.());

  const { branches } = useSelector((state: RootState) => state.branches);
  const { buildings } = useSelector((state: RootState) => state.buildings);

  const [fileName, setFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchBuildings());
    
    
    if (initialData?.floorPlan) {
      setFileName("liberty_groundfloor.pdf");
    }
  }, [dispatch, initialData]);

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
      floorName: initialData?.floorName || "Ground Floor",
      floorNumber: initialData?.floorNumber || 0,
      totalArea: initialData?.totalArea || 4500,
      status: initialData?.status || false,
      groundMaintenance: initialData?.groundMaintenance || false,
      floorPlan: undefined,
    },
  });

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
    console.log("Form data:", data);
    console.log("Buildings available:", buildings);
    console.log("Branches available:", branches);

    if (!buildings) {
      throw new Error("Buildings data is not available");
    }

    if (!branches) {
      throw new Error("Branches data is not available");
    }

    const branch = branches.find((b) => b.id.toString() === data.branchId);
    const building = buildings.find((b) => b.id.toString() === data.buildingId);

    console.log("Found branch:", branch);
    console.log("Found building:", building);

    const payload = {
      ...data,
      branchName: branch?.name || "",
      buildingName: building?.name || "",
      floorPlan: data.floorPlan?.[0] || initialData?.floorPlan,
      status: data.status ?? false,
      groundMaintenance: data.groundMaintenance ?? false,
    };

    console.log("Final payload:", payload);
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
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        
        <div className="px-6 py-4 bg-green-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Floor</h2>
            <p className="text-sm text-gray-600">Edit Floor in system</p>
          </div>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          
          <div className="">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Floor Information</h3>
            
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
              <select 
                {...register("branchId")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
            </div>

            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
              <select 
                {...register("buildingId")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              {errors.buildingId && <p className="text-red-500 text-xs mt-1">{errors.buildingId.message}</p>}
            </div>

            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor Name</label>
              <input 
                type="text" 
                {...register("floorName")} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.floorName && <p className="text-red-500 text-xs mt-1">{errors.floorName.message}</p>}
            </div>

            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                <input 
                  type="number" 
                  {...register("floorNumber")} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.floorNumber && <p className="text-red-500 text-xs mt-1">{errors.floorNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor Area (sq ft)</label>
                <input 
                  type="number" 
                  {...register("totalArea")} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.totalArea && <p className="text-red-500 text-xs mt-1">{errors.totalArea.message}</p>}
              </div>
            </div>
          </div>

          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Floor Plan</h3>
            
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
              <input
                type="file"
                id="floorPlan"
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="floorPlan" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Upload Floor Plan</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                </div>
              </label>
            </div>

            
            {fileName && (
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">{fileName}</span>
                <button 
                  type="button" 
                  onClick={() => setFileName("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          
          <div className="">
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
          </div>

          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Editing..." : "Edit"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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