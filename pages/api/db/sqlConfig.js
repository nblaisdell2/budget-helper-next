var os = require("os");

var sql = null;
var sqlConnString = "";

var hostname = os.hostname();
if (hostname == "DESKTOP-C0LNOFT") {
  // DEV / LOCALHOST - SQL Server Connection
  sql = require("msnodesqlv8");
  sqlConnString =
    "Driver={SQL Server Native Client 11.0};Server=DESKTOP-C0LNOFT;Database=BudgetHelper;Integrated Security=True;Trusted_Connection=yes;";
} else {
  // PRODUCTION / AWS - SQL Server Connection
  sql = require("msnodesqlv8");
  sqlConnString =
    "Driver={SQL Server Native Client 11.0};Server=sql-server-db-1.ctm8otgitadb.us-east-1.rds.amazonaws.com,1433;Uid=admin;Pwd=FG2xnEcDpC8kNLbAfLUw;Database=BudgetHelper;";
}

// This will run a stored procedure and return the results as JSON
function query(res, spName, params) {
  console.log("Attempting to query from stored procedure: '" + spName + "'");

  sql.open(sqlConnString, function (err, conn) {
    if (err) console.log(err);

    var pm = conn.procedureMgr();
    pm.callproc(spName, params, function (err, results, output) {
      if (err) console.log(err);
      console.log("query results");
      console.log(results);
      res.status(200).json(results);
    });
  });
}

// This function will run a stored procedure, and get no results
function execute(res, spName, params) {
  console.log("Attempting to run stored procedure: '" + spName + "'");

  sql.open(sqlConnString, function (err, conn) {
    if (err) console.log(err);

    var pm = conn.procedureMgr();
    pm.callproc(spName, params, function (err, results, output) {
      if (err) console.log(err);
      console.log("execute results");
      console.log(results);
      res.status(200).json({ status: "OK" });
    });
  });
}

exports.query = query;
exports.execute = execute;
