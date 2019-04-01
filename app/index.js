const express = require("express");
const PORT = 1337;

app
	.set("views", "app/views")
	.use(express.static("app/static"));

app
	.get("/", (req, res) => res.render("index"))
	.listen(PORT, () => console.log(`Listening on port ${PORT}.`));