import { JSDOM } from 'jsdom';

export interface MoveElementsSource {

	/**
	 * Selector to source page's document defining which element shsould be moved around
	 */
	selector: string;

	/**
	 * Optionally, the matched elements can be filtered by this function
	 */
	filter?: (element: HTMLElement) => boolean;
}

export interface MoveElementsTarget {

	/**
	 * Selector of target point in page. Exactly one element (after optional filtering) must match.
	 *
	 * Either selector or callback is required.
	 */
	selector?: string;

	/**
	 * If selector matches multiple elements, you can use filter function to narrow the match to only one
	 */
	filterOfSelectorMatches?: (element: HTMLElement) => boolean;

	/**
	 * Where to put the moved elements relative to target point?
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
	 */
	position?: InsertPosition;

	/**
	 * If selector is not specified, the matching elements are given to this callback.
	 *
	 * @param element Matching element
	 * @param dom JSDOM of the page. Put the mathching element wherever you want.
	 */
	callback?: (element: HTMLElement, dom: JSDOM) => JSDOM;
}

/**
 * Move some elements to another place in page
 *
 * @param dom JSDOM with source page
 * @param source Specification of what elements should me moved
 * @param target Specification where to move them
 */
export function moveElements(
	dom: JSDOM,
	source: MoveElementsSource,
	target: MoveElementsTarget,
): JSDOM {
	let matches = Array.from<HTMLElement>(dom.window.document.querySelectorAll<HTMLElement>(source.selector));

	if (source.filter) {
		matches = matches.filter(source.filter);
	}

	if (target.position === 'afterbegin' || target.position === 'afterend') {
		matches = matches.reverse();
	}

	for (let element of matches) {
		if (target.callback) {
			dom = target.callback.call(element, dom);
		} else {
			if (!target.selector) {
				throw new Error('This function needs target.callback or target.selector');
			}
			element.parentElement.removeChild(element);
			let targetElements = Array.from<HTMLElement>(dom.window.document.querySelectorAll<HTMLElement>(target.selector));
			if (target.filterOfSelectorMatches) {
				targetElements = targetElements.filter(target.filterOfSelectorMatches);
			}
			if (targetElements.length !== 1) {
				throw new Error('Target selector resulted in more than one result!');
			}
			let targetElement = targetElements[0];
			targetElement.insertAdjacentElement(target.position, element);
		}
	}

	return dom;

}
