class Node {
  constructor(name, { svg, mouse }) {
    this.name = name;
    this.svg = svg;
    this.mouse = mouse;
    // DOM Element creation
    this.domElement = document.createElement('div');
    this.domElement.classList.add('node');
    this.domElement.setAttribute('title', this.name);

    // Create output visual
    var outDom = document.createElement('span');
    outDom.classList.add('output');
    outDom.innerHTML = '&nbsp;';
    this.domElement.appendChild(outDom);

    // Output Click handler
    outDom.onclick = (e) => {
      if (mouse.currentInput &&
        !this.ownsInput(mouse.currentInput)) {
        var tmp = mouse.currentInput;
        mouse.currentInput = null;
        this.connectTo(tmp);
      }
      e.stopPropagation();
    };

    // Node Stuffs
    this.value = '';
    this.inputs = [];
    this.connected = false;

    // SVG Connectors
    this.attachedPaths = [];
  }

  getOutputPoint() {
    var tmp = this.domElement.firstElementChild;
    var offset = GetFullOffset(tmp);
    return {
      x: offset.left + tmp.offsetWidth / 2,
      y: offset.top + tmp.offsetHeight / 2
    };
  }

  addInput(name) {
    var input = new NodeInput(name, { svg:this.svg, mouse:this.mouse });
    this.inputs.push(input);
    this.domElement.appendChild(input.domElement);

    return input;
  }

  detachInput(input) {
    var index = -1;
    for (var i = 0; i < this.attachedPaths.length; i++) {
      if (this.attachedPaths[i].input == input) {
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

  ownsInput(input) {
    for (var i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i] === input) {
        return true;
      }
    }
    return false;
  }

  updatePosition() {
    var outPoint = this.getOutputPoint();

    var aPaths = this.attachedPaths;
    for (var i = 0; i < aPaths.length; i++) {
      var iPoint = aPaths[i].input.getAttachPoint();
      var pathStr = this.createPath(iPoint, outPoint);
      aPaths[i].path.setAttributeNS(null, 'd', pathStr);
    }

    for (var j = 0; j < this.inputs.length; j++) {
      if (this.inputs[j].node !== null) {
        var iP = this.inputs[j].getAttachPoint();
        var oP = this.inputs[j].node.getOutputPoint();

        var pStr = this.createPath(iP, oP);
        this.inputs[j].path.setAttributeNS(null, 'd', pStr);
      }
    }
  }

  createPath(a, b) {
    var diff = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    var pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return pathStr;
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
    var oPoint = this.getOutputPoint();

    var pathStr = this.createPath(iPoint, oPoint);

    input.path.setAttributeNS(null, 'd', pathStr);
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


