var ZGalleryManager = function(container, array) {
	var manager = {},
			currentEl = null,
			root = $('#' + container),
			items = buildElements(array);

	function buildElements(values) {
		return values.map(function(item) {
			return new ZGalleryItem(item, open, close, next);
		});
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

	return manager;
}