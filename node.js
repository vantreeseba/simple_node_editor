class Node {
  constructor(name, { svg, mouse }) {
    this.name = name;
    this.svg = svg;
    this.mouse = mouse;

    // DOM Element creation
    this.domElement = document.createElement('div');
    this.domElement.classList.add('node');
    this.domElement.setAttribute('title', this.name);

    this.portsContainer = document.createElement('div');
    this.portsContainer.classList.add('container');

    this.inputsDom = document.createElement('div');
    this.inputsDom.classList.add('ports');
    this.outputsDom = document.createElement('div');
    this.outputsDom.classList.add('ports');

    this.domElement.appendChild(this.portsContainer);
    this.portsContainer.appendChild(this.inputsDom);
    this.portsContainer.appendChild(this.outputsDom);

    // Create output visual
    // var outDom = document.createElement('span');
    // outDom.classList.add('output');
    // outDom.innerHTML = '&nbsp;';
    // this.domElement.appendChild(outDom);

    // Output Click handler
    // outDom.onclick = (e) => {
    //   if (mouse.currentPort &&
    //     !this.ownsInput(mouse.currentPort)) {
    //     var tmp = mouse.currentPort;
    //     mouse.currentPort = null;
    //     this.connectTo(tmp);
    //   }
    //   e.stopPropagation();
    // };

    // Node Stuffs
    this.value = '';
    this.ports = [];
    this.connected = false;

    // SVG Connectors
    this.attachedPaths = [];
  }

  addPort(name, type = 'input') {
    var port = new NodePort(name, type, { svg:this.svg, mouse:this.mouse });
    this.ports.push(port);
    if(type == 'input') {
      this.inputsDom.appendChild(port.domElement);
    } else {
      this.outputsDom.appendChild(port.domElement);
    }
    // this.domElement.appendChild(port.domElement);

    return port;
  }

  detachPort(port) {
    var index = -1;
    for (var i = 0; i < this.attachedPaths.length; i++) {
      if (this.attachedPaths[i].input === port) {
        index = i;
      }
    }

    if (index >= 0) {
      this.attachedPaths[index].path.removeAttribute('d');
      this.attachedPaths[index].input.node = null;
      this.attachedPaths.splice(index, 1);
    }

    if (this.attachedPaths.length <= 0) {
      this.domElement.classList.remove('connected');
    }
  }

  ownsPort(port) {
    for (var i = 0; i < this.ports.length; i++) {
      if (this.port[i] === port) {
        return true;
      }
    }
    return false;
  }

  updatePosition() {
    // var outPoint = this.getOutputPoint();

    var aPaths = this.attachedPaths;
    for (var i = 0; i < aPaths.length; i++) {
      var iPoint = aPaths[i].input.getAttachPoint();
      // var pathStr = createPath(iPoint, outPoint);
      // aPaths[i].path.setAttributeNS(null, 'd', pathStr);
    }

    for (var j = 0; j < this.ports.length; j++) {
      if (this.ports[j].node !== null) {
        var iP = this.ports[j].getAttachPoint();
        // var oP = this.ports[j].node.getOutputPoint();

        // var pStr = createPath(iP, oP);
        // this.ports[j].path.setAttributeNS(null, 'd', pStr);
      }
    }
  }

  connectTo(input) {
    input.node = this;
    this.connected = true;
    this.domElement.classList.add('connected');

    input.domElement.classList.remove('empty');
    input.domElement.classList.add('filled');

    this.attachedPaths.push({
      input: input,
      path: input.path
    });

    var iPoint = input.getAttachPoint();
    // var oPoint = this.getOutputPoint();

    // var pathStr = createPath(iPoint, oPoint);

    // input.path.setAttributeNS(null, 'd', pathStr);
  }

  moveTo(point) {
    this.domElement.style.top = point.y + 'px';
    this.domElement.style.left = point.x + 'px';
    this.updatePosition();
  }

  initUI() {
    draggable(this.domElement, () => this.updatePosition());
    // Fix positioning
    this.domElement.style.position = 'absolute';

    document.body.appendChild(this.domElement);
    // Update Visual
    this.updatePosition();
  }
}


