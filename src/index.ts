import { parseString } from "xml2js";
import { TeardownAPI } from "./teardownAPI";
import DeclarationBuilder from "./declarationBuilder";
import FunctionBuilder from "./functionBuilder";
import * as fs from "fs";

async function getAPIMarkup(): Promise<string> {
	const response = await fetch("https://teardowngame.com/modding/api.xml");
	return await response.text();
}

async function generate() {
	const xml = await getAPIMarkup();
	const declarationDocument = new DeclarationBuilder();

	parseString(xml, (err, result) => {
		if (err) {
			console.error("Error while parsing XML: ", err.message);
			return;
		}

		const api = result.api as TeardownAPI;
		for (const functionNode of api.function) {
			const functionBuilder = new FunctionBuilder();
			functionBuilder.name = functionNode.$.name;

			const functionInputs = functionNode.input ?? [];
			const functionOutputs = functionNode.output ?? [];

			for (const functionInput of functionInputs) {
				functionBuilder.addArgument(functionInput.$.name, {
					type: functionInput.$.type,
					optional: functionInput.$.optional === "true",
					desc: functionInput.$.desc,
				});
			}

			for (const functionOutput of functionOutputs) {
				functionBuilder.addReturn(functionOutput.$.name, {
					type: functionOutput.$.type,
					desc: functionOutput.$.desc,
				});
			}

			declarationDocument.addDeclaration(functionBuilder);
		}

		const declaration = declarationDocument.build();
		fs.writeFileSync("./teardown.d.ts", declaration);
	});
}

generate().then(_ => console.log("Done!"));
