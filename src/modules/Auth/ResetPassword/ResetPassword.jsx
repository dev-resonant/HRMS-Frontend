import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router";
import {
  PasswordInput,
  Button,
  InlineNotification,
  InlineLoading,
  Heading,
  Stack,
} from "@carbon/react";
import { ArrowRight, Enterprise, Checkmark, Subtract } from "@carbon/icons-react";
import { useResetPassword } from "./reset-password-api";
import "./reset-password.scss";

const defaultInput = {
  password: "",
  confirm_password: "",
};

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const reset = useResetPassword(token);
  const isLoading = reset.isPending;

  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: defaultInput });

  const passwordVal = watch("password") || "";

  const rules = [
    { label: "At least 8 characters", valid: passwordVal.length >= 8 },
    { label: "At least one number or special char", valid: /[\d!@#$%^&*()]/.test(passwordVal) },
  ];

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    form_data.append("token", token);
    reset.mutate(form_data, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (axiosError) => {
        setError("root.serverError", {
          message: axiosError.response?.data?.message || "Password reset failed.",
          type: axiosError.response?.status,
        });
      },
    });
  };

  return (
    <div className="simple-auth-page">
      <div className="simple-reset-container animate-fade-in">
        <div className="simple-auth-header">
          <div className="brand-badge">
            <Enterprise size={24} />
          </div>
          <Heading className="brand-title">New Password</Heading>
          <p className="brand-tagline">Set your new password</p>
        </div>

        <form noValidate onSubmit={handleSubmit(submit)} className="simple-reset-form">
          <Stack gap={4}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  id="reset-password"
                  labelText="New Password"
                  placeholder="Enter new password"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            {/* Simple Dynamic Requirements */}
            <div className="simple-checklist">
              {rules.map((r, idx) => (
                <div key={idx} className={`checklist-item ${r.valid ? "passed" : ""}`}>
                  {r.valid ? (
                    <Checkmark size={12} className="check-icon success" />
                  ) : (
                    <Subtract size={12} className="check-icon neutral" />
                  )}
                  <span>{r.label}</span>
                </div>
              ))}
            </div>

            <Controller
              name="confirm_password"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  id="reset-confirm-password"
                  labelText="Confirm Password"
                  placeholder="Repeat new password"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            {errors?.root?.serverError && (
              <InlineNotification
                kind="error"
                title="Failed"
                subtitle={errors.root.serverError.message}
                hideCloseButton
              />
            )}

            <Button
              type="submit"
              size="lg"
              className="submit-btn"
              disabled={isLoading}
              renderIcon={isLoading ? null : ArrowRight}
            >
              {isLoading ? (
                <InlineLoading status="active" description="Saving..." />
              ) : (
                "Update Password"
              )}
            </Button>

            <div className="back-link-row">
              <Link to="/login" className="back-link">
                Back to Sign In
              </Link>
            </div>
          </Stack>
        </form>
      </div>
    </div>
  );
}
