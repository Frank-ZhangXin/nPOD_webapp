const mysql = require("mysql");
const dotenv = require("dotenv").config();

var pool = mysql.createPool({
  connectLimit: 10,
  host: process.env.WRITE_DB_HOST,
  user: process.env.WRITE_DB_USER,
  password: process.env.WRITE_DB_PASS,
  database: process.env.WRITE_DB_NAME,
  multipleStatements: true,
});

async function testPoolForUpdate() {
  const newConnection = await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
  try {
    return newConnection;
  } finally {
    newConnection.release();
    console.log("Write DB connection was released.");
  }
}

async function pooledConnection(asyncAction) {
  const newConnection = await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
  try {
    return await asyncAction(newConnection);
  } finally {
    newConnection.release();
    console.log("Write DB connection was released.");
  }
}

// update a case
async function update_case(case_id, update_columns, update_values) {
  let updateStr = "";
  for (let i = 0; i < update_columns.length; i++) {
    let updateValue = update_values[i];
    if (update_values[i] === "") {
      updateValue = "''";
    }
    if (update_values[i] === "NULL" || update_values[i] === null) {
      updateValue = "NULL";
    } else {
      updateValue = "'" + update_values[i] + "'";
    }
    if (i === 0) {
      updateStr = update_columns[i] + "=" + updateValue;
    } else {
      updateStr = updateStr + ", " + update_columns[i] + "=" + updateValue;
    }
  }
  const sql = `UPDATE cases SET ${updateStr} WHERE case_id='${case_id}'`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[Update the case] The case ${case_id} was updated.`);
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// update AAb
async function update_AAb(columns) {
  let updateStr = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (updateStr === "") {
      updateStr = key + "=" + columns[key];
    } else {
      updateStr += "," + key + "=" + columns[key];
    }
  }
  const sql = `UPDATE AAb SET ${updateStr} WHERE case_id=${columns.case_id} AND AAb_id=${columns.AAb_id}`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Update the AAb] The case ${columns.case_id} was updated.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// update HLA
async function update_HLA(
  columns,
  isBatch = false,
  tempTableName = "HLA_test"
) {
  let updateStr = "";
  for (let [key, value] of Object.entries(columns)) {
    if (key === "case_id") {
      continue;
    }
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (updateStr === "") {
      updateStr = key + "=" + columns[key];
    } else {
      updateStr += "," + key + "=" + columns[key];
    }
  }
  const tableName = isBatch ? tempTableName : "HLA";
  const sql = `UPDATE ${tableName} SET ${updateStr} WHERE case_id='${columns.case_id}'`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Update the HLA] The case ${columns.case_id} was updated.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// update RNA
async function update_RNA(columns) {
  let updateStr = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (updateStr === "") {
      updateStr = key + "=" + columns[key];
    } else {
      updateStr += "," + key + "=" + columns[key];
    }
  }
  const sql = `UPDATE RNA SET ${updateStr} WHERE case_id='${columns.case_id}' AND RNA_id='${columns.RNA_id}'`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Update the HLA] The case ${columns.case_id} was updated.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// update sample
async function update_sample(columns) {
  let updateStr = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null && value !== "null") {
      columns[key] = "'" + value + "'";
    }
    if (updateStr === "") {
      updateStr = key + "=" + columns[key];
    } else {
      updateStr += "," + key + "=" + columns[key];
    }
  }
  const sql = `UPDATE samples SET ${updateStr} WHERE case_id='${columns.case_id}' AND vial_id='${columns.vial_id}'`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Update the sample] The case ${columns.case_id} was updated.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// update dataset
async function update_dataset(dataset_id, columns) {
  let updateStr = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null && value !== "null") {
      columns[key] = "'" + value + "'";
    }
    if (updateStr === "") {
      updateStr = key + "=" + columns[key];
    } else {
      updateStr += "," + key + "=" + columns[key];
    }
  }
  const sql = `UPDATE dataset SET ${updateStr} WHERE dataset_id='${dataset_id}'`;
  console.log("sql: ", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Update the HLA] The case ${columns.case_id} was updated.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Batch update a table
async function batch_update_table(tableName, matrix) {
  const resList = [];
  let updateFunc;
  let targetTable = tableName;
  switch (tableName) {
    case "HLA":
      updateFunc = update_HLA;
      targetTable = "HLA_test";
  }
  for (const row of matrix) {
    let rowRes = updateFunc
      ? updateFunc(row, true, targetTable)
      : "The updating table is not supported";
    resList.push(rowRes);
  }
  return await Promise.all(resList);
}

module.exports = {
  testPoolForUpdate: testPoolForUpdate,
  update_case: update_case,
  update_AAb: update_AAb,
  update_HLA: update_HLA,
  update_RNA: update_RNA,
  update_sample: update_sample,
  update_dataset: update_dataset,
  batch_update_table: batch_update_table,
};
