import board


board = board.Board()
board.initialize_board(default_board=True, show_indexes=True)
board.display()
selection = []
while True:
    command = input()
    if command[:6] == "select":
        data = command[-3:]
        x = int(data[0])
        y = int(data[1])
        color = data[2]
        selection.append([x, y, color])
        print("ball selected")

    elif command[:8] == "unselect":
        data = command[-3:]
        x = int(data[0])
        y = int(data[1])
        color = data[2]
        if [x, y, color] in selection:
            selection.remove([x, y, color])
            print("ball unselected")
        else:
            print("wall wasn't selected")

    elif command[:4] == "move":
        direction = int(command[-1])
        board.move(selection, direction)
        selection = []
        board.display()

    elif command == "help":
        pass

    else:
        print("invalid command")
