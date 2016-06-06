var DomArray = (function() {

	// constructor

	function DomArray(parent, renderer) {
		this.parent = parent;
		this.renderer = renderer;
	};


	// methods that remove items

	DomArray.prototype.shift = function() {
		this.parent.removeChild(this.parent.firstChild);
	};

	DomArray.prototype.pop = function() {
		this.parent.removeChild(this.parent.lastChild);
	};


	// methods that add items

	DomArray.prototype.push = function() {
		var appendable = renderAll(arguments, this.renderer);
		this.parent.appendChild(appendable);
	};

	DomArray.prototype.unshift = function() {
		var appendable = renderAll(arguments, this.renderer);
		this.parent.insertBefore(appendable, this.parent.firstChild);
	};


	// other methods

	DomArray.prototype.splice = function(start, deleteCount) {
		var childNodes = this.parent.childNodes;

		// If `start` is negative, begin that many elements from the end
		start = start < 0 ? childNodes.length + start : start

		// remove the element at index `start` `deleteCount` times
		deleteCount = typeof deleteCount === 'number' ? deleteCount : childNodes.length - start;
		var stop = start + deleteCount;
		for (var i = start; i < stop && childNodes[start]; i++) {
			this.parent.removeChild(childNodes[start]);
		}

		// add new elements at index `start`
		if (arguments.length > 2) {
			var newItems = [].slice.call(arguments, 2);
			var appendable = renderAll(newItems, this.renderer);
			this.parent.insertBefore(appendable, childNodes[start]);
		}
	};

	DomArray.prototype.reverse = function() {
		var docFrag = document.createDocumentFragment();

		// append every last child of parent to doc frag
		while (this.parent.lastChild) {
			docFrag.appendChild(
				this.parent.removeChild(this.parent.lastChild)
			);
		}

		// append doc frag to parent
		this.parent.appendChild(docFrag);
	};


	// helper functions

	// renderAll returns a single node containing the rendered nodes
	function renderAll(collection, renderer) {
		// call renderer (should return a DOM node) for each item in collection
		var elements = [].map.call(collection, function() {
			return renderer.apply(null, arguments);
		});

		if (elements.length > 1) {
			var docFrag = document.createDocumentFragment();
			elements.forEach(function(el) {
				docFrag.appendChild(el);
			});
			return docFrag;
		} else {
			return elements[0];
		}
	}

	return DomArray;
})();