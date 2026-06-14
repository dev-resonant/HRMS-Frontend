import { useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContextExport";

export function AuthProvider({ children }) {
  const exist_token = localStorage.getItem("token");
  const exist_userdata = exist_token ? JSON.parse(localStorage.getItem("userdata")) : null;
  const exist_isAuth = exist_token && exist_userdata;

  const [token, setToken] = useState(exist_token);
  const [userData, setUserData] = useState(exist_userdata);
  const [isAuth, setIsAuth] = useState(exist_isAuth);

  function updateToken(token) {
    if (!token) {
      throw new Error(`Invalid Token Passed to setToken function, Got Token: ${token}`);
    }
    if (token === "clearToken") {
      setToken(null);
      setUserData(null);
      setIsAuth(false);
      localStorage.removeItem("token");
      localStorage.removeItem("userdata");
      return { isAuth: false, token: null, userData: null };
    } else {
      const userdata = jwtDecode(token);
      setToken(token);
      setUserData(userdata);
      setIsAuth(true);
      localStorage.setItem("token", token);
      localStorage.setItem("userdata", JSON.stringify(userdata));
      return { token, userData: userdata, isAuth: true };
    }
  }
  const value = useMemo(() => {
    function getData() {
      if (token && userData && isAuth) {
        return { token, userData, isAuth };
      } else {
        const exist_token = localStorage.getItem("token");
        if (exist_token) {
          return updateToken(exist_token);
        } else {
          return { isAuth: false, token: null, userData: null };
        }
      }
    }
    return { getData, setToken: updateToken };
  }, [token, userData, isAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

