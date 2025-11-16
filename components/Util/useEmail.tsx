import { useState, useCallback } from "react";
import {
  sendClientEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendNewUserAdminNotification,
  sendNewOrderAdminNotification,
  type EmailRequest,
  type EmailResponse,
  type OrderItem,
} from "../../lib/clientEmailService";

/**
 * React hook for sending emails from client components
 *
 * Usage:
 *
 * const EmailComponent = () => {
 *   const { sendEmail, sending, error, success } = useEmail();
 *
 *   const handleSendEmail = async () => {
 *     await sendEmail({
 *       to: "customer@example.com",
 *       subject: "Hello",
 *       text: "Test email"
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSendEmail} disabled={sending}>
 *         {sending ? "Sending..." : "Send Email"}
 *       </button>
 *       {success && <p>Email sent successfully!</p>}
 *       {error && <p>Error: {error}</p>}
 *     </div>
 *   );
 * };
 */
export function useEmail() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = useCallback(async (emailData: EmailRequest) => {
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendClientEmail(emailData);

      if (result.success) {
        setSuccess(true);
        return result;
      } else {
        setError(result.error || "Failed to send email");
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    sendEmail,
    sending,
    error,
    success,
    reset,
  };
}

/**
 * Hook for sending template-based emails with specific methods
 */
export function useTemplateEmail() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendWelcome = useCallback(async (to: string, fullname: string) => {
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendWelcomeEmail(to, fullname);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send welcome email");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
    }
  }, []);

  const sendOrderConfirmation = useCallback(
    async (params: {
      to: string;
      customerName: string;
      orderNumber: number;
      totalPrice: number;
      items: OrderItem[];
      shippingAddress: string;
      currency?: string;
    }) => {
      setSending(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await sendOrderConfirmationEmail(params);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Failed to send order confirmation");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setSending(false);
      }
    },
    []
  );

  const sendStatusUpdate = useCallback(
    async (params: {
      to: string;
      customerName: string;
      orderNumber: number;
      status: string;
      trackingNumber?: string;
      shippingAddress?: string;
    }) => {
      setSending(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await sendOrderStatusUpdateEmail(params);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Failed to send status update");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setSending(false);
      }
    },
    []
  );

  const sendAdminUserNotification = useCallback(
    async (adminEmail: string, fullname: string, userEmail: string) => {
      setSending(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await sendNewUserAdminNotification(
          adminEmail,
          fullname,
          userEmail
        );
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Failed to send admin notification");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setSending(false);
      }
    },
    []
  );

  const sendAdminOrderNotification = useCallback(
    async (params: {
      adminEmail: string;
      customerName: string;
      customerEmail: string;
      orderNumber: number;
      totalPrice: number;
      items: OrderItem[];
      currency?: string;
    }) => {
      setSending(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await sendNewOrderAdminNotification(params);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Failed to send admin notification");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setSending(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    sendWelcome,
    sendOrderConfirmation,
    sendStatusUpdate,
    sendAdminUserNotification,
    sendAdminOrderNotification,
    sending,
    error,
    success,
    reset,
  };
}
