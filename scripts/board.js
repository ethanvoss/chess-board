var size = 8;
const board = document.getElementById('board');
const pieces = ['K','Q','R','B','N','P'];
const squares = [];
var position = [];

//set board div;
board.style.width = '400px';
board.style.height = board.style.width;

//-----Create Board-----//
var color = 0;
var squareSize = board.style.width.split('px')[0] / size;
for(var x = 0; x < size; x++)
{
	var row = [];
	for(var y = 0; y < size; y++)
	{
		if(y == 0) color++;
		var c = color % 2;
		if(c == 0) c = "#dbdbdb"; else c = "#3b5966";
		var square = document.createElement('div');
		square.setAttribute('class', 'square');
		square.style.background = c;
		square.style.width = squareSize + "px";
		square.style.height = squareSize + "px";
		if(x == 7) square.style.display = "inline";
		var id = y.toString() + x.toString();
		square.setAttribute('id', id);
		squares.push(square);
		board.appendChild(square);

		color++;
	}
}


//sets start position
setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');



//-----Generates Postion Array-----//
function setPosition(fenIn)
{
	fenIn = fenIn.split('/');
	for(var r in fenIn)
	{
		var row = fenIn[r].split('');
		var rowOut = [];
		for(var c in row)
		{
			//---FindPiece---//
			
			var lookingAt = row[c];
			var foundPiece = false;
			for(var z in pieces)
			{
				if(pieces[z] == lookingAt.toUpperCase())
				{
					//push piece to square
					rowOut.push(lookingAt);
					foundPiece = true;
					break;
				}			
			}
			if(!foundPiece) //push empty square
			{
				var times = parseInt(lookingAt);
				for(var i = 0; i < times; i++)
				{
					rowOut.push('0');
				}
			}
		}
		position.push(rowOut);
	}
	console.log(position);
	displayPieces();
}

//-----Display Pieces-----//
function displayPieces()
{
	for(var r in position)
	{
		var row = position[r];
		for(var c in row)
		{
			var lookingAt = row[c];
			//find if lookingAt is a piece
			for(var p in pieces)
			{
				if(lookingAt == pieces[p]) //white piece
				{
					genPiece('w', lookingAt, r, c);
				}else
				if(lookingAt.toUpperCase() == pieces[p]) //black piece
				{
					genPiece('b', lookingAt, r, c);
				}
			}

		}
	}
	function genPiece(col, p, y, x)
	{
		var pic = col + p.toUpperCase();
		var piece = document.createElement('div');
		piece.setAttribute('class', 'piece');
		piece.setAttribute('id', 'piece');
		var img = document.createElement('img');
		img.setAttribute('alt',p);
		img.setAttribute('src', 'img/pieces/' + pic + '.png');
		img.setAttribute('draggable','false');
		var square = document.getElementById(x+y);
		img.style.width = square.style.width;
		piece.appendChild(img);
		square.appendChild(piece);
		dragElement(piece);

	}
}



//---Make Pieces Draggable---//

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  var scale = elmnt.style.width;  

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
	/* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  
    //--Snap to square--//
    var dist = '0';
    var targeted;
    console.log(pos3);
    for(var s in squares)
    {
    	var xy = squares[s].getBoundingClientRect();
    	var xy2 = elmnt.getBoundingClientRect();
    	var d = Math.sqrt(Math.pow((xy.x - xy2.x),2) + Math.pow((xy.y - xy2.y),2));
    	if(dist == '0') 
		{
			dist = d; 
			targeted = squares[s];
		}
		else if(d < dist)
		{
			dist = d;
			targeted = squares[s];	
		} 
    }
    var oldPos = elmnt.parentElement.id;
    elmnt.remove();
    targeted.appendChild(elmnt);
    elmnt.style.left = targeted.style.left;
    elmnt.style.top = targeted.style.top;

    //update position
    var newPos = targeted.id;
    position[newPos.split('')[1]][newPos.split('')[0]] = position[oldPos.split('')[1]][oldPos.split('')[0]];
    position[oldPos.split('')[1]][oldPos.split('')[0]] = '0';
    console.log(position);
    
  }
}