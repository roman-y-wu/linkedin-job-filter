/**
 * Development sync module
 * Syncs blocked values to local dev server for saving to source code
 */

import { debounce } from "./utilities.js";

const DEV_SERVER_URL = "http://localhost:3847/sync";

async function postStorageToDevServer() {
  const storage = await chrome.storage.local.get();

  const response = await fetch(DEV_SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(storage),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  console.log("[Dev Sync] Synced to local server");
}

const syncToDevServer = debounce(async () => {
  try {
    await postStorageToDevServer();
  } catch (error) {
    // Server not running - silently ignore connection errors
    if (error.message.includes("Failed to fetch")) return;
    console.debug("[Dev Sync] Error:", error.message);
  }
}, 1000);

export { syncToDevServer };
