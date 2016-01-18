var ZGalleryManager = function(container) {
	var manager = {},
			currentEl = null,
			root = $('#' + container),
			items = null;

	function buildElements(values) {
		return values.map(function(item) {
			return new ZGalleryItem(item, open, close, next);
		});
	}

	function parseDOM() {
		var postElems = root.find('.p-image');

		array = postElems.map(function(index, item) {
			var result = {};

			result.outerImg = {
				src: $(item).children('img').attr('src'),
				alt: $(item).children('img').attr('alt')
			};

			result.images = $(item).find('.post-images').children().map(function(i, image) {
				return {
					src: $(image).attr('src'),
					alt: $(image).attr('alt')
				};
			}).toArray();
			result.message = $(item).last('p').text();

			return result;
		}).toArray();

		console.log(array);

		items = buildElements(array);
	}

	function closeAll() {
		items.forEach(function(item) {
			item.retract();
		});
	}

	function markAsCurrent(element) {
		items.forEach(function(item, index) {
			if (element == item) {
				currentEl = index;
			}
		});
	}

	function open() {
		closeAll();
		markAsCurrent(this);
		this.expand();
	}

	function close() {
		this.retract();
	}

	function next() {
		closeAll();
		currentEl += 1;
		if (currentEl == items.length) {
			currentEl = 0
		}
		items[currentEl].expand()
	}

	function openSlideshow() {
		this.createSlideshow();
	}

	manager.start = function() {
		root.empty().append.apply(root, items);
	}

	manager.reset = function(newArray) {
		items = buildElements(newArray);
		this.start();
	}

	manager.add = function(newValue) {
		items.push(
			new ZGalleryItem(newValue, open, close, next)
		);

		this.start();
	}

	parseDOM();

	return manager;
}
