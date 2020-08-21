
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
        if(e.target === this.mouse.currentPort.domElement) {
          return;
        }
        this.mouse.currentPort.path.removeAttribute('d');
        this.mouse.currentPort = null;
      }
    };
  }

  constructor() {
    this._setupSVG();
    this._setupMouseEvents();
    this.contextMenu = new ContextMenu();
    this.snapToGrid = false;

    this.contextMenu.addItem('Add Node (1 in)', (e) => {
      var node = this.addNode('test');
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort('IN');
    });

    this.contextMenu.addItem('Add Node (1 in 1 out)', (e) => {
      var node = this.addNode('test');
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort('IN');
      node.addPort('OUT', 'output');
    });

    this.contextMenu.addItem('Add Node (1 in 1 out)', (e) => {
      var node = this.addNode('test');
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort('IN');
      node.addPort('NORTH', 'output');
      node.addPort('SOUTH', 'output');
      node.addPort('EAST', 'output');
      node.addPort('WEST', 'output');
    });



    this.contextMenu.addItem('Toggle Snap', e => {
      this.snapToGrid = !this.snapToGrid;
    });
  }

  addNode(name) {
    return new Node(name, { svg:this.svg, mouse: this.mouse });
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
        var toPort = to.ports.find(x => x.name === edge.id) || to.addPort(edge.id);
        var fromPort = from.ports.find(x => x.name === edge.id) || from.addPort(edge.id, 'output');
        toPort.connect(fromPort);
        toPort.updatePosition();
      }
    });

  }
}
