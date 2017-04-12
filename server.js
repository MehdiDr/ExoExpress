const express = require('express');
const app= express();
const port = process.env.PORT || 5000;
const ejs = require('ejs');
const users = require('./data/users');
const projects = require('./data/projects');
const pg = require('pg');
const bodyParser = require('body-parser');
const urlDB = 'postgres://postgres:*****@localhost:5432/coucou';
const urlDB2 =  process.env.DATABASE_URL || 'postgres://postgres:*****@localhost:5432/base1';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(function(req, res, next) {
  console.log('Quelque chose se passe...');
  next();
});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('pages/homepage')
});


app.get('/users', function(req, res, next){
  const user = req.body;

  pg.connect(urlDB, function(err, client, done){
    if(err) { return next(err); }
    client.query('SELECT * FROM person', function(err, result){
      done()
      if(err){ return next(err) }
      // res.send(JSON.stringify(result.rows))
      res.render('pages/users', {
        users : result.rows
      });
    });
  });
  // res.render('pages/users', {
  //   users:users
  // });
});

app.post('/addUsers',function(req, res){
  const users = {firstname: req.body.firstname, lastname : req.body.lastname, age : req.body.age};
  console.log(users);

  pg.connect(urlDB2, function(err, client, done){
    client.query('INSERT INTO users(firstname, lastname, age) VALUES ($1, $2, $3);', [users.firstname, users.lastname, users.age], function(err, result){
      done();
      res.send('Welcome to the family');
    });
  });
})

app.get('/addUsers', function(req, res){
  res.render('pages/addUsers');
})


// méthode find à la place de if
app.get('/users/:id', function(req, res){
  let usersId = users.find(function(item){
    return item.id === Number(req.params.id);
    })
    if(usersId) {
      res.render('pages/soloUser', {
        users:users,
        id:req.params.id,
        githubUrl: projects.githubUrl
      });
    }
    else{
      res.send('error');
    }
});

app.get('/projects', function(req, res){
  res.render('pages/projects', {
    projects:projects
  });
});

app.get('/projects/:id', function(req, res){
  res.render('pages/soloProject', {
    projects: projects,
    id: req.params.id
  });
});

app.get('/users/:userId/projects', function(req, res){
  let userId = projects.filter(function(item){
    return item.userId === Number(req.params.userId)
  })
  if(userId) {
    res.render('pages/userProject', {
      projects: projects,
      userId: req.params.userId
    });
  }
  else{
    res.send('page non trouvée mf !!')
  }
})

app.get('*', function(req, res){
  res.status(404).send('vous vous êtes trompés de page, vous êtes nuls');
})

app.listen(port);
console.log('port 5000');
