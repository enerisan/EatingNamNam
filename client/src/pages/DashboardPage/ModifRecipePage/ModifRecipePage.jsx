/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */

import "./ModifRecipePage.css";
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
import BackButton from "../../../components/BackButton/BackButton";

export default function ModifRecipePage() {
  const navigate = useNavigate();
  const { ingredients, recipeIngredients, recipeUser, recipeLabels } =
    useLoaderData();

  const {
    id,
    recipe_description,
    recipe_image,
    recipe_name,
    recipe_number_of_people,
    set_up_time,
    is_validated,
  } = recipeUser;

  const allLabels = [
    { id: 1, name: "Végétarien" },
    { id: 2, name: "Végétalien" },
    { id: 3, name: "Sans gluten" },
    { id: 4, name: "Sans lactose" },
    { id: 5, name: "Cétogène" },
    { id: 6, name: "Pescétarien" },
  ];

  const [value, setValue] = useState("");
  const [ingredientsSelected, setIngredientsSelected] = useState(
    (recipeIngredients || []).map((ingredient) => ({
      id: ingredient.ingredient_id,
      name: ingredient.ingredient_name,
      quantity: ingredient.ingredient_quantity,
    }))
  );
  const [selectedLabels, setSelectedLabels] = useState(
    recipeLabels && recipeLabels.length > 0
      ? recipeLabels.map((label) => label.id)
      : []
  );
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
        navigate("/connexion");
      }
    };

    checkAuth();
  }, [currentUser, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      name: recipe_name,
      image: recipe_image,
      number_of_people: recipe_number_of_people,
      set_up_time,
      description: recipe_description,
      is_validated,
    },
  });

  useEffect(() => {
    setFormValue("name", recipe_name);
    setFormValue("image", recipe_image);
    setFormValue("number_of_people", recipe_number_of_people);
    setFormValue("set_up_time", set_up_time);
    setFormValue("description", recipe_description);
    setFormValue("is_validated", is_validated);
  }, [
    setFormValue,
    recipe_name,
    recipe_image,
    recipe_number_of_people,
    set_up_time,
    recipe_description,
    is_validated,
  ]);

  const onSubmit = async (data) => {
    if (selectedLabels.length === 0) {
      toast.error("Vous devez sélectionner au moins un label.");
      return;
    }
    const myObj = {
      recipe: { ...data, user_id: recipeUser.user_id },
      ingredients: ingredientsSelected.map((ingredient) => ({
        id: ingredient.id,
        quantity: ingredient.quantity,
      })),
      labels: selectedLabels,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/recipe/${id}`,
        myObj
      );
      toast.success("Votre recette a bien été mise à jour!");
      navigate("/admin/recipes");
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  };

  const filterInputs = (inputValue) => {
    const trimmedInputValue = inputValue.trim().toLowerCase();
    return trimmedInputValue.length === 0
      ? []
      : ingredients.filter((ingredient) =>
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

  const selectIngredient = (ingredient) => {
    setIngredientsSelected((prevSelected) => [
      ...prevSelected,
      { ...ingredient, quantity: 0 },
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
      prevSelected.filter(
        (ingredient) => ingredient.id !== ingredientToRemove.id
      )
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

  const toggleLabel = (labelId) => {
    setSelectedLabels((prevLabels) =>
      prevLabels.includes(labelId)
        ? prevLabels.filter((label) => label !== labelId)
        : [...prevLabels, labelId]
    );
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
              placeholder={recipe_name || "Écrivez le nom de votre recette"}
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
              src={recipe_image || "images/add_img.png"}
              alt="Ajouter"
            />
            <input
              type="url"
              name="image"
              className="recipeImageLink"
              placeholder={recipe_image || "Saisissez l'url de l'image"}
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
              placeholder={recipe_number_of_people || "Nombre de personnes"}
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
              placeholder={set_up_time || "Temps de préparation (en minutes)"}
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
                    placeholder={ingredient.quantity || "Quantité (en grammes)"}
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
              placeholder={
                recipe_description || "Décrivez ici le déroulé de votre recette"
              }
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
            <label htmlFor="is_validated">
              Valider
              <input
                type="checkbox"
                id="is_validated"
                {...register("is_validated")}
              />
            </label>
            <div className="labelSelection">
              <p>Labels:</p>
              {allLabels.map((label) => (
                <label key={label.id} className="labelCheckbox">
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                  />
                  {label.name}
                </label>
              ))}
            </div>
            <button className="recipeSubmit" type="submit">
              Mettre à jour votre recette
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
