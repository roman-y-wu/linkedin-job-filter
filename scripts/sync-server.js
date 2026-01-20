#!/usr/bin/env node
/**
 * Local development sync server
 * Listens for storage updates from the extension and saves them to a JSON file
 *
 * Usage: node scripts/sync-server.js
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../extension/data/blocked-values.json");
const PORT = 3847;

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function isBlockedValuesKey(key) {
  return key.includes("blockedJobAttributeValues") && !key.includes(".backup");
}

function filterBlockedValues(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => isBlockedValuesKey(key))
  );
}

function handleSync(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const blockedValues = filterBlockedValues(data);

      fs.writeFileSync(DATA_FILE, JSON.stringify(blockedValues, null, 2));

      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Synced ${Object.keys(blockedValues).length} storage keys`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error("Sync error:", error.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/sync") {
    handleSync(req, res);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🔄 Sync server running at http://localhost:${PORT}`);
  console.log(`📁 Saving to: ${DATA_FILE}\n`);
  console.log("Waiting for extension sync...\n");
});
