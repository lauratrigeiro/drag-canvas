# drag-canvas
<h3>Draggable Square in a Canvas</h3>

View this project at: http://lauratrigeiro-drag-canvas.s3-website-us-west-1.amazonaws.com/

This project uses a module called dragCanvas that given an HTML5 page with a canvas, creates a rectangle that is draggable using the mouse. The properties and position of the rectangle are stored in a private rect sub-module while the position of the mouse is stored in the mouse sub-module.

The first step is to listen whether a user clicks on the rectangle in onMouseDown by checking if the mouse position is inside of the rectangle (computed in rect.mouseCollision). When this happens, the rectangle is now dragging and a timer begins that gradually moves the rectangle as the mouse moves. Two listeners are also added. onMouseMove makes sure that the rectangle stays inside of the canvas using clamp functions on the coordinates of the mouse. onMouseUp listens for the release of the mouse and sets dragging to false, stopping the timer and the rectangle's movement.

The architectural pattern I used is based on the Module Pattern from <em>Learning JavaScript Design Patterns</em> by Addy Osmani. I also learned a lot from reading [this HTML5 Canvas Tutorial](http://rectangleworld.com/blog/archives/129).
