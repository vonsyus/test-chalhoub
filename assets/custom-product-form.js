if (!customElements.get('custom-product-form')) {
	customElements.define('custom-product-form', class CustomProductForm extends HTMLElement {
		constructor() {
			super();

			this.form = this.querySelector('form');
			this.submitButton = this.querySelector('[type="submit"]');
			this.quantityInput = this.querySelector('.quantity-input');
			this.currentVariant = this.querySelector('.variant-id');

			this.form.addEventListener('submit', this.submitHandler.bind(this));
		}

		async connectedCallback() {
			if (!this.quantityInput) return;
			this.setQuantities();
			const variantHTML = await this.fetchVariantSectionHTML(this.dataset.url, this.currentVariant.id, this.dataset.sectionId);
			this.updateQuantities(variantHTML);
			this.setQuantities();
		}

		fetchVariantSectionHTML(url, variantId, sectionId) {
			return fetch(`${url}?variant=${variantId}&section_id=${sectionId}`)
				.then((res) => res.text())
				.then((res) => {
					if (this.currentVariant.id !== variantId) return;
					return new DOMParser().parseFromString(res, 'text/html');
				});
		}

		submitHandler(e) {
			e.preventDefault();

			const formData = new FormData(this.form);
			const config = {
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Accept': `application/javascript`
				},
				body: formData
			};

			fetch(`${routes.cart_add_url}`, config)
				.then((res) => {
					const isCartExist = false;
					if (isCartExist) {
						// update cart without page reload here
					} else {
						window.location = window.routes.cart_url;
					}
				})
				.catch((e) => {
					console.error(e);
				})
				.finally(() => {
					// hide smth like loading on button here
				});
		}

		setQuantities() {
			const data = {
				cartQuantity: this.quantityInput.dataset.cartQuantity ? parseInt(this.quantityInput.dataset.cartQuantity) : 0,
				min: this.quantityInput.dataset.min ? parseInt(this.quantityInput.dataset.min) : 1,
				max: this.quantityInput.dataset.max ? parseInt(this.quantityInput.dataset.max) : null,
				step: this.quantityInput.step ? parseInt(this.quantityInput.step) : 1
			}

			let min = data.min;
			const max = data.max === null ? data.max : data.max - data.cartQuantity;
			if (max !== null) min = Math.min(min, max);
			if (data.cartQuantity >= data.min) min = Math.min(min, data.step);

			this.quantityInput.min = min;
			this.quantityInput.max = max;
			this.quantityInput.value = min;
		}

		updateQuantities(html) {
			const updatedQuantityInput = html.querySelector('.quantity-input');
			const attributes = ['data-cart-quantity', 'data-min', 'data-max', 'step'];

			for (let attribute of attributes) {
				const valueUpdated = updatedQuantityInput.getAttribute(attribute);
				if (valueUpdated !== null) this.quantityInput.setAttribute(attribute, valueUpdated);
			}
		}
	});
}