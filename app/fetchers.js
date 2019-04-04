const fetch = require("node-fetch");

module.exports.fetchRoom = async function fetchRoom (roomname) {
	if (roomname === "random") return transformData({
		tmp: Math.floor(Math.random() * 3200),
		air: Math.floor(Math.random() * 1100),
		snd: Math.floor(Math.random() * 9000),
		occ: Boolean(Math.random())
	});

	return fetch("http://localhost:3000/api/v1/room/" + roomname)
		.then(res => res.json())
		.then(json => json.data.measurements)
		.then(json => transformData({
			tmp: json.temperature,
			air: json.co2,
			snd: json.mic_level,
			occ: json.occupancy
		}));
}

function transformData (data) {
	const { tmp, air, snd, occ } = data;
	return {
		tmp: Number((tmp / 1000).toFixed(1).replace(/\.0/, "")),
		roomstate: (()=>{
			if      (tmp <= 1400) return "freezing ";
			else if (tmp <= 2200) return "cool ";
			else if (tmp <= 2800) return "hot ";
			else if (tmp >  2800) return "boiling ";
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
	return fetch("http://localhost:3000/api/v1/rooms/")
		.then(res => res.json())
		.then(json => json.data
			.map(room => Object.assign({}, room.measurements, {name: room.room_name}))
			.map(room=>{console.log(room);return room})
			.map(room => Object.assign({}, transformData({
				tmp: room.temperature,
				air: room.co2,
				snd: room.mic_level,
				occ: room.occupancy,
				bkd: Math.round(Math.random()) ? true : false}),
				{name: room.name}))
			.map(room => Object.assign(room, {occ: (room.occ === "Yep") ? true : false})));
}