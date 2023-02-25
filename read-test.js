let fs = require("node:fs");
const { exec } = require("child_process");

fs.readFile("results.xml", "utf8", function (err, data) {
  if (err) throw err;
  const matches = [...data.matchAll(/testsuites.*time=\"(.*)\"/g)];
  const match = Number(matches[0][1]).toFixed(2);
  exec(`echo "PLAYWRIGHT_TIME_TAKEN=${match}" >> $GITHUB_OUTPUT`);
});
