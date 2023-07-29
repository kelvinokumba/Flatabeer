// code here
const beerMenu = document.getElementById('beer-list');
const beerDetails = document.querySelector('.beer-details');
const reviewForm = document.getElementById('review-form');
const reviewInput = document.getElementById('review');

// variable name for base URL for the API
const apiUrl = 'http://localhost:3000';

// Function to render the beer menu in the <nav> element
function renderBeerMenu(beers) {
  beerMenu.innerHTML = '';
  beers.forEach((beer) => {
    const menuItem = document.createElement('li');
    menuItem.textContent = beer.name;
    menuItem.addEventListener('click', () => displayBeerDetails(beer));
    beerMenu.appendChild(menuItem);
  });
}

// Function to display beer details in the main section
function displayBeerDetails(beer) {
  beerDetails.innerHTML = `
    <h2 id="beer-name">${beer.name}</h2>
    <img id="beer-image" src="${beer.image_url}" alt="${beer.name}" width="200" height="200" />
    <p><em id="beer-description">${beer.description}</em></p>
    <h3>Customer Reviews</h3>
    <ul id="review-list">
      ${beer.reviews.map((review) => `<li>${review}</li>`).join('')}
    </ul>
    <form id="review-form">
      <label for="review">Your Review:</label>
      <textarea id="review"></textarea>
      <button type="submit">Add review</button>
    </form>
  `;
}

// Function to add a new review to the selected beer
function addReview(beerId, review) {
  // Send the new review to the server (no persistence, just for display purposes)
  fetch(`${apiUrl}/beers/${beerId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reviews: [review], // Replace existing reviews with the new one
    }),
  });

  // show the new review (again, no persistence, just for display)
  const newReview = document.createElement('li');
  newReview.textContent = review;
  document.getElementById('review-list').appendChild(newReview);
}

// Event listener for the review form submission
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const reviewText = reviewInput.value.trim();

  if (reviewText !== '') {
    const selectedBeerId = getCurrentDisplayedBeerId(); // function to get the current displayed beer ID
    if (selectedBeerId) {
      addReview(selectedBeerId, reviewText);
    }
    reviewInput.value = '';
  }
});
// Make a GET request to retrieve all the beers
fetch(`${apiUrl}/beers`)
  .then((response) => response.json())
  .then((data) => {
    renderBeerMenu(data); // Render the beer menu
    if (data.length > 0) {
      // Display the details of the first beer initially
      fetch(`${apiUrl}/beers/${data[0].id}`)
        .then((response) => response.json())
        .then((firstBeer) => displayBeerDetails(firstBeer));
    }
  })
  .catch((error) => console.error('Error fetching beer data:', error));
