import axios from "axios";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import React, { useState, useEffect, useContext, createContext } from "react";

type authType = {
  user: null | User;
  register?: (
    email: string,
    fullname: string,
    password: string,
    shippingAddress: string,
    phone: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  login?: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  forgotPassword?: (email: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  logout?: () => void;
  updateUser?: (updatedUser: User) => void;
};

const initialAuth: authType = {
  user: null,
};

const authContext = createContext<authType>(initialAuth);

type User = {
  id: number;
  email: string;
  fullname: string;
  shippingAddress?: string;
  phone?: string;
  isAdmin?: boolean;
  token: string;
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setCookie("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      deleteCookie("user");
    }
  }, [user]);

  const register = async (
    email: string,
    fullname: string,
    password: string,
    shippingAddress: string,
    phone: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        {
          email,
          fullname,
          password,
          shippingAddress,
          phone,
        }
      );
      const registerResponse = response.data;
      const user: User = {
        id: +registerResponse.data.id,
        email,
        fullname,
        shippingAddress,
        phone,
        isAdmin: registerResponse.data.isAdmin || false,
        token: registerResponse.token,
      };
      setUser(user);
      return {
        success: true,
        message: "register_successful",
      };
    } catch (err) {
      const errResponse = (err as any).response.data;
      let errorMessage: string;
      if (errResponse.error.type === "alreadyExists") {
        errorMessage = errResponse.error.type;
      } else {
        errorMessage = errResponse.error.detail.message;
      }
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const login = async (email: string, password: string) => {
    console.log("=== LOGIN FUNCTION CALLED ===");
    console.log("Email:", email);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      const loginResponse = response.data;
      console.log("Login API Response:", loginResponse);
      console.log("isAdmin from API:", loginResponse.data.isAdmin);

      const user: User = {
        id: +loginResponse.data.id,
        email,
        fullname: loginResponse.data.fullname,
        phone: loginResponse.data.phone,
        shippingAddress: loginResponse.data.shippingAddress,
        isAdmin: loginResponse.data.isAdmin,
        token: loginResponse.token,
      };

      console.log("User object being set:", user);
      setUser(user);
      return {
        success: true,
        message: "login_successful",
      };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: "incorrect",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
        {
          email,
        }
      );
      const forgotPasswordResponse = response.data;
      setUser(user);
      return {
        success: forgotPasswordResponse.success,
        message: "reset_email_sent",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "something_went_wrong",
      };
    }
  };

  const logout = () => {
    setUser(null);
    deleteCookie("user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Return the user object and auth methods
  return {
    user,
    register,
    login,
    forgotPassword,
    logout,
    updateUser,
  };
}
