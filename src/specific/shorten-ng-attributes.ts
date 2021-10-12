/**
 * Shorten various ng-* attributes in prerendered page content.
 */
export function shortenNgAttributes(html: string): string {

	html = html.replace(/ng-star-inserted/g, '');
	html = html.replace(
		/_ngcontent-([a-z0-9-_])/ig,
		(all, classCode) => {
			return '_n' + classCode.replace(/\-/g, '');
		},
	);
	return html;
}

export function shortenNgAttributesAsync(html: string): Promise<string> {
	return Promise.resolve(shortenNgAttributes(html));
}
