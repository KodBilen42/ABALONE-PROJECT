import websockets
import asyncio
import board


sessions = []


def find_session(session_id):
    for session in sessions:
        if str(id(session)) == session_id:
            return session
    print("session not found")
    return None


class Session:
    my_board = None

    def __init__(self):
        sessions.append(self)
        self.my_board= board.Board()
        self.my_board.initialize_board(default_board=True)
        print("new session created sessions:" + str(len(sessions)))

    def process_data(self, message = None):
        if message is None:
            return self.my_board.return_data()
        balls = []
        direction = int(message[-1])
        selected = message[:-1]
        for i in range(int(len(selected) / 2)):
            x = int(selected[i*2])
            y = int(selected[i*2 + 1])
            ball = self.my_board.find_ball_by_position([x, y])
            balls.append(ball)  
        self.my_board.move(balls, direction)
        self.my_board.display()
        return self.my_board.return_data()


async def connecter():
        uri = "ws://localhost:5500"
        async with websockets.connect(uri) as websocket:
            await websocket.send("python connected")

            greeting = await websocket.recv()
            print("server saluted us: " + greeting)

            while True:
                message = await websocket.recv()
                print("server sent us: " + message)
                if message[:15] == "session_request":
                    sess = Session()
                    session_id = str(id(sess))
                    await websocket.send("session_id"+session_id)

                elif message[:13] == "session_start":
                    session_id = message[13:]
                    new_state_data, turn_color = find_session(session_id).process_data()
                    await websocket.send("move_respond" + session_id + "," + new_state_data + "," + turn_color)

                elif message[:9] == "move_data":
                    session_id, move = message[9:].split(",")
                    new_state_data, turn_color = find_session(session_id).process_data(move)
                    await websocket.send("move_respond"+session_id+","+new_state_data+","+turn_color)

                elif message[:13] == "session_close":
                    session_id = message[13:]
                    for session in sessions:
                        if str(id(session)) == session_id:
                            sessions.remove(session)
                            print("session_removed remaining sessions "+str(len(sessions)))

asyncio.get_event_loop().run_until_complete((connecter()))
