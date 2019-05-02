/**
* S SVG Funktionssammlung
**/
var S = {};
S.create = function( tag, attr ) {
  var el = document.createElementNS( 'http://www.w3.org/2000/svg', tag );
  return $( el ).attr( attr ).appendTo( S.svg );
}
S.rect = function(x,y,w,h,bg) {
  return S.create( 'rect', { x:x, y:y, width:w, height:h, fill:bg } );
}
S.circle = function(x,y,r,bg) {
  return S.create( 'circle', { cx:x, cy:y, r:r, fill:bg  } );
}


/**
* GAME
**/
class MovingElement {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

class Ball extends MovingElement {
  constructor() {
    super();
  }
}

class Racket extends MovingElement {
  constructor() {
    super();
  }
}

class Game {
  constructor( svg ) {
    S.svg = svg;
    this.container = $(svg);
    this.racket = false;
    this.ball = false;
    this.moveRacketInterval = false;
    this.racketWidth = 150;
    this.racketSpeed = 10;
    this.ballSpeedY = -10;
    this.ballSpeedX = 0;
    this.ballIsMoving = false;
    this.ballIsSticky = false;
  }
  createRacket() {
    this.racket = S.rect(125,785,this.racketWidth,10,'#000');
    $( document ).on( 'keydown', function( e ) {
      //console.log( e.keyCode );
      switch( e.keyCode ) {
        case 100: // num pad left
        case 65: // a
        case 37: //cursor links
          console.log( 'left' );
          this.moveRacket(-this.racketSpeed);
          break;
        case 102: // num pad right
        case 68: // d
        case 39: //cursor rechts
          console.log( 'right' );
          this.moveRacket(this.racketSpeed);
          break;
        case 32: // space
          console.log( 'start' );
          this.moveBall( Math.random()*20 - 10, this.ballSpeedY );
          break;
      }
    }.bind(this));
    $( document ).on( 'keyup', function( e ) {
      this.moveRacket(0);
    }.bind(this));


  }
  moveBall( x, y ) {
    if ( y == 0 ) {
      this.ballIsMoving = false;
    } else if ( !this.ballIsMoving ) {
      this.ballIsMoving = true;
      this.moveBallPixel(x,y);
    }
  }
  moveBallPixel( x,y ) {
    var ballX = this.ball.attr('cx')*1+x;
    var ballY = this.ball.attr('cy')*1+y;
    var racketX = this.racket.attr('x')*1;

    if ( ballX < 20 || ballX > 380 ) {
      x *= -1;
    }


    if ( ballY <= 20 ) {
      ballY = 20;
      y *= -1;
    }
    if ( ballY >= 765 ) {

      if ( ballX >= racketX-20 && ballX <= racketX+170 ) {
        ballY = 765;
        if ( this.ballIsSticky ) {
          this.ballIsMoving = false;
        } else {
          y *= -1;
        }
      } else {
        this.ballIsMoving = false;
        S.rect(0,0,400,800,'rgba(255,0,0,0.8)');
      }

    }

    this.ball.attr('cx', ballX );
    this.ball.attr('cy', ballY );
    if ( this.ballIsMoving ) {
      window.requestAnimationFrame(
        this.moveBallPixel.bind(this,x,y)
      );
    }
  }


  moveRacket( x ) {
    if ( x == 0 ) {
      this.racketIsMoving = false;
    } else if ( !this.racketIsMoving ) {
      this.racketIsMoving = true;
      this.moveRacketPixel(x);
    }
  }
  moveRacketPixel( x ) {
    var racketX = this.racket.attr('x')*1 + x;
    racketX = Math.max( 0, racketX );
    racketX = Math.min( 400-this.racketWidth, racketX );

    if ( !this.ballIsMoving ) {
      var ballX = this.ball.attr('cx')*1 + x;
      ballX = Math.max( 75, ballX );
      ballX = Math.min( 325, ballX );
      this.ball.attr('cx',ballX );
    }

    if ( racketX >= 0 && racketX <= 400-this.racketWidth ) {
      this.racket.attr('x',racketX );
      if ( this.racketIsMoving ) {
        window.requestAnimationFrame(
          this.moveRacketPixel.bind(this,x)
        );
      }
    }
  }
  createBall() {
    this.ball = S.circle(200,765,20,'#ccc');
  }
}

/**
* onload
**/
$( document ).ready( function() {
  var g = new Game( '#game' );
  g.createRacket();
  g.createBall();
});
