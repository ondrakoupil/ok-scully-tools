# Scully Tools

This is a set of tools and plugins to use with [Scully.io](https://scully.io/)

It is personal, highly unstable and not well tested. I warned you.

## General functions

 - `inlineStyle()` - inline `<link>` directly into the prerendered page
 - `moveElements()` - move elements around in the prerendered page (from `<head>` to `<body>` etc.)

## Specific plugins

- `moveScriptsToBody()` - move initial page's lazy loaded module sources from `<head>` to end of `<body>` so that the page is rendered before they are downloaded and executed
- `inlineGlobalStylesInHead()` - inline global styles directly into `<head>`, so that they don't trigger a separate request and page is rendered quicker
- `moveExtStylesToBody()` - external styles for various dependencies that are useful only after firing off angular can be safely put down to end of body.
- `shortenNgAttributes()` - shortens various _ng-* attributes in the prerendered page to save a few (kilo) bytes.

## Usual setup

Scully plugins file:

```
export async function scripts(html: JSDOM, route: HandledRoute): Promise<JSDOM> {
	return moveScriptsToBody(html);
}

export async function styles(html: JSDOM): Promise<JSDOM> {
	html = inlineGlobalStylesInHead(html, 'dist/static');
	html = moveExtStylesToBody(html);
	return html;
}

registerPlugin('postProcessByHtml', 'ngAttrs', removeNgAttributesAsync);
registerPlugin('postProcessByDom', 'scripts', scripts);
registerPlugin('postProcessByDom', 'styles', styles);

// register various router plugins...
```

Scully config file:

```
export const config: ScullyConfig = {
	//...
	defaultPostRenderers: [
		'ngAttrs',
		'scripts',
		'styles',
	],
	//
};
```
