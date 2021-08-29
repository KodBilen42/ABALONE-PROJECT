import board

print("type help to see all commands")
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
        print("select xyc")
        print("  x-> x index position of the piece you want to move (int)")
        print("  x-> y index position of the piece you want to move (int)")
        print('  c-> color info for your piece "W" for white, "R" for red (str')
        print("")
        print("  select a piece you want to move")
        print("  you can run as many select command as you need")
        print("  you can only select one piece with one command")
        print("")
        print("")
        print("unselect xyc")
        print("  x-> x index position of the piece you want to move (int)")
        print("  y-> y index position of the piece you want to move (int)")
        print('  c-> color info for your piece "W" for white, "R" for red (str)')
        print("")
        print("  unselect a piece that you selected previusly")
        print("  you can run as many unselect commands as you need")
        print("  you can only unselect one piece with one command")
        print("")
        print("")
        print("move d")
        print("  d-> direction index (int)")
        print("  direction indexes are as follows:")
        print("   0 1")
        print("  2 x 3")
        print("   4 5")
        print("")
        print("  move selected peice(s)")

    else:
        print("invalid command")
