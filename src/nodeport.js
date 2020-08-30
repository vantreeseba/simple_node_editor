class NodePort {
  /**
   * Constructor.
   * @param {string} name - The name of the port.
   * @param {HTMLElement} svg - The svg element to draw this port into.
   */
  constructor({ id, name, type = 'input' }, node, { svg, mouse }) {
    this.id = id || Math.round(Math.random() * 1000000);
    this.type = type;
    this.svg = svg;
    this.name = name;
    this.node = node;
    this.ports = [];

    // The dom element, here is where we could add
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = name;
    this.domElement.classList.add('connection');
    this.domElement.classList.add(this.type);

    // SVG Connector
    this.path = document.createElementNS(svg.ns, 'path');
    this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
    this.path.setAttributeNS(null, 'stroke-width', '3');
    this.path.setAttributeNS(null, 'fill', 'none');
    svg.appendChild(this.path);

    // DOM Event handlers
    this.domElement.addEventListener('click', e => {
      if (mouse.currentPort) {
        if(mouse.currentPort.type !== this.type) {
          this.connect(mouse.currentPort);
          mouse.currentPort = null;
        }
      } else {
        if(this.type === 'input') {
          this.ports.forEach(p => p.disconnect(this));
        }
        mouse.currentPort = this;
      }
    });
  }

  connect(port) {
    // return if we are alredy connected to the port.
    if(this.ports.find(p => p === port)) {
      return;
    }

    // Don't have more than 1 connection if you're an input port.
    if(this.type === 'input') {
      this.ports.forEach(p => p.disconnect(this));
    }

    // Add the port to the list of connections.
    this.ports.push(port);

    // Make the other port connect to this one.
    port.connect(this);

    // UI
    this.domElement.classList.add('filled');

    if(this.type === 'output' && this.path.hasAttribute('d')) {
      port.path.setAttribute('d', this.path.getAttribute('d'));
      this.path.removeAttribute('d');
    }
  }

  disconnect(port) {
    var index = this.ports.indexOf(port);
    if(!this.ports[index]) {
      return;
    }

    this.ports.splice(index, 1)[0].disconnect(this);

    // UI
    this.path.removeAttribute('d');
    if(this.ports.length <= 0) {
      this.domElement.classList.remove('filled');
    }
  }

  updatePosition() {
    if(this.type === 'output') {
      this.ports.forEach(p => p.updatePosition());
    } else {
      if(this.ports.length > 0) {
        var iPoint = this.getAttachPoint();
        var iPoint2 = { x: iPoint.x + 40, y: iPoint.y };

        this.ports.forEach(p => {
          var oPoint = p.getAttachPoint();
          var oPoint2 = { x: oPoint.x - 40, y: iPoint.y };
          var pathStr = createPath(iPoint, oPoint, iPoint2, oPoint);
          this.path.setAttributeNS(null, 'd', pathStr);
        });
      }
    }
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
        // y: offset.top + this.domElement.offsetHeight / 2
        // TODO: Fix this so that the connection is centered vertically.
        y: offset.top + this.domElement.offsetHeight - 8
      };
    } else {
      return {
        x: offset.left + this.domElement.offsetWidth - 2,
        // y: offset.top + this.domElement.offsetHeight / 2
        y: offset.top + this.domElement.offsetHeight - 8
      };
    }
  }
}
