/* eslint-disable camelcase */
import { useEffect } from "react";
import axios from "axios";
import {
  useLoaderData,
  useOutletContext,
  useNavigate,
  NavLink,
} from "react-router-dom";
import "./AdminUsersPage.css";
import UserBar from "../../../components/UserBar/UserBar";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const { role, id } = currentUser;
  const user_id = id;

  const users = useLoaderData();
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

  return (
    <>
      <UserBar role={role} user_id={user_id} />
      <div className="users-container-ad">
        {users.map((u) => (
          <div key={u.id} className="card-user-ad">
            <div className="card-img-container-ad">
              <img
                className="card-image-ad"
                src={u.image_profile}
                alt="avatar"
              />
            </div>
            <div className="card-pseudo-ad">
              <div className="card-label-ad">Pseudo :</div>
              <div className="card-input-ad">{u.pseudo}</div>
            </div>
            <div className="card-prenom-nom-ad">
              <div className="card-label-ad">Prénom:</div>
              <div className="card-input-ad">{u.firstname}</div>
              <div className="card-label-ad">Nom:</div>
              <div className="card-input-ad">{u.lastname}</div>
            </div>
            <div className="card-email-ad">
              <div className="card-label-ad">Email :</div>
              <div className="card-input-ad">{u.email}</div>
            </div>

            <div className="btn-card-container-ad">
              <NavLink
                to={`/admin/users/modif/${u.id}`}
                className="btn-card-ad"
              >
                Plus de détails
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
