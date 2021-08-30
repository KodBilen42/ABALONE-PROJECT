import requests

import board
from flask import Flask, request, render_template

app = Flask(__name__)
board = board.Board()


@app.route('/temp', methods=['GET', 'POST'])
def home():
    return render_template()

@app.route('/temp', methods=['GET', 'POST'])
def temp():
    return "hello world"

@app.route('/move', methods=['GET', 'POST'])
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