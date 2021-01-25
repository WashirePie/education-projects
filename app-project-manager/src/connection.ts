const Datastore = require("nedb");
const path = require("path");

let connect = () => {
  return {
    projects:  new Datastore({ filename: path.join(__dirname, '../db/projects.nedb'), autoload: true, }),
    employees: new Datastore({ filename: path.join(__dirname, '../db/employees.nedb'), autoload: true, }),
    suppliers: new Datastore({ filename: path.join(__dirname, '../db/suppliers.nedb'), autoload: true, }),
  }
}

export { connect }
