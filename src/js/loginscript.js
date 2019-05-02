var createUserInput = function() {
  return new Promise( function( res, rej ) {
    $( 'body>div').empty();
    $( '<input type="text">' ).appendTo( 'body>div' );
    $( '<button>' )
      .html( 'Login')
      .appendTo( 'body>div' )
      .on('click', function() {
        var eingabe = $('input').val();
        if ( eingabe != '' ) {
          res( eingabe );
        } else {
          rej();
        }
      });
  });
}

var postUserName = function( username ) {
  return new Promise( function(res,rej) {
    $.ajax({
      url:'http://localhost:8888/user',
      method:'post',
      data:{u:username},
      success:res,
      error:rej
    })
  });
}



$( document ).ready( function() {

  createUserInput()
    .then( postUserName )
    .then( console.log )
    .catch( function() { $( 'input' ).addClass('error') } );

});
