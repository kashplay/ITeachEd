import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search..",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative w-full h-12 max-sm:h-11">
        <div className="absolute inset-0 border shadow-[0px_19px_56px_0px_rgba(49,79,124,0.04)] rounded-xl border-solid border-[#3C423D] bg-transparent" />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full bg-transparent text-white text-base font-normal leading-6 pl-12 pr-4 rounded-xl outline-none placeholder:text-white placeholder:opacity-50 max-sm:text-sm"
          aria-label="Search"
        />
      </div>
    </form>
  );
};
