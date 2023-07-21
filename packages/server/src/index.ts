import express from "express";

const app = express();

app.use("/", express.static("../client/build"));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
