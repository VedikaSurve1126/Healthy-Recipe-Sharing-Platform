document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
});

function fetchRecipes() {
    fetch('/api/recipes')  // Correct route to fetch recipes
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched Recipes:", data); // Check if data is fetched
            if (Array.isArray(data)) {  // Since data is the array itself
                renderRecipes(data);
            } else {
                console.error('Unexpected data format:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

function renderRecipes(recipes) {
    if (recipes.length === 0) {
        console.warn('No recipes found!');
        return;
    }

    recipes.forEach(recipe => {
        const cuisine = recipe.cuisine.toLowerCase();
        const cuisineContainer = document.getElementById(`${cuisine}-recipes`);

        console.log(`Rendering recipe for cuisine: ${cuisine}`);  // Debugging
        console.log("Recipe data:", recipe); // Log the entire recipe object

        if (cuisineContainer) {
            const recipeCard = createRecipeCard(recipe);
            cuisineContainer.appendChild(recipeCard);
        } else {
            console.warn(`No container found for cuisine: ${cuisine}`);  // Debugging
        }
    });
}

// Function to create recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${recipe.recipeName}</h5>
                <p class="card-text">${recipe.instructions.substring(0, 100)}...</p>
                <p class="card-text">Cuisine: ${recipe.cuisine}</p>
                <p class="card-text">Category: ${recipe.category}</p>
                <a href="recipeDetail.html?id=${recipe._id}" class="btn btn-primary">View Details</a> <!-- Link to recipe detail page -->
            </div>
        </div>
    `;
    return card;
}