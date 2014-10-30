// 存储二维数组
var board = new Array();
var scroe = 0;
var hasConflicted = new Array();

$(function() {
	newgame();
});

function newgame () {
	// 初始化棋盘格
	init();
	// 随机生成两个数字（2或4）
	generateOneNumber();
	generateOneNumber();
}

function init () {
	for (var i = 0; i <4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css({
				"top": getPosTop(i,j),
				"left": getPosLeft(i,j)
			});
		};
	};
	for (var i = 0; i < 4; i++) {
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			hasConflicted[i][j] = false;
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
		};
	};

	updateBoardView();

	score = 0;
}
// 遍历所有numberCell并根据board[i][j]的值更新显示样式
function updateBoardView () {
	$(".number-cell").remove();	
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var numCell = $("#number-cell-"+i+"-"+j);
			if(board[i][j]==0){
				numCell.css({
					'width': '0',
					'height': '0',
					'top':getPosTop(i,j)+50,
					'left':getPosLeft(i,j)+50
				});
			}else{
				numCell.css({
					'width': '100px',
					'height': '100px',
					'top':getPosTop(i,j),
					'left':getPosLeft(i,j),
					'background-color':getNumberBackgroundColor(board[i][j]),
					'color':getNumberColor(board[i][j])
				});
				numCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		};
	};
}

function generateOneNumber () {
	if(nospace(board)){
		return false;
	}
	// 生成随机位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	// 优化生成随机位置的速度
	var times = 0;
	while(times <= 50){
		if(board[randx][randy]==0) break;
		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));
		++times;
	}
	if(times=50){
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if(board[i][j]==0){
					randx = i;
					randy = j;
				}
			};
		};
	}
	// 生成随机数（以50%的概率生成2或4）
	var randNum = Math.random()<0.5?2:4;
	// 显示
	board[randx][randy]=randNum;
	showNumberWithAnimation(randx,randy,randNum);
	return true;
}

$(document).keydown(function(event) {
	switch(event.keyCode){
		case 37:
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			};
			break;
		case 38:
			// 去除有滚动条时的默认操作
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			};
			break;
		case 39:
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			};
			break;
		case 40:
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			};
			break;
		default: break;
	}
});

function isgameover () {
	if (nospace(board)&&nomove(board)){
		gameover();
	}
}

function gameover (argument) {
	alert("GAME OVER!");
}

// 先判断能否移动，再操作
function moveLeft () {
	if(!canMoveLeft(board)){
		return false;
	}
// move
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if(board[i][j]!=0){
				for (var k = 0; k < j; k++) {
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						hasConflicted[i][k]=true;
						score += board[i][k];
						updateScore(score);
						continue;
					}
				};
			}	
		};
	};
	setTimeout('updateBoardView()',200);
	return true;
}

function moveUp () {
	if(!canMoveUp(board)){
		return false;
	}
// move
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if(board[i][j]!=0){
				for (var k = 0; k < i; k++) {
					if(board[k][j]==0&&noBlockVertical(k,j,i,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(k,j,i,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						hasConflicted[k][j]=true;
						score += board[k][j];
						updateScore(score);
						continue;
					}
				};
			}	
		};
	};
	setTimeout('updateBoardView()',200);
	return true;
}

function moveRight () {
	if(!canMoveRight(board)){
		return false;
	}
// move
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >=0 ; j--) {
			if(board[i][j]!=0){
				for (var k = 3; k > j; k--) {
					if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						hasConflicted[i][k]=true;
						score += board[i][k];
						updateScore(score);
						continue;
					}
				};
			}	
		};
	};
	setTimeout('updateBoardView()',200);
	return true;
}

function moveDown () {
	if(!canMoveDown(board)){
		return false;
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if(board[i][j]!=0){
				for (var k = 3; k > i; k--) {
					if(board[k][j]==0&&noBlockVertical(i,j,k,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][j]==board[k][j]&&noBlockVertical(i,j,k,board)&&!hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						hasConflicted[k][j]=true;
						score += board[k][j];
						updateScore(score);
						continue;
					}
				};
			}	
		};
	};
	setTimeout('updateBoardView()',200);
	return true;
}