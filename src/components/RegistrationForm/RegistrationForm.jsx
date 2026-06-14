import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Autocomplete,
  Typography,
  Box,
  CircularProgress,
  Collapse,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  CheckCircleOutlined,
} from '@mui/icons-material';

// Zod Schema for Validation
const registrationSchema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be under 50 characters')
    .refine((val) => val.trim().length > 0, 'Full name cannot be only spaces'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.string().min(1, 'Please select a professional role'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

const ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'UX/UI Designer',
  'Product Manager',
  'DevOps Specialist',
  'Data Scientist',
  'QA Automation Engineer',
];

export const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    setSubmitSuccess(false);
    
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmittingForm(false);
    setSubmitSuccess(true);
    setSubmittedData(data);
    reset(); // reset form fields
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="glass-panel animate-fade-in-up">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          className="gradient-text glow-accent"
          sx={{ display: 'inline-block', mb: 1 }}
        >
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join the HRMS portal to manage your workspace.
        </Typography>
      </Box>

      {/* Success Alert */}
      <Collapse in={submitSuccess}>
        {submittedData && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlined fontSize="inherit" />}
            sx={{
              mb: 3,
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              '& .MuiAlert-icon': {
                color: '#34d399',
              },
            }}
            onClose={() => setSubmitSuccess(false)}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Registration Successful!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome, {submittedData.fullName}. Your account has been registered as a <strong>{submittedData.role}</strong>.
            </Typography>
          </Alert>
        )}
      </Collapse>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Full Name Field */}
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                disabled={isSubmittingForm}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: errors.fullName ? 'error.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmittingForm}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: errors.email ? 'error.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmittingForm}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: errors.password ? 'error.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          disabled={isSubmittingForm}
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Role Autocomplete Field */}
          <Controller
            name="role"
            control={control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={ROLES}
                value={value || null}
                onChange={(_, newValue) => onChange(newValue || '')}
                disabled={isSubmittingForm}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Role"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  />
                )}
              />
            )}
          />

          {/* Accept Terms Checkbox */}
          <Box>
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...fieldProps}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      disabled={isSubmittingForm}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the Terms of Service & Privacy Policy
                    </Typography>
                  }
                />
              )}
            />
            {errors.acceptTerms && (
              <FormHelperText error sx={{ ml: 3.5, mt: 0.5 }}>
                {errors.acceptTerms.message}
              </FormHelperText>
            )}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmittingForm}
            sx={{
              mt: 1,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              height: '54px',
            }}
          >
            {isSubmittingForm ? (
              <CircularProgress size={24} sx={{ color: 'primary.contrastText' }} />
            ) : (
              'Register Employee'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
