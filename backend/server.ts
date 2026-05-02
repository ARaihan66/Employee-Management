import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import employeeRoutes from "./routes/employeeRoutes.ts"

dotenv.config();

const app = express();

const crossOrigin = { origin: "*" };
app.use(cors(crossOrigin));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/employee", employeeRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.send("Api is running.......");
});

const port = process.env.PORT | 5000;

app.listen(port, () => {
  console.log("Server is running on the port 5000");
});
