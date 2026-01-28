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

    // Check for French-only Quebec jobs after hns is created
    if (jobBoard.id === "linkedIn") {
      checkFrenchOnlyJob(jobListing, hns);
    }

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

  const checkFrenchOnlyJob = (jobListing, hns) => {
    if (!jobBoard.locationSelector || !jobBoard.titleSelector) return;

    const locationElement = jobListing.querySelector(jobBoard.locationSelector);
    if (!locationElement) return;

    const locationText = locationElement.textContent;
    const quebecPatterns = [
      /\bQC\b/i,
      /\bQuebec\b/i,
      /\bQuébec\b/i,
      /\bMontreal\b/i,
      /\bMontréal\b/i,
      /\bLaval\b/i,
      /\bGatineau\b/i,
      /\bQuebec City\b/i,
      /\bLongueuil\b/i,
      /\bSherbrooke\b/i
    ];
    const isInQuebec = quebecPatterns.some((p) => p.test(locationText));
    if (!isInQuebec) return;

    const titleElement = jobListing.querySelector(jobBoard.titleSelector);
    if (!titleElement) return;

    const title = titleElement.textContent.trim();
    if (!title || title.length < 3) return;

    chrome.i18n.detectLanguage(title, (result) => {
      console.log('[HNS Debug] Title:', title);
      console.log('[HNS Debug] Languages:', result.languages);

      // Check if French is the primary language (highest confidence)
      const languages = result.languages || [];
      if (languages.length === 0) return;

      // Find language with highest percentage
      const primaryLang = languages.reduce((a, b) =>
        (a.percentage || 0) > (b.percentage || 0) ? a : b
      );

      // If French is the primary language, mark as French-only
      const isFrenchPrimary = primaryLang.language === "fr";

      if (isFrenchPrimary) {
        // Check if toggle is enabled in storage
        const storageKey = `JobDisplayManager.${jobBoard.id}.hideFrenchOnlyJobs`;
        chrome.storage.local.get(storageKey, (storage) => {
          const isEnabled = storage[storageKey] || false;
          if (isEnabled) {
            // Add a toggle for French-only job
            hns.addToggle(
              "frenchOnly",
              "French-only",
              "Language",
              false, // not default attribute
              false, // not removable
              true,  // toggled on (blocked)
              () => {
                // On click, just toggle off (unblock this job)
                const toggle = hns.getToggle("frenchOnly", "French-only");
                if (toggle) {
                  toggle.toggleOff();
                }
              }
            );
          }
        });
      }
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
