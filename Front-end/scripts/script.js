const host = () => {
  let server = localStorage.getItem("server") || "ulas";
  if (server == "ulas") {
    return "wss://abalone.aristhat.duckdns.org:3";
  } else {
    return "ws://localhost:3";
  }
};

let ws = new WebSocket(host());

const username = localStorage.getItem("username") || "Anonymous";
let game = new Board();
let selected = [];
let swapped = false; // false mean white, true mean red
let state = "";

function connect() {
  ws = new WebSocket(host());
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
      game.initialize_board(state)
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
  move_request(document.getElementById("text").value);
}

function move_request(direction){
  if (swapped) {
    command_changer = "452301";
    direction = command_changer[parseInt(direction)];
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
  console.log(direction);

  command_string = direction.toString();
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
  if(selected.length != 0){
    if(element.className.includes("grey")
    || (element.className.includes("red") && !swapped)
    || (element.className.includes("white") && swapped)){
      console.log("move")
      let surrounding_positons = calculate_surrounding_positons()
      if (surrounding_positons !== null){
        for(let i = 0; i < surrounding_positons.length; i++){
          let direction = surrounding_positons[i]
          for(let j = 0; j < direction.length; j++){
            let position = direction[j]
            if(position != null){
              if(position[0].toString() + position[1].toString() == element.id){
                console.log("request")
                move_request(i)
              }
            }
          }
        }
      }
    }
  }
  
  if (selected.includes(element)) {
    selected.splice(selected.indexOf(element), 1);
    element.className = element.className.replace(" selected_red", "");
    element.className = element.className.replace(" selected_white", "");
    console.log(element.id + " removed");
  } else {
    if (element.className.includes("red")) {
      element.className += " selected_red";
      selected.push(element);
      console.log(element.id + " added");
    } else if (element.className.includes("white")) {
      element.className += " selected_white";
      selected.push(element);
      console.log(element.id + " added");
    }
  }
  console.log(selected);
}
//hover function
function hover(element) {}

//hover_end function
function hover_end(element) {}

function element_to_ball(element){
  let id = element.id
  let ball_position = [id[0], id[1]]
  let ball = game.find_ball_by_position(ball_position)
  return ball
}

function calculate_surrounding_positons(){
  let directions_of_borders = [[],[],[],[],[],[]]
  if (selected.length === 0)
    return null
  else if (selected.length == 1){
    let borders = game.find_borders(element_to_ball(selected[0]))
    for(let i = 0; i < borders.length; i++){
      directions_of_borders[i].push(borders[i])
    }
  }
  else if(selected.length === 2 || selected.length === 3){
    
    let direction_wheel = "20135420"
    let balls = [];
    for(let ballobject of selected){
      balls.push(element_to_ball(ballobject))
    }
    let groupdirecion = game.block_check(balls)
    if (!groupdirecion)
      return null
    let ball1 = game.find_head(balls, groupdirecion)
    let ball2 = game.find_head(balls, game.opposite_direction(groupdirecion))
    let direction1;
    let ballmiddle;
    if (selected.length === 2)
      direction1 = game.find_border_direction([ball2[0], ball2[1]], [ball1[0], ball1[1]])
    else if ( selected.length === 3){
      for (let ballobject of selected){
        let ball = element_to_ball(ballobject)
        if (ball != ball1 && ball != ball2){
          ballmiddle = ball
          direction1 = game.find_border_direction([ballmiddle[0], ballmiddle[1]], [ball1[0], ball1[1]])
        }
      }
    }
    let direction2 = game.opposite_direction(direction1)
    let borders1 = game.find_borders(ball1)
    let borders2 = game.find_borders(ball2)
    console.log(direction1)
    directions_of_borders[direction1].push(borders1[direction1])
    for(let i = 0; i < 6; i++){
      if (parseInt(direction_wheel[1 + i]) == direction1){
        directions_of_borders[parseInt(direction_wheel[1 + i - 1])].push(borders1[parseInt(direction_wheel[1 + i - 1])])
        directions_of_borders[parseInt(direction_wheel[1 + i + 1])].push(borders1[parseInt(direction_wheel[1 + i + 1])])
      }
    }
    directions_of_borders[direction2].push(borders2[direction2])
    for(let i = 0; i < 6; i++){
      if (parseInt(direction_wheel[1 + i]) == direction2){
        directions_of_borders[parseInt(direction_wheel[1 + i - 1])].push(borders2[parseInt(direction_wheel[1 + i - 1])])
        directions_of_borders[parseInt(direction_wheel[1 + i + 1])].push(borders2[parseInt(direction_wheel[1 + i + 1])])
      }
    }
    if(selected.length === 3){
      let bordersmiddle = game.find_borders(ballmiddle)
      for (let i = 0; i < bordersmiddle.length; i++){
        if (i != direction1 && i != direction2){
          directions_of_borders[i].push(bordersmiddle[i])
        }
      }
    }
  }
  return directions_of_borders
}