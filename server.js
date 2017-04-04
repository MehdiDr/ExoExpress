const express = require('express');
const app= express();
const port = process.env.PORT || 5000;
const ejs = require('ejs');
const users = [
  {id: 0, firstName: 'Michel'},
  {id: 1, firstName: 'Osman'},
  {id: 2, firstName: 'Tandi'},
  {id: 3, firstName: 'Daniel'},
  {id: 4, firstName: 'Faustino'},
  {id: 5, firstName: 'Ijacques'}
  ];

html = ejs.render('<%= users.join(", "); %>', {users: users});

const router = express.Router();

app.use('/', router);
app.set('view engine', 'ejs');

router.use(function(req, res, next) {
  console.log('Quelque chose se passe...');
  next();
});

router.route('/')
  .get(function(req, res) {
    res.setHeader('Content-Type', 'text-plain');
    res.end('Homepage');
  })

app.get('/users', function(req, res){
  res.render('pages/index', {
    users:users
  });
});
app.get('/users/:id', function(req, res){
  res.render('pages/soloUser', {
    users:users,
    id:req.params.id
  });
});

  // router.route('/users')
  //   .get(function(req, res) {
  //     res.setHeader('Content-Type', 'text-plain');
  //     res.end("la liste d'utilisateurs est : " + users.map( function(item){
  //       return item.firstName;
  //     }));
  //   });

// router.route('/users')
//   .get(function(req, res) {
//     res.setHeader('Content-Type', 'text-plain');
//     res.end(html);
//   });


// router.route('/users/:id')
//   .get(function(req, res){
//     res.setHeader('Content-type', 'text-plain');
//     res.end("le nom de l'utilisateur est : " + users[req.params.id].firstName);
//   });

app.listen(port);
console.log('port 5000');
