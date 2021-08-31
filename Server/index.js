const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5500 });
clients = [];
python_client = null;
wss.on("connection", ws => {
    clients.push(ws);
    console.log("a user connected");
    ws.send("welcome");
    ws.on("message", data  =>{
        data = `${data}`;
        console.log(`a client sent us: ${data}`);

        if (data == "python connected"){
            console.log("client identified as python_client");
            python_client = ws;
            clients.pop(ws);
        }

        else if (python_client != null && ws != python_client){
            console.log("sending message to python_client");
            python_client.send(data);
        }

        else if (ws == python_client){
            for (let i = 0; i < clients.length; i++){
                console.log(`sending new state data to all clients (length:${clients.length})`);
                clients[i].send(data);
            }
        }
    })



    ws.on("close", () => {
        clients.pop(ws);
        console.log("a user disconnected");
    } )
})