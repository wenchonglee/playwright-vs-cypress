const { defineConfig } = require("cypress");
const { exec } = require("child_process");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("after:run", (results) => {
        if (results) {
          const duration = Number(results.totalDuration) / 1000;
          exec(`echo "CYPRESS_TIME_TAKEN=${duration}" >> $GITHUB_OUTPUT`);
        }
      });
    },
  },
  video: false,
  reporter: "list",
});
