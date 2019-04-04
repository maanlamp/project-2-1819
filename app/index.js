const express = require("express");
const app = express();
const bodyparser = require("body-parser").urlencoded({extended: false});
const session = require("express-session")({secret: "Geheimpie ;)", resave: false, saveUninitialized: true});
const { overview, room, reminder, unsub} = require("./routes.js");
const compression = require("compression")();
const static = express.static("app/static");
const PORT = process.env.port || 1337;

function initSession (req, res, next) {
	if (!req.session.notify) req.session.notify = new Object();
	return next();
}

app
	.set("views", "app/views")
	.set("view engine", "ejs")
	.use(bodyparser)
	.use(session)
	.use(initSession)
	.use(compression)
	.use(static);

app
	.get("/", overview)
	.get("/:roomname", room)
	.post("/reminder/:roomname", reminder)
	.post("/unsub/:roomname", unsub)
	.listen(PORT, () => console.log(`Listening on port ${PORT}.`));