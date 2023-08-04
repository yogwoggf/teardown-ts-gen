export type TeardownInputNode = {
	$: {
		name: string;
		type: string;
		optional: string;
		desc: string;
	}
}

export type TeardownOutputNode = {
	$: {
		name: string;
		type: string;
		desc: string;
	}
}

export type TeardownFunctionNode = {
	$: {
		name: string;
	}

	input: TeardownInputNode[];
	output: TeardownOutputNode[];
}

export type TeardownAPI = {
	function: TeardownFunctionNode[];
}
