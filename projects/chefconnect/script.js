document.addEventListener('DOMContentLoaded', () => {
    const addRecipeForm = document.getElementById('add-recipe-form');
    const recipeGrid = document.getElementById('recipe-grid');

    // Default recipes if localStorage is empty
    const defaultRecipes = [
        {
            title: "Spicy Chicken Stir-fry",
            description: "A quick and flavorful stir-fry with tender chicken and crisp vegetables, perfect for a weeknight meal.",
            ingredients: "Chicken breast, Bell peppers, Onions, Soy sauce, Ginger, Garlic, Chili flakes, Broccoli",
            instructions: "1. Slice chicken and vegetables. 2. Sauté chicken until browned. 3. Add vegetables and stir-fry. 4. Add sauce and simmer.",
            imageUrl: "https://via.placeholder.com/250x150?text=Spicy+Chicken+Stir-fry",
            source: "ChefConnect Community"
        },
        {
            title: "Mediterranean Lentil Soup",
            description: "Hearty and nutritious lentil soup packed with Mediterranean flavors, fresh herbs, and vegetables.",
            ingredients: "Brown lentils, Carrots, Celery, Onions, Diced tomatoes, Vegetable broth, Spinach, Cumin, Coriander",
            instructions: "1. Sauté aromatics. 2. Add lentils, broth, and tomatoes; simmer. 3. Stir in spinach. 4. Season and serve.",
            imageUrl: "https://via.placeholder.com/250x150?text=Mediterranean+Lentil+Soup",
            source: "Grandma's Kitchen"
        },
        {
            title: "Classic Chocolate Chip Cookies",
            description: "The timeless favorite: warm, gooey chocolate chip cookies with a perfect crispy edge and soft center.",
            ingredients: "All-purpose flour, Baking soda, Salt, Unsalted butter, Granulated sugar, Brown sugar, Eggs, Vanilla extract, Chocolate chips",
            instructions: "1. Cream butter and sugars. 2. Beat in eggs and vanilla. 3. Mix dry ingredients, then add to wet. 4. Fold in chocolate chips. 5. Bake until golden.",
            imageUrl: "https://via.placeholder.com/250x150?text=Chocolate+Chip+Cookies",
            source: "Traditional Recipe"
        }
    ];

    // Function to load recipes from localStorage or use defaults
    const loadRecipes = () => {
        const recipes = JSON.parse(localStorage.getItem('chefConnectRecipes'));
        if (!recipes || recipes.length === 0) {
            localStorage.setItem('chefConnectRecipes', JSON.stringify(defaultRecipes));
            return defaultRecipes;
        }
        return recipes;
    };

    // Function to save recipes to localStorage
    const saveRecipes = (recipes) => {
        localStorage.setItem('chefConnectRecipes', JSON.stringify(recipes));
    };

    // Function to display recipes in the DOM
    const displayRecipes = () => {
        recipeGrid.innerHTML = ''; // Clear current recipes
        const recipes = loadRecipes();
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.imageUrl || 'https://via.placeholder.com/250x150?text=Recipe+Image'}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <div class="card-actions">
                    <button class="btn-primary view-recipe-btn">View Recipe</button>
                    <button class="btn-secondary add-to-plan-btn">Add to Plan</button>
                </div>
            `;
            recipeGrid.appendChild(recipeCard);

            // Add event listener for "View Recipe" button (simple alert for now)
            recipeCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
                alert(
                    `Recipe: ${recipe.title}\n\n` +
                    `Ingredients:\n${recipe.ingredients}\n\n` +
                    `Instructions:\n${recipe.instructions}\n\n` +
                    `Source: ${recipe.source}`
                );
            });
        });
    };

    // Handle adding a new recipe
    addRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const newRecipe = {
            title: document.getElementById('recipe-title').value.trim(),
            description: document.getElementById('recipe-description').value.trim(),
            ingredients: document.getElementById('recipe-ingredients').value.trim(),
            instructions: document.getElementById('recipe-instructions').value.trim(),
            imageUrl: document.getElementById('recipe-image').value.trim(),
            source: document.getElementById('recipe-source').value.trim() || 'ChefConnect User'
        };

        if (newRecipe.title && newRecipe.ingredients && newRecipe.instructions) {
            const recipes = loadRecipes();
            recipes.push(newRecipe);
            saveRecipes(recipes);
            displayRecipes(); // Re-render the grid with the new recipe
            addRecipeForm.reset(); // Clear the form
            alert('Recipe added successfully!');
        } else {
            alert('Please fill in at least the title, ingredients, and instructions.');
        }
    });

    // Initial display of recipes when the page loads
    displayRecipes();
});