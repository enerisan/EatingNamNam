/* eslint-disable camelcase */
import { useEffect } from "react";
import "./UserRecipePage.css";
import axios from "axios";
import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import UserBar from "../../../components/UserBar/UserBar";

export default function UserRecipesPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const data = useLoaderData();

  const user = data.user[0];
  const { role, user_id } = user;

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

  if (!currentUser) {
    return navigate("/connexion");
  }

  const handleDetailsClick = (recipe) => {
    if (recipe.is_validated) {
      navigate(`/details/${recipe.recipe_id}`);
    } else {
      toast.warn("Cette recette est en attente de validation.");
    }
  };

  return (
    <>
      <UserBar role={role} user_id={user_id} />
      <div className="recipes-body-user">
        <div className="recipes-container-user">
          {data.recipes.map((r) => (
            <div className="recipe-card-user" key={r.id}>
              <h3>{r.recipe_name}</h3>
              <div className="img-recipe-container-user">
                <img className="img-recipe-user" src={r.image} alt={r.name} />
              </div>

              <div className="recipe-infos-user">
                <p>😋 Recette pour {r.number_of_people} personnes </p>
                <p>⏰ Temps de prép. : {r.set_up_time}´</p>
                {r.is_validated ? "✔️ Validée" : " ❌ En attente de validation"}
                <p>📝{r.description.split(" ").slice(0, 8).join(" ")} ... </p>
              </div>
              <button
                type="button"
                className="buttonDetails-recipecard-user"
                onClick={() => handleDetailsClick(r)}
              >
                Plus de détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
