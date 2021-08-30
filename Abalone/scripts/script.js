var selected = []

function select(classname) {
  if (selected.includes(document.getElementById(classname)))
    selected.pop(document.getElementById(classname))
  else
    selected.push(document.getElementById(classname))
}

