import React, { useEffect, useState } from "react";
import WriteIn from "../component/Admin/component/WriteIn/WriteIn";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

export default function WriteInPage() {
  const [adminAccess, setAdminAccess] = useState(false);
  const history = useHistory();
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authRes = await Auth.currentAuthenticatedUser();
      console.log("Check auth response ", authRes);
      console.log(
        "user group",
        authRes.signInUserSession.accessToken.payload["cognito:groups"][0]
      );
      if (
        authRes.signInUserSession.accessToken.payload["cognito:groups"][0] ===
        "admin"
      ) {
        setAdminAccess(true);
        console.log("Welcome to admin page!");
      } else {
        setAdminAccess(false);
        history.push("/");
        console.log("Admin page accessing is failed, since you are not admin.");
      }
    } catch (error) {
      setAdminAccess(false);
      console.log("Check Auth error ", error);
      history.push("/");
      console.log("Admin page accessing is failed, since you are not admin.");
    }
  }
  return <div>{adminAccess ? <WriteIn /> : null}</div>;
}
