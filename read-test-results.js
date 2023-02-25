let fs = require("node:fs");
const { exec } = require("child_process");
const args = process.argv;

if (args[2] === "playwright") {
  fs.readFile("results.xml", "utf8", function (err, data) {
    if (err) throw err;
    const matches = [...data.matchAll(/testsuites.*time=\"(.*)\"/g)];
    const match = Number(matches[0][1]).toFixed(2);
    exec(`echo "PLAYWRIGHT_TIME_TAKEN=${match}" >> $GITHUB_OUTPUT`);
  });
}

if (args[2] === "cypress") {
  fs.readFile("cy-results", "utf8", function (err, data) {
    if (err) throw err;
    const matches = [...data.matchAll(/All specs passed.*00:(\d\d)/g)];
    const match = matches[0][1];
    exec(`echo "CYPRESS_TIME_TAKEN=${match}.0" >> $GITHUB_OUTPUT`);
  });
}
