// src/components/forms/SignInForm.tsx
import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { SignInFormValues } from "@/types"

type SignInFormProps = {
    onSubmit: (values: SignInFormValues) => void
    isLoading: boolean
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>()

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full border rounded-md p-2"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Invalid email address",
                            },
                        })}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <div className="text-red-500 text-sm">{errors.email.message}</div>
                    )}
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit"}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600 mt-2">
                    No account?{" "}
                    <a
                        href="/auth/sign-up"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        Please sign up
                    </a>
                </p>
            </div>
        </>
    )
}

export default SignInForm
