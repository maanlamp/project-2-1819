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
	const airQuality = options.air;
	const sound = options.snd;
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