
var selected = [];
var command = "1";
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
      selected_id = selected[i].id
      data_selected.push(selected_id)
    }
    console.log(data_selected)
    console.log(command)

    /*
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["move.py", command, data_selected]);
    pythonProcess.stdout.on('data', (data) => {
      data_pack = data;
  });
  for (var i = 0; i < length(data_pack); i++){
    id = data_pack[i][0] + data_pack[i][1];
      color = data_pack[i][2];

      if (color == "W")
        document.getElementById(id).className = "white";
      else
        document.getElementById(id).className = "red";
    }
    */
  }

