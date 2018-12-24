///////////////////////////////////////////////////////////////////
// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Sopping list object
 * - Liked recipes
 */
const state = {};

// an async expression function
/**
 * Search controller
 */
const controlSearch = async () => {
    //1 - get the query from the view
    const query = searchView.getInput();

    // TESTING
    //const query = 'pizza';


    if (query) {
        // 2 - New search object and add it to state
        state.search = new Search(query);

        // 3 - Prepare the UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4 - Search for recipes
            await state.search.getResults();

            // 5 - Render results on UI
            clearLoader();
            searchView.rederResults(state.search.result);

        } catch (err) {
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }

}

/** 
 * Recipe controller
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe); // the spinning wheel

        // Hightlight selected search item 
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);

        // TESTING
        //window.r = state.recipe;

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings in time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert('Error processing recipe');
            console.log(err);
        }
    }
}
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

//sets the window to listen to these events, avoiding the repetion above; 
[
    // events 
    'hashchange',
    'load'
].forEach(event => window.addEventListener(event, controlRecipe));


/////////////////////////////////////////////////////////////
// Buttons
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();

    controlSearch();
});

// TESTING
/*
window.addEventListener('load', event => {
    event.preventDefault();

    controlSearch();
});
*/


// event delegation
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // parse int specifies that it is decimal
        const goToPage = parseInt(btn.dataset.goto, 10); // activates goto function attributed to the button
        searchView.clearResults();
        searchView.rederResults(state.search.result, goToPage);
    };
});



// testing the async function
/*search.getResults()
    .then( recipes => console.log(recipes[0]))
    .catch( error => console.log(error));
*/


// key = 8092d77f911d7f024b2081f0d87a294b
// API URL for search requests
// http://food2fork.com/api/search 
// and this for recipe requests: 
// http://food2fork.com/api/get 