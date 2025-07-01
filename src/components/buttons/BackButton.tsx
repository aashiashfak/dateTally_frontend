import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Define the type for props
type BackButtonProps = {
    handleBackClick: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ handleBackClick }) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            aria-label="Go back"
            className="text-xl"
        >
            <ArrowLeft className="h-16 w-16" />
        </Button>
    );
};

export default BackButton;
