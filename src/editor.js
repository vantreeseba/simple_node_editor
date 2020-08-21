
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

  _setupUI() {
    this._setupSVG();
    this._setupMouseEvents();
    this.titlebar = new TitleBar();
    this.contextMenu = new ContextMenu();

    this.titlebar.addItem('save', (e) => {
      Files.download('graph-editor.json', this.toJson());
    });

    this.titlebar.addItem('load', e => {
      Files.upload(data => {
        this.fromJson(data);
      });
    });

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

  constructor() {
    this.nodes = [];
    this.snapToGrid = false;
    this._setupUI();
  }

  addNode(name) {
    var node = new Node(name, { svg:this.svg, mouse: this.mouse });
    this.nodes.push(node);
    return node;
  }

  clearUI() {
    this.svg.innerHTML = '';
    document.querySelectorAll('.node').forEach(n => {
      document.body.removeChild(n);
    });

    this.nodes = [];
  }

  fromJson(jsonString) {
    this.clearUI();

    var json = JSON.parse(jsonString);
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

  toJson() {
    var json = {
      nodes: this.nodes.map(n => {
        return {
          id: n.name,
          position: n.getPosition()
        };
      }),
      edges: this.nodes.map(n => {
        var ins = n.ports.filter(p => p.type === 'input');
        return ins.map(ip => {

          // Inputs only have 1 port.
          return {
            id: ip.name,
            from: ip.ports[0].node.name,
            to: ip.node.name
          };
        });
      }).reduce((acc, cur) => acc.concat(cur.filter(x => x)), [])
    };

    return JSON.stringify(json);
  }
}
