User OKR Screen
---------------

```js
{
  id: 100
  type: 'user|team',
  owner: 'peter@mongodb.com',
  state: 'draft|review|approved',
  edit:false,
  objectives: [{
    id: 1,
    objective: 'objective 1',
    tags: ['mandatory'],

    aligned_with: {
      id: 200,
      objective_id: 10
    },

    keyResults: [{
      id: 5,
      completeness: 45,
      keyResult: 'first key result',
      tags: ['mandatory']
    }],

    comments: [{
      timestamp: new Date(),
      comment: 'some comment @peter'
    }]
  }],
  auth: [{
      rights: ['edit'],
      username: 'peter@example.com'
    }
  ]
}
```

Users collection
================
```js
{
  username: 'peter@example.com',
  name: 'peter peterson',
  photo: 'http://somefoto.com',
  roles: ['admin', 'user', 'manager']
}
```

Teams collection
================
```js
{
  manager: 'peter@peterson.com',
  members: [{
    user: 'ole@ole.com'
  }]
}
```

Tags collection
===============
```js
{
  name: 'mandatory',
  description: 'mandatory tag'
}
```
