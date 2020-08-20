class NodeInput {
  /**
   * Constructor.
   *
   * @param {string} name - The name of the input.
   * @param {HTMLElement} svg - The svg element to draw this input into.
   */
  constructor(name, { svg, mouse }) {
    this.svg = svg;
    this.name = name;
    this.node = null;

    // The dom element, here is where we could add
    // different input types
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = name;
    this.domElement.classList.add('connection');
    this.domElement.classList.add('empty');

    // SVG Connector
    this.path = document.createElementNS(svg.ns, 'path');
    this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
    this.path.setAttributeNS(null, 'stroke-width', '2');
    this.path.setAttributeNS(null, 'fill', 'none');
    svg.appendChild(this.path);

    // DOM Event handlers
    this.domElement.onclick = (e) => {
      if (mouse.currentInput) {
        if (mouse.currentInput.path.hasAttribute('d')) {
          mouse.currentInput.path.removeAttribute('d');
        }
        if (mouse.currentInput.node) {
          mouse.currentInput.node.detachInput(mouse.currentInput);
          mouse.currentInput.node = null;
        }
      }
      mouse.currentInput = this;
      if (this.node) {
        this.node.detachInput(this);
        this.domElement.classList.remove('filled');
        this.domElement.classList.add('empty');
      }
      e.stopPropagation();
    };
  }

  /**
   * Get the {x,y} position of the attachment point.
   *
   * @return {{x,y}}
   */
  getAttachPoint() {
    var offset = GetFullOffset(this.domElement);
    return {
      x: offset.left, // + this.domElement.offsetWidth - 2,
      y: offset.top + this.domElement.offsetHeight / 2
    };
  }
}


