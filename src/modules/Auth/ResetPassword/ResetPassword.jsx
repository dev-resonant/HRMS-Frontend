import { useForm } from "react-hook-form";
import { useResetPassword } from "./reset-password-api";
import { useSearchParams } from "react-router";
import "./reset-password.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";

const defaultInput = {
  password: "",
  confirm_password: "",
};

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = searchParams.get("token");
  const reset = useResetPassword(token);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: defaultInput });

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    form_data.append("token", token);
    reset.mutate(form_data, {
      onError: (axiosError) => {
        setError("root.serverError", { message: axiosError.response.data.message, type: axiosError.response.status });
      },
    });
  };

  return (
    <div className="reset-password-page gradient-bg">
      <Card className="reset-password-container" elevation={3}>
        <CardHeader title="Reset Password" />
        <CardContent>
          <img src="/images/norquest_newlogo.png" alt="" />
          <form noValidate onSubmit={handleSubmit(submit)} className="reset-password-form">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter a new Password below to change your password
            </Typography>

            <TextField
              required
              id="password"
              label="New Password"
              autoFocus
              type={showPassword ? "text" : "password"}
              error={Boolean(errors.password)}
              autoComplete="new-password"
              fullWidth
              sx={{ mb: 3 }}
              {...register("password", {
                required: "Password is Required",
                min: { value: 8, message: "Password should not be less than 8 character" },
                max: { value: 15, message: "Password should not be more than 15 character" },
                validate: {
                  isValidPassword: (value) => {
                    if (!/[A-Za-z]/.test(value)) return "Password must contain atleast one alphabet character";
                    if (!/\d+/.test(value)) return "Password must contain atleast one numeric character";
                    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
                      return "Password must contain atleast one special character";
                  },
                },
              })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              helperText={errors.password?.message}
            />

            <TextField
              required
              id="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              error={Boolean(errors.confirm_password)}
              autoComplete="new-password"
              fullWidth
              {...register("confirm_password", {
                required: "Confirm Password is Required",
                validate: {
                  isEqual: (value, formValues) => {
                    if (value === formValues.password) {
                      return true;
                    } else {
                      return "Confirm password does not match";
                    }
                  },
                },
              })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((p) => !p)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              helperText={errors.confirm_password?.message}
            />
            {errors?.root?.serverError && (
              <Typography color="error" variant="caption" sx={{ mt: 2 }}>
                {errors.root.serverError.message}
              </Typography>
            )}
          </form>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button variant="contained" onClick={handleSubmit(submit)}>
            Continue
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
