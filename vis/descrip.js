// allows for drop down menu

function dropDown() {
    
    var info = document.getElementById("dropDown");

    if (info.style.visibility == "hidden") {
	info.style.visibility = "visible";
    }
}

function putAway() {
 
    var info = document.getElementById("dropDown");
    
    if (info.style.visibility == "visible") {
	info.style.visibility = "hidden";
    }
}
