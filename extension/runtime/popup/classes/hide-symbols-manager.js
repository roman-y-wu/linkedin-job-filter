class HideSymbolsManager {
  checkboxInput = document.querySelector("input[name='hide-symbols']");
  checkboxLabel = this.checkboxInput.closest("label");

  constructor(jobBoard, storage) {
    this.hideSymbolsStorageKey = `JobDisplayManager.${jobBoard.id}.hideSymbols`;

    chrome.storage.local.onChanged.addListener((changes) => {
      const containsChangesToHideSymbols = Object.hasOwn(
        changes,
        this.hideSymbolsStorageKey
      );

      if (!containsChangesToHideSymbols) return;

      this.checkboxInput.checked =
        changes[this.hideSymbolsStorageKey].newValue;
      this.checkboxLabel.setAttribute(
        "data-checked",
        this.checkboxInput.checked
      );
    });

    this.checkboxInput.addEventListener("input", () => {
      this.checkboxLabel.setAttribute(
        "data-checked",
        this.checkboxInput.checked
      );
      chrome.storage.local.set({
        [this.hideSymbolsStorageKey]: this.checkboxInput.checked,
      });
    });

    this.checkboxInput.addEventListener("keydown", (keyboardEvent) => {
      if (keyboardEvent.key !== "Enter" || keyboardEvent.repeat) return;

      this.checkboxInput.checked = this.checkboxInput.checked ? false : true;
      this.checkboxInput.dispatchEvent(new Event("input"));
    });

    const hideSymbolsStorageKeyFound = Object.hasOwn(
      storage,
      this.hideSymbolsStorageKey
    );

    const hideSymbols = hideSymbolsStorageKeyFound
      ? storage[this.hideSymbolsStorageKey]
      : false;

    this.checkboxInput.checked = hideSymbols;
    this.checkboxLabel.setAttribute("data-checked", hideSymbols);
  }
}

export { HideSymbolsManager };
