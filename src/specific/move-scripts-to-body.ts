import { JSDOM } from 'jsdom';
import { moveElements } from '../general-functions/move-elements';

/**
 * All <script>'s in <head> will be moved to <body> after content and before angular's sources
 */
export function moveScriptsToBody(html: JSDOM): JSDOM {

	let result = moveElements(
		html,
		{
			selector: 'head script',
			filter: isMovableScript,
		},
		{
			selector: 'script#ScullyIO-transfer-state',
			position: 'afterend'
		}
	);

	return result;

}


function isMovableScript(script: HTMLScriptElement): boolean {
	return (
		script.getAttribute('charset') === 'utf-8'
		&& !script.getAttribute('src').match(/\//)
	);
}
