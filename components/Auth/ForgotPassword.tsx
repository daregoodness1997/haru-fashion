import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useTranslations } from "next-intl";

import { useAuth } from "../../context/AuthContext";
import Button from "../Buttons/Button";
import Input from "../Input/Input";

type Props = {
  onLogin: () => void;
  onClose: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
};

const ForgotPassword: React.FC<Props> = ({
  onLogin,
  onClose,
  errorMsg,
  setErrorMsg,
  setSuccessMsg,
}) => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const t = useTranslations("LoginRegister");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const forgotPasswordResponse = await auth.forgotPassword!(email);
    console.log(forgotPasswordResponse);
    if (forgotPasswordResponse.success) {
      setSuccessMsg("forgot_password_success");
      setShowToast(true);

      // Close modal after showing toast for 2 seconds
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 2000);
    } else {
      // setErrorMsg("incorrect_email_password");
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            <span>{t("forgot_password_success")}</span>
          </div>
        </div>
      )}

      <Dialog.Title
        as="h3"
        className="text-3xl text-center my-8 font-medium leading-10 text-gray-900"
      >
        {t("forgot_password")}
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="email"
          placeholder={`${t("email_address")} *`}
          name="email"
          required
          extraClass="w-full focus:border-gray500"
          border="border-2 border-gray300 mb-4"
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          value={email}
        />
        {errorMsg !== "" && (
          <div className="text-red text-sm mb-4 whitespace-nowrap">
            {t(errorMsg)}
          </div>
        )}
        <Button
          type="submit"
          value={t("submit")}
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
        <div className="text-center text-gray400">
          {t("go_back_to")}{" "}
          <span
            onClick={onLogin}
            className="text-gray500 focus:outline-none focus:underline cursor-pointer"
          >
            {t("login")}
          </span>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
