// src/pages/SignIn.tsx
import React, { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import BackButton from "@/components/buttons/BackButton"
import InputOTPControlled from "@/components/forms/InputOTPControlled"
import SignInForm from "@/components/forms/SignInForm"
import { setUser } from "@/redux/slices/authSlice"
import { noAuthInstance } from "@/utils/axios"
import useToastNotification from "@/hooks/SonnerToast"
import { setExpiryTime } from "@/utils/axiosFunctions"
import { SignInFormValues, VerifyOtpResponse } from "@/types"

const SignIn: React.FC = () => {
  const [isOTPsent, setIsOTPsent] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [isError, setIsError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showToast = useToastNotification()

  const handleFormSubmit = useCallback(
    async (values: SignInFormValues) => {
      setEmail(values.email)
      setLoading(true)
      try {
        const response = await noAuthInstance.post("/accounts/sign-in/", {
          email: values.email,
        })
        setExpiryTime()
        showToast(response.data.message || "OTP sent successfully", "success")
        setIsOTPsent(true)
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || "Error sending OTP"
        showToast(errorMsg, "error")
      } finally {
        setLoading(false)
      }
    },
    [showToast]
  )

  const verifyAndLogin = useCallback(async () => {
    setLoading(true)
    try {
      const response = await noAuthInstance.post<VerifyOtpResponse>(
        "/accounts/verify-otp/",
        { email, otp }
      )
      const { access, user } = response.data

      dispatch(
        setUser({
          isAuthenticated: true,
          isActive: user.is_active,
          email: user.email,
          username: user.username,
          accessToken: access,
          role: user.role,
        })
      )

      showToast("User logged in successfully", "success")
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        "Something went wrong. Please try again."
      setIsError(errorMsg)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }, [email, otp, dispatch, showToast])

  const handleBackClick = useCallback(() => {
    isOTPsent ? setIsOTPsent(false) : navigate(-1)
  }, [isOTPsent, navigate])

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-md shadow-md border-gray-100 overflow-y-auto">
      <BackButton handleBackClick={handleBackClick} />
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isOTPsent ? "Verify OTP" : "Sign In"}
      </h1>
      {!isOTPsent ? (
        <SignInForm onSubmit={handleFormSubmit} isLoading={loading} />
      ) : (
        <InputOTPControlled
          email={email}
          verifyAndLogin={verifyAndLogin}
          setOtp={setOtp}
          isLoading={loading}
          setIsError={setIsError}
          isError={isError}
        />
      )}
    </div>
  )
}

export default SignIn
