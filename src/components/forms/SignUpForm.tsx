import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import useToastNotification from "@/hooks/SonnerToast";
import { noAuthInstance } from "@/utils/axios";
import { Email } from "@/types";

interface SignUpFormProps {
  setUserData: (data: Email) => void;
  setIsOTPsent: (value: boolean) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setUserData, setIsOTPsent }) => {
  const [loading, setLoading] = useState(false);
  const showToast = useToastNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Email>();

  const onSubmit = async (data: Email) => {
    try {
      setLoading(true);
      const response = await noAuthInstance.post("accounts/sign-up/", {
        email: data.email,
      });

      showToast(response?.data?.message || "OTP sent", "success");

      setUserData({ email: data.email });
      setIsOTPsent(true);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || "Error sending OTP";
      setError("email", {
        type: "manual",
        message: errorMsg,
      });
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mt-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Please sign in
          </a>
        </p>
      </div>
    </>
  );
};

export default SignUpForm;
