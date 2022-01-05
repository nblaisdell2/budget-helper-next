const { default: Results } = require("../../../components/Results");

var sql = null;
var sqlConfig = {};

// DEV / LOCALHOST - SQL Server Connection
// DONT FORGET TO REINSTALL: npm install msnodesqlv8
sql = require("mssql/msnodesqlv8");
sqlConfig = {
  driver: "msnodesqlv8",
  parseJSON: true,
  connectionString:
    "Driver={SQL Server Native Client 11.0};Server=" +
    process.env.DB_HOST +
    ";Database=" +
    process.env.DB_DATABASE +
    ";Integrated Security=True;Trusted_Connection=yes;",
};

// // PRODUCTION / AWS - SQL Server Connection
// // DONT FORGET TO UNINSTALL: npm uninstall msnodesqlv8
// sql = require("mssql");
// sqlConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   server: process.env.DB_HOST,
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
//   options: {
//     trustServerCertificate: true, // change to true for local dev / self-signed certs
//   },
// };

// This will run a stored procedure and return the results as JSON
function query(res, spName, params) {
  console.log("Attempting to query from stored procedure: '" + spName + "'");
  console.log(params);

  sql
    .connect(sqlConfig)
    .then((pool) => {
      let request = pool.request();
      let paramNames = Object.keys(params);
      for (let i = 0; i < paramNames.length; i++) {
        let currKey = paramNames[i];

        request.input(currKey, params[currKey]);
      }
      return request.execute(spName);
    })
    .then((result) => {
      console.log(result);
      let dbResults = null;
      // if (result.recordsets.length > 1) {

      // } else {
      //   dbResults
      // }
      // for(let i = 0; i < result.recordsets.length; i++) {
      //   if (result.recordsets[i].length == 0)
      // }

      dbResults =
        result.recordsets.length > 1 ? result.recordsets : result.recordset;
      res.send(JSON.stringify(dbResults));
    })
    .catch((err) => {
      console.log(err);
      res.send("Error");
    });
}

// This function will run a stored procedure, and get no results
function execute(res, spName, params) {
  console.log("Attempting to run stored procedure: '" + spName + "'");
  console.log(params);

  sql
    .connect(sqlConfig)
    .then((pool) => {
      let request = pool.request();
      let paramNames = Object.keys(params);
      for (let i = 0; i < paramNames.length; i++) {
        let currKey = paramNames[i];
        request.input(currKey, params[currKey]);
      }
      return request.execute(spName);
    })
    .then((result) => {
      res.send("Success");
    })
    .catch((err) => {
      console.log(err);
      res.send("Error");
    });
}

exports.query = query;
exports.execute = execute;
