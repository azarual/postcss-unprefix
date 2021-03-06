"use strict";
const fs = require("fs");
const assert = require("assert");
const stylelint = Array.prototype.includes && require("stylelint");
const reporter = require("postcss-reporter");
const unprefix = require("..");

function process (css, postcssOpts, opts) {
	const postcss = require("postcss");
	const processors = [
		unprefix(opts),
		stylelint && stylelint,
		reporter(),
	].filter(Boolean);
	return postcss(processors).process(css, postcssOpts);
}

let files = fs.readdirSync("./test/fixtures");

files = files.filter((filename) => {
	return /\.(?:c|le|sc)ss$/.test(filename) && !/\.\w+\.\w+$/.test(filename);
});
describe("fixtures", () => {
	// files = ["values.css"]

	files.forEach((filename) => {
		const testName = filename.replace(/\.\w+$/, "");
		const inputFile = "./test/fixtures/" + filename;
		const outputFile = inputFile.replace(/\.(\w+)$/, ".out.$1");
		const syntax = RegExp.$1.toLowerCase();
		const input = fs.readFileSync(inputFile).toString();
		let output = "";
		try {
			output = fs.readFileSync(outputFile).toString();
		} catch (ex) {
			//
		}

		if (input === output) {
			console.error(inputFile);
		}

		it(testName, () => {
			let real;
			return process(input, {
				from: inputFile,
				syntax: syntax === "css" ? null : require("postcss-" + syntax),
			}).then((result) => {
				real = result.css;
				assert.strictEqual(output, real);
				assert.strictEqual(result.messages.length, 0);
			}).catch(ex => {
				if (real) {
					fs.writeFileSync(inputFile.replace(/\.(\w+)$/, ".out.$1"), real);
				}
				throw ex;
			});
		});
	});
});
