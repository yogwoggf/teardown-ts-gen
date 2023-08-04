import Builder from "./builder";

export default class DeclarationBuilder extends Builder {
	declarations: Builder[] = [];

	constructor() {
		super();
	}

	public addDeclaration(declaration: Builder) {
		this.declarations.push(declaration);
	}

	public build(): string {
		this.add("// generated by teardown-ts-gen");
		for (const declaration of this.declarations) {
			this.add(declaration.build());
		}
		return this.lines.join("\n");
	}
}