const quoteContainer = document.querySelector('#quote');
const slideContainer = document.getElementById('slide-container');
const learnMoreButton = document.querySelector('#learn-more');

// Slide the bottom section down
function slideDown() {
  const slideContainer = document.getElementById('slide-container');
  // const quoteContainer = document.getElementById('quote');

  quoteContainer.style.visibility = 'visible';
  slideContainer.classList.remove('hidden');
  quoteContainer.classList.remove('hidden');
}

// Change the primary color
function changeColor() {
  const randomNum = Math.floor(Math.random() * 359);
  const newColor = 'hsl(' + randomNum + ', 51%, 48%)';
  const buttons = document.querySelectorAll('button');

  // Change the color of the background
  document.getElementsByTagName('HTML')[0].style.backgroundColor = newColor;

  // Change the color of any non-disabled buttons, and remove any previous coloring of disabled
  // buttons
  for (let i = 0; i < buttons.length; i++) {
    if (!buttons[i].classList.contains('disabled')) {
      buttons[i].style.backgroundColor = newColor;
    } else {
      buttons[i].style.backgroundColor = null;
    }
  }

  slideDown();
}

// Disable the learn more button if an author isn't found
function learnMoreState(author, pageExists) {
  let buttonState = 'enabled';

  if (!pageExists) {
    buttonState = 'disabled';
  }

  if (!author) {
    buttonState = 'disabled';
  }

  // Disable the button if any of the above conditions are met and the button is currently not
  // disabled. Also, remove any added styling to the backgroundColor property
  if (buttonState === 'disabled' && !learnMoreButton.classList.contains('disabled')) {
    learnMoreButton.classList.add('disabled');
    // learnMoreButton.style.backgroundColor = null;
  }

  // Enable the button if the above conditions aren't met and the button is currently disabled
  if (buttonState === 'enabled' && learnMoreButton.classList.contains('disabled')) {
    learnMoreButton.classList.remove('disabled');
  }

  // Change the primary color
  changeColor();
}

// Add an image of the author to the document
function appendImage(imageUrl) {

  // Create the image element
  const imageContainer = document.createElement('div');
  const image = document.createElement('img');
  imageContainer.id = 'image';
  image.src = imageUrl;

  // Append image to the document
  imageContainer.append(image);
  quoteContainer.insertBefore(imageContainer, quoteContainer.firstChild);
}

// Query the wikipedia api for information about the author
function queryWikiApi(author) {

  // Continue if there is an author
  if (author) {
    const apiEndpoint = 'https://en.wikipedia.org/w/api.php?';
    const authorName = author.replace(/\s/g, '%20');
    const imageSize = 150;
    const query = 'action=query&redirects&format=json&formatversion=2&prop=pageimages&pithumbsize=' + imageSize + '&titles=' + authorName;
    const fullUrl = apiEndpoint + query;

    fetch(fullUrl)
      .then(response => response.json())
      .then((response) => {
        const pageExists = !response.query.pages[0].missing;
        const imagePresent = response.query.pages[0].thumbnail;

        // Append an image of the author to the document
        if (pageExists && imagePresent) {
          appendImage(response.query.pages[0].thumbnail.source);
        }

        // Set the state of the learn more button
        learnMoreState(author, pageExists);
      });

  // Do the below as a fallback if there is no author, usually stuff that would get called later on
  // in the queue. The learn more button should be set to disabled if there is no author and it is
  // not already disabled
  } else {
    if (!learnMoreButton.classList.contains('disabled')) {
      learnMoreButton.classList.add('disabled');
    }

    // changeColor() is called after querying the wiki api for a synchronised transition. If there
    // is no author it won't get called. Invoke it here in case of no author
    changeColor();
  }
}

// Generate new quote and append it to the document
const quotesUrl = 'https://gitlab.com/adamrutter/random-quotes/raw/master/quotes.json';

function newQuote() {
  fetch(quotesUrl)
    .then(response => response.json())
    .then((jsonQuotes) => {

      // Generate random number no larger than the amount of quotes
      const randomNum = Math.floor(Math.random() * jsonQuotes.length);

      // Extract quote and author
      const quoteText = jsonQuotes[randomNum].quoteText;
      const quoteAuthor = jsonQuotes[randomNum].quoteAuthor;

      // Append quote to document
      const newText = document.createElement('p');
      newText.id = 'text';
      newText.textContent = quoteText;
      quoteContainer.appendChild(newText);

      // Append author to document if there is one
      if (quoteAuthor) {
        const newAuthor = document.createElement('p');
        newAuthor.id = 'author';
        newAuthor.textContent = quoteAuthor;
        quoteContainer.appendChild(newAuthor);
      }

      // Fetch data about the author such as an image
      queryWikiApi(quoteAuthor);
    });
}

// Remove old quote and author if they exist
function removeOld() {

  // Remove the event listener to stop new quotes firing on updates
  const slideContainer = document.getElementById('slide-container');
  slideContainer.removeEventListener('transitionend', removeOld);

  const oldQuote = document.getElementById('text');
  const oldAuthor = document.getElementById('author');
  const oldImage = document.getElementById('image');

  if (oldQuote) {
    quoteContainer.removeChild(oldQuote);
  }

  if (oldAuthor) {
    quoteContainer.removeChild(oldAuthor);
  }

  if (oldImage) {
    quoteContainer.removeChild(oldImage);
  }

  newQuote();
}

// Slide the bottom section up
function slideUp() {
  slideContainer.classList.add('hidden');
  quoteContainer.classList.add('hidden');
  slideContainer.addEventListener('transitionend', removeOld);
}

// Generate a new quote upon clicking the generate quote button
const newQuoteButton = document.querySelector('#generate-quote');

newQuoteButton.addEventListener('click', () => {
  slideUp();
});

// Go to wikipedia upon clicking the learn more button, but only if the button is not disabled
const wikiUrl = 'https://en.wikipedia.org/wiki/Special:Search/';

learnMoreButton.addEventListener('click', () => {
  if (!learnMoreButton.classList.contains('disabled')) {
    const searchTerm = author.textContent.toLowerCase().replace(/\s+/g, '_');
    const fullUrl = wikiUrl + searchTerm;

    window.open(fullUrl);
  }
});

// Call the newQuote() function on page load
document.addEventListener('DOMContentLoaded', () => {
  newQuote();
});
