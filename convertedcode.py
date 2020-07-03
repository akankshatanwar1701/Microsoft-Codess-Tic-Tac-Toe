
import numpy as np


player = 'x'
opponent = 'circle'

def onetotwod(arr):
	x=np.array(arr)
	board = np.reshape(x, (-1, 3))
	return board


def twotooned(board):
	arr=board.flatten()
	return arr


def isMovesLeft(board):
	for x in range(3):
		for y in range(3):
			if board[x][y] == 'blank':
				return True
	return False


def evaluate(b):  
   
    # Checking for Rows for X or O victory.  
    for row in range(0, 3):  
       
        if b[row][0] == b[row][1] and b[row][1] == b[row][2]:  
           
            if b[row][0] == 'x': 
                return 10 
            elif b[row][0] == 'circle':  
                return -10 
  
    # Checking for Columns for X or O victory.  
    for col in range(0, 3):  
       
        if b[0][col] == b[1][col] and b[1][col] == b[2][col]:  
           
            if b[0][col]=='x': 
                return 10 
            elif b[0][col] == 'circle':  
                return -10 
  
    # Checking for Diagonals for X or O victory.  
    if b[0][0] == b[1][1] and b[1][1] == b[2][2]:  
       
        if b[0][0] == 'x':  
            return 10 
        elif b[0][0] == 'circle':  
            return -10 
       
    if b[0][2] == b[1][1] and b[1][1] == b[2][0]:  
       
        if b[0][2] == 'x':  
            return 10 
        elif b[0][2] == 'circle':  
            return -10 
       
    # Else if none of them have won then return 0  
    return 0 



def minimax(board, depth, isMax):

	score = evaluate(board)
	#if maximiser won the game return it's score

	if score == 10:
		return score

	#If Minimizer has won the game return his/her evaluated score

	if score == -10:
		return score

	#If there are no more moves and no winner then it is a tie

	if isMovesLeft(board) == False:
		return 0

	#If this maximizer's move

	if isMax:
		best = -1000

		#traverse all cell
		for x in range(3):
			for y in range(3):
				if board[x][y] = 'blank':
					board[x][y] = player
					best = max( best, minimax(board, depth+1, !isMax) )
					board[x][y] = 'blank'

		return best

	else:
		best = 1000

		for x in range(3):
			for y in range(3):
				if board[x][y] == 'blank':
					board[x][y] = opponent
					best = min( best,  minimax(board, depth+1, !isMax) )
					board[x][y] = 'blank'

		return best


def findBestMove(board):
	bestVal = -1000
	row = -1
	col = -1

	for x in range(3):
		for y in range(3):
			if board[x][y] == 'blank':
				board[x][y] = player
				moveVal = minimax(board, 0, false)
				board[x][y] = 'blank'

				if moveVal > bestVal:
					row = x
					col = y
					bestVal = moveVal

	return row, col





