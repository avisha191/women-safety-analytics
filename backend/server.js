import express from "express";
import cors from "cors";
import riskRoutes from "./routes/riskRoutes.js";

const app = express();
app.use(cors());

app.use("/api/risk", riskRoutes);

app.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
