/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  useLoaderData,
  useOutletContext,
  useNavigate,
  NavLink,
} from "react-router-dom";
import "./AdminIngredientsPage.css";
import { toast } from "react-toastify";
import UserBar from "../../../components/UserBar/UserBar";

export default function AdminIngredientsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const { role, id } = currentUser;
  const user_id = id;
  const initialIngredients = useLoaderData();
  const [ingredients, setIngredients] = useState(initialIngredients);

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

  const handleDeleteIngredient = async (ingredient_id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ingredient/${ingredient_id}`,
        ingredients
      );
      toast.success("Ingredient éliminé correctement");
      setIngredients(ingredients.filter((ing) => ing.id !== ingredient_id));
    } catch (error) {
      toast.error(
        "Une erreur s'est produite. Veuillez réessayer ultérieurement"
      );
    }
  };

  return (
    <div className="ingredients-body">
      <UserBar role={role} user_id={user_id} />

      <div className="ingredients-container-ad">
        {ingredients.map((i) => (
          <div className="ingredient-card-ad" key={i.id}>
            <h3>{i.name}</h3>
            <div className="img-ingredient-cont">
              <img className="img-ingre-ad" src={i.image} alt={i.name} />
            </div>

            <div className="ingredient-infos">
              <div className="emoji-info">
                {" "}
                <p className="emoji">🍱 </p> <p>Catégory : {i.category}</p>
              </div>
              <div className="emoji-info">
                <p className="emoji-calories">🔋</p>{" "}
                <p>Calories : {i.calories}</p>
              </div>
            </div>
            <div className="btns-modif-supr">
              <NavLink to={`/admin/ingredient/modif/${i.id}`}>
                <button type="button" className="buttonDetails-ingredientcard">
                  Modifier
                </button>
              </NavLink>
              <button
                type="button"
                className="buttonDetails-ingredientcard"
                onClick={() => handleDeleteIngredient(i.id)}
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
