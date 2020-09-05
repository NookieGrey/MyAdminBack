const express = require('express');
const cors = require('cors');
const app = express();
const port = 8090;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/static', express.static('static'));
app.use(function delay(req, res, next) {
  setTimeout(next, 1000);
});

const SIMPLE_TOKEN = "53j4kl5l34k5gdf89g08fg";

app.get('/ping', (req, res) => {
  res.send({
    message: "pong"
  });
});

function checkToken(req, res, next) {
  if (req.headers.token === SIMPLE_TOKEN) return next();
  
  res.status(401);
  
  res.send({
    message: "wrong token"
  });
}

app.get('/profile', checkToken, (req, res) => {
  res.send({
    id: "1",
    name: "John",
    role: "admin",
    ava: "/static/ava.png"
  });
});

app.post('/sign-in', (req, res) => {
  if (req.body.login !== "user@name.com" || req.body.password !== "secret123") {
    res.status(401);
    
    res.send({
      message: "wrong credentials"
    });
    
    return;
  }
  
  res.send({
    token: SIMPLE_TOKEN
  });
});

app.post('/sign-up', (req, res) => {
  res.send({
    token: SIMPLE_TOKEN
  });
});

app.post('/forgot-password', (req, res) => {
  res.send({
    message: "success"
  });
});

app.post('/reset-password', (req, res) => {
  res.send({
    message: "success"
  });
});

app.get('/dashboard', checkToken, (req, res) => {
  res.send({
    calls: [
      {type: "incoming", count: 125},
      {type: "outgoing", count: 75},
      {type: "missing", count: 25}
    ],
    goods: [
      {type: "tv", count: 20},
      {type: "laptop", count: 15},
      {type: "microwave", count: 30},
      {type: "fridge", count: 25}
    ],
    users: [
      {type: "admin", count: 1, year: "2018"},
      {type: "admin", count: 3, year: "2019"},
      {type: "admin", count: 2, year: "2020"},
      {type: "manager", count: 2, year: "2018"},
      {type: "manager", count: 4, year: "2019"},
      {type: "manager", count: 3, year: "2020"},
      {type: "operator", count: 1, year: "2018"},
      {type: "operator", count: 5, year: "2019"},
      {type: "operator", count: 2, year: "2020"},
    ]
  });
});

const users = [
  {
    name: "Jhon",
    role: 'admin',
    id: 1,
  },
  {
    name: "Tom",
    role: 'operator',
    id: 2,
  },
  {
    name: "Fred",
    role: 'user',
    id: 3,
  },
  {
    name: "Jhon",
    role: 'user',
    id: 4,
  },
  {
    name: "Tom",
    role: 'admin',
    id: 5,
  },
  {
    name: "Karl",
    role: 'user',
    id: 6,
  },
  {
    name: "Tiny",
    role: 'user',
    id: 7,
  },
  {
    name: "Sara",
    role: 'admin',
    id: 8,
  },
  {
    name: "Liza",
    role: 'user',
    id: 9,
  },
  {
    name: "Kim",
    role: 'admin',
    id: 10,
  },
  {
    name: "Jery",
    role: 'admin',
    id: 11,
  },
  {
    name: "Key",
    role: 'operator',
    id: 12,
  },
];

app.get('/users/list', checkToken, (req, res) => {
  const start = (req.query.page - 1) * 10;
  
  res.send({
    totalCount: users.length,
    list: users.slice(start, start + 10),
  });
});

app.get('/users/item/:id', checkToken, (req, res) => {
  const user = users.filter(user => +user.id === +req.params.id)[0];
  
  if (user) return res.send(user);
  
  res.status(404);
  
  res.send({
    message: "user not found"
  });
});

app.post('/users/item', checkToken, (req, res) => {
  const index = users.findIndex(user => +user.id === +req.body.id);
  
  if (index !== -1) {
    users[index] = req.body;
  
  } else {
    users.push({
      ...req.body,
      id: users[users.length - 1].id + 1
    });
  }
  
  res.send({
    message: "success"
  });
});

app.delete('/users/item/:id', checkToken, (req, res) => {
  const index = users.findIndex(user => +user.id === +req.params.id);
  
  if (index !== -1) {
    users.splice(index, 1);
    
     res.send({
      message: "success"
    });
    return
  }
  
  res.status(404);
  
  res.send({
    message: "user not found"
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));