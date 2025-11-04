import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "startDate", "endDate", "changeButton"]

  connect() {
    this.updateChangeButtonVisibility()
  }

  toggle(event) {
    const periodSelect = this.getPeriodSelect()
    const isCustom = periodSelect && periodSelect.value === "custom"
    
    if (isCustom) {
      // Show modal for custom selection
      this.showModal()
      // Don't submit the form when switching to custom
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
    } else {
      this.hideModal()
      // Submit the form when selecting a predefined period
      if (event) {
        this.element.closest("form").submit()
      }
    }
    
    this.updateChangeButtonVisibility()
  }

  updateChangeButtonVisibility() {
    const periodSelect = this.getPeriodSelect()
    const isCustom = periodSelect && periodSelect.value === "custom"
    
    if (this.hasChangeButtonTarget) {
      this.changeButtonTarget.style.display = isCustom ? "inline-flex" : "none"
    }
  }

  getPeriodSelect() {
    // Try different possible select names
    return this.element.querySelector("select[name='period']") || 
           this.element.querySelector("select[name='cashflow_period']") ||
           this.element.querySelector("select")
  }

  openCustomModal() {
    this.showModal()
  }

  showModal() {
    this.modalTarget.style.display = "block"
    this.modalTarget.showModal()
    document.body.style.overflow = "hidden"
  }

  hideModal() {
    this.modalTarget.style.display = "none"
    this.modalTarget.close()
    document.body.style.overflow = ""
  }

  closeModal() {
    this.hideModal()
    // Reset period select to first non-custom option
    const periodSelect = this.getPeriodSelect()
    if (periodSelect) {
      const firstNonCustomOption = periodSelect.querySelector("option:not([value='custom'])")
      periodSelect.value = firstNonCustomOption ? firstNonCustomOption.value : ""
      this.updateChangeButtonVisibility()
    }
  }

  submitCustomDates() {
    const startDate = this.startDateTarget.value
    const endDate = this.endDateTarget.value
    
    if (startDate && endDate) {
      // Set the values in the main form
      const form = this.element.closest("form")
      const periodSelect = this.getPeriodSelect()
      
      // Determine parameter names based on the select field name
      let startDateName = "start_date"
      let endDateName = "end_date"
      
      if (periodSelect && periodSelect.name === "cashflow_period") {
        // For cashflow, we might need different parameter names
        // Check if there are existing inputs with cashflow-specific names
        startDateName = "start_date"
        endDateName = "end_date"
      }
      
      const startInput = form.querySelector(`input[name='${startDateName}']`) || this.createHiddenInput(form, startDateName)
      const endInput = form.querySelector(`input[name='${endDateName}']`) || this.createHiddenInput(form, endDateName)
      
      startInput.value = startDate
      endInput.value = endDate
      
      this.hideModal()
      form.submit()
    } else {
      alert("Please select both start and end dates")
    }
  }

  createHiddenInput(form, name) {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = name
    form.appendChild(input)
    return input
  }
}
