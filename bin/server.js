const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION REJECTION SHUTTING DOWN");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("../app");
// runs before the app to read the dotenv config

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Handle all promise rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNDHANLDED REJECTION SHUTTING DOWN");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVE. Shutting down gracefully");
  server.close(() => {
    console.log("Process Terminated!");
  });
});
