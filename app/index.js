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
	.use((req, res, next) => {if (!req.session.notify) req.session.notify = new Object(); next();})
	.use(express.static("app/static"));

app
	.get("/", (req, res) => res.end("home"))
	.get("/:roomname", async (req, res) => {
		const {roomname} = req.params;
		const shouldnotify = req.session.notify[roomname] || false;
		const {roomstate, tmp, air, snd, occ} = await fetchData().then(transformData);
		res.render("room", {roomstate, shouldnotify, roomname, tmp, air, snd, occ, date: getDate()});})
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
		tmp: 35,
		air: 428,
		snd: 2090,
		occ: true
	};
}

function transformData (data) {
	const {tmp, air, snd, occ} = data;
	return {
		tmp,
		roomstate: (()=>{
			if      (tmp <= 10) return "freezing";
			else if (tmp <= 20) return "cool";
			else if (tmp <= 30) return "hot";
			else if (tmp >  30) return "boiling";
		})() + ((occ) ? " occupied" : ""),
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