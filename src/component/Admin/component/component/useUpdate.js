import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";

export default function useUpdate(
  caseId,
  update,
  changed,
  setAccept,
  updateColumns,
  updateValues,
  setShowError,
  setShowSuccess,
  setMsg
) {
  const [result, setResult] = useState(false);
  useEffect(() => {
    if (update && !changed) {
      console.log("Updating case columns...");
      updateCase(caseId, updateColumns, updateValues);
    }
  }, [caseId, update, changed]);
  async function updateCase(id, columns, values) {
    return await API.put("dbapi", "/db/update_case", {
      body: {
        case_id: id,
        update_columns: columns,
        update_values: values,
      },
    })
      .then((res) => {
        if (res["affectedRows"] ?? false) {
          setResult(true);
          setShowError(false);
          setShowSuccess(true);
          setMsg("Update is successful!");
          console.log("Update case columns are successful!");
        }
      })
      .catch((error) => {
        setAccept(false);
        setShowError(true);
        setShowSuccess(false);
        setMsg("Update is failed");
        console.log("Amplify API call error", error);
        console.log("failed columns", columns);
        console.log("failed values", values);
      });
  }

  return result;
}
