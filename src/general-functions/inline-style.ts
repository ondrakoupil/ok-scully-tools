import { JSDOM } from 'jsdom';

let fs = require('fs');
let path = require('path');

export interface InlineStyleSource {

	/**
	 * Selector of source page's as string
	 */
	selector: string;

	/**
	 * Optionally the matching elements can be filtered
	 */
	filter?: (element: HTMLElement) => boolean;
}


/**
 * Inline content of external <link type="stylesheet">
 *
 * @param dom JSDOM with source page
 * @param source definition of which <link>s should be inlined
 * @param basePath Path to dist/static directory, where "root" of page's URL is located
 */
export function inlineStyle(
	dom: JSDOM,
	source: InlineStyleSource,
	basePath: string,
): JSDOM {

	let matches = Array.from<HTMLElement>(dom.window.document.querySelectorAll<HTMLElement>(source.selector));

	if (source.filter) {
		matches = matches.filter(source.filter);
	}

	for (let element of matches) {
		let src = element.getAttribute('href');
		let file = path.join(basePath, src);
		if (!fs.existsSync(file)) {
			throw new Error('File does not exist: ' + file);
		}
		let content: string = fs.readFileSync(file, {encoding: 'utf-8'});

		let newStyle = dom.window.document.createElement('style');
		newStyle.append(content);
		// newStyle.setAttribute('data-inlined-from', file + ' (' + content.length + ')');
		element.insertAdjacentElement('afterend', newStyle);
		element.parentElement.removeChild(element);
	}

	return dom;

}


function isMovableStyleLink(link: string): boolean {
	return !!(link.match(/href="styles.[a-z0-9]+.css"/) && link.match(/rel="stylesheet"/));
}
