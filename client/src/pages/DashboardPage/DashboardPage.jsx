/* eslint-disable camelcase */
import axios from "axios";
import { useEffect } from "react";
import {
  NavLink,
  useLoaderData,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import UserBar from "../../components/UserBar/UserBar";
import "./DashboardPage.css";

export default function DashboardPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const { firstname, lastname, pseudo, image_profile, email, role, user_id } =
    data.user[0];
  const menus = data.menu.slice(0, 7);

  const dailyMenus = {
    Lundi: menus[0] || {},
    Mardi: menus[1] || {},
    Mercredi: menus[2] || {},
    Jeudi: menus[3] || {},
    Vendredi: menus[4] || {},
    Samedi: menus[5] || {},
    Dimanche: menus[6] || {},
  };

  const userBadges = data.user.filter((u) => u.badge_id);
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

  if (!currentUser) {
    return navigate("/connexion");
  }

  return (
    <>
      <UserBar role={role} user_id={user_id} />

      <div className="body-dashboard">
        <div
          className={
            role === "user" ? "container-infos" : "container-infos-admin"
          }
        >
          <img
            className={
              role === "user" ? "img-profile-user" : "image-profile-admin"
            }
            src={image_profile}
            alt="avatar"
          />
          <div className="infos">
            <div className="pseudo">
              <h2>{pseudo}</h2>
            </div>
            <div className="cle">
              <h2>
                {firstname} {lastname}
              </h2>
            </div>
            <div className="cle">
              <h2>{email}</h2>
            </div>

            <NavLink
              to={`/admin/users/modif/${user_id}`}
              className={
                role === "user" ? "button-modify" : "button-modify-admin"
              }
            >
              Modifier mon profil
            </NavLink>
          </div>
        </div>

        {role === "user" ? (
          <div className="container-badges-planning">
            <div className="container-badges">
              <h1>Mes badges</h1>
              {userBadges.length > 0 ? (
                userBadges.map((u) => (
                  <img
                    key={u.id}
                    src={u.badge_image}
                    alt={u.badge_description}
                    title={`${u.badge_name} - ${u.badge_description}`}
                    className="img-badge"
                  />
                ))
              ) : (
                <p>Aucun badge disponible</p>
              )}
            </div>
            <div className="container-planning">
              <h1 className="title-planning">Mon planning </h1>
              <div className="days">
                {Object.keys(dailyMenus).map((day) => (
                  <div key={day} className="day-column">
                    <div className="day-name">{day}</div>
                    <div className="img-menu-container">
                      {dailyMenus[day].recipe_image ? (
                        <img
                          src={dailyMenus[day].recipe_image}
                          className="img-menu"
                          alt={dailyMenus[day].recipe_name}
                        />
                      ) : (
                        <p>Aucun menu</p>
                      )}
                    </div>
                    <h3>{dailyMenus[day].recipe_name || ""}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="container-dash-admin">
            <NavLink to="/admin/users" className="container-admin">
              <h1>Utilisateurs</h1>
            </NavLink>
            <div className="container-admin">
              <NavLink to="/admin/recipes" className="container-admin">
                <h1>Recettes</h1>
              </NavLink>
            </div>
            <div className="container-admin">
              <NavLink to="/admin/ingredients" className="container-admin">
                <h1>Ingredients</h1>
              </NavLink>
            </div>
            <div className="container-admin">
              <NavLink to="/admin/comments" className="container-admin">
                <h1>Commentaires</h1>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
