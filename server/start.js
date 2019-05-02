var fs = require( 'fs' );
var cp = require( 'child_process' );

var serverFile = 'login.js';

var server = cp.fork( serverFile );
console.log( 'Server gestartet.' );

fs.watchFile( serverFile, function() {
  server.kill();
  console.log( 'Server beendet.' );

  server = cp.fork( serverFile );
  console.log( 'Server gestartet.' );
});
