//===========================
//	Learned bot
//===========================
jQuery(document).ready(jQuery(function($) {
    var randomChoice = function(l) {
	var ind = (Math.floor(Math.random() * l.length));
	return l[ind];
    };

    var best = function(l, r, s) {
	if (l > r && l > s) {
	    return 'left';
	} else if (r > l && r > s) {
	    return 'right';
	} else if (s > l && s > r) {
	    return 'stay';
	} else if (l === r && r === s) {
	    return randomChoice(['left', 'right','stay']);
	} else if (l === r) {
	    return randomChoice(['left', 'right']);
	} else if (r === s) {
	    return randomChoice(['right', 'stay']);
	} else {
	    return randomChoice(['left', 'stay']);
	}
    };
    
    var learnedBotMaker = function(table) {
	var left = 0;
	var right = 1;
	var stay = 2;
	return {
            initialize: function(game, cfg) {
		this.game = game;
		this.cfg = cfg;
	    },

	    hit: function() {
		;
	    },

	    loseBall: function() {
		;
	    },

	    winLevel: function() {
		;
	    },

	    update: function() {
		if(this.game.ball.moving) {
		    this.move();
		}
	    },

	    move: function() {
		var paddleX = this.game.paddle.getX();
		var ballX = this.game.ball.getX();
		var ballY = this.game.ball.getY();
		var ballV = this.game.ball.getVelocity();
		var gameObj = this.game;

                if (ballX < 0 || ballY < 0 || ballV < 0) {
                    return
                }
                
		var leftVal  = this.indexTable(paddleX, ballX, ballY, ballV, 0);
		var rightVal = this.indexTable(paddleX, ballX, ballY, ballV, 1);
		var stayVal  = this.indexTable(paddleX, ballX, ballY, ballV, 2);

		var move = best(leftVal, rightVal, stayVal);

		if(move == 'right'){
                    gameObj.paddle.stopMovingLeft();
                    gameObj.paddle.moveRight();
                }
                else if (move == 'stay'){
                    gameObj.paddle.stopMovingLeft();
                    gameObj.paddle.stopMovingRight();
                }
                else if (move == 'left'){
                    gameObj.paddle.stopMovingRight();
                    gameObj.paddle.moveLeft();
		}
	    },


	    indexTable: function(paddleX, ballX, ballY, ballV, action) {
		return table[action][paddleX][ballX][ballY][ballV];
	    }
	}
    };

    Breakout2.bot = Breakout2.bot || {};
    Breakout2.bot['long_learned'] = learnedBotMaker(long_table);
}));