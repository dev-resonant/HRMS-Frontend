import { DEMO_CREDENTIALS } from "./constants";

// Check if demo mode is enabled
export const isDemo = () => {
  return import.meta.env?.VITE_IS_DEMO === "true";
};

// Demo JWT secret
const DEMO_JWT_SECRET = "demo_secret_key_12345";

// Generate demo token using JWT
export const generateDemoToken = (userData) => {
  const demoUser = {
    id: "demo_user_" + Date.now(),
    email: userData.email || userData.user_name || "demo@example.com",
    user_name: userData.user_name || userData.email?.split("@")[0] || "DemoUser",
    name: userData.user_name || userData.email?.split("@")[0] || "Demo User",
    role: userData.role || "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    isDemo: true,
  };

  // Create JWT token
  const token = jwt_encode(demoUser, DEMO_JWT_SECRET);
  return token;
};

// Validate login credentials
const validateLogin = (data, resolve, reject) => {
  let matchedUser = null;

  if (data.email && data.password) {
    matchedUser = DEMO_CREDENTIALS.emailPassword.find(
      (cred) => cred.email === data.email && cred.password === data.password,
    );
  } else if (data.user_name && data.password) {
    matchedUser = DEMO_CREDENTIALS.usernamePassword.find(
      (cred) => cred.user_name === data.user_name && cred.password === data.password,
    );
  }

  if (matchedUser) {
    const token = generateDemoToken({ ...data, role: matchedUser.role });
    resolve({
      data: {
        message: "Login Successful",
        data: { token },
      },
    });
  } else {
    const error = new Error("Invalid credentials");
    error.response = { data: { message: "Invalid credentials" } };
    reject(error);
  }
};

// Validate OTP send request
const validateOtpSend = (data, resolve, reject) => {
  if (data.email) {
    const matchedUser = DEMO_CREDENTIALS.emailOtp.find((cred) => cred.email === data.email);
    if (matchedUser) {
      resolve({
        data: {
          message: "OTP sent successfully",
        },
      });
    } else {
      const error = new Error("Email not found");
      error.response = { data: { message: "Email not found" } };
      reject(error);
    }
  } else if (data.number) {
    const matchedUser = DEMO_CREDENTIALS.numberOtp.find((cred) => cred.number === data.number);
    if (matchedUser) {
      resolve({
        data: {
          message: "OTP sent successfully",
        },
      });
    } else {
      const error = new Error("Mobile number not found");
      error.response = { data: { message: "Mobile number not found" } };
      reject(error);
    }
  } else {
    const error = new Error("Invalid data provided");
    error.response = { data: { message: "Invalid data provided" } };
    reject(error);
  }
};

// Validate OTP verification
const validateOtpVerify = (data, resolve, reject) => {
  let matchedUser = null;

  if (data.email && data.otp) {
    matchedUser = DEMO_CREDENTIALS.emailOtp.find((cred) => cred.email === data.email && cred.otp === data.otp);
    if (matchedUser) {
      const token = generateDemoToken({ ...data, role: matchedUser.role });
      resolve({
        data: {
          message: "OTP verified successfully",
          data: { token },
        },
      });
    } else {
      const error = new Error("Invalid OTP");
      error.response = { data: { message: "Invalid OTP" } };
      reject(error);
    }
  } else if (data.number && data.otp) {
    matchedUser = DEMO_CREDENTIALS.numberOtp.find((cred) => cred.number === data.number && cred.otp === data.otp);
    if (matchedUser) {
      const token = generateDemoToken({ ...data, role: matchedUser.role });
      resolve({
        data: {
          message: "OTP verified successfully",
          data: { token },
        },
      });
    } else {
      const error = new Error("Invalid OTP");
      error.response = { data: { message: "Invalid OTP" } };
      reject(error);
    }
  } else {
    const error = new Error("Invalid data provided");
    error.response = { data: { message: "Invalid data provided" } };
    reject(error);
  }
};

// Validate demo credentials
export const validateDemoCredentials = (formdata, endpoint) => {
  return new Promise((resolve, reject) => {
    switch (endpoint) {
      case "auth/login":
        validateLogin(formdata, resolve, reject);
        break;
      case "auth/sendOtp":
        validateOtpSend(formdata, resolve, reject);
        break;
      case "auth/verifyOtp":
        validateOtpVerify(formdata, resolve, reject);
        break;
      default: {
        const error = new Error("Invalid endpoint");
        error.response = { data: { message: "Invalid endpoint" } };
        reject(error);
      }
    }
  });
};
