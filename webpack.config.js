const path = require("path")

module.exports = {
	entry: "./src/timsort-impl.js",
	mode: "production",
	module: {
		rules: [
		  {
			test: /\.css$/i,
			use: ["style-loader", "css-loader"],
		  },
		],
	  },
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "build"),
	},
	resolve: {
		extensions: [".js"],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "build"),
		},
		port: 8080,
		open: true,
	},
}
