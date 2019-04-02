window.odometerOptions = {
	format: "dd",
	duration: 1000,
	theme: "minimal"
};
const tmp = document.querySelector("#tmp");

function setRoomState (temperature, occ) {
	const roomstate = (()=>{
		if      (temperature <= 10) return "freezing";
		else if (temperature <= 20) return "cool";
		else if (temperature <= 30) return "hot";
		else if (temperature >  30) return "boiling";
	})() + ((occ === true) ? " occupied" : "");

	document.querySelector("#app").className = roomstate;
	tmp.innerText = temperature;
}