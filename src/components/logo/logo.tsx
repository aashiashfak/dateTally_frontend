import React from "react";

const Logo: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 select-none">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                D
            </div>
            <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-wide">
                DateTally
            </span>
        </div>
    );
};

export default Logo;
