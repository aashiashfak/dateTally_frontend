import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice";
import Logo from "../logo/logo";
import type { AuthState } from "@/types";
import { ModeToggle } from "../buttons/ThemeButtons";
import { useTheme } from "../layouts/ThemeProvider";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme()

    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    const { isAuthenticated } = useSelector(
        (state: { userAuth: AuthState }) => state.userAuth
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/sign-in");
    };

    useEffect(() => {
        if (theme === "system") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setResolvedTheme(isDark ? "dark" : "light");
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    const bgClass = resolvedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";


    return (
        <div className={`flex items-center justify-between px-6 py-4 shadow-md sticky top-0 z-50 ${bgClass}`}>
            {/* Logo & Brand */}
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <Logo />
            </div>

            {/* Auth and Theme Buttons */}
            <div className="flex  gap-3" >
                {isAuthenticated ? (
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button onClick={() => navigate("/auth/sign-in")}>Login</Button>
                )}
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;
