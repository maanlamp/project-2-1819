module.exports.fetchRoom = async function fetchRoom (israndom) {
	if (israndom) {}; //return random
	return transformData({
		tmp: Math.floor(Math.random() * 32),
		air: Math.floor(Math.random() * 1100),
		snd: Math.floor(Math.random() * 9000),
		occ: Boolean(Math.random())
	});
}

function transformData (data) {
	const { tmp, air, snd, occ } = data;
	return {
		tmp,
		roomstate: (()=>{
			if      (tmp <= 14) return "freezing ";
			else if (tmp <= 22) return "cool ";
			else if (tmp <= 28) return "hot ";
			else if (tmp >  28) return "boiling ";
		})()
		+ ((occ === true) ? "occupied " : "")
		+ (()=>{
				if      (air <= 500)  return "clear ";
				else if (air <= 1000) return "smoggy ";
				else if (air >  1000) return "dangerous ";
			})()
		+ (()=>{
				if      (snd <= 2500) return "quiet";
				else if (snd <= 6000) return "minimal";
				else if (snd <= 8500) return "loud";
				else if (snd >  8500) return "intense";
			})(),
		air: (()=>{
			if      (air <= 500)  return "Geweldig";
			else if (air <= 750)  return "Goed";
			else if (air <= 1000) return "Matig";
			else if (air >  1000) return "Slecht";
		})(),
		snd: (()=>{
			if      (snd <= 2500) return "Stil";
			else if (snd <= 6000) return "Minimaal";
			else if (snd <= 8500) return "Lawaaiig";
			else if (snd >  8500) return "Intens";
		})(),
		occ: (occ == true) ? "Yep" : "Nope"
	};
}

const dateHelpers = {
	days: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
	months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
};
module.exports.getDate = function getDate () {
	const date = new Date();
	const day = dateHelpers.days[date.getDay()];
	const daynum = date.getDay();
	const month = dateHelpers.months[date.getMonth()];

	return `${day} ${daynum} ${month}`;
}

module.exports.fetchAll = async function fetchAll () {
	return [
		{occ: false, name: "Starkweather", tmp: 25, bkd: false},
		{occ: false, name: "Edison", tmp: 21, bkd: false},
		{occ: true, name: "Lamar", tmp: 12, bkd: true},
		{occ: true, name: "Analytics Dojo", tmp: 12, bkd: true},
		{occ: true, name: "Hull", tmp: 12, bkd: true},
		{occ: true, name: "Lippershey", tmp: 12, bkd: true},
		{occ: false, name: "Nell", tmp: 19, bkd: true}
	];
}