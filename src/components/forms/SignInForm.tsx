import React from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { SignInFormValues } from "@/types/index"; 

// ================== Props Type ===================
type SignInFormProps = {
    onSubmit: (
        values: SignInFormValues,
        formikHelpers: FormikHelpers<SignInFormValues>
    ) => void;
    isLoading: boolean;
};

// ================== Component ===================
const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, isLoading }) => {
    const formik = useFormik<SignInFormValues>({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
        }),
        onSubmit: (values, formikHelpers) => {
            onSubmit(values, formikHelpers);
        },
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full border rounded-md p-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="Enter your email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-sm">
                            {formik.errors.email}
                        </div>
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
    );
};

export default SignInForm;
