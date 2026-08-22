import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router";
import {
  TextInput,
  PasswordInput,
  Button,
  InlineLoading,
  Heading,
  Stack,
} from "@carbon/react";
import { ArrowRight, Enterprise, Globe } from "@carbon/icons-react";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { SOCIAL_SIGNUP_TYPES } from "./signup-constants";
import "./signup.scss";

export function GlobalMultiSignup({
  social_signup_options = ["google"],
  onSignup,
  isLoading = false,
}) {
  const {
    control,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const buttonText = useMemo(() => {
    if (isLoading) return "Creating account...";
    return "Create Account";
  }, [isLoading]);

  const submitHandler = async (data) => {
    onSignup?.(data);
  };

  const handleGoogleSignup = () => {
    console.debug("Google signup clicked");
  };

  const PROVIDERS = {
    [SOCIAL_SIGNUP_TYPES.google]: {
      label: "Google",
      handler: handleGoogleSignup,
      icon: Globe,
    },
  };

  return (
    <div className="simple-auth-page">
      <div className="simple-signup-container animate-fade-in">
        <div className="simple-auth-header">
          <div className="brand-badge">
            <Enterprise size={24} />
          </div>
          <Heading className="brand-title">Create ProHRM Account</Heading>
          <p className="brand-tagline">Get started in seconds</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="simple-signup-form">
          <Stack gap={4}>
            <Controller
              name="full_name"
              control={control}
              rules={{
                required: "Full name is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="signup-fullname"
                  labelText="Full Name"
                  placeholder="Het Gajjar"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: { value: REGEX_EMAIL, message: "Invalid email address" },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="signup-email"
                  labelText="Work Email"
                  placeholder="het@gmail.com"
                  type="email"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  id="signup-password"
                  labelText="Password"
                  placeholder="Het@1234"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

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
                  id="signup-confirm-password"
                  labelText="Confirm Password"
                  placeholder="Repeat password"
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
              renderIcon={isLoading ? null : ArrowRight}
            >
              {isLoading ? (
                <InlineLoading status="active" description="Creating account..." />
              ) : (
                buttonText
              )}
            </Button>

            <div className="login-link-row">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>

            {social_signup_options.length > 0 && (
              <div className="social-section">
                <div className="or-divider">
                  <span>OR</span>
                </div>
                {social_signup_options.map((key) => {
                  const provider = PROVIDERS[key];
                  if (!provider) return null;
                  const Icon = provider.icon;
                  return (
                    <Button
                      key={key}
                      kind="tertiary"
                      size="md"
                      onClick={provider.handler}
                      renderIcon={Icon}
                      className="social-btn"
                    >
                      Sign up with {provider.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </Stack>
        </form>
      </div>
    </div>
  );
}
