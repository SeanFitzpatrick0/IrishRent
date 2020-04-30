export function toURL(id: string): string {
	return id.replace(" ", "-");
}

export function fromURL(url: string): string {
	return url.replace("-", " ");
}
