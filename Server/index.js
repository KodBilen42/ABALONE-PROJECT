const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5500 })
clients = [];
wss.on("connection", ws => {
    clients.push(ws);
    console.log("a user connected");
    ws.send("welcome");
    is_python = false;
    ws.on("message", data  =>{
        data = `${data}`;
        console.log(data);

        if (data == "python-connected"){
            is_python = true
        }

        else{
            for (let i = 0; i < clients.lenght; i++){
                if (clients[i].is_python){
                    clients[i].send(data);
                    clients[i].on("message", (response)=>{
                        response = `${response}`;
                        ws.send(response);
                    })
                }
            }
        }
    })



    ws.on("close", () => {
        console.log("a user disconnected");
    } )
})