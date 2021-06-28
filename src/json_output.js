class JSONHandler {
  fromJson(editor, jsonString) {
    var json = JSON.parse(jsonString);
    // Build nodes.
    var nodes = json.nodes.map(node => {
      var added = editor.addNode(node);
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

  toJson(editor) {
    var json = {
      nodes: editor.nodes.map(n => {
        return {
          id: n.id,
          name: n.name,
          position: n.getPosition(),
          data: n.data.value
        };
      }),
      edges: editor.nodes.map(n => {
        var ins = n.ports.filter(p => p.type === 'input');
        return ins.map(ip => {

          // Inputs only have 1 port.
          return {
            id: ip.id,
            from: ip.ports[0].node.id,
            to: ip.node.id,
            toName: ip.name,
            fromName: ip.ports[0].name
          };
        });
      }).reduce((acc, cur) => acc.concat(cur.filter(x => x)), [])
    };

    return JSON.stringify(json);
  }
}
