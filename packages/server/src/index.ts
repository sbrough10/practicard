import { app } from "./routes";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
