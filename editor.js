
class Editor {
  _setupSVG() {
    this.svg = document.getElementById('svg');
    if (!this.svg) {
      this.svg = document.createElement('svg');
      this.svg.id = 'svg';
      document.body.appendChild(this.svg);
    }
    this.svg.ns = this.svg.namespaceURI;
  }

  _setupMouseEvents() {
    this.mouse = {
      currentPort: null
    };

    window.onmousemove = (e) => {
      if (this.mouse.currentPort) {
        var p = this.mouse.currentPort.path;
        var iP = this.mouse.currentPort.getAttachPoint();
        var oP = { x: e.pageX, y: e.pageY };
        var s = createPath(iP, oP);
        p.setAttributeNS(null, 'd', s);
      }
    };

    window.onclick = (e) => {
      if (this.mouse.currentPort) {
        this.mouse.currentPort.path.removeAttribute('d');
        if (this.mouse.currentPort.node) {
          this.mouse.currentPort.node.detachPort(this.mouse.currentPort);
        }
        this.mouse.currentPort = null;
      }
    };
  }

  constructor() {
    this._setupSVG();
    this._setupMouseEvents();
  }

  addNode(name) {
    var node = new Node(name, { svg:this.svg, mouse: this.mouse });
    node.initUI();

    return node;
  }

  fromJson(json) {
    // Build nodes.
    var nodes = json.nodes.map(node => {
      var added = this.addNode(node.id);
      if(node.position) {
        added.moveTo(node.position);
      }

      return added;
    });

    // Build connections.
    json.edges.forEach(edge => {
      var from = nodes.find(x => x.name === edge.from);
      var to = nodes.find(x => x.name === edge.to);

      if(from) {
        var toport = to.ports.find(x => x.name === edge.id) || to.addPort(edge.id);
        var fromport = from.ports.find(x => x.name === edge.id) || from.addPort(edge.id, 'output');
        if(from) {
          from.connectTo(toport);
        }
      }
    });

  }
}
