/* eslint-disable camelcase */
import { useLoaderData, useOutletContext } from "react-router-dom";
import "./RecipeDetails.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import BackButton from "../../components/BackButton/BackButton";

function RecipeDetails() {
  const data = useLoaderData();

  const currentUser = useOutletContext();

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

  const userId = currentUser.currentUser.id;

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
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
            onClick={currentUser ? handleFavorite : null}
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
          <h2 className="avisTitle">Donnez votre avis</h2>
          <div className="customLine" />

          <div className="comment-box">-- Ajouter un commentaire --</div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
