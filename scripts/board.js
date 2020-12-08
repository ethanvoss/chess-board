const pieces = ['K','Q','R','B','N','P'];
const collumConvert = ['a','b','c','d','e','f','g','h'];
const rowConvert = ['8','7','6','5','4','3','2','1'];
const rowFlipper = ['7','6','5','4','3','2','1','0'];
const doc = document.documentElement;
class Board
{
	//---Construct---//
	constructor(initObj)
	{
		this.width = initObj.width || 400;
		this.size = initObj.size || 8;
		this.startingFen = initObj.startingFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
		const boardId = initObj.boardId || 'board';
		this.board = document.getElementById(boardId);
		this.position = [];
		this.squares = [];
		this.board.style.width = this.width + 'px';
		this.board.style.height = this.board.style.width;
		const board = this;

		//---Generates Board---///
		var color = 0;
		var squareSize = this.width / this.size;
		doc.style.setProperty('--square-size', squareSize + "px");
		var darkColor = initObj.darkColor || "#1e4a66";
		var lightColor = initObj.lightColor || "#fcfcfc";

		if(initObj.oritentation == 'black')
		{
			for(var x = this.size - 1; x >= 0; x--)
			{
				for(var y = this.size - 1; y >= 0; y--)
				{
					if(y == this.size - 1) color++;

					var backgroundColor;
					if(color % 2 == 0) backgroundColor = darkColor;
					else backgroundColor = lightColor;

					const square = document.createElement('div');

					square.setAttribute('class', 'square');
					square.style.background = backgroundColor;
					//if(x == 7) square.style.display = "inline";
					const id = y.toString() + x.toString();
					square.setAttribute('id', id);

					this.squares.push(square);
					this.board.appendChild(square);

					color++;
				}
			}
		}
		else
		{
			for(var x = 0; x < this.size; x++)
			{
				for(var y = 0; y < this.size; y++)
				{
					if(y == 0) color++;

					var backgroundColor;
					if(color % 2 == 0) backgroundColor = darkColor;
					else backgroundColor = lightColor;

					const square = document.createElement('div');

					square.setAttribute('class', 'square');
					square.style.background = backgroundColor;
					if(x == this.size - 1) square.style.display = "inline";
					const id = y.toString() + x.toString();
					square.setAttribute('id', id);

					this.squares.push(square);
					this.board.appendChild(square);

					color++;
				}
			}
		}
		

		//---Generate Postion---//
		this.startingFen = this.startingFen.split('/');
		for(var r in this.startingFen)
		{
			var row = this.startingFen[r].split('');
			var rowOut = [];
			row.forEach((lookingAt) => {
				const isPiece = pieces.some((piece) => {return piece == lookingAt.toUpperCase()});
				if(isPiece) rowOut.push(lookingAt); 
				else 
				{
					var timesToPush = parseInt(lookingAt);
					for(var i = 0; i < timesToPush; i++)
					{
						rowOut.push('0');
					}
				}
			})
			this.position.push(rowOut); //pushes last row
		}

		//---Display the pieces---//
		for(var r in this.position)
		{
			var row = this.position[r];
			for(var c in row)
			{
				var lookingAt = row[c];
				//find if lookingAt is a piece
				pieces.forEach((piece) => {
					if(lookingAt == piece) //white piece
					{
						genPiece('w', lookingAt, r, c);
					}else
					if(lookingAt.toUpperCase() == piece) //black piece
					{
						genPiece('b', lookingAt, r, c);
					}
				})

			}
		}
		//--Generates Html for the pieces--//
		function genPiece(collum, pieceIn, y, x)
		{
			var pic = collum + pieceIn.toUpperCase();
			var img = document.createElement('img');
			img.setAttribute('alt',pieceIn);
			img.setAttribute('src', 'img/pieces/' + pic + '.png');
			img.setAttribute('draggable','false');
			img.setAttribute('class', 'pieceImg');
			var piece = document.createElement('div');
			piece.setAttribute('class', 'piece');
			piece.setAttribute('id', 'piece');
			piece.appendChild(img);
			var square = document.getElementById(x+y);
			square.appendChild(piece);
			dragElement(piece, board);

		}
		
	}

