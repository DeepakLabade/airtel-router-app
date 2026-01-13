import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import router from "./routes/index.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(config.PORT, () => {
  console.log(`server is running at PORT ${config.PORT}`);
});
