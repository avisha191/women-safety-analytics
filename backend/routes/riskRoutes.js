import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/clusters", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync("data/cluster_stats.json", "utf-8")
  );
  res.json(data);
});

router.get("/centroids", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync("data/centroids.json", "utf-8")
  );
  res.json(data);
});

export default router;
