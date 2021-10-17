const b = require("./board")
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5500 });
clients = [];
sessions = [];
session_requesters = []
turn_color = null;

class game_Session{
    my_board = new b.Board()
    constructor() {
        this.my_board.initialize_board()
    }

    process_data(message = ""){
        if (message == null)
            return this.my_board.return_data()
        let balls = [];
        let direction = parseInt(message[message.length - 1])
        let selected = message.slice(0, message.length - 1)
        for (let i = 0; i < parseInt(selected.length / 2.0); i++){
            let x = parseInt(selected[i*2])
            let y = parseInt(selected[i*2 + 1])
            let ball = this.my_board.find_ball_by_position([x, y])
            balls.push(ball)
        }
        console.log(balls)
        this.my_board.move(balls, direction)
        this.my_board.display()
        return this.my_board.return_data()
    }
}

wss.on("connection", function connection(ws, req){
    const client_ip = req.socket.remoteAddress;
    clients.push(ws);
    console.log(`a user connected ip:${client_ip}`);
    ws.send("welcome");

    ws.on("message", data  =>{
        data = `${data}`;
        console.log(`a client sent us: ${data}`);


        if(data === "session_request"){ // session request from browser
            found_session = false
            for(let i = 0; i < sessions.length; i++){
                if (sessions[i].length === 2){
                    sessions[i].push(ws)

                    let [new_state_data, turncolor] = sessions[i][0].process_data()
                    console.log("a session started")
                    sessions[i][1].send("red")
                    sessions[i][2].send("white")
                    console.log(`sending new state data to all clients (length:${sessions[i].length})`);
                    for (let j = 1; j < sessions[i].length; j++){
                        sessions[i][j].send(new_state_data);
                    }
                    turn_color = turncolor
                    found_session = true
                }
            }
            if (found_session === false){
                 let sess = new game_Session()
                sessions.push([sess, ws]) // save session id
                console.log(`new session created (total sessions:${sessions.length})`)
            }
        }
        
        else if (data.slice(0,12) === "move_request"){ //move information from browser
            move_data = data.slice(12, data.length);
            color_check = false;
            let session = null;
            let session_index = null
            turn_check = false;
            for (let i = 0; i < sessions.length; i++){
                if (sessions[i].includes(ws)){
                    session = sessions[i][0];
                    session_index = i
                    index = sessions[i].indexOf(ws)
                    if ((turn_color === "W" && index === 2) || (turn_color === "R" && index === 1))
                        turn_check = true;
                }
            }
            if (turn_check){
                let [new_state_data, turncolor] = session.process_data(move_data)
                console.log(`sending new state data to all clients (length:${sessions[session_index].length})`);
                for (let j = 1; j < sessions[session_index].length; j++){
                    sessions[session_index][j].send(`${new_state_data},${turncolor}`);
                    turn_color = turncolor
                }
            }
        }
    });
    ws.on("close", () => {
        clients.splice(clients.indexOf(ws));
        for (let i = 0; i < sessions.length; i++){
            if (sessions[i].includes(ws)){
                console.log("informing every client that session is closed")
                for (let j = 1; j < sessions[i].length; j++){
                    sessions[i][j].send(`session_closed`);
                }
                sessions.splice(sessions.indexOf(sessions[i]), 1)
            }
        }
        console.log("a user disconnected");
    } )
})