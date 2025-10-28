import React, { useState, useRef } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { useOutSideClick } from "../../../../hooks/useOutSideClick";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showDropdownIcon?: boolean;
  className?: string;
  suggestions?: string[];
  readOnly?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  showDropdownIcon = false,
  className = "",
  suggestions = [],
  readOnly = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = showSuggestions
    ? suggestions
    : suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutSideClick(wrapperRef, () => setShowSuggestions(false));

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />

      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onFocus={() => setShowSuggestions(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder={placeholder}
        className="w-full pl-10 cursor-pointer py-2 text-sm rounded-lg bg-gray-100 border border-gray-300 focus:outline-none"
      />

      {showDropdownIcon && (
        <button
          type="button"
          className="absolute cursor-pointer right-2 top-2.5 text-gray-400 text-sm focus:outline-none"
          onClick={() => setShowSuggestions((prev) => !prev)}
        >
          <FaChevronDown />
        </button>
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 bg-[#FFFFFF] rounded shadow mt-1 w-full max-h-60 overflow-auto text-sm">
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(item);
                setShowSuggestions(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
