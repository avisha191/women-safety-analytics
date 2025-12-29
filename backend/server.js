import express from "express";
import cors from "cors";
import riskRoutes from "./routes/riskRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/risk", riskRoutes);

// ✅ IMPORTANT: Dynamic PORT for deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
