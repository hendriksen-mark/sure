import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="resizable"
export default class extends Controller {
  static targets = ["container", "handle"];
  static values = {
    storageKey: String,
    minHeight: { type: Number, default: 200 },
    maxHeight: { type: Number, default: 1200 },
    defaultHeight: { type: Number, default: 400 }
  };

  connect() {
    this.isDragging = false;
    this.startY = 0;
    this.startHeight = 0;

    // Restore saved height from localStorage
    this.#restoreHeight();
  }

  startResize(event) {
    event.preventDefault();
    this.isDragging = true;
    this.startY = event.clientY || event.touches[0].clientY;
    this.startHeight = this.containerTarget.offsetHeight;

    // Add event listeners
    document.addEventListener("mousemove", this.resize);
    document.addEventListener("mouseup", this.stopResize);
    document.addEventListener("touchmove", this.resize);
    document.addEventListener("touchend", this.stopResize);

    // Visual feedback
    this.handleTarget.classList.add("bg-gray-400");
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  }

  resize = (event) => {
    if (!this.isDragging) return;

    const currentY = event.clientY || event.touches[0].clientY;
    const deltaY = currentY - this.startY;
    const newHeight = Math.max(
      this.minHeightValue,
      Math.min(this.maxHeightValue, this.startHeight + deltaY)
    );

    this.containerTarget.style.height = `${newHeight}px`;
  };

  stopResize = () => {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Remove event listeners
    document.removeEventListener("mousemove", this.resize);
    document.removeEventListener("mouseup", this.stopResize);
    document.removeEventListener("touchmove", this.resize);
    document.removeEventListener("touchend", this.stopResize);

    // Reset visual feedback
    this.handleTarget.classList.remove("bg-gray-400");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Save height to localStorage
    this.#saveHeight();
  };

  #restoreHeight() {
    if (!this.storageKeyValue) return;

    const savedHeight = localStorage.getItem(this.storageKeyValue);
    if (savedHeight) {
      const height = Number.parseInt(savedHeight, 10);
      if (height >= this.minHeightValue && height <= this.maxHeightValue) {
        this.containerTarget.style.height = `${height}px`;
      }
    } else {
      // Use default height if no saved value
      this.containerTarget.style.height = `${this.defaultHeightValue}px`;
    }
  }

  #saveHeight() {
    if (!this.storageKeyValue) return;
    localStorage.setItem(this.storageKeyValue, this.containerTarget.offsetHeight);
  }
}
