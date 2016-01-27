var ZGalleryManager = function(container, options) {
	var manager = {},
			opts = options || {},
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

			if ($(item).children('img').length > 0) {
				result.outerImg = {
					src: $(item).children('img').attr('src'),
					alt: $(item).children('img').attr('alt')
				};
			} else if ($(item).children('video').length > 0) {
				result.outerVideo = $(item).children('video');
			}

			result.images = $(item).find('.post-images').children().map(function(i, image) {
				return {
					src: $(image).attr('src'),
					alt: $(image).attr('alt')
				};
			}).toArray();
			result.videos = $(item).find('.post-video').children();
			result.photographer = $(item).find('h4.photo-by').text();
			result.message = $(item).children('p').text().replace("(" + result.photographer + ")", "");
			return result;
		}).toArray();

		items = buildElements(array);

		calculatePosition(items);
	}

	function hasExpanded(elements) {
		return elements.some(function(element) {
			return $(element).hasClass('zg-expanded');
		})
	}

	function getRow(index, numPerRow) {
		var num = index + 1,
				value = numPerRow - num;

		if (value >= 0) {
			return {
				num: 1,
				index: index
			};
		} else {
			var row = Math.ceil(Math.abs(value)/numPerRow) + 1,
					inRowIndex = (num - (row - 1) * numPerRow) - 1;
			return {
				num: row,
				index: inRowIndex
			};
		}
	}

	function resetIndices(elements, numPerRow, gap, ew, eh, ws) {
		elements.forEach(function(element, index) {
			var row = getRow(index, numPerRow);
			$(element)
				.attr('data-row', row.num)
				.attr('data-index', row.index)
				.attr('data-left', getLeftOffset(row.index, ws, gap, ew))
				.attr('data-top', getTopOffset(row.num, gap, eh))
				.css('left', getLeftOffset(row.index, ws, gap, ew))
				.css('top', getTopOffset(row.num, gap, eh));
		});
	}

	function getLeftOffset(index, whitespace, gap, width) {
		return whitespace + index * (width + gap);
	}

	function getTopOffset(row, gap, height) {
		return (row - 1) * (gap + height);
	}

	function calculatePosition(elements) {
		var cw = root.width(), // container width
				ew = opts.width || 200, // element width
				eh = opts.height || 200, // element height
				g = opts.gap || 30; // gap

		var numPerRow = Math.floor(cw/(ew+g)),
				whiteSpace = (cw - (ew * numPerRow + g * (numPerRow - 1)))/2,
				rowNum = Math.ceil(elements.length/numPerRow);

		resetIndices(elements, numPerRow, g, ew, eh, whiteSpace);

		if (hasExpanded(elements)) {
			var expanded = 0,
					activeRow = 0;

			for (var i=0; i<elements.length; i++) {
				var elem = elements[i];
				if ($(elem).hasClass('zg-expanded')) {
					expanded = parseInt($(elem).attr('data-index'));
					activeRow = parseInt($(elem).attr('data-row'));
				}
			}

			for (var j = 1; j <= rowNum + 5; j++) {
				var filteredRow = elements.filter(function(item) {
					return parseInt($(item).attr('data-row')) === j;
				});

				for (var z = 0; z < filteredRow.length; z++) {
					var elemz = $(filteredRow[z]);
					elemz.attr('data-index', z);

					if (elemz.hasClass('zg-expanded') && z === numPerRow - 1) {
						elemz
							.attr('data-index', 0)
							.attr('data-row', j + 1)
							.css('top', getTopOffset(j + 1, g, eh));

						activeRow = j + 1;
						expanded = 0;
					} else if (j === activeRow && z > expanded) {
						elemz
							.attr('data-index', z + 2)
							.css('left', getLeftOffset(z + 2, whiteSpace, g, ew));
					} else if (j > activeRow && z >= expanded) {
						elemz
							.attr('data-index', z + 3)
							.css('left', getLeftOffset(z + 3, whiteSpace, g, ew));
					} else {
						elemz
							.css('left', getLeftOffset(z, whiteSpace, g, ew));
					}
					var newIndex = parseInt(elemz.attr('data-index'));
					if (newIndex >= numPerRow) {
						elemz.attr('data-row', j + 1)
							.css('top', getTopOffset(j + 1, g, eh));
					}
				}
			}

			var anchor = $('.zg-expanded');
			var expandedH = anchor.height() + parseInt(anchor.attr('data-row')) * eh;
			var rowsH = parseInt($(items[items.length - 1]).attr('data-row')) * (eh + g);
			var newH = expandedH > rowsH ? expandedH : rowsH;
			root.css('height', newH);
		} else {
			root.css('height', rowNum * (eh + g));
		}
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
		calculatePosition(items);
	}

	function close() {
		this.retract();
		calculatePosition(items);
	}

	function next() {
		closeAll();
		currentEl += 1;
		if (currentEl == items.length) {
			currentEl = 0
		}
		items[currentEl].expand()
		calculatePosition(items);
	}

	manager.start = function() {
		if (window.location.search === "?latest") {
			items[items.length - 1].expand();
		}
		root.empty().append.apply(root, items);
		calculatePosition(items);
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

	$(window).resize(function() {
		calculatePosition(items);
	});

	return manager;
}
