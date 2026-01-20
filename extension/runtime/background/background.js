import { install } from "../modules/install.js";
import { addMessageListener } from "../modules/messaging.js";
import { updateBadge, updateBadges } from "../modules/tabs.js";
import { getJobBoardByHostname } from "../modules/job-boards.js";
import { updateLocalStorage, updateSyncStorage } from "../modules/storage.js";
import { updateContentScriptRegistrations } from "../modules/permissions.js";
import { syncToDevServer } from "../modules/dev-sync.js";

addMessageListener("refresh popup", ({ sender }) => updateBadge(sender.tab));
addMessageListener("get job board", ({ message, sendResponse }) =>
  sendResponse(getJobBoardByHostname(message.data.hostname))
);

chrome.runtime.onInstalled.addListener(install);
chrome.storage.local.onChanged.addListener(updateBadges);
chrome.storage.local.onChanged.addListener(updateSyncStorage);
chrome.storage.local.onChanged.addListener(syncToDevServer);
chrome.storage.sync.onChanged.addListener(updateLocalStorage);
chrome.permissions.onAdded.addListener(updateContentScriptRegistrations);
chrome.permissions.onRemoved.addListener(updateContentScriptRegistrations);
