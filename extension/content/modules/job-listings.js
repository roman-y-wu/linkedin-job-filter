const jobListings = async (jobBoard) => {
  const hnsMap = new Map();

  const setDisplayPreference = (userSettings) => {
    const updateRemoveHiddenJobsDOM = (displayPreference) => {
      document.documentElement.setAttribute(
        "data-hns-remove-hidden-jobs",
        displayPreference
      );
    };

    const updateHideSymbolsDOM = (hideSymbols) => {
      document.documentElement.setAttribute(
        "data-hns-hide-symbols",
        hideSymbols
      );
    };

    const removeHiddenJobsStorageKey = `JobDisplayManager.${jobBoard.id}.removeHiddenJobs`;
    const hideSymbolsStorageKey = `JobDisplayManager.${jobBoard.id}.hideSymbols`;

    updateRemoveHiddenJobsDOM(userSettings[removeHiddenJobsStorageKey] || false);
    updateHideSymbolsDOM(userSettings[hideSymbolsStorageKey] || false);

    chrome.storage.local.onChanged.addListener((changes) => {
      if (Object.hasOwn(changes, removeHiddenJobsStorageKey))
        updateRemoveHiddenJobsDOM(changes[removeHiddenJobsStorageKey].newValue);
      if (Object.hasOwn(changes, hideSymbolsStorageKey))
        updateHideSymbolsDOM(changes[hideSymbolsStorageKey].newValue);
    });
  };

  const addHns = (jobListing) => {
    jobListing.setAttribute("data-hns-job-listing", "");

    // Detect LinkedIn dismissed jobs
    if (jobBoard.id === "linkedIn") {
      observeDismissedState(jobListing);
    }

    const hns = ui.createComponent("hns-container", jobBoard.id);
    hns.jobListing = jobListing;
    hnsMap.set(jobListing, hns);
    for (const attributeBlocker of attributeBlockers)
      attributeBlocker.addToggles(hns);
    jobListing.append(hns.element);
  };

  const removeHns = (jobListing) => {
    hnsMap.delete(jobListing);
  };

  const observeDismissedState = (jobListing) => {
    const checkDismissed = () => {
      const isDismissed = jobListing.textContent.includes("We won't show you this job again") ||
                          jobListing.textContent.includes("won't show you this job");

      if (isDismissed) {
        jobListing.setAttribute("data-hns-linkedin-dismissed", "");
      } else {
        jobListing.removeAttribute("data-hns-linkedin-dismissed");
      }
    };

    checkDismissed();

    new MutationObserver(checkDismissed).observe(jobListing, {
      childList: true,
      subtree: true,
      characterData: true
    });
  };

  const storage = await chrome.storage.local.get();
  setDisplayPreference(storage);

  const attributeBlockers = jobBoard.attributes.map(
    (attribute) => new AttributeBlocker(jobBoard, attribute, storage, hnsMap)
  );

  const attributeBlockerMap = new Map(
    attributeBlockers.map((attributeBlocker) => [
      attributeBlocker.storageKey,
      attributeBlocker,
    ])
  );

  chrome.storage.local.onChanged.addListener((changes) =>
    Object.entries(changes).forEach(([storageKey, changes]) =>
      attributeBlockerMap.get(storageKey)?.handleStorageChanges(changes)
    )
  );

  return { addHns, removeHns, setDisplayPreference };
};
