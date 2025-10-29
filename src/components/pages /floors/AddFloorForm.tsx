import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import SearchBar from "../../common/deletrconfirmation/searchbar/Searchbar";

interface Branch {
  id: string;
  name: string;
}

interface AddFloorFormProps {
  branches: Branch[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const floorSchema = z.object({
  branchId: z.string().min(1, "Branch selection is required"),
  buildingId: z.string().min(1, "Building selection is required"),
  floorName: z.string().min(3, "Floor name is required"),
  floorNumber: z.coerce.number().min(0, "Floor number must be 0 or higher"),
  totalArea: z.coerce.number().min(1, "Area must be at least 1 sq ft"),
  floorPlan: z
    .any()
    .refine((file) => file?.length > 0, "Floor plan is required"),
});

const AddFloorForm: React.FC<AddFloorFormProps> = ({
  branches,
  onSubmit,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => onCancel?.());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof floorSchema>>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      branchId: "",
      buildingId: "",
      floorName: "",
      floorNumber: 0,
      totalArea: 0,
      floorPlan: undefined,
    },
  });

  const onFormSubmit = (data: any) => {
    const selectedBranch = branches.find((b) => b.id === data.branchId);
    const payload = {
      ...data,
      branchName: selectedBranch?.name || "",
      floorPlan: data.floorPlan[0], 
    };
    onSubmit(payload);
  };

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto"
    >
      
      <div className="bg-[#d7e7e2] px-6 py-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Add Floor</h2>
          <p className="text-sm text-gray-600">Add Floor in system</p>
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
          Floor Information
        </h3>

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Branch Name
          </label>
          <SearchBar
            placeholder="Select Branch"
            value={watch("branchId")}
            onChange={(val) => {
              const selectedBranch = branches.find((b) => b.name === val);
              setValue("branchId", selectedBranch?.id || "");
            }}
            showDropdownIcon={true}
            suggestions={branches.map((b) => b.name)}
          />

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
            placeholder="Liberty Tower"
            {...register("buildingId")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.buildingId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.buildingId.message}
            </p>
          )}
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Floor Name
            </label>
            <input
              type="text"
              placeholder="Ground Floor"
              {...register("floorName")}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.floorName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.floorName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Floor Number
            </label>
            <input
              type="number"
              {...register("floorNumber", { valueAsNumber: true })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.floorNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.floorNumber.message}
              </p>
            )}
          </div>
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Floor Area (sq ft)
          </label>
          <input
            type="number"
            {...register("totalArea", { valueAsNumber: true })}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.totalArea && (
            <p className="text-red-500 text-xs mt-1">
              {errors.totalArea.message}
            </p>
          )}
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Upload Floor Plan
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            {...register("floorPlan")}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.floorPlan && (
            <p className="text-red-500 text-xs mt-1">
              {errors.floorPlan.message}
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

export default AddFloorForm;
