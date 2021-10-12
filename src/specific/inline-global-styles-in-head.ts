import { JSDOM } from 'jsdom';
import { inlineStyle } from '../general-functions/inline-style';


/**
 * Global styles that should be inlined directly into page's <head>.
 *
 * Filename is expected to be styles.{...bundle hash...}.css
 */
export function inlineGlobalStylesInHead(html: JSDOM, pathToOutputDirectory: string): JSDOM {

	let result = inlineStyle(
		html,
		{
			selector: 'head link[rel="stylesheet"]',
			filter: isMovableStyleLink,
		},
		pathToOutputDirectory,
	);

	return result;

}


function isMovableStyleLink(link: HTMLLinkElement): boolean {
	return (link.href.match(/^styles.[a-z0-9]+.css/) && link.rel === 'stylesheet');
}
