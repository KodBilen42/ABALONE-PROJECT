import websockets
import asyncio
import board

board = board.Board()

async def connecter():
    uri = "ws://localhost:5500"
    async with websockets.connect(uri) as websocket:
        await websocket.send("python connected")

        message = await websocket.recv()
        print(message)

asyncio.get_event_loop().run_until_complete(connecter())
asyncio.get_event_loop().run_forever()

"""
def move():
    command = request.form.get("command")
    data_selected = request.form.("data_selected")

    print(command)
    print(data_selected)
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
    return data_pack

app.run(host='127.0.0.1', port=5000)
app.run()
"""