
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
      currentPort: null,
      currentNode: null
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
      if(this.mouse.currentNode && e.target !== this.mouse.currentNode.domElement) {
        this.mouse.currentNode.domElement.classList.remove('selected');
        this.mouse.currentNode = null;
      }
    };

    window.addEventListener('keydown', e => {
      if(e.key === 'Delete') {
        this.nodes = this.nodes.filter(n => n !== this.mouse.currentNode);
        this.mouse.currentNode.delete();
      }
    });

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
      var node = this.addNode({ name:'test' });
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort({ name:'IN' });
    });

    this.contextMenu.addItem('Add Node (1 in 1 out)', (e) => {
      var node = this.addNode({ name:'test' });
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort({ name:'IN' });
      node.addPort({ name:'OUT', type:'output' });
    });

    this.contextMenu.addItem('Add text adventure movement node', (e) => {
      var node = this.addNode({ name:'Room' });
      node.moveTo({ x: e.clientX, y: e.clientY });
      node.addPort({ name:'IN' });
      node.addPort({ name:'NORTH', type:'output' });
      node.addPort({ name:'SOUTH', type:'output' });
      node.addPort({ name:'EAST', type:'output' });
      node.addPort({ name:'WEST', type:'output' });
    });

    this.contextMenu.addItem('Toggle Snap', e => {
      this.snapToGrid = !this.snapToGrid;
    });

  }

  constructor() {
    this.nodes = [];
    this.snapToGrid = false;
    this._setupUI();

    this.jsonhandler = new JSONHandler();
  }

  addNode(nodeconfig) {
    var node = new Node(nodeconfig, { svg:this.svg, mouse: this.mouse });
    this.nodes.push(node);

    node.contextMenu = new ContextMenu({ element: node.domElement, title:'woo' });
    node.contextMenu.addItem('delete', () => {
      node.delete();
    });

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

    this.jsonhandler.fromJson(this, jsonString);
  }

  toJson() {
    return this.jsonhandler.toJson(this);
  }
}
