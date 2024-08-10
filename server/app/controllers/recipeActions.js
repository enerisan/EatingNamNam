/* eslint-disable camelcase */
const tables = require("../../database/tables");

const browse = async (req, res, next) => {
  try {
    const recipes = await tables.recipe.readAll();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};
const read = async (req, res, next) => {
  try {
    const ingredients = await tables.ingredient.readAll();

    if (ingredients == null) {
      res.sendStatus(404);
    }

    const recipeIngredients = await tables.recipe.readRecipeIngredients(
      req.params.id
    );
    if (recipeIngredients == null) {
      res.sendStatus(404);
    }

    const recipeUser = await tables.recipe.readRecipeUser(req.params.id);
    if (recipeUser == null) {
      res.sendStatus(404);
    }

    const recipeLabels = await tables.recipeLabel.readLabelsByRecipeId(
      req.params.id
    );
    if (recipeLabels == null) {
      res.sendStatus(404);
    }

    const comments = await tables.comment.readCommentsByRecipeId(
      req.params.id
    );
    if (comments == null) {
      res.sendStatus(404);
    }

    const data = {
      ingredients,
      recipeIngredients,
      recipeUser,
      recipeLabels,
      comments,
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  const recipe = { ...req.body.recipe, id: req.params.id };
  const { ingredients = [], labels = [] } = req.body;

  try {
    await tables.recipe.update(recipe);

    await tables.recipeIngredient.deleteByRecipeId(recipe.id);

    await Promise.all(
      ingredients.map((ingredient) =>
        tables.recipeIngredient.create({
          recipe_id: recipe.id,
          ingredient_id: ingredient.id,
          quantity: ingredient.quantity,
        })
      )
    );

    await tables.recipeLabel.deleteByRecipeId(recipe.id);

    await Promise.all(
      labels.map((label_id) =>
        tables.recipeLabel.create({
          recipe_id: recipe.id,
          label_id,
        })
      )
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const add = async (req, res, next) => {
  const { recipe, ingredients } = req.body;
  try {
    const insertId = await tables.recipe.create(recipe);
    const ingredientInsert = ingredients.map(async (i) => {
      await tables.recipeIngredient.create({
        recipe_id: insertId,
        ingredient_id: i.id,
        quantity: i.quantity,
      });
    });

    res.status(201).json({ insertId, ingredientInsert });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  try {
    await tables.recipe.delete(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
