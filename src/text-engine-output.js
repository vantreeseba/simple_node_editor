class TextEngineJson {
  constructor(editor) {
    this.editor = editor;

    let titlebar = this.editor.titlebar;

    titlebar.addItem('Save Text Engine', () => {
      Files.download('text-engine.json', this.toJson());
    });
  }

  fromJson(jsonString) {
    var json = JSON.parse(jsonString);
    // Build nodes.
    var nodes = json.nodes.map(node => {
      var added = this.editor.addNode(node);
      if(node.position) {
        added.moveTo(node.position);
      }

      return added;
    });

    // Build connections.
    json.edges.forEach(edge => {
      var from = nodes.find(x => x.id === edge.from);
      var to = nodes.find(x => x.id === edge.to);

      if(from) {
        var toPort = to.ports.find(x => x.name === edge.toName && x.type == 'input') ||
          to.addPort({ ...edge, name: edge.toName });
        var fromPort = from.ports.find(x => x.name === edge.fromName && x.type == 'output') ||
          from.addPort({ ...edge, name: edge.fromName, type: 'output' });

        toPort.connect(fromPort);
        toPort.updatePosition();
      }
    });

  }

  toJson() {

    var json = {
      roomId: this.editor.nodes[0].id,
      inventory: [],
      rooms: this.editor.nodes.map(r => {
        return {
          id: r.id,
          name: r.name,
          ...r.data.value,
          items: [],
          exits: r.ports.filter(p => p.type === 'output').map(p => {
            return {
              dir: p.name,
              id: p.ports[0].node.id,
            };
          })
        };
      })
    };


    // var json = {
    //   nodes: this.editor.nodes.map(n => {
    //     return {
    //       id: n.id,
    //       name: n.name,
    //       position: n.getPosition(),
    //       data: n.data.value
    //     };
    //   }),
    //   edges: this.editor.nodes.map(n => {
    //     var ins = n.ports.filter(p => p.type === 'input');
    //     return ins.map(ip => {
    //
    //       // Inputs only have 1 port.
    //       return {
    //         id: ip.id,
    //         from: ip.ports[0].node.id,
    //         to: ip.node.id,
    //         toName: ip.name,
    //         fromName: ip.ports[0].name
    //       };
    //     });
    //   }).reduce((acc, cur) => acc.concat(cur.filter(x => x)), [])
    // };

    return JSON.stringify(json);
  }
}
