'use strict';
/**
 * Returns the offset of the element from the top and left of the screen.
 *
 * @param {HTMLElement} element - The element to get the offset of.
 * @return {{top:number, left:number}} - The offset top and left.
 */
function GetFullOffset(element) {
  var offset = {
    top: element.offsetTop,
    left: element.offsetLeft,
  };

  if (element.offsetParent) {
    var po = GetFullOffset(element.offsetParent);
    offset.top += po.top;
    offset.left += po.left;
    return offset;
  } else {
    return offset;
  }
}


/**
 * Makes an element draggable.
 *
 * @param {HTMLElement} element - The element.
 */
function draggable(element, callback) {
  var isMouseDown = false;

  // initial mouse X and Y for `mousedown`
  var mouseX;
  var mouseY;

  // element X and Y before and after move
  var elementX = 0;
  var elementY = 0;

  // mouse button down over the element
  element.addEventListener('mousedown', onMouseDown);

  // mouse button released
  element.addEventListener('mouseup', onMouseUp);

  // need to attach to the entire document
  // in order to take full width and height
  // this ensures the element keeps up with the mouse
  document.addEventListener('mousemove', onMouseMove);

  /**
   * Listens to `mousedown` event.
   * @param {Object} event - The event.
   */
  function onMouseDown(event) {
    if(event.target !== element) {
      return;
    }
    mouseX = event.clientX;
    mouseY = event.clientY;

    var offset = GetFullOffset(element);
    elementX = offset.left || 0;
    elementY = offset.top || 0;

    isMouseDown = true;
  }
  /**
   * Listens to `mouseup` event.
   *
   * @param {Object} event - The event.
   */
  function onMouseUp() {
    var offset = GetFullOffset(element);
    elementX = offset.left || 0;
    elementY = offset.top || 0;
    callback();

    isMouseDown = false;
  }

  /**
   * Listens to `mousemove` event.
   *
   * @param {Object} event - The event.
   */
  function onMouseMove(event) {
    if (!isMouseDown) {
      return;
    }
    var deltaX = event.clientX - mouseX;
    var deltaY = event.clientY - mouseY;
    element.style.left = elementX + deltaX + 'px';
    element.style.top = elementY + deltaY + 'px';
    callback();
  }
}
