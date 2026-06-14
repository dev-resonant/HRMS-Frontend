export const DEMO_CREDENTIALS = {
  // Mode : Email + Password
  emailPassword: [
    {
      email: "smit@gmail.com",
      password: "Smit@1234",
      role: "admin",
    },
    {
      email: "het@gmail.com",
      password: "Het@1234",
      role: "user",
    },
    {
      email: "aaditya@gmail.com",
      password: "Aaditya@1234",
      role: "user",
    },
  ],

  // Mode : Username + Password
  usernamePassword: [
    {
      user_name: "Het",
      password: "Het@1234",
      role: "admin",
    },
    {
      user_name: "Smit",
      password: "Smit@1234",
      role: "user",
    },
    {
      user_name: "Aaditya",
      password: "Aaditya@1234",
      role: "user",
    },
  ],

  // Mode : Email + OTP
  emailOtp: [
    {
      email: "Het@gmail.com",
      otp: "1234",
      role: "admin",
    },
    {
      email: "smit@gmail.com",
      otp: "1234",
      role: "user",
    },
    {
      email: "aaditya@gmail.com",
      otp: "1234",
      role: "user",
    },
  ],

  // Mode : Number + OTP
  numberOtp: [
    {
      number: "9327536128",
      otp: "1234",
      role: "admin",
    },
    {
      number: "9104015371",
      otp: "1234",
      role: "user",
    },
    {
      number: "8160517020",
      otp: "1234",
      role: "user",
    },
  ],
};
