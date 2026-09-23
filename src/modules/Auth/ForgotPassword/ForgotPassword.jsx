import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  Button,
  InlineNotification,
  InlineLoading,
  Heading,
  Stack,
} from "@carbon/react";
import { ArrowLeft, Login, Enterprise, Send, Renew } from "@carbon/icons-react";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { useForgotPassword } from "./forgot-password-api";
import "./forgot-password.scss";

const defaultInput = {
  email: "het@gmail.com",
};

export function ForgotPassword({ defaultValues = defaultInput }) {
  const location = useLocation();
  const [isSent, setIsSent] = useState(false);

  if (location.state?.formdata) {
    defaultValues = { ...defaultValues, ...location.state.formdata };
  }

  const {
    control,
    handleSubmit,
    setError,
    watch,
  } = useForm({ defaultValues });

  const forgotSubmit = useForgotPassword();
  const isLoading = forgotSubmit.isPending;

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    forgotSubmit.mutate(form_data, {
      onSuccess: () => setIsSent(true),
      onError: (axiosError) => {
        setError("root.serverError", {
          message: axiosError.response?.data?.message || "Failed to send reset link",
          type: axiosError.response?.status,
        });
      },
    });
  };

  return (
    <div className="simple-auth-page">
      <div className="simple-forgot-container animate-fade-in">
        <div className="simple-auth-header">
          <div className="brand-badge">
            <Enterprise size={24} />
          </div>
          <Heading className="brand-title">Forgot Password</Heading>
          <p className="brand-tagline">Enter your work email to reset</p>
        </div>

        {isSent ? (
          <div className="reset-feedback-block">
            <InlineNotification
              kind="success"
              title="Reset link sent"
              subtitle={`Check ${watch("email")} for instructions.`}
              hideCloseButton
            />
            <Button
              kind="ghost"
              size="md"
              renderIcon={Renew}
              onClick={handleSubmit(submit)}
              disabled={isLoading}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              Resend Link
            </Button>
            <Link to="/login" style={{ display: "block", marginTop: "1rem" }}>
              <Button kind="primary" renderIcon={Login} size="lg" style={{ width: "100%" }}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(submit)} className="simple-forgot-form">
            <Stack gap={4}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: { value: REGEX_EMAIL, message: "Enter a valid email" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    id="forgot-email"
                    labelText="Email Address"
                    placeholder="het@gmail.com"
                    type="email"
                    required
                    invalid={!!error}
                    invalidText={error?.message}
                    {...field}
                  />
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="submit-btn"
                disabled={isLoading}
                renderIcon={isLoading ? null : Send}
              >
                {isLoading ? (
                  <InlineLoading status="active" description="Sending..." />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="back-link-row">
                <Link to="/login" className="back-link">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </Stack>
          </form>
        )}
      </div>
    </div>
  );
}
