import React, { useState } from "react";
import SignUpForm from "@/components/forms/SignUpForm";
import InputOTPControlled from "@/components/forms/InputOTPControlled";
import { noAuthInstance } from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import useToastNotification from "@/hooks/SonnerToast";
import BackButton from "@/components/buttons/BackButton";
import { setExpiryTime } from "@/utils/axiosFunctions";
import { AuthUser, VerifyOtpResponse  } from "@/types";

const SignUp: React.FC = () => {
    const [isOTPsent, setIsOTPsent] = useState<boolean>(false);
    const [userData, setUserData] = useState<Partial<AuthUser>>({});
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showToast = useToastNotification();

    const verifyAndLogin = async () => {
        try {
            setLoading(true);
            const updatedData = {
                ...userData,
                otp: otp,
                role: "User",
            };

            const response = await noAuthInstance.post<VerifyOtpResponse>(
                "/accounts/sign-up/verify-otp/",
                updatedData
            );

            const { access, user } = response.data;

            dispatch(
                setUser({
                    isAuthenticated: true,
                    isActive: user.is_active || false,
                    email: user.email || "",
                    username: user.username || "",
                    accessToken: access || "",
                    role: user.role || "",
                })
            );

            setExpiryTime();
            showToast("User created and logged in successfully", "success");
            navigate("/");
        } catch (error: any) {
            showToast(
                error?.response?.data?.error || "An unknown error occurred",
                "error"
            );
            console.error("Error during OTP verification:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        if (isOTPsent) {
            setIsOTPsent(false);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 border rounded-md shadow-md">
            <BackButton handleBackClick={handleBackClick} />
            <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
            {!isOTPsent ? (
                <SignUpForm
                    setUserData={setUserData}
                    setIsOTPsent={setIsOTPsent}
                />
            ) : (
                <InputOTPControlled
                    email={userData?.email || ""}
                    verifyAndLogin={verifyAndLogin}
                    setOtp={setOtp}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default SignUp;
