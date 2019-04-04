window.odometerOptions = {
	duration: 1000,
	theme: "minimal"
};
const tmp = document.querySelector("#tmp");
const occ = document.querySelector("#occ");
const air = document.querySelector("#air");
const snd = document.querySelector("#snd");

function setRoomState (options) {
	const occupied = options.occ;
	const temperature = options.tmp;
	const airQuality = (()=>{switch(options.air){
		case "Geweldig": return 500;
		case "Goed": return 750;
		case "Matig": return 1000;
		case "Slecht": return 2000;
		default: return options.air;
	}})();
	const sound = (()=>{switch(options.snd){
		case "Stil": return 2500;
		case "Minimaal": return 6000;
		case "Luid": return 8500;
		case "Intens": return 8500;
		default: return options.snd;
	}})();
	const roomstate = (()=>{
			if      (temperature <= 14) return "freezing ";
			else if (temperature <= 22) return "cool ";
			else if (temperature <= 28) return "hot ";
			else if (temperature >  28) return "boiling ";
		})()
		+ ((occupied === true) ? "occupied " : "")
		+ (()=>{
				if      (airQuality <= 500)  return "clear ";
				else if (airQuality <= 1000) return "smoggy ";
				else if (airQuality >  1000) return "dangerous ";
			})()
		+ (()=>{
				if      (sound <= 2500) return "quiet";
				else if (sound <= 6000) return "minimal";
				else if (sound <= 8500) return "loud";
				else if (sound >  8500) return "intense";
			})();

	document.querySelector("#app").className = roomstate;
	tmp.innerText = temperature;
	occ.innerText = (occupied === true) ? "Yep" : "Nope";
	air.innerText = (()=>{
		if      (airQuality <= 500)  return "Geweldig";
		else if (airQuality <= 750)  return "Goed";
		else if (airQuality <= 1000) return "Matig";
		else if (airQuality >  1000) return "Slecht";
	})();
	snd.innerText = (()=>{
		if      (sound <= 2500) return "Stil";
		else if (sound <= 6000) return "Minimaal";
		else if (sound <= 8500) return "Lawaaiig";
		else if (sound >  8500) return "Intens";
	})();
}

setInterval(() => {
	console.log("Polling...");
	const roomname = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
	fetch("/" + roomname, {headers:{"Accept": "application/json"}})
		.then(body => body.json())
		.then(setRoomState);
}, 5000);