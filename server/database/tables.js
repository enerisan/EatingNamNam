// Import the repository modules responsible for handling data operations on the tables
const UserRepository = require("./models/UserRepository");
const MenuRepository = require("./models/MenuRepository");
const IngredientRepository = require("./models/IngredientRepository");
const CommentRepository = require("./models/CommentRepository");
const RecipeRepository = require("./models/RecipeRepository");
const LabelRepository = require("./models/LabelRepository");
const BadgeRepository = require("./models/BadgeRepository");
const RecipeLabelRepository = require("./models/RecipeLabelRepository");
const RecipeIngredientRepository = require("./models/RecipeIngredientRepository");
const UserFavoriteRecipeRepository = require("./models/UserFavoriteRecipeRepository");
// Create an empty object to hold data repositories for different tables
const tables = {};

/* ************************************************************************* */
// Register data repositories for tables
/* ************************************************************************* */

// Register each repository as data access point for its table
tables.user = new UserRepository();
tables.menu = new MenuRepository();
tables.ingredient = new IngredientRepository();
tables.comment = new CommentRepository();
tables.recipe = new RecipeRepository();
tables.label = new LabelRepository();
tables.badge = new BadgeRepository();
tables.recipeLabel = new RecipeLabelRepository();
tables.recipeIngredient = new RecipeIngredientRepository();
tables.userFavoriteRecipe = new UserFavoriteRecipeRepository();

/* ************************************************************************* */

// Use a Proxy to customize error messages when trying to access a non-existing table

// Export the Proxy instance with custom error handling
module.exports = new Proxy(tables, {
  get(obj, prop) {
    // Check if the property (table) exists in the tables object
    if (prop in obj) return obj[prop];

    // If the property (table) does not exist, throw a ReferenceError with a custom error message
    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in ${__filename}?`
    );
  },
});
