document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const recipeId = queryParams.get('id'); // Get the recipe ID from the URL

    if (recipeId) {
        fetchRecipeDetails(recipeId);
    } else {
        console.error('No recipe ID provided in the URL');
    }
});

function fetchRecipeDetails(id) {
    fetch(`/api/recipes/${id}`)  // Fetch the recipe details by ID
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(recipe => {
            if (recipe) {
                displayRecipeDetails(recipe);
            } else {
                console.error('Recipe not found');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}

function displayRecipeDetails(recipe) {
    document.getElementById('recipe-name').textContent = recipe.recipeName;
    document.getElementById('recipe-cuisine').textContent = recipe.cuisine;
    document.getElementById('recipe-category').textContent = recipe.category;
    document.getElementById('recipe-instructions').textContent = recipe.instructions;
}
