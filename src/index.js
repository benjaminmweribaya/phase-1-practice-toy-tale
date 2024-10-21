let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');
  const toyUrl = 'http://localhost:3000/toys';

  addBtn.addEventListener("click", () => {
    // Toggle the form visibility
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch toys and render them on page load
  fetch(toyUrl)
    .then(response => response.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    })
    .catch(error => console.error('Error fetching toys:', error));

  // Function to create a card for each toy
  function renderToyCard(toy) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener to the like button
    const likeButton = div.querySelector('.like-btn');
    likeButton.addEventListener('click', () => handleLike(toy, div));

    toyCollection.appendChild(div);
  }

  // Handle form submission to add a new toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    fetch(toyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        renderToyCard(toy); // Add the new toy to the DOM
        toyForm.reset(); // Clear the form fields
      })
      .catch(error => console.error('Error adding new toy:', error));
  });

  // Handle liking a toy
  function handleLike(toy, div) {
    const newLikes = toy.likes + 1;

    fetch(`${toyUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        // Update the likes displayed in the DOM
        const p = div.querySelector('p');
        p.textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes; // Update the toy object with the new likes count
      })
      .catch(error => console.error('Error updating likes:', error));
  }
});