	//---Move Function---//
	move(move)
	{
		//----Code for e2-e4 format----//
		var oldPos = move.split('-')[0].split('');
		var newPos = move.split('-')[1].split('');

		var x1, y1;
		for(var i in collumConvert) if(collumConvert[i] == oldPos[0]) x1 = i;
		for(var i in rowConvert) if(rowConvert[i] == oldPos[1]) y1 = i;
		var x2, y2;
		for(var i in collumConvert) if(collumConvert[i] == newPos[0]) x2 = i;
		for(var i in rowConvert) if(rowConvert[i] == newPos[1]) y2 = i;
		var oldSquare = document.getElementById(x1.toString() + y1);
		var newSquare = document.getElementById(x2.toString() + y2);
		var piece = oldSquare.childNodes[0];
		piece.remove();
		newSquare.appendChild(piece);


		//---Capture---//
		if(newSquare.childNodes.length > 1) //piece moved to square already holding a piece
		{
			var children = Array.from(newSquare.childNodes);
			var capturedPiece;
			children.forEach((heldPiece) => {
				if(heldPiece != piece) capturedPiece = heldPiece;
			});
			capturedPiece.remove();
		}
	}
}

const boardMove = new Event('boardMove');

//---Make Pieces Draggable---//

function dragElement(elmnt, board) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;
	const scale = elmnt.style.width;  
	const imgElmnt = elmnt.childNodes[0];
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

		elmnt.appendChild(imgElmnt);

		document.onmouseup = null;
		document.onmousemove = null;

	    //--Snap to square--//
	    var dist = board.width;
	    var targeted;
	    board.squares.forEach((square) => {
	    	var xy = square.getBoundingClientRect();
	    	var xy2 = elmnt.getBoundingClientRect();
	    	var d = Math.sqrt(Math.pow((xy.x - xy2.x),2) + Math.pow((xy.y - xy2.y),2));
	    	if(d < dist)
	    	{
	    		dist = d;
	    		targeted = square;	
	    	} 
	    })
	    var oldPos = elmnt.parentElement.id.split('');
	    var newPos = targeted.id.split('');

	    elmnt.remove();
	    targeted.appendChild(elmnt);
	    elmnt.style.left = targeted.style.left;
	    elmnt.style.top = targeted.style.top;

	    //---Capture---//
		if(targeted.childNodes.length > 1) //piece moved to square already holding a piece
		{
			var children = Array.from(targeted.childNodes);
			var capturedPiece;
			children.forEach((heldPiece) => {
				if(heldPiece != elmnt) capturedPiece = heldPiece;
			});
			capturedPiece.remove();
		}

	    var newX = newPos[0], newY = newPos[1], oldX = oldPos[0], oldY = oldPos[1];

	    //find move
	    var x1; for(var i in collumConvert) if(i == oldX) x1 = collumConvert[i];
	    var y1; for(var i in rowConvert) if(i == oldY) y1 = rowConvert[i];
	    var x2; for(var i in collumConvert) if(i == newX) x2 = collumConvert[i];
	    var y2; for(var i in rowConvert) if(i == newY) y2 = rowConvert[i];
	    var move = x1 + y1 + '-' + x2 + y2;

	    boardMove.move = move;
	    boardMove.oldPos = oldPos[0].toString() + oldPos[1].toString();
	    boardMove.newPos = newPos[0].toString() + newPos[1].toString();
	    document.dispatchEvent(boardMove);


	    //update position
	    board.position[newY][newX] = board.position[oldX][oldY];
	    board.position[oldY][oldX] = '0';
	}
}