import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, onSearch, showFreeOnly, setShowFreeOnly, searchTerm }) => {
    const [localSearch, setLocalSearch] = useState(searchTerm || '');

    useEffect(() => {
        setLocalSearch(searchTerm || '')
    },[searchTerm])

    if (!isOpen) return null;

    const handleSearch = () => {
        onSearch(localSearch);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
                <div className="bg-[#151515] rounded-xl p-6 shadow-xl relative">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold text-white">Search</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col items-start mb-8">
                        <p className="text-gray-400 text-xs mt-1.5">Search by events, venue & etc.</p>
                    </div>

                    <div className="flex justify-between mb-6 w-full">
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl bg-[#151515] border border-[#222222] text-white focus:outline-none placeholder:text-[#777]"
                            placeholder="Search..."
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full rounded-full px-4 py-3 transition duration-200 bg-white text-black hover:bg-[#f2f2f2] text-xs"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
