/* eslint-disable camelcase */
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import AddRecipeButton from "../AddRecipeButton/AddRecipeButton";
import BackButton from "../BackButton/BackButton";

export default function UserBar({ role, user_id }) {
  const location = useLocation();
  const isIngredientsActive = location.pathname === "/admin/ingredients";
  return (
    <>
      <div className="high-page-recipe">
        <BackButton />
        {isIngredientsActive ? (
          <NavLink to="/ingredient" className="btn-add-recipe">
            Ajouter un ingredient
          </NavLink>
        ) : (
          <AddRecipeButton />
        )}
      </div>
      <ul className="list-dashboard">
        <li>
          <NavLink
            to={`/dashboard/${user_id}`}
            className={({ isActive }) =>
              isActive ? "links-dashboard-active" : "links-dashboard"
            }
          >
            Mon profil
          </NavLink>
        </li>
        {role === "user" ? (
          <>
            <li>
              <NavLink
                to={`/user/recipes/${user_id}`}
                className={({ isActive }) =>
                  isActive ? "links-dashboard-active" : "links-dashboard"
                }
              >
                Mes recettes
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/user/favorites/${user_id}`}
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
          </>
        ) : (
          role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    isActive ? "links-dashboard-active" : "links-dashboard"
                  }
                >
                  Utilisateurs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/recipes"
                  className={({ isActive }) =>
                    isActive ? "links-dashboard-active" : "links-dashboard"
                  }
                >
                  Recettes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/ingredients"
                  className={({ isActive }) =>
                    isActive ? "links-dashboard-active" : "links-dashboard"
                  }
                >
                  Ingredients
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/comments"
                  className={({ isActive }) =>
                    isActive ? "links-dashboard-active" : "links-dashboard"
                  }
                >
                  Commentaires
                </NavLink>
              </li>
            </>
          )
        )}
      </ul>
    </>
  );
}

UserBar.propTypes = {
  role: PropTypes.string.isRequired,
  user_id: PropTypes.number.isRequired,
};
