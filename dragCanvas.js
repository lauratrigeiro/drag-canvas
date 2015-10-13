/* dragCanvas requires a canvas with the id 'dragCanvas'.
	After being initialized, it creates a rectangle that may be
	dragged around the canvas using the mouse.
*/

var dragCanvas = (function() {
	// Private variables
	var canvas = document.getElementById('dragCanvas');
	var context = canvas.getContext('2d');

	var dragging;
	var dragDistanceX;
	var dragDistanceY;
	var timer;
	var targetX;
	var targetY;
	var easeAmount = 0.45;
	var framesPerSec = 60;

	// Private sub-modules
	var mouse = {
		x      : 0,
		y      : 0,
		update : function(event) {
			var clientRect = canvas.getBoundingClientRect();
			this.x = (event.clientX - clientRect.left) * (canvas.width / clientRect.width);
			this.y = (event.clientY - clientRect.top) * (canvas.height / clientRect.height);
		}
	};

	var rect = {
		width  : 0,
		height : 0,
		x      : 0,
		y      : 0,
		color  : '#000',
		create : function(width, height, x, y, color) {
			this.width = width;
			this.height = height;
			this.x = x;
			this.y = y;
			this.color = color;
		},
		draw   : function() {
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		},
		mouseCollision : function() {
			var halfWidth = this.width / 2;
			var halfHeight = this.height / 2;
			return (mouse.x > this.x - halfWidth && mouse.x < this.x + halfWidth && mouse.y > this.y - halfHeight && mouse.y < this.y + halfHeight);
		}
	};

	// Private functions
	function onMouseDown(event) {
		event.preventDefault();

		// Update the mouse position
		mouse.update(event);

		// Check whether the rectangle was clicked
		if (rect.mouseCollision()) {
			dragging = true;

			// The rectangle can now be dragged by moving the mouse
			window.addEventListener('mousemove', onMouseMove, false);

			// Determine how far the mouse has dragged the rectangle
			dragDistanceX = mouse.x - rect.x;
			dragDistanceY = mouse.y - rect.y;

			// Determine the final position of the mouse
			targetX = mouse.x - dragDistanceX;
			targetY = mouse.y - dragDistanceY;

			// Move the rectangle gradually to its new position
			timer = setInterval(moveRectangle, 1000 / framesPerSec);
		}

		// While the rectangle is dragged, listen for it being released
		canvas.removeEventListener('mousedown', onMouseDown, false);
		window.addEventListener('mouseup', onMouseUp, false);
	}

	// While dragging, make sure the rectangle stays within the canvas
	function onMouseMove(event) {
		// Set the clamping boundaries so the rectangle stays in bounds
		var minX = 0;
		var maxX = canvas.width - rect.width;
		var minY = 0;
		var maxY = canvas.height - rect.height;

		// Update the mouse position
		mouse.update(event);

		// Clamp the x and y positions
		targetX = clamp(mouse.x - dragDistanceX, minX, maxX);
		targetY = clamp(mouse.y - dragDistanceY, minY, maxY);
	}

	function onMouseUp(event) {
		canvas.addEventListener('mousedown', onMouseDown, false);
		window.removeEventListener('mouseup', onMouseUp, false);

		// If the rectangle was being dragged, stop moving it.
		if (dragging) {
			dragging = false;
			window.removeEventListener('mousemove', onMouseMove, false);
		}
	}

	// Gradually move the rectangle toward its target position
	function moveRectangle() {
		rect.x += easeAmount * (targetX - rect.x);
		rect.y += easeAmount * (targetY - rect.y);

		// Stop moving the rectangle if it's been released and has reached its target
		// Allow a margin of error of 0.1
		if (!dragging && Math.abs(rect.x - targetX) < 0.1 && Math.abs(rect.y - targetY) < 0.1) {
			rect.x = targetX;
			rect.y = targetY;

			// Stop the timer
			clearInterval(timer);
		}

		// Erase the old rectangle and draw one at its new coordinates
		context.clearRect(0, 0, canvas.width, canvas.height);
		rect.draw();
	}

	// Utility function for clamping a value given a min and max
	function clamp(pos, min, max) {
		return (pos < min) ? min : ((pos > max) ? max : pos);
	}

	// Public variables and functions
	return {
		init : function(width, height, color) {
			// Draw a square in the center of the canvas
			rect.create(width, height, canvas.width / 2 - width / 2, canvas.height / 2 - height / 2, color);
			rect.draw();
			canvas.addEventListener('mousedown', onMouseDown, false);
		}
	};
})();
