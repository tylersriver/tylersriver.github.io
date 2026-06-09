var darkMode = window.localStorage.getItem('darkMode');
if(!darkMode){
	darkMode =  false;
} else if(darkMode === "true"){
	darkMode = true;
} else{
	darkMode = false;
}
mode();


function darkToggle(){
	toggle();
	mode();
}

function mode(){
	if(darkMode || darkMode){
		document.body.classList.add("dark");
	} else{
		document.body.classList.remove("dark");
	}
}

function toggle(){
	darkMode = !darkMode;
	window.localStorage.setItem('darkMode',darkMode);	
}