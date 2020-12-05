Chess board for websites

include the script and css in your html, create a div with id 'board' and use
var {boardname} = new Board({width}, {starting fen}, {size});

use eventlistener 'boardMove' for when the board is interacted with.
the event contains .move, .oldpos, and .newpos.
use boardname.move({move}) to make a move.