var json = {
  'nodes': [
    {
      'id': 'n1',
      'position': { x: 100, y:150 }
    },
    {
      'id': 'n2',
      'position': { x: 200, y:100 }
    },
    {
      'id': 'n3',
      'position': { x: 200, y:200 }
    },
    {
      'id': 'n4',
      'position': { x: 300, y:150 }
    }

  ],
  'edges': [
    {
      'id': 'e1',
      'from': 'n1',
      'to': 'n2'
    },
    {
      'id': 'e1',
      'from': 'n1',
      'to': 'n3'
    },
    {
      'id': 'e1',
      'from': 'n2',
      'to': 'n4'
    },
    {
      'id': 'e1',
      'from': 'n3',
      'to': 'n4'
    }
  ]
};
