/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Navigate, useLoaderData, useOutletContext } from "react-router-dom";
import "./RecipeDetails.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import BackButton from "../../components/BackButton/BackButton";

function RecipeDetails() {
  const data = useLoaderData();

  const { currentUser } = useOutletContext();

  const {
    id,
    recipe_name,
    recipe_number_of_people,
    recipe_description,
    recipe_image,
    recipe_date,
    set_up_time,
    user_firstname,
    user_lastname,
  } = data.recipeUser;

  const postDate = new Date(recipe_date);
  const day = postDate.getDate();
  const month = postDate.getMonth() + 1;
  const year = postDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const userId = currentUser?.id;

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    if (!userId) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris");
      return;
    }
    const favorite = {
      user_id: userId,
      recipe_id: id,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/favorite`,
        favorite
      );
      setIsFavorite(true);
      toast.success("Votre recette a bien été ajoutée comme favorite");
    } catch (err) {
      toast.error("Une erreur es survenue, veuillez réessayer ultérieurement");
    }
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  if (!currentUser) {
    Navigate("/connexion");
  }

  const onSubmit = async (formData) => {
    if (!userId) {
      toast.error("Veuillez vous connecter pour envoyer un commentaire");
      return;
    }
    const comment = { ...formData };

    comment.user_id = currentUser.id;

    comment.recipe_id = id;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/comment`, comment);
      toast.success(
        "Votre commentaire a été soumis avec succès et est en attente de validation. "
      );
    } catch (err) {
      console.error(err);
      toast.error("Une erreur es survenue, veuillez réessayer ultérieurement");
    }
  };

  return (
    <div>
      <BackButton />
      <div className="recipeDetailContainer ">
        <h1 className="recipeDetailTitle">{recipe_name}</h1>
        <div className="buttonContainer">
          <button type="button" className="numberPeople">
            😋 Nombre de personnes : {recipe_number_of_people}
          </button>
          <button type="button" className="numberPeople">
            ⏰ Temps : {set_up_time}´
          </button>
        </div>
        <img
          className="recipeDetailImage"
          src={recipe_image}
          alt={recipe_name}
        />

        <div className="buttonContainer">
          <button type="button" className="planning">
            📅 Ajouter au planning
          </button>
          <button
            type="button"
            className="favoris"
            onClick={handleFavorite}
            disabled={isFavorite}
          >
            {isFavorite ? "Mise en favoris 🧡" : "Mettre en favoris 🖤"}
          </button>
        </div>

        <div className="lineContainer">
          <h2 className="ingredientTitle">Ingrédients</h2>
          <div className="customLine" />

          <div className="ingredientContainer">
            {data.recipeIngredients.map((ingredient) => (
              <div key={ingredient.ingredient_id} className="ingredientItem">
                <img
                  className="ingredientImage"
                  src={ingredient.ingredient_image}
                  alt={ingredient.ingredient_name}
                />
                <p className="ingredientName">{ingredient.ingredient_name}</p>
                <p className="ingredientQuantity">
                  {ingredient.ingredient_quantity} gr
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="lineContainer">
          <h2 className="recipeTitle">Recette</h2>
          <div className="customLine" />

          <p className="recipeDescription">{recipe_description}</p>
        </div>
        <div className="lineContainer">
          <h2 className="authorTitle">Auteur</h2>
          <div className="customLine" />
        </div>
        <div className="textContainer">
          <p className="post">Postée le : {formattedDate}</p>
          <p className="">
            Par : {user_firstname} {user_lastname}
          </p>
        </div>

        <div className="lineContainer">
          <h2 className="authorTitle">Commentaires</h2>
          <div className="customLine" />
        </div>

        {data.comments.map((comment) => {
          const commentDate = new Date(comment.date);
          const dayComment = commentDate.getDate();
          const monthComment = commentDate.getMonth() + 1;
          const yearComment = commentDate.getFullYear();
          const formattedCommentDate = `${dayComment}/${monthComment}/${yearComment}`;

          return (
            <>
              <div className="textContainer" key={comment.id}>
                <p>{comment.description}</p>
                <p>{formattedCommentDate}</p>
                <p>Author: {comment.user}</p>
              </div>
              <div className="lineContainer">
                <div className="customLine" />
              </div>
            </>
          );
        })}

        <div className="lineContainer">
          <h2 className="avisTitle">Donnez votre avis</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="commentaireForm">
            <textarea
              name="description"
              className="comment-box"
              placeholder={
                currentUser
                  ? "Envoyez votre commentaire"
                  : "Veuillez vous connecter pour envoyer un commentaire"
              }
              rows="5"
              cols="33"
              {...register("description", {
                required: "Un commentaire est obligatoire",
                minLength: {
                  value: 3,
                  message:
                    "Votre commentaire doit contenir au moins 3 caractères",
                },
              })}
            />
            {errors.description && (
              <span className="recipeCreationError">
                {errors.description.message}
              </span>
            )}
            <button
              className="commentaireSubmit"
              type="submit"
              disabled={!currentUser}
            >
              Envoyez votre commentaire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
