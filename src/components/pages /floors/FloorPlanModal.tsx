import React from "react";
import { X } from "lucide-react";

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorPlanUrl: string | null;
}

const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  isOpen,
  onClose,
  floorPlanUrl,
}) => {
  if (!isOpen || !floorPlanUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/0 bg-opacity-50 z-50">
      <div className="relative bg-gray-400 rounded-lg shadow-xl max-w-xl w-[90vw] h-[50vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute bg-gray-700  p-1 rounded-full top-2 right-2 text-white cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center items-center w-full h-[50vh]">
          <img
            src={floorPlanUrl}
            alt="Floor Plan"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanModal;
