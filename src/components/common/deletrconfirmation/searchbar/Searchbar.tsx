import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useOutSideClick } from "../../../../hooks/useOutSideClick";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  showDropdownIcon?: boolean;
  required?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  suggestions = [],
  showDropdownIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutSideClick(wrapperRef, () => setIsOpen(false));



  const filteredOptions = suggestions.filter(
    
    (opt) =>
      opt &&
      opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  console.log("Suggestions:", suggestions);
console.log("Types:", suggestions.map(opt => typeof opt));


  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className="flex items-center text-sm md:justify-between border border-gray-300 rounded-lg px-2 md:px-3 md:py-2 cursor-pointer hover:border-blue-400 transition"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent"
        />
        {showDropdownIcon && (
          <ChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-40 overflow-y-auto shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleSelect(opt)}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
