import board
import sys
command = sys.argv[0]
data_selected = sys.argv[1]

#begin
board = board.Board()

selected = []
for data in data_selected:
    position = [int(data[0]), int(data[1])]
    selected.append(board.find_ball_by_position(position))

direction = int(command)
move_data = board.move(selected, direction)
selection = []
if len(move_data) == 2:
    red, white = move_data
    if red == 6 or white == 6:
        is_finished = True
        print("Game Over")
    print("red:", red, "white:", white)

data_pack = board.return_data()
#end

print(data_pack)
sys.stdout.flush()

