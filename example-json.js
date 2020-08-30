var json = {
  'nodes': [
    {
      'id': 1,
      'name': 'n1',
      'position': { x: 100, y:150 }
    },
    {
      'id': 2,
      'name': 'n2',
      'position': { x: 300, y:100 }
    },
    {
      'id': 3,
      'name': 'n3',
      'position': { x: 300, y:250 }
    },
    {
      'id': 4,
      'name': 'n4',
      'position': { x: 600, y:200 }
    }

  ],
  'edges': [
    {
      'id': 1,
      'from': 1,
      'fromName': 'out 1',
      'to': 2,
      'toName': 'in 1'
    },
    {
      'id': 2,
      'from': 1,
      'fromName': 'out 2',
      'to': 3,
      'toName': 'in 1'
    },
    {
      'id': 3,
      'from': 2,
      'fromName': 'out 1',
      'to': 4,
      'toName': 'this is a long name as a test',
    },
    {
      'id': 4,
      'from': 3,
      'fromName': 'some calculated value',
      'to': 4,
      'toName': 'in 1',
    }
  ]
};
