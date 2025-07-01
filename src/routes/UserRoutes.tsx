import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/user/Home";
import Navbar from "@/components/navbar/Navbar";


const UserRoutes = () => {
    return (
        <>
            <Navbar />
            {/* Main Content */}
            <div className="">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </>
    );
};

export default UserRoutes;