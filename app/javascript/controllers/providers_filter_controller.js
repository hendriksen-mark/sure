import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="providers-filter"
// Filters provider cards by free-text query and a chip-selected kind.
// Updates the visible-count target on the section heading and toggles
// an empty-state target when no card matches.
export default class extends Controller {
  static targets = ["input", "chip", "regionChip", "card", "empty", "count"];
  static values = { kind: { type: String, default: "all" }, region: { type: String, default: "all" } };

  connect() {
    this.syncChipState();
    this.syncRegionChipState();
  }

  filter() {
    const query = this.hasInputTarget
      ? this.inputTarget.value.toLocaleLowerCase().trim()
      : "";
    const activeKind = this.kindValue;
    const activeRegion = this.regionValue;
    let visibleCount = 0;

    this.cardTargets.forEach((card) => {
      const name = card.dataset.providerName ?? "";
      const region = card.dataset.providerRegion ?? "";
      const kind = card.dataset.providerKind ?? "";
      const haystack = `${name} ${region} ${kind}`;
      const matchesQuery = !query || haystack.includes(query);
      const matchesKind = activeKind === "all" || kind === activeKind;
      const matchesRegion = activeRegion === "all" || region.includes(activeRegion);
      const visible = matchesQuery && matchesKind && matchesRegion;
      card.classList.toggle("hidden", !visible);
      if (visible) visibleCount++;
    });

    if (this.hasCountTarget) {
      this.countTarget.textContent = visibleCount;
    }

    if (this.hasEmptyTarget) {
      this.emptyTarget.classList.toggle("hidden", visibleCount > 0);
    }
  }

  selectChip(event) {
    this.kindValue = event.currentTarget.dataset.kind ?? "all";
    this.syncChipState();
    this.filter();
  }

  selectRegionChip(event) {
    this.regionValue = event.currentTarget.dataset.region ?? "all";
    this.syncRegionChipState();
    this.filter();
  }

  clear() {
    if (this.hasInputTarget) this.inputTarget.value = "";
    this.kindValue = "all";
    this.regionValue = "all";
    this.syncChipState();
    this.syncRegionChipState();
    this.filter();
    if (this.hasInputTarget) this.inputTarget.focus();
  }

  syncChipState() {
    if (!this.hasChipTarget) return;
    this.chipTargets.forEach((chip) => {
      const active = chip.dataset.kind === this.kindValue;
      chip.classList.toggle("bg-container", active);
      chip.classList.toggle("shadow-border-xs", active);
      chip.classList.toggle("text-primary", active);
      chip.classList.toggle("text-secondary", !active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  syncRegionChipState() {
    if (!this.hasRegionChipTarget) return;
    this.regionChipTargets.forEach((chip) => {
      const active = chip.dataset.region === this.regionValue;
      chip.classList.toggle("bg-container", active);
      chip.classList.toggle("shadow-border-xs", active);
      chip.classList.toggle("text-primary", active);
      chip.classList.toggle("text-secondary", !active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
}
