const pieces = ['K','Q','R','B','N','P'];
const cConvert = ['a','b','c','d','e','f','g','h'];
const rConvert = ['8','7','6','5','4','3','2','1'];
var b;
class Board
{
	//---Construct---//
	constructor(width, startingFen, size)
	{
		this.width = width || 400;
		this.size = size || 8;
		this.startingFen = startingFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
		this.board = document.getElementById('board');
		this.position = [];
		this.squares = [];
		this.board.style.width = this.width + 'px';
		this.board.style.height = this.board.style.width;
		b = this;
		//---Generates Board---///
		
		var color = 0;
		var squareSize = this.width / this.size;
		for(var x = 0; x < this.size; x++)
		{
			var row = [];
			for(var y = 0; y < this.size; y++)
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
				this.squares.push(square);
				this.board.appendChild(square);

				color++;
			}
		}

		//---Generate Postion---//
		this.startingFen = this.startingFen.split('/');
		for(var r in this.startingFen)
		{
			var row = this.startingFen[r].split('');
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
			this.position.push(rowOut);
		}

		//---Display the pieces---//
		for(var r in this.position)
		{
			var row = this.position[r];
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
		//--Generates Html for the pieces--//
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

	move(move)
	{
		//----Code for e2-e4 format----//
		var pos = move.split('-');
		var x1, y1;
		for(var i in cConvert) if(cConvert[i] == pos[0].split('')[0]) x1 = i;
		for(var i in rConvert) if(rConvert[i] == pos[0].split('')[1]) y1 = i;
		var x2, y2;
		for(var i in cConvert) if(cConvert[i] == pos[1].split('')[0]) x2 = i;
		for(var i in rConvert) if(rConvert[i] == pos[1].split('')[1]) y2 = i;
		var oldSquare = document.getElementById(x1.toString() + y1);
		var newSquare = document.getElementById(x2.toString() + y2);
		var piece = oldSquare.childNodes[0];
		piece.remove();
		newSquare.appendChild(piece);
	}


}

const boardMove = new Event('boardMove');

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
	/* stop moving when mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
  
    //--Snap to square--//
    var dist = '0';
    var targeted;
    for(var s in b.squares)
    {
    	var xy = b.squares[s].getBoundingClientRect();
    	var xy2 = elmnt.getBoundingClientRect();
    	var d = Math.sqrt(Math.pow((xy.x - xy2.x),2) + Math.pow((xy.y - xy2.y),2));
    	if(dist == '0') 
		{
			dist = d; 
			targeted = b.squares[s];
		}
		else if(d < dist)
		{
			dist = d;
			targeted = b.squares[s];	
		} 
    }


    var oldPos = elmnt.parentElement.id;
    var newPos = targeted.id;
    elmnt.remove();
    targeted.appendChild(elmnt);
    elmnt.style.left = targeted.style.left;
    elmnt.style.top = targeted.style.top;

    //find move
    var x1; for(var i in cConvert) if(i == oldPos.split('')[0]) x1 = cConvert[i];
    var y1; for(var i in rConvert) if(i == oldPos.split('')[1]) y1 = rConvert[i];
    var x2; for(var i in cConvert) if(i == newPos.split('')[0]) x2 = cConvert[i];
    var y2; for(var i in rConvert) if(i == newPos.split('')[1]) y2 = rConvert[i];
    var move = x1 + y1 + '-' + x2 + y2;

	boardMove.move = move;
	boardMove.oldPos = oldPos;
	boardMove.newPos = newPos;
    document.dispatchEvent(boardMove);
    //update position
    b.position[newPos.split('')[1]][newPos.split('')[0]] = b.position[oldPos.split('')[1]][oldPos.split('')[0]];
    b.position[oldPos.split('')[1]][oldPos.split('')[0]] = '0';
  }
}

