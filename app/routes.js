const { fetchRoom, fetchAll, getDate } = require("./fetchers.js");

module.exports.overview = async function overview (req, res) {
	const rooms = (await fetchAll())
		.sort((roomA, roomB) => (roomA.tmp < roomB.tmp) ? -1 : 1)
		.sort(room => room.occ ? -1 : 1)
		.sort(room => room.bkd ? -1 : 1);
	const free = rooms
		.filter(room => !room.occ && !room.bkd)
		.length;
	const avgtmp = (rooms
		.reduce((tmp, room) => tmp + room.tmp, 0)
		/ rooms.length)
		.toFixed(1)
		.replace(/\.0/, "");
	const tmpstr = (()=>{
			if      (avgtmp <= 14) return "freezing";
			else if (avgtmp <= 22) return "cool";
			else if (avgtmp <= 28) return "hot";
			else if (avgtmp >  28) return "boiling";
		})();

	return res.render("overview", {free, rooms, avgtmp, tmpstr});
}

module.exports.room = async function room (req, res) {
	const { roomname } = req.params;
	const shouldnotify = req.session.notify[roomname] || false;
	const { roomstate, tmp, air, snd, occ } = await fetchRoom(roomname.toLowerCase());

	switch (req.accepts(["html", "json"])){
		case "html": return res.render("room", {roomstate, shouldnotify, roomname, tmp, air, snd, occ, date: getDate()});
		case "json": return res.json({roomstate, shouldnotify, roomname, tmp, air, snd, occ, date: getDate()});
		default: return res.status(415).end("Unsupported Content-Type requested. Try application/json or text/html.");
	}
}

module.exports.reminder = function reminder (req, res) {
	//Set reminder server side?
	const { roomname } = req.params;
	req.session.notify[roomname] = true;

	return res.redirect(`/${roomname}`);
}

module.exports.unsub = function unsub (req, res) {
	//Unset reminder server side?
	const { roomname } = req.params;
	req.session.notify[roomname] = false;

	return res.redirect(`/${roomname}`);
}