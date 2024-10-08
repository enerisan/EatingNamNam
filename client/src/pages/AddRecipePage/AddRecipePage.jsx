/* eslint-disable react/jsx-props-no-spreading */

import "./AddRecipePage.css";
import {
  NavLink,
  useLoaderData,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autosuggest from "react-autosuggest";
import BackButton from "../../components/BackButton/BackButton";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const ingredientsData = useLoaderData();
  const [value, setValue] = useState("");
  const [ingredientsSelected, setIngredientsSelected] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const { currentUser } = useOutletContext();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/checkauth`,
          {
            withCredentials: true,
          }
        );
        const authenticatedUser = response.data.user;
        if (!authenticatedUser || authenticatedUser.id !== currentUser.id) {
          navigate("/connexion");
        }
      } catch (e) {
        console.error(e);
        navigate("connexion");
      }
    };

    checkAuth();
  }, [currentUser, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  if (!currentUser) {
    navigate("/connexion");
  }

  const onSubmit = async (data) => {
    const myObj = {};

    myObj.recipe = { data: { ...data }, user_id: currentUser.id };
    myObj.ingredients = ingredientsSelected.map((ingredient) => ({
      id: ingredient.id,
      quantity: ingredient.quantity,
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/recipe`, myObj);
      toast.success(
        "Votre recette a bien été ajoutée et est maintenant en attente de validation.",
        navigate(`/user/recipes/${currentUser.id}`)
      );
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  };

  const filterInputs = (inputValue) => {
    const trimmedInputValue = inputValue.trim().toLowerCase();
    const inputLength = trimmedInputValue.length;
    return inputLength === 0
      ? []
      : ingredientsData.filter((ingredient) =>
          ingredient.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(trimmedInputValue)
        );
  };

  const onSuggestionsFetchRequested = ({ value: inputValue }) => {
    setSuggestions(filterInputs(inputValue));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const selectIngredient = (ingredient, quantity) => {
    setIngredientsSelected((prevSelected) => [
      ...prevSelected,
      { ...ingredient, quantity },
    ]);
    setValue("");
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => `${suggestion.name}`;

  const renderSuggestion = (suggestion) => (
    <button
      type="button"
      className="suggestion"
      onClick={() => selectIngredient(suggestion)}
    >
      {suggestion.name}
    </button>
  );

  const removeIngredient = (ingredientToRemove) => {
    setIngredientsSelected((prevSelected) =>
      prevSelected.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const onChange = (e, { newValue }) => {
    setValue(newValue);
  };

  const inputProps = {
    placeholder: "Cherchez un ingrédient",
    value,
    onChange,
  };

  const eventEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ingredient = e.target.value;
      selectIngredient(ingredient);
    }
  };

  return (
    <div>
      <BackButton />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="connectionForm">
          <div className="recipeTopContainer">
            <input
              type="text"
              className="recipeName"
              name="name"
              placeholder="Écrivez le nom de votre recette"
              {...register("name", {
                required: "Le nom de la recette est obligatoire",
                minLength: {
                  value: 3,
                  message:
                    "Le nom de la recette doit contenir au moins 3 caractères",
                },
              })}
            />
            {errors.name && (
              <span className="recipeCreationError">{errors.name.message}</span>
            )}

            <img
              className="recipeImage"
              src="images/add_img.png"
              alt="Ajouter"
            />
            <input
              type="url"
              name="image"
              className="recipeImageLink"
              placeholder="Saisissez l'url de l'image"
              {...register("image", {
                required: "L'URL de l'image est obligatoire",
                pattern: {
                  value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                  message: "Veuillez entrer une URL valide",
                },
              })}
            />
            {errors.image && (
              <span className="recipeCreationError">
                {errors.image.message}
              </span>
            )}
          </div>
          <div className="recipeSecondaryInfo">
            <input
              type="number"
              className="numberOfPeople"
              name="number_of_people"
              placeholder="Nombre de personnes"
              {...register("number_of_people", {
                required: "Le nombre de personnes est obligatoire",
                pattern: {
                  value: /^[0-9]+$/,
                  message:
                    "Le nombre de personnes ne doit contenir que des chiffres",
                },
              })}
            />
            {errors.number_of_people && (
              <span className="recipeCreationError">
                {errors.number_of_people.message}
              </span>
            )}
            <input
              type="number"
              className="preparationTime"
              name="set_up_time"
              placeholder="Temps de préparation (en minutes)"
              {...register("set_up_time", {
                required: "Le temps de préparation est obligatoire",
                pattern: {
                  value: /^[0-9]+$/,
                  message:
                    "Le temps de préparation ne doit contenir que des chiffres",
                },
              })}
            />
            {errors.set_up_time && (
              <span className="recipeCreationError">
                {errors.set_up_time.message}
              </span>
            )}
          </div>
          <div className="autosuggest">
            <div className="autosuggestInteraction">
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={eventEnter}
              />
              <NavLink to="/ingredient" className="newIngredient">
                {" "}
                Créez un ingrédient s'il n'existe pas
              </NavLink>
            </div>
            <p>Ingrédients ajoutés :</p>
            <ul>
              {ingredientsSelected.map((ingredient, index) => (
                <li key={ingredient.id}>
                  {ingredient.name}
                  <button
                    type="button"
                    className="removeIngredient"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    ✖
                  </button>
                  <input
                    type="number"
                    className="quantity"
                    name={`quantity-${index}`}
                    placeholder="Quantité (en grammes)"
                    {...register("quantity", {
                      required: "La quantité est obligatoire",
                      pattern: {
                        value: /^[0-9]+$/,
                        message:
                          "La quantité ne doit contenir que des chiffres",
                      },
                    })}
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const newQuantity = e.target.value;
                      setIngredientsSelected((prevSelected) =>
                        prevSelected.map((ing, i) =>
                          i === index ? { ...ing, quantity: newQuantity } : ing
                        )
                      );
                    }}
                  />
                  {errors.quantity && (
                    <span className="recipeCreationError">
                      {errors.quantity.message}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="recipeDescriptionContainer">
            <label htmlFor="recipeDescription">
              Description de votre recette
            </label>
            <textarea
              name="description"
              className="recipeDescription"
              placeholder="Décrivez ici le déroulé de votre recette"
              rows="5"
              cols="33"
              {...register("description", {
                required: "Une description est obligatoire",
                minLength: {
                  value: 30,
                  message:
                    "La description doit contenir au moins 30 caractères",
                },
              })}
            />
            {errors.description && (
              <span className="recipeCreationError">
                {errors.description.message}
              </span>
            )}
            <button className="recipeSubmit" type="submit">
              Ajoutez votre recette
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
