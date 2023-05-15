if (!customElements.get('custom-variant-radios')) {
	customElements.define('custom-variant-radios', class CustomVariantRadios extends HTMLElement {
		constructor() {
			super();
			this.addEventListener('change', this.changeHandler);
		}

		changeHandler() {
			this.updateOptions();
			this.updateCurrentVariant();
			if (this.currentVariant) {
				this.updateURL();
				this.updateMedia();
				this.updateProductInfo();
			}
		}

		updateURL() {
			if (!this.currentVariant) return;
			window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
		}

		updateMedia() {
			// update media code here
		}

		updateProductInfo() {
			const currentVariantId = this.currentVariant.id;
			const sectionId = this.dataset.sectionId;
			const url = this.dataset.url;

			fetch(`${url}?variant=${currentVariantId}&section_id=${sectionId}`)
				.then((res) => res.text())
				.then((res) => {
					if (this.currentVariant.id !== currentVariantId) return;

					const html = new DOMParser().parseFromString(res, 'text/html');
					const current = {
						price: document.querySelector('.product-info .price')
						// add more fields to update here (e.g. sku, etc.)
					};
					const updated = {
						price: html.querySelector('.product-info .price')
						// add more fields to update here (e.g. sku, etc.)
					}

					current.price.innerHTML = updated.price.innerHTML;
				});
		}

		updateCurrentVariant() {
			this.currentVariant = this.getVariantData().find((variant) => {
				return !variant.options.map((option, index) => {
					return this.options[index] === option;
				}).includes(false);
			});
			const variantInput = document.querySelector('.variant-id');
			variantInput.value = this.currentVariant.id;
			variantInput.dispatchEvent(new Event('change', { bubbles: true }));
		}

		getVariantData() {
			this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
			return this.variantData;
		}

		updateOptions() {
			const fieldsets = Array.from(this.querySelectorAll('fieldset'));
			this.options = fieldsets.map((fieldset) => {
				return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
			});
		}
	});
}