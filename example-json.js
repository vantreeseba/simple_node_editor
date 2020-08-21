var json = {
  'nodes': [
    {
      'id': 'n1',
      'position': { x: 100, y:150 }
    },
    {
      'id': 'n2',
      'position': { x: 300, y:100 }
    },
    {
      'id': 'n3',
      'position': { x: 300, y:200 }
    },
    {
      'id': 'n4',
      'position': { x: 600, y:200 }
    }

  ],
  'edges': [
    {
      'id': 'e1',
      'from': 'n1',
      'to': 'n2'
    },
    {
      'id': 'e2',
      'from': 'n1',
      'to': 'n3'
    },
    {
      'id': 'this is a long name as a test',
      'from': 'n2',
      'to': 'n4'
    },
    {
      'id': 'e4',
      'from': 'n3',
      'to': 'n4'
    }
  ]
};
