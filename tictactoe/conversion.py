#Django sends 1-D array with 9 elements, which is to be converted into a 2-D board
def onetotwod(arr,n):
	board=[[0 for x in range(n)] for y in range(n)]
	k=0
	for i in range(n):
		for j in range(n):
			board[i][j]=arr[k]
			k=k+1
	return board

#sending one single index number back as the bestmove 
#given i,j we can know which block is represented by them in 1-D array
# 0,0 being 0.......2,2 being 8th block
def twotooned(row,col,n):
	index= col+n*row
	return index
