import React from "react";
import { CalendarDays } from "lucide-react";

const Logo: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 select-none">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-wide">
                DateTally
            </span>
        </div>
    );
};

export default Logo;
