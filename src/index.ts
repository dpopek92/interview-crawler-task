require("dotenv").config();
import express from "express";
import state_router from "./routes/state";
import { initWorker } from "./workers";

const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

app.use(state_router);

initWorker();
