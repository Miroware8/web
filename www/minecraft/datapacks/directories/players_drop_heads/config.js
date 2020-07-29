const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "players_drop_heads",
		version: [1, 0, 1],
		name: "Players Drop Heads",
		compatibility: ["1.14", "1.15", "1.16"],
		description: `
			Players drop their heads when killed by another player.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "plaDroHea.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};