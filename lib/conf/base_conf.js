exports.hostnames = {
  prod: "www.envoimoinscher.com",
  test: "test.envoimoinscher.com"
};

exports.options = {
  agent: false,
  auth: "",
  //ca: fs.readFileSync("./ca-bundle.crt"),
  headers: {
    access_key: ""
  },
  hostname: exports.hostnames.test,
  method: "GET",
  options: {
    auth: "",
    headers: {
      access_key: ""
    }
  },
  path: "/api/v1"
};
