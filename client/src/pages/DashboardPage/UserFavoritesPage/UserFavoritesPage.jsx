/* eslint-disable camelcase */
import { useEffect } from "react";
import "./UserFavoritesPage.css";
import axios from "axios";
import {
  NavLink,
  useNavigate,
  useOutletContext,
  useLoaderData,
} from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../components/BackButton/BackButton";

export default function UserFavoritesPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const favorites = useLoaderData();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/checkauth`,
          { withCredentials: true }
        );

        const authenticatedUser = response.data.user;
        if (!authenticatedUser || authenticatedUser.id !== currentUser.id) {
          navigate("/connexion");
        }
      } catch (err) {
        console.error(err);
        navigate("/connexion");
      }
    };
    checkAuth();
  }, [currentUser, navigate]);
  if (!currentUser) {
    return navigate("/connexion");
  }

  const handleDeleteFavorite = async (favorite_id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/favorite/${favorite_id}`,
        favorites
      );
      toast.success("Favori éliminé correctement");
    } catch (error) {
      console.error("Erreur");
      toast.error("Un erreur s´est produit.Veuillez reessayer ultérieurement");
    }
  };
  return (
    <div className="recipes-body-user">
      <BackButton />
      <NavLink to="/ajout-recette" className="btn-add-recipe">
        Ajouter une nouvelle recette
      </NavLink>
      <ul className="list-dashboard">
        <li>
          <NavLink
            to={`/dashboard/${currentUser.id}`}
            className={({ isActive }) =>
              isActive ? "links-dashboard-active" : "links-dashboard"
            }
          >
            Mon profil
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/user/recipes/${currentUser.id}`}
            className={({ isActive }) =>
              isActive ? "links-dashboard-active" : "links-dashboard"
            }
          >
            Mes recettes
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/user/favorites/${currentUser.id}`}
            className={({ isActive }) =>
              isActive ? "links-dashboard-active" : "links-dashboard"
            }
          >
            Mes favoris
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? "links-dashboard-active" : "links-dashboard"
            }
          >
            Mes notifications
          </NavLink>
        </li>
      </ul>
      <div className="favorites-container">
        {favorites.map((r) => (
          <div className="favorite-card" key={r.favorite_id}>
            <div className="img-favorite-container">
              <img
                className="img-favorite"
                src={r.favorite_image}
                alt={r.favorite_name}
              />
            </div>
            <h3 className="favorite-name">{r.favorite_name}</h3>
            <button
              type="button"
              className="buttonDetails-recipecard-user"
              onClick={() => handleDeleteFavorite(r.favorite_id)}
            >
              🧡
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
