var json = {
  'nodes': [
    {
      'id': 1,
      'name': 'n1',
      'position': { x: 100, y:150 },
      'data': { img: 'test', desc: 'this is a desc' }
    },
    {
      'id': 2,
      'name': 'n2',
      'position': { x: 300, y:100 },
      'data': { img: 'test', desc: 'this is a desc' }
    },
  ],
  'edges': [
    {
      'id': 1,
      'from': 1,
      'fromName': 'north',
      'to': 2,
      'toName': 'south'
    },
    {
      'id': 2,
      'from': 2,
      'fromName': 'south',
      'to': 1,
      'toName': 'north'
    }
  ]
};
