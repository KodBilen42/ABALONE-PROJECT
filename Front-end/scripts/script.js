//const host = "localhost";
const host = "abalone.aristhat.duckdns.org";
let ws = new WebSocket(`wss://${host}:3`);

const username = localStorage.getItem("username") || "Anonymous";
let game = new Board();
let selected = [];
let swapped = false;
let state = "";

function connect() {
  ws = new WebSocket(`wss://${host}:3`);
  ws.addEventListener("open", () => {
    modal.style.display = "none";
    ws.send("session_request");
    ws.send(
      `benim adım ${username} soyadım ilhan 19 yaşındayım yakılışlıyım taliplerimi bekliyorum`
    );
  });
  ws.addEventListener("message", ({ data }) => {
    console.log(`server sent us ${data}`);

    if (data.slice(0, 4) == "data") {
      new_state = data.slice(4, data.length);
      console.log(`new state:${new_state}`);
      state = new_state;
      render();
    } else if (data.slice(0, 5) == "white") {
      swapped = false;
    } else if (data.slice(0, 3) == "red") {
      swapped = true;
    } else if (data.slice(0, 14) == "session_closed") {
      render_empty();
      ws.send("session_request");
    }
  });
}
connect();

// if websocket connection drops shows modal and tries to reconnect
const modal = document.getElementById("reconnectModal");
function isOpen() {
  if (ws.readyState == 3) {
    connect();
    modal.style.display = "block";
  }
}
setInterval(() => isOpen(), 1000);

// read move command and send a move_requets to server
function read_command() {
  let command = document.getElementById("text").value;
  if (swapped) {
    command_changer = "452301";
    command = command_changer[parseInt(command)];
  }

  let data_selected = [];
  for (let i = 0; i < selected.length; i++) {
    selected_id = selected[i].id;
    if (swapped) {
      selected_id = selected_id[0] + (8 - parseInt(selected_id[1])).toString();
    }
    data_selected.push(selected_id);
  }

  console.log(data_selected);
  console.log(command);

  command_string = command.toString();
  data_selected_string = "";
  for (let i = 0; i < data_selected.length; i++) {
    data_selected_string += data_selected[i].toString();
  }
  data = data_selected_string + command_string;
  ws.send(`move_request${data}`);
  selected = [];
}

function render_empty() {
  all_elements = document.getElementsByTagName("button");
  for (let i = 0; i < all_elements.length; i++) {
    all_elements[i].className = "circle grey";
  }
}

// Give the appropriate classes to the buttons according to server state data
function render() {
  render_empty();
  for (let i = 0; i < state.length / 3; i++) {
    id = state[i * 3] + state[i * 3 + 1];
    if (swapped) id = id[0] + (8 - parseInt(id[1])).toString();
    color = state[i * 3 + 2];

    element = document.getElementById(id);
    if (color == "W") element.className = "circle white";
    if (color == "R") element.className = "circle red";
  }
}

function rotate_board() {
  all_elements = document.getElementsByTagName("button");
  for (let i = 0; i < all_elements.length; i++) {
    new_id =
      all_elements[i].id[0] + (8 - parseInt(all_elements[i].id[1])).toString();
    all_elements[i].id = new_id;
  }
}

//selected function
function select(element) {
  if (selected.includes(element)) {
    selected.splice(selected.indexOf(element), 1);
    element.className = element.className.replace(" selected_red", "");
    element.className = element.className.replace(" selected_white", "");
    console.log(element.id + " removed");
  } else {
    
    if (element.className.includes("red")){
       element.className += " selected_red";
       selected.push(element);
    }
    else if (element.className.includes("white")){
      element.className += " selected_white";
      selected.push(element);
    }
    console.log(element.id + " added");
  }
  console.log(selected);
}
//hover function
function hover(element) {
}

//hover_end function
function hover_end(element) {
}

