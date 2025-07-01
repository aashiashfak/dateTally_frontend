import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthState } from "@/types";

interface AuthRedirectProps {
    children: ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
    const user = useSelector((state: { userAuth: AuthState }) => state.userAuth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isAuthenticated) {
            if (user.role === "Admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [user.isAuthenticated, user.role, navigate]);

    return user.isAuthenticated ? null : <>{children}</>;
};

export default AuthRedirect;
