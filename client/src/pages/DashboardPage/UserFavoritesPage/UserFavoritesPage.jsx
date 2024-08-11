/* eslint-disable camelcase */

import { useState, useEffect } from "react";
import "./UserFavoritesPage.css";
import axios from "axios";
import { useNavigate, useOutletContext, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import UserBar from "../../../components/UserBar/UserBar";

export default function UserFavoritesPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const initialFavorites = useLoaderData();
  const { role, id } = currentUser;
  const user_id = id;

  const [favorites, setFavorites] = useState(initialFavorites);

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
        `${import.meta.env.VITE_API_URL}/api/favorite/${favorite_id}`
      );
      toast.success("Favori éliminé correctement");
      setFavorites(favorites.filter((fav) => fav.favorite_id !== favorite_id));
    } catch (error) {
      console.error("Erreur");
      toast.error(
        "Une erreur s'est produite. Veuillez réessayer ultérieurement"
      );
    }
  };
  return (
    <div className="recipes-body-user">
      <UserBar role={role} user_id={user_id} />
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
