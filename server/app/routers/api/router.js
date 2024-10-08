const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const userRouter = require("./user/router");
const menuRouter = require("./menu/router");
const commentRouter = require("./comment/router");
const recipesRouter = require("./recipe/router");
const labelsRouter = require("./labels/router");
const badgeRouter = require("./badges/router");
const ingredientRouter = require("./ingredient/router");
const recipeLabelRouter = require("./recipeLabel/router");
const recipeIngredientRouter = require("./recipeIngredient/router");
const authRouter = require("./auth/router");
const cookieConsentRouter = require("./cookies/router");
const userFavoriteRecipeRouter = require("./userFavoriteRecipe/router");

router.use("/user", userRouter);
router.use("/menu", menuRouter);
router.use("/comment", commentRouter);
router.use("/recipe", recipesRouter);
router.use("/labels", labelsRouter);
router.use("/badges", badgeRouter);
router.use("/ingredient", ingredientRouter);
router.use("/recipe-label", recipeLabelRouter);
router.use("/recipe-ingredient", recipeIngredientRouter);
router.use("/auth", authRouter);
router.use("/cookies", cookieConsentRouter);
router.use("/favorite", userFavoriteRecipeRouter);
/* ************************************************************************* */

module.exports = router;
