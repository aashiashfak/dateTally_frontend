import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice"; 
import Logo from "../logo/logo";
import type { AuthState } from "@/types";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(
        (state: { userAuth: AuthState }) => state.userAuth
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/sign-in");
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
            {/* Logo & Brand */}
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <Logo />
            </div>

            {/* Auth Button */}
            <div>
                {isAuthenticated ? (
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button onClick={() => navigate("/auth/sign-in")}>Login</Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
