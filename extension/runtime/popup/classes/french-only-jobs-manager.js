class FrenchOnlyJobsManager {
  checkboxInput = document.querySelector("input[name='hide-french-only-jobs']");
  checkboxLabel = this.checkboxInput.closest("label");

  constructor(jobBoard, storage) {
    // Only show this option for LinkedIn
    if (jobBoard.id !== "linkedIn") {
      this.checkboxLabel.style.display = "none";
      return;
    }

    this.storageKey = `JobDisplayManager.${jobBoard.id}.hideFrenchOnlyJobs`;

    chrome.storage.local.onChanged.addListener((changes) => {
      if (!Object.hasOwn(changes, this.storageKey)) return;

      this.checkboxInput.checked = changes[this.storageKey].newValue;
      this.checkboxLabel.setAttribute("data-checked", this.checkboxInput.checked);
    });

    this.checkboxInput.addEventListener("input", () => {
      this.checkboxLabel.setAttribute("data-checked", this.checkboxInput.checked);
      chrome.storage.local.set({
        [this.storageKey]: this.checkboxInput.checked,
      });
    });

    this.checkboxInput.addEventListener("keydown", (keyboardEvent) => {
      if (keyboardEvent.key !== "Enter" || keyboardEvent.repeat) return;

      this.checkboxInput.checked = !this.checkboxInput.checked;
      this.checkboxInput.dispatchEvent(new Event("input"));
    });

    const hideFrenchOnly = storage[this.storageKey] || false;
    this.checkboxInput.checked = hideFrenchOnly;
    this.checkboxLabel.setAttribute("data-checked", hideFrenchOnly);
  }
}

export { FrenchOnlyJobsManager };
