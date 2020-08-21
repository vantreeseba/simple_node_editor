class Node {
  constructor(name, { svg, mouse }) {
    this.name = name;
    this.ports = [];

    // DOM Element creation
    this.svg = svg;
    this.mouse = mouse;

    this.domElement = document.createElement('div');
    this.domElement.classList.add('node');
    this.domElement.setAttribute('title', this.name);

    this.portsContainer = document.createElement('div');
    this.portsContainer.classList.add('portsContainer');

    this.inputsDom = document.createElement('div');
    this.inputsDom.classList.add('ports');
    this.outputsDom = document.createElement('div');
    this.outputsDom.classList.add('ports');

    this.domElement.appendChild(this.portsContainer);
    this.portsContainer.appendChild(this.inputsDom);
    this.portsContainer.appendChild(this.outputsDom);

    draggable(this.domElement, () => this.updatePosition());
    document.body.appendChild(this.domElement);

    this.updatePosition();
  }

  addPort(name, type = 'input') {
    var port = new NodePort(name, type, { svg:this.svg, mouse:this.mouse });
    this.ports.push(port);

    // UI
    if(type === 'input') {
      this.inputsDom.appendChild(port.domElement);
    } else {
      this.outputsDom.appendChild(port.domElement);
    }

    return port;
  }

  updatePosition() {
    this.ports.forEach(p => p.updatePosition());
  }

  moveTo(point) {
    this.domElement.style.top = point.y + 'px';
    this.domElement.style.left = point.x + 'px';
    this.updatePosition();
  }
}


