const express = require("express");
const app = express();
const bodyparser = require("body-parser").urlencoded({extended: false});
const session = require("express-session")({secret: "Geheimpie ;)", resave: false, saveUninitialized: true});
const PORT = 1337;

app
	.set("views", "app/views")
	.set("view engine", "ejs")
	.use(bodyparser)
	.use(session)
	.use(initSession)
	.use(express.static("app/static"));

app
	.get("/", (req, res) => res.end("home"))
	.get("/:roomname", async (req, res) => {
		const {roomname} = req.params;
		const shouldnotify = req.session.notify[roomname] || false;
		const {roomstate, tmp, air, snd, occ} = await fetchData().then(transformData);
		switch (req.accepts(["html", "json"])){
			case "html": return res.render("room", {roomstate, shouldnotify, roomname, tmp, air, snd, occ, date: getDate()});
			case "json": return res.json({roomstate, shouldnotify, roomname, tmp, air, snd, occ, date: getDate()});
			default: res.status(415).end("Unsupported Content-Type requested. Try application/json or text/html");
		}})
	.post("/reminder/:roomname", (req, res) => {
		//Set reminder server side?
		const {roomname} = req.params;
		req.session.notify[roomname] = true;
		res.redirect(`/${roomname}`)})
	.post("/unsub/:roomname", (req, res) => {
		//Set reminder server side?
		const {roomname} = req.params;
		req.session.notify[roomname] = false;
		res.redirect(`/${roomname}`)})
	.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

async function fetchData () {
	return {
		tmp: Math.floor(Math.random() * 32),
		air: Math.floor(Math.random() * 1100),
		snd: Math.floor(Math.random() * 9000),
		occ: Boolean(Math.random())
	};
}

function transformData (data) {
	const {tmp, air, snd, occ} = data;
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
function getDate () {
	const date = new Date();
	const day = dateHelpers.days[date.getDay()];
	const daynum = date.getDay();
	const month = dateHelpers.months[date.getMonth()];

	return `${day} ${daynum} ${month}`;
}

function initSession (req, res, next) {
	if (!req.session.notify) req.session.notify = new Object();
	next();
}