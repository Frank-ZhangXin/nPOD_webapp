import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";

export default function useConfirm(
  nameList,
  confirmClicked,
  setUserData,
  setUserRows,
  createRows
) {
  let result;
  useEffect(() => {
    // disable loop
    for (const idx in nameList) {
      const name = nameList[idx];
      let err;
      const disableRes = confirmUser(name)
        .then((res) => {
          console.log("successfully confirm: ", name);
          result = true;
          // update user list
          const listRes = listUsers(59);
          listRes
            .then((res) => {
              console.log("list all users: sucess");
              setUserData(res.Users);
              setUserRows(createRows(res.Users));
            })
            .catch((err) => console.error("list all users error: ", err));
        })
        .catch((error) => {
          console.error("failed to confirm user: " + name, error);
          err = error;
          result = false;
        });
      if (err) {
        break;
      }
    }
  }, [confirmClicked]);

  async function confirmUser(name, nextToken = null) {
    console.log("Confirming user ", name);
    let apiName = "AdminQueries";
    let path = "/confirmUserSignUp";
    let myInit = {
      body: {
        username: name,
        token: nextToken,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    const { NextToken, ...rest } = await API.post(apiName, path, myInit);
    nextToken = NextToken;
    return rest;
  }

  async function listUsers(count, nextToken = null) {
    console.log("listing all users after disable user");
    let apiName = "AdminQueries";
    let path = "/listUsers";
    let myInit = {
      body: {
        token: nextToken,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    const { NextToken, ...rest } = await API.get(apiName, path, myInit);
    nextToken = NextToken;
    return rest;
  }

  return result;
}
