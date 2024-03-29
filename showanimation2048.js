function showNumberWithAnimation (i,j,randNum) {
	var numCell = $("#number-cell-"+i+"-"+j);
	numCell.css({
		'background-color': getNumberBackgroundColor(randNum),
		'color': getNumberColor(randNum)
	});
	numCell.text(randNum);
	numCell.animate({'width':cellSideLength+'px', 'height':cellSideLength+'px','top':getPosTop(i,j),'left':getPosLeft(i,j)}, 100);
}

function showMoveAnimation (fromx,fromy,tox,toy) {
	var numCell = $("#number-cell-"+fromx+"-"+fromy);
	numCell.animate({'top':getPosTop(tox,toy),
	 				 'left': getPosLeft(tox,toy)}, 200);
}

function scoreAnimate (addNum) {
	var $addScore =  $('#addScore');
	$addScore.text("+"+addNum);
	$addScore.animate({'top': '-50%','display':'none'}, 600,function(){
		$(this).text('');
	});
	$addScore.animate({'top': '50%','display':'block'}, 10);
}