import DateManager from "@/components/layouts/DateManager";
import React from "react";
import type { AuthState } from "@/types";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
    const { isAuthenticated } = useSelector(
        (state: { userAuth: AuthState }) => state.userAuth
    );

    return (
        isAuthenticated ? (
            <DateManager />
        ) : (
            <div className="h-screen flex justify-center items-center">
                <h1 className="text-center">Please login to continue</h1>
            </div>
        )
    );
};

export default Home;
