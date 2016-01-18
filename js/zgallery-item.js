var ZGalleryItem = function(input, open, close, next) {
	var itemCtrl = {},
			el = document.createElement('div'),
			min = null,
			expanded = null;

	function initMiniVersion() {
		min = $(document.createElement('img'))
			.attr('src', input.outerImg.src)
			.attr('alt', input.outerImg.alt)[0];
	}

	function generateControls() {
		var closeButton = $(document.createElement('button'))
					.addClass('zg-item-retract')
					.text('X')[0],
				nextButton = $(document.createElement('button'))
					.addClass('zg-item-next')
					.text('->')[0];
		return [
			closeButton,
			nextButton
		];
	}

	function getElementImages() {
		return input.images.map(function(item, index) {
			return $(document.createElement('img'))
				.attr('data-id', index)
				.attr('src', item.src)
				.attr('alt', item.alt)[0];
		});
	}

	function getElementText() {
		return $(document.createElement('p'))
			.text(input.message)[0];
	}

	function initExpandedVersion() {
		expanded = document.createElement('div');
		$(expanded).append.apply(
			$(expanded),
			generateControls()
				.concat(
					getElementImages()
				)
				.concat(
					getElementText()
				)
		);
	}

	function initContents() {
		$(el).addClass('zgallery-item');

		initMiniVersion();
		initExpandedVersion();
	}

	function retractElement() {
		$(el).removeClass('zg-expanded')
			.addClass('zg-retracted')
			.off().empty().append(min)
			.on('click', function(e) {
				e.stopPropagation();
				open.call(el)
			});

	}

	function expandElement() {
		$(el).removeClass('zg-retracted')
			.addClass('zg-expanded')
			.off().empty().append(expanded);

		$(el).find('.zg-item-retract')
			.on('click', function(e) {
				e.stopPropagation();
				close.call(el);
			});

		$(el).find('.zg-item-next')
			.on('click', function(e) {
				e.stopPropagation();
				next();
			});

		$(el).find('img')
			.on('click', function(e) {
				e.stopPropagation();

				el.createSlideshow($(this).data('id'));
			})
	}

	el.retract = function() {
		retractElement();
	}

	el.expand = function() {
		expandElement();
	}

	el.createSlideshow = function(id) {
		var currentSlide = id || 0;

		function nextSlide() {
			currentSlide += 1;
			if (currentSlide === input.images.length) {
				currentSlide = 0;
			}
			slide.attr('src', input.images[currentSlide].src);
		}

		function prevSlide() {
			currentSlide -= 1;
			if (currentSlide < 0) {
				currentSlide = input.images.length - 1;
			}
			slide.attr('src', input.images[currentSlide].src);
		}

		var slide = $(document.createElement('img'))
			.addClass('zslideshow-item')
			.attr('src', input.images[currentSlide].src);

		var overlay = $(document.createElement('div'))
					.addClass('zslideshow-overlay')
					.append(
						slide,
						$(document.createElement('div'))
							.addClass('zss-btn-panel')
							.append(
								$(document.createElement('button'))
									.addClass('zss-btn zss-btn-prev')
									.text('<')
									.on('click', function(e) {
										e.stopPropagation();
										prevSlide();
									}),
								$(document.createElement('button'))
									.addClass('zss-btn zss-btn-close')
									.text('X')
									.on('click', function(e) {
										e.stopPropagation();
										$('.zslideshow-overlay').remove();
									}),
								$(document.createElement('button'))
									.addClass('zss-btn zss-btn-next')
									.text('>')
									.on('click', function(e) {
										e.stopPropagation();
										nextSlide();
									})
							)
					);

		$('body').append(overlay);
	}

	initContents();
	retractElement();

	return el;
}
