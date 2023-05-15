const productGalleryThumbs = new Swiper('.product-gallery-thumbs', {
	spaceBetween: 10,
	slidesPerView: 4,
	freeMode: true,
	watchSlidesProgress: true,
});

const productGallery = new Swiper('.product-gallery', {
	loop: true,
	slidesPerView: 1,
	autoHeight: true,
	thumbs: {
		swiper: productGalleryThumbs
	}
});