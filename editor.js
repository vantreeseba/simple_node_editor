
class Editor {
  constructor() {
    // SVG SETUP
    // ===========
    this.svg = document.getElementById('svg');
    if (!this.svg) {
      this.svg = document.createElement('svg');
      this.svg.id = 'svg';
      document.body.appendChild(this.svg);
    }
    this.svg.ns = this.svg.namespaceURI;

    // MOUSE SETUP
    // =============
    this.mouse = {
      currentInput: null,
      createPath: (a, b) => {
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
    };

    window.onmousemove = (e) => {
      if (this.mouse.currentInput) {
        var p = this.mouse.currentInput.path;
        var iP = this.mouse.currentInput.getAttachPoint();
        var oP = { x: e.pageX, y: e.pageY };
        var s = this.mouse.createPath(iP, oP);
        p.setAttributeNS(null, 'd', s);
      }
    };

    window.onclick = (e) => {
      if (this.mouse.currentInput) {
        this.mouse.currentInput.path.removeAttribute('d');
        if (this.mouse.currentInput.node) {
          this.mouse.currentInput.node.detachInput(this.mouse.currentInput);
        }
        this.mouse.currentInput = null;
      }
    };

  }

  addNode(name) {
    var node = new Node(name, { svg:this.svg, mouse: this.mouse });
    node.initUI();

    return node;
  }

  fromJson(json) {
    var nodes = json.nodes.map(node => {
      var added = this.addNode(node.id);
      if(node.position) {
        added.moveTo(node.position);
      }

      return added;
    });


    json.edges.forEach(edge => {
      var from = nodes.find(x => x.name === edge.from);
      var to = nodes.find(x => x.name === edge.to);

      if(from) {
        var port = to.inputs.find(x => x.name == edge.id) || to.addInput(edge.id);
        if(from) {
          from.connectTo(port);
        }
      }
    });

  }
}
