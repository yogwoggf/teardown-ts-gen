import Builder from "./builder";

function convertTypeToLua(type: string) {
	switch (type) {
		case "table":
			return "LuaTable";
		case "bool":
			return "boolean";
		case "int":
		case "value":
		case "float":
			return "number";
		case "varying":
			return "any";
		case "or":
			return "string";
		default:
			return type;
	}
}

export type FunctionArgument = {
	type: string;
	optional: boolean;
	desc: string;
};

export type FunctionReturn = Omit<FunctionArgument, "optional">;

export default class FunctionBuilder extends Builder {
	arguments: Record<string, FunctionArgument> = {};
	returns: Record<string, FunctionReturn> = {};
	name: string = "";

	public addArgument(name: string, argument: FunctionArgument) {
		name = name + "_";
		argument.type = convertTypeToLua(argument.type);

		this.arguments[name] = argument;
	}

	public addReturn(name: string, returnVal: FunctionReturn) {
		returnVal.type = convertTypeToLua(returnVal.type);

		this.returns[name] = returnVal;
	}

	constructor() {
		super();
	}

	public build(): string {
		this.add("/**");

		Object.entries(this.arguments).forEach(
			([name, { type, optional, desc }]) => {
				this.add(
					` * @param {${type}} ${
						optional ? `[${name}]` : name
					} ${desc}`,
				);
			},
		);

		Object.entries(this.returns).forEach(([_, { type, desc }]) => {
			this.add(` * @returns {${type}} ${desc}`);
		});

		this.add(" */");

		const paramList = Object.entries(this.arguments)
			.map(([name, { type, optional }]) => {
				return `${name}${optional ? "?" : ""}: ${type}`;
			})
			.join(", ");

		const returnList = Object.values(this.returns)
			.map(({ type }) => {
				return type;
			})
			.join(", ");

		const renderedReturns =
			Object.values(this.returns).length > 1
				? `LuaMultiReturn<[${returnList}]>`
				: returnList;
		const returnPart =
			renderedReturns.length < 1 ? ": void" : `: ${renderedReturns}`;

		this.add(`declare function ${this.name}(${paramList})${returnPart};`);

		return this.lines.join("\n");
	}
}
