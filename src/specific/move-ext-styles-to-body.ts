import { JSDOM } from 'jsdom';
import { moveElements } from '../general-functions/move-elements';

/**
 * Global styles that should be linked in the bottom of body - for various dependencies that are not required in initial page render
 *
 * Filename is expected to be ext-styles.{...bundle hash...}.css
 */
export function moveExtStylesToBody(html: JSDOM): JSDOM {

	let result = moveElements(
		html,
		{
			selector: 'head link[rel="stylesheet"]',
			filter: isExtStyleLink,
		},
		{
			selector: 'body',
			position: 'beforeend'
		}
	);

	return result;

}


function isExtStyleLink(link: HTMLLinkElement): boolean {
	return (link.href.match(/ext-styles.[a-z0-9]+.css/) && link.rel === 'stylesheet');
}

