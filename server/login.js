var express = require( 'express' );
var loki = require( 'lokijs' );
var app = express();
var fs = require( 'fs' );
var server = app.listen(8888,function(){
  console.log( 'Express on 8888: OK' );
});
var bp = require( 'body-parser' );

app.use( bp.urlencoded({extended:true} ) );

/* var db = new loki('./user2.json');
var user = db.addCollection('user');
//user.insert({name:'Alex'});

console.log( user.get(1) );*/

var loadUser = function() {
  return new Promise( function(res,rej) {
    fs.readFile( 'user.json', function(err,data) {
      if ( err ) rej();
      res(JSON.parse(data));
    });
  });
}

var saveUser = function( user ) {
  return new Promise( function(res,rej) {
    fs.writeFile(
      'user.json',
      JSON.stringify(user),
      function(err,data) {
        if ( err ) rej();
        else res();
      }
    );
  });
}

var findUser = function( user, username ) {
  return new Promise( function(res, rej ) {
    for ( let i in user.user ) {
      if ( user.user[i].name == username ) {
        res();
      }
    }
    rej( user );
  });
}

app.use( function( request, response, next) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, DELETE, POST, PUT' );
  response.setHeader( 'Content-Type', 'application/json' );
  next();
});

app.post( '/user', function(req,res) {
  var username = req.body.u; // POST Daten
  console.log( username );
  loadUser()
    .then( function( user ) {
      return findUser( user, username );
    })
    .then( function() {
      res.end( 'OK' );
    })
    .catch( function( user ) {
      user.user.push({name:username});
      saveUser( user )
        .then( function() {
          res.end( 'User angelegt' );
        })

    })


});
