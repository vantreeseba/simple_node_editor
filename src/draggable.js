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

function createPath(b, a) {
  var diff = {
    x: b.x - a.x,
    y: b.y - a.y
  };

  var halfx = a.x + (diff.x/2);
  var halfy = a.y + (diff.y/2);

  var curve = 6;

  var pathStr = `M ${a.x} ${a.y}`;
  // pathStr += `L ${a.x + 15} ${a.y + diff.y/8}`;
  // pathStr += `L ${halfx} ${a.y + diff.y/6}`;
  // pathStr += `L ${halfx} ${b.y - diff.y/6}`;
  // pathStr += `L ${b.x - 15} ${b.y - diff.y/8}`;
  //
  // pathStr += `L ${halfx-diff.x/curve} ${a.y}`;
  // pathStr += `Q ${halfx} ${a.y} ${halfx} ${a.y+diff.y/curve}`;
  // pathStr += `L ${halfx} ${halfy+diff.y/curve}`;
  // pathStr += `L ${halfx} ${halfy}`;
  // pathStr += `L ${halfx} ${b.y-diff.y/curve}`;
  // pathStr += `Q ${halfx} ${b.y} ${halfx + diff.x/curve} ${b.y}`;
  // pathStr += `L ${b.x} ${b.y}`;


  // pathStr += `Q ${a.x + 30} ${a.y} ${Math.max(a.x + 10, a.x + diff.x/2)} ${a.y + diff.y/6}`;
  // pathStr += `T ${Math.min(b.x-20, b.x-diff.x/2)} ${b.y - diff.y/6}`;
  // pathStr += `T ${b.x} ${b.y}`;
  // pathStr += `T ${b.x - 20} ${b.y - diff.y/6}`;
  // pathStr += `T ${b.x} ${b.y}`;
  // pathStr += `T ${b.x - 20} ${b.y}`;
  // pathStr += `T ${b.x} ${b.y}`;
  // pathStr += `Q ${a.x + diff.x/2} ${a.y + diff.y/2} ${b.x} ${b.y}`;
  // pathStr += `S ${a.x+20} ${a.y} ${a.x + diff.x/6} ${a.y + diff.y/6}`;
  // pathStr += `S ${a.x+diff.x/6} ${b.y} ${a.x + diff.x/3} ${a.y + diff.y/3}`;
  // pathStr += `S ${b.x-20} ${b.y} ${a.x + diff.x} ${a.y + diff.y}`;

  // pathStr += `S ${a.x + 20} ${a.y} ${a.x + 20} ${a.y + (diff.y)/4}`;
  // pathStr += `S ${b.x - 20} ${b.y} ${b.x - 20} ${b.y}`;
  // pathStr += `S ${b.x - 20} ${b.y} ${b.x - 20} ${b.y - (diff.y) /4}`;
  // pathStr += `S ${b.x} ${b.y} ${a.x + diff.x} ${a.y + diff.y}`;
  //
  // pathStr += `S ${a.x + 20} ${a.y} ${a.x + 20} ${a.y + (diff.y)/4}`;
  // pathStr += `S ${b.x - 20} ${b.y} ${b.x - 20} ${b.y}`;
  // pathStr += `S ${b.x - 20} ${b.y} ${b.x - 20} ${b.y - (diff.y) /4}`;

  // pathStr = `M ${a.x} ${a.y}`;
  pathStr += `C ${a.x + diff.x / 3 * 2} ${a.y} ${a.x + diff.x/3} ${b.y} ${b.x} ${b.y}`;

  return pathStr;
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
