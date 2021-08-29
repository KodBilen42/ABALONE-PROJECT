import board

my_board = board.Board()
my_board.balls = [[3, 4, "W"], [3, 5, "W"], [3, 6, "W"], [4, 4, "W"], [5, 4, "W"]]

my_board.display()

my_board.move([[3, 6, "W"], [3, 4, "W"], [3, 5, "W"]], 0)

my_board.display()
