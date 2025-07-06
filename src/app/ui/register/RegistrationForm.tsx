'use client'
import { ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import Button from "../components/button/button";
import Link from "next/link";

export default function RegistrationForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const registrationSchema = z.object({
        email: z.string().email("Provide a valid email"),
        username: z.string().min(1, "Create a username"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    }).superRefine(async (data, ctx) => {
        const { email, username, password, confirmPassword } = data;

        // Confirm password check
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ['confirmPassword']
            });
        }

        // Email validation
        const isEmailValid = await validateEmail(email);
        console.log("Valid: " + isEmailValid)
        if (!isEmailValid) {
            ctx.addIssue({
                code: "custom",
                message: "Email is not valid",
                path: ["email"],
            });
        }

        // Username validation
        const isUsernameAvailable = await checkUsernameAvailability(username);
        if (!isUsernameAvailable) {
            ctx.addIssue({
                code: "custom",
                path: ['username'],
                message: 'Username is not available',
            });
        }
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);

        try {
            // Validate using Zod
            const parsedData = registrationSchema.safeParse({
                email: formData.get("email"),
                username: formData.get("username"),
                password: formData.get("password"),
                confirmPassword: formData.get("confirmPassword"),
            });

            if (!parsedData.success) {
                setErrorMessage("Validation failed. Check the required fields.")
                console.log(parsedData.error.format());
                return
            }

            const response = await fetch(`https://localhost:5000/api/users`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            //const data = await response.json();
            if (!response.ok) {
                // setErrorMessage(data['message'])
            }

            router.push("/login")
        } catch (error) {
            console.log(error)

        } finally {
            setIsPending(false)
        }

    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "0.75rem" }}>
            <div style={{ "paddingLeft": "1.5rem", "paddingRight": "1.5rem", "paddingBottom": "1rem", "paddingTop": "2rem", "flex": "1 1 0%", "borderRadius": "0.5rem", "backgroundColor": "#F9FAFB" }}>
                <h1 style={{ "marginBottom": "0.75rem", "fontSize": "1.5rem", "lineHeight": "2rem", "color": "#111827" }}>
                    Please log in to continue.
                </h1>
                <div style={{ "width": "100%" }}>
                    <div>
                        <label
                            style={{ "display": "block", "marginBottom": "0.75rem", "marginTop": "1.25rem", "fontSize": "0.75rem", "lineHeight": "1rem", "fontWeight": 500, "color": "#111827" }}
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div style={{ "position": "relative" }}>
                            <input
                                style={{ "display": "block", "paddingLeft": "2.5rem", "borderRadius": "0.375rem", "borderWidth": "1px", "borderColor": "#E5E7EB", "outlineWidth": "2px", "width": "100%", "fontSize": "0.875rem", "lineHeight": "1.25rem" }}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon style={{ "position": "absolute", "left": "0.75rem", "top": "50%", "color": "#6B7280", "pointerEvents": "none", "height": "18px", "width": "18px" }} />
                        </div>
                    </div>
                    <div>
                        <label
                            style={{ "display": "block", "marginBottom": "0.75rem", "marginTop": "1.25rem", "fontSize": "0.75rem", "lineHeight": "1rem", "fontWeight": 500, "color": "#111827" }}
                            htmlFor="email"
                        >
                            Username
                        </label>
                        <div style={{ "position": "relative" }}>
                            <input
                                style={{ "display": "block", "paddingLeft": "2.5rem", "borderRadius": "0.375rem", "borderWidth": "1px", "borderColor": "#E5E7EB", "outlineWidth": "2px", "width": "100%", "fontSize": "0.875rem", "lineHeight": "1.25rem" }}
                                id="username"
                                type="username"
                                name="username"
                                placeholder="Enter a username"
                                required
                            />
                            <AtSymbolIcon style={{ "position": "absolute", "left": "0.75rem", "top": "50%", "color": "#6B7280", "pointerEvents": "none", "height": "18px", "width": "18px" }} />
                        </div>
                    </div>
                    
                    <div style={{ "marginTop": "1rem" }}>
                        <label
                            style={{ "display": "block", "marginBottom": "0.75rem", "marginTop": "1.25rem", "fontSize": "0.75rem", "lineHeight": "1rem", "fontWeight": 500, "color": "#111827" }}
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div style={{ "position": "relative" }}>
                            <input
                                style={{ "display": "block", "paddingLeft": "2.5rem", "borderRadius": "0.375rem", "borderWidth": "1px", "borderColor": "#E5E7EB", "outlineWidth": "2px", "width": "100%", "fontSize": "0.875rem", "lineHeight": "1.25rem" }}
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon style={{ "position": "absolute", "left": "0.75rem", "top": "50%", "color": "#6B7280", "pointerEvents": "none", "height": "18px", "width": "18px" }} />
                        </div>
                    </div>
                    <div style={{ "marginTop": "1rem" }}>
                        <label
                            style={{ "display": "block", "marginBottom": "0.75rem", "marginTop": "1.25rem", "fontSize": "0.75rem", "lineHeight": "1rem", "fontWeight": 500, "color": "#111827" }}
                            htmlFor="password"
                        >
                            Confirm Password
                        </label>
                        <div style={{ "position": "relative" }}>
                            <input
                                style={{ "display": "block", "paddingLeft": "2.5rem", "borderRadius": "0.375rem", "borderWidth": "1px", "borderColor": "#E5E7EB", "outlineWidth": "2px", "width": "100%", "fontSize": "0.875rem", "lineHeight": "1.25rem" }}
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Enter password again"
                                required
                                minLength={6}
                            />
                            <KeyIcon style={{ "position": "absolute", "left": "0.75rem", "top": "50%", "color": "#6B7280", "pointerEvents": "none", "height": "18px", "width": "18px" }} />
                        </div>
                    </div>
                </div>
                {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
                <Button style={{ "marginTop": "1rem", "width": "100%" }} aria-disabled={isPending}>
                    Register <ArrowRightIcon style={{ "width": "1.25rem", "height": "1.25rem", "color": "#F9FAFB" }} />
                </Button>
                <div
                    style={{ "display": "flex", "marginLeft": "0.25rem", "alignItems": "flex-end", "height": "2rem" }}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon style={{ "width": "1.25rem", "height": "1.25rem", "color": "#EF4444" }} />
                            <p style={{ "fontSize": "0.875rem", "lineHeight": "1.25rem", "color": "#EF4444" }}>{errorMessage}</p>
                        </>
                    )}
                </div>
                <div>
                    <p style={{ "marginBottom": "0.75rem", "fontSize": "1.5rem", "lineHeight": "2rem", "color": "#111827" }}>
                        Already have an account? <Link color="#3b82f6" href={"/login"}>Login here</Link>
                    </p>
                </div>
            </div>
        </form>
    )
}

// https://blog.devgenius.io/async-operations-with-zod-refine-and-superrefine-methods-2b24dafc1d84
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    const res = await fetch(`https://localhost:5000/api/users/usernames/${username}`)
    const data = await res.json();

    console.log(data.available)
    return data.available;
};

const validateEmail = async (email: string): Promise<boolean> => {
    return fetch(`https://localhost:5000/api/users/emails/${email}`)
        .then(res => res.json())
        .then(data => data.valid);
};