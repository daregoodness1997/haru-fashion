import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import axios from "axios";
import Head from "next/head";
import Button from "../components/Buttons/Button";
import Input from "../components/Input/Input";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const t = useTranslations("LoginRegister");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Invalid Link</h1>
          <p className="text-center text-gray-600">
            This password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully.
            </p>
            <p className="text-gray-600">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Shunapee Fashion House</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="New Password *"
              name="newPassword"
              required
              extraClass="w-full focus:border-gray500"
              border="border-2 border-gray300 mb-4"
              onChange={(e) =>
                setNewPassword((e.target as HTMLInputElement).value)
              }
              value={newPassword}
            />

            <Input
              type="password"
              placeholder="Confirm Password *"
              name="confirmPassword"
              required
              extraClass="w-full focus:border-gray500"
              border="border-2 border-gray300 mb-4"
              onChange={(e) =>
                setConfirmPassword((e.target as HTMLInputElement).value)
              }
              value={confirmPassword}
            />

            {error && (
              <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              value={loading ? "Resetting..." : "Reset Password"}
              extraClass="w-full text-center text-xl"
              size="lg"
              disabled={loading}
            />

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
}

export default ResetPassword;
