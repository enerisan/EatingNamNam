/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  useLoaderData,
  useOutletContext,
  useNavigate,
  NavLink,
} from "react-router-dom";
import "./AdminRecipesPage.css";
import { toast } from "react-toastify";
import UserBar from "../../../components/UserBar/UserBar";

export default function AdminRecipesPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const { role, id } = currentUser;
  const user_id = id;
  const initialRecipes = useLoaderData();
  const [recipes, setRecipes] = useState(initialRecipes);

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

  if (!currentUser) {
    return navigate("/connexion");
  }

  const handleDeleteRecipe = async (recipe_id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/recipe/${recipe_id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Recette éliminée correctement");
      setRecipes(recipes.filter((rec) => rec.id !== recipe_id));
    } catch (error) {
      toast.error(
        "Une erreur s'est produite. Veuillez réessayer ultérieurement"
      );
    }
  };
  return (
    <div className="recipes-body">
      <UserBar role={role} user_id={user_id} />

      <div className="recipes-container-ad">
        {recipes.map((r) => (
          <div className="recipe-card-ad" key={r.id}>
            <h3>{r.name}</h3>
            <div className="img-recipe-container">
              <img className="img-recipe-ad" src={r.image} alt={r.name} />
            </div>

            <div className="recipe-infos">
              <p> 😋 Recette pour {r.number_of_people} personnes </p>

              <div className="validation">
                {r.is_validated ? "✔️ validée" : " ❌ En attente de validation"}
              </div>
            </div>
            <div className="btns-modif-supr">
              <NavLink to={`/admin/recipes/modif/${r.id}`}>
                <button type="button" className="buttonDetails-recipecard">
                  Modifier
                </button>
              </NavLink>
              <button
                type="button"
                className="buttonDetails-recipecard"
                onClick={() => handleDeleteRecipe(r.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
