class AjaxHandlerView(View):
    def get(self, request):
        if request.is_ajax():
            vector= request.GET.getlist('array[]')
            level= request.GET.get('difficulty_level')
            player_marker= request.GET.get('player_marker')
            opponent_marker= request.GET.get('opponent_marker')


            if player_marker=='1':
                player = 'x'
                opponent= 'circle'
            else:
                player= 'circle'
                opponent= 'x'


            def onetotwod(arr):
                board=[[0 for x in range(3)] for y in range(3)]
                k=0
                for i in range(3):
                    for j in range(3):
                        board[i][j]=arr[k]
                        k=k+1
                return board

            def twotooned(row,col):
                index= col+3*row
                return index


            def isMovesLeft(board):
	            for x in range(3):
		            for y in range(3):
			            if board[x][y] == 'blank':
				            return True
	            return False


            def evaluate(b, player, opponent):

                # Checking for Rows for X or O victory.
                for row in range(0, 3):

                    if b[row][0] == b[row][1] and b[row][1] == b[row][2]:

                        if b[row][0] == player:
                            return 10
                        elif b[row][0] == opponent:
                            return -10

                # Checking for Columns for X or O victory.
                for col in range(0, 3):

                    if b[0][col] == b[1][col] and b[1][col] == b[2][col]:

                        if b[0][col]==player:
                            return 10
                        elif b[0][col] == opponent:
                            return -10

                # Checking for Diagonals for X or O victory.
                if b[0][0] == b[1][1] and b[1][1] == b[2][2]:

                    if b[0][0] == player:
                        return 10
                    elif b[0][0] == opponent:
                        return -10

                if b[0][2] == b[1][1] and b[1][1] == b[2][0]:

                    if b[0][2] == player:
                        return 10
                    elif b[0][2] == opponent:
                        return -10

                # Else if none of them have won then return 0
                return 0



            def minimax(board, depth, isMax, player, opponent):

	            score = evaluate(board,player,opponent)
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
				            if board[x][y] == 'blank':
					            board[x][y] = player
					            best = max( best, minimax(board, depth+1, not isMax, player, opponent) )
					            board[x][y] = 'blank'

		            return best

	            else:
		            best = 1000

		            for x in range(3):
			            for y in range(3):
				            if board[x][y] == 'blank':
					            board[x][y] = opponent
					            best = min( best,  minimax(board, depth+1, not isMax, player, opponent) )
					            board[x][y] = 'blank'

		            return best



            def findBestMove(arr, player, opponent):
                board= onetotwod(arr)

                bestVal = -1000
                row = -1
                col = -1
                for x in range(3):
                    for y in range(3):
                        if board[x][y] == 'blank':
                            board[x][y] = player
                            moveVal = minimax(board, 0, False, player, opponent)
                            board[x][y] = 'blank'

                        # print("starting if condition")
                            if moveVal > bestVal:
                                row = x
                                col = y
                                bestVal = moveVal

                return twotooned(row,col)


            aiMove=findBestMove(vector, player, opponent)

            return JsonResponse({'result': aiMove}, status=200)

        return render(request, "index.html")
