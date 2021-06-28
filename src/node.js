class Node {
  constructor({ id, name, data }, { svg, mouse }) {
    this.id = id || Math.round(Math.random() * 1000000);
    this.name = name;
    this.ports = [];

    // DOM Element creation
    this.svg = svg;
    this.mouse = mouse;

    this.domElement = document.createElement('div');
    this.domElement.classList.add('node');
    this.domElement.setAttribute('title', this.name);

    this.data = new NodeValue(data);

    this.domElement.appendChild(this.data.domElement);


    this.portsContainer = document.createElement('div');
    this.portsContainer.classList.add('portsContainer');

    this.inputsDom = document.createElement('div');
    this.inputsDom.classList.add('ports');
    this.outputsDom = document.createElement('div');
    this.outputsDom.classList.add('ports');

    this.domElement.appendChild(this.portsContainer);
    this.portsContainer.appendChild(this.inputsDom);
    this.portsContainer.appendChild(this.outputsDom);

    draggable(this.domElement, () => {
      if (this.mouse.currentNode) {
        this.mouse.currentNode.domElement.classList.remove('selected');
      }
      this.mouse.currentNode = this;
      this.domElement.classList.add('selected');
      this.updatePosition();
    });
    document.body.appendChild(this.domElement);

    this.updatePosition();
  }

  delete() {
    this.ports.forEach(p => p.ports.forEach(pp => pp.disconnect(p)));
    document.body.removeChild(this.domElement);
  }

  /**
   * Add a port to the node.
   *
   * @typedef {object} PortOptions
   * @property {string} opts.id - test
   * @property {string} opts.name - test
   * @property {string} [opts.type=input] - test
   *
   * @param {PortOptions} opts - test
   * @return {NodePort} The port created
   */
  addPort({ id, name, type = 'input' }) {
    var port = new NodePort({ id, name, type }, this, { svg: this.svg, mouse: this.mouse });
    this.ports.push(port);

    // UI
    if (type === 'input') {
      this.inputsDom.appendChild(port.domElement);
    } else {
      this.outputsDom.appendChild(port.domElement);
    }

    return port;
  }

  /**
   * Update the visual position of every port and connection.
   * @return {void}
   */
  updatePosition() {
    this.ports.forEach(p => p.updatePosition());
  }

  /**
   * Get the current position of the node.
   *
   * @typedef {object} Point
   * @property {number} x
   * @property {number} y
   *
   * @return {Point}
   */
  getPosition() {
    return {
      x: parseFloat(this.domElement.style.left.replace('px', '')),
      y: parseFloat(this.domElement.style.top.replace('px', ''))
    };
  }

  /**
   * Moves the node to the given point.
   *
   * @param {Point} point - The point to move to.
   * @return {void}
   */
  moveTo(point) {
    this.domElement.style.top = point.y + 'px';
    this.domElement.style.left = point.x + 'px';
    this.updatePosition();
  }
}


