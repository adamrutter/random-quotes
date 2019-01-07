# Random Quotes

A small project built whilst learning JavaScript basics. It was inspired by the freeCodeCamp Random Quote Machine project and uses the Wikipedia API.

## Wikipedia API

The Wikipedia API is used to enhance user experience. It is queried to try and find an entry on the author of the quote.

### Author Image

If the API query found an entry and that page has a main image, we add that image to our document.

```javascript
if (pageExists && imagePresent) {
  appendImage(response.query.pages[0].thumbnail.source);
}
```

### Learn More

The 'Learn More' button opens the author's Wikipedia entry (if one is available) in a new tab.

A function `learnMoreState(author, pageExists)` is called to determine whether should the button should be active or not (based on whether the page exists). If it is active, it links to the Wikipedia entry; if it is inactive, the `disabled` class is added to the element and it is restyled.

## Colour

On producing a new quote, a new colour is chosen randomly for the buttons and background. This is done by setting a new `style.backgroundColor` on relevant elements, defined using the CSS `hsl` function with a random number between 0 and 359 as the hue.

```javascript
const randomNum = Math.floor(Math.random() * 359);
const newColor = 'hsl(' + randomNum + ', 51%, 48%)';
```

## Animation

Some animation is used when adding a new quote to the document.

When the 'New Quote' button is clicked, the `slideUp()` function is used to move the bottom of the document up. When the new quote has been added to the document, the `slideDown()` function is then used to reveal the new quote.

These functions toggle classes on some elements that cause them to be repositioned. The CSS property `transition` is used so this happens smoothly.
