export default abstract class Builder {
	protected lines: string[] = [];
	public abstract build(): string;

	protected add(substring: string) {
		this.lines.push(substring);
	}
}
