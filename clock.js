var moveTimer;
var settingsTimer;
var gearTimer;

const fontSizes = {
	"small" : "6em",
	"medium" : "12em",
	"large" : "17em"
}

const colors = {
	"red" : "#fe0000",
	"green" : "#0bff01",
	"blue" : "#00cfff",
	"yellow" : "#fdfe02",
	"pink" : "#fe00f6",
	"white" : "#ffffff"
}

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
};

function formatDate() {
  const weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  let dt = new Date()
  let day = weekday[dt.getDay()];
  let suffix = "am";
  let hours = dt.getHours();
	let seconds = ("0" + dt.getSeconds()).slice(-2);
  if (dt.getHours() > 12) {
    hours = dt.getHours() - 12;
    suffix = "pm";
  } else if (hours == 0) {
		hours = 12;
	}
  let minutes = ("0" + dt.getMinutes()).slice(-2);
  //return day + " at " + hours + ":" + minutes + " " + suffix;
	return hours + ":" + minutes;
};

function updateTimer(){
	const crtTime = document.getElementById("timetxt");
	crtTime.innerText = formatDate();
}

function moveClock(){
	let l = Math.floor(Math.random() * 201) - 100;
	let t = Math.floor(Math.random() * 201) - 100;
	const clock = document.getElementById("clock");
	clock.style.marginLeft = l + "px";
	clock.style.marginTop = t + "px";
}

let wakeLock = null;

// create an async function to request a wake lock
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');

    // listen for our release event
    wakeLock.addEventListener('release', () => {
      // if wake lock is released alter the UI accordingly
    });

  } catch (err) {
    // if wake lock request fails - usually system related, such as battery

  }
}

function adjustOpacity() {
  const txt = document.getElementById("timetxt");
	const slider = document.getElementById("brightnessRange");
	txt.style.opacity = slider.value/100;
	localStorage.setItem('opacity', slider.value/100);
  //const txtStyles = window.getComputedStyle(txt);
/*   const o = txtStyles.getPropertyValue('opacity');
  if(o >= .2) {
    txt.style.opacity = o - .05;
		localStorage.setItem('opacity', Math.round((o - .05) * 100)/100);
  } else {
    txt.style.opacity = 1;
		localStorage.setItem('opacity', 1);
  } */
}

//function toggleFullscreen(){
	//if(document.fullscreenElement){
		//document.exitFullscreen();
	//} else {
		//document.documentElement.requestFullscreen();
	//}
//}

function loadEvents() {
	//window.addEventListener("touchend", toggleFullScreen, false);
  const txt = document.getElementById("timetxt");
	const slider = document.getElementById("brightnessRange");
	const colors = document.querySelector(".colors");
	const sizes = document.querySelector(".fonts");
	const gear = document.getElementById("gear");
  //txt.addEventListener("touchend", adjustOpacity, false);
	txt.addEventListener("click", adjustOpacity, false);
	slider.addEventListener("input", adjustOpacity, false);
	colors.addEventListener("click", function (event) {
		changeColor(event.target.id)
	}, false);
		sizes.addEventListener("click", function (event) {
		changeFontSize(event.target.id)
	}, false);
	gear.addEventListener("click", function gearClick(e) {
		e.stopPropagation();
		gear.classList.add("hidden");
		clearTimeout(gearTimer);
		showSettings();
	}, false);
	document.body.onclick = function showGear() {
		const gear = document.getElementById("gear");
		const settings = document.querySelector(".settings");
		if(gear.classList.contains("hidden") && settings.classList.contains("hidden")){
			gear.classList.remove("hidden");
			gearTimer = setTimeout(hideGear, 5000);
		}
	};
	document.body.onmousedown = function keepSettings() {
		if(!document.querySelector(".settings").classList.contains("hidden")) {
			if(settingsTimer) clearTimeout(settingsTimer);
		}
	}
	document.body.onmouseup = function startSettingsTimer() {
		if(!document.querySelector(".settings").classList.contains("hidden")) {
			settingsTimer =  setTimeout(hideSettings, 10000);
		}
	}
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

function initiateDisplay() {
	const brightness = localStorage.getItem('opacity');
	const slider = document.getElementById('brightnessRange');
	const selectedColor = localStorage.getItem("color");
	if(brightness) {
		const txt = document.getElementById("timetxt");
		txt.style.opacity = parseFloat(brightness);
		slider.value = Math.round(brightness * 100);
	}
	if(selectedColor) {
		changeColor(selectedColor);
	}
	const selectedFontSize = localStorage.getItem("size");
	if(selectedFontSize) {
		changeFontSize(selectedFontSize);
	}
}

function stopTimer(tvar) {
	clearInterval(tvar);
}

function changeColor(color) {
	if (color) {
		document.getElementById("timetxt").style.color = colors[color];
		document.querySelector(".current").classList.remove("current");
		document.getElementById(color).classList.add("current");
		localStorage.setItem("color", color);
	}
}

function changeFontSize(size){
	if(size){
		document.getElementById("timetxt").style.fontSize = fontSizes[size];
		document.querySelector(".current-font").classList.remove("current-font");
		document.getElementById(size).classList.add("current-font");
		localStorage.setItem("size", size);
	}
}

function showSettings() {
	document.querySelector(".settings").classList.remove("hidden");
	settingsTimer = setTimeout(hideSettings, 10000);
}

function hideGear() {
	document.getElementById("gear").classList.add("hidden");
}

function hideSettings() {
	document.querySelector(".settings").classList.add("hidden");
}

function handleVisibilityChange() {
  console.log("visibilty change");
	if(wakeLock !== null && document.visibilityState === 'visible'){
		requestWakeLock();
	}
}

window.onload = function() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("serviceworker.js").then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    }).catch(function (err) {
      console.log("Service Worker registration failed:", err);
    });
  }
	updateTimer();
	setInterval(updateTimer, 2000);
	moveTimer = setInterval(moveClock, 30000);
  requestWakeLock();
	loadEvents();
	initiateDisplay();
};