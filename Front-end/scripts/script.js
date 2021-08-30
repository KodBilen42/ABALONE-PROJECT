const ws = new WebSocket("ws://localhost:5500")

var selected = [];
var command = "9";

function select(elementid) {
  if (selected.includes(document.getElementById(elementid))){
    selected.pop(document.getElementById(elementid));
    document.getElementById(elementid).className = document.getElementById(elementid).className.replace(" selected", "");
    console.log(elementid + "removed")
  }
  else{
    selected.push(document.getElementById(elementid));
    document.getElementById(elementid).className += " selected";
    console.log(elementid + "added")
  }
}

function read_command(){
    command = document.getElementById("textbox").value;

    var data_selected = [];
    for (var i = 0; i < selected.length; i++){
      selected_id = selected[i].id;
      data_selected.push(selected_id);
    }

    console.log(data_selected);
    console.log(command);

    command_string = command.toString();
    data_selected_string = "";
    for (let i = 0; i<data_selected.length; i++){
      data_selected_string += data_selected[i].toString();
    }
    data = data_selected_string + command_string;
    ws.send(data);


    /*
    axios.post('http://127.0.0.1:5000/move', {
      command: command,
      data_selected: data_selected
    })
    .then(function (response) {
      console.log(response);
      data_pack = respose.data
      for (var i = 0; i < length(data_pack); i++){
        id = data_pack[i][0] + data_pack[i][1];
          color = data_pack[i][2];
    
          if (color == "W")
            document.getElementById(id).className = "white";
          else
            document.getElementById(id).className = "red";
        }
    })
    .catch(function (error) {
      console.log(error);
    });
    */
  }

