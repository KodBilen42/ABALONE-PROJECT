import websockets
import asyncio
import board

my_board = board.Board()
my_board.initialize_board(default_board=True)
my_board.display()
def process_data(message):
    balls = []
    direction = int(message[-1])
    selected = message[:-1]
    for i in range(int(len(selected) / 2)):
        x = int(selected[i*2])
        y = int(selected[i*2 + 1])
        ball = my_board.find_ball_by_position([x, y])
        balls.append(ball)
    my_board.move(balls, direction)
    my_board.display()
    return my_board.return_data()

async def connecter():
        uri = "ws://localhost:5500"
        async with websockets.connect(uri) as websocket:
            await websocket.send("python connected")

            greeting = message = await websocket.recv()
            print("server saluted us: " + greeting)

            while True:
                message = await websocket.recv()
                print("server sent us: " + message)
                new_state_data = process_data(message)
                await websocket.send(new_state_data)
asyncio.get_event_loop().run_until_complete((connecter()))
