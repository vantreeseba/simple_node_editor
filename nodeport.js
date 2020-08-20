class NodePort {
  /**
   * Constructor.
   * @param {string} name - The name of the port.
   * @param {HTMLElement} svg - The svg element to draw this port into.
   */
  constructor(name, type = 'input', { svg, mouse }) {
    this.type = type;
    this.svg = svg;
    this.name = name;
    this.node = null;

    // The dom element, here is where we could add
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = name;
    this.domElement.classList.add('connection');
    this.domElement.classList.add(this.type);
    this.domElement.classList.add('empty');

    // SVG Connector
    this.path = document.createElementNS(svg.ns, 'path');
    this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
    this.path.setAttributeNS(null, 'stroke-width', '2');
    this.path.setAttributeNS(null, 'fill', 'none');
    svg.appendChild(this.path);

    // DOM Event handlers
    this.domElement.onclick = (e) => {
      if (mouse.currentPort) {
        if (mouse.currentPort.path.hasAttribute('d')) {
          mouse.currentPort.path.removeAttribute('d');
        }
        if (mouse.currentPort.node) {
          mouse.currentPort.node.detachInput(mouse.currentPort);
          mouse.currentPort.node = null;
        }
      }
      mouse.currentPort = this;
      if (this.node) {
        this.node.detachPort(this);
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
    if(this.type === 'input') {
      return {
        x: offset.left,
        y: offset.top + this.domElement.offsetHeight / 2
      };
    } else {
      return {
        x: offset.left + this.domElement.offsetWidth - 2,
        y: offset.top + this.domElement.offsetHeight / 2
      };
    }
  }
}


