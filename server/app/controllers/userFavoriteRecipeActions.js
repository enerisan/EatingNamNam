const tables = require("../../database/tables");

const browse = async (req, res, next) => {
  try {
    const favorites = await tables.userFavoriteRecipe.readAll();
    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const favorites = await tables.userFavoriteRecipe.readFavoritesByUserId(
      req.params.id
    );

    if (favorites == null) {
      res.sendStatus(404);
    } else {
      res.json(favorites);
    }
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  const favorite = { ...req.body, id: req.params.id };
  try {
    await tables.userFavoriteRecipe.update(favorite);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  const favorite = req.body;
  try {
    const insertId = await tables.userFavoriteRecipe.create(favorite);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await tables.userFavoriteRecipe.delete(req.params.id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = { browse, read, edit, add, destroy };
