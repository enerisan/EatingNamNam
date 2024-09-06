/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./AdminCommentsPage.css";

import UserBar from "../../../components/UserBar/UserBar";

export default function AdminCommentsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext();
  const { role, id } = currentUser;
  const user_id = id;
  const initialComments = useLoaderData();
  const { register, handleSubmit } = useForm();
  const [comments, setComments] = useState(initialComments);

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

  const handleDeleteComment = async (comment_id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comment/${comment_id}`
      );
      toast.success("Commentaire éliminé correctement");
      setComments(comments.filter((com) => com.id !== comment_id));
    } catch (error) {
      toast.error(
        "Une erreur s'est produite. Veuillez réessayer ultérieurement"
      );
    }
  };

  const onSubmit = async (formData, comment_id) => {
    const {
      [`date-${comment_id}`]: date,
      [`description-${comment_id}`]: description,
      [`recipe_id-${comment_id}`]: recipe_id,
      [`user_id-${comment_id}`]: formUserId,
      [`is_validated-${comment_id}`]: is_validated,
    } = formData;

    const dataToSend = {
      date,
      description,
      recipe_id,
      user_id: formUserId,
      is_validated,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/comment/${comment_id}`,
        dataToSend
      );
      toast.success("Modification effectuée avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  };

  return (
    <div className="comments-body">
      <UserBar role={role} user_id={user_id} />
      <div className="comments-container">
        {comments.map((comment) => (
          <form
            className="comment-card"
            key={comment.id}
            onSubmit={handleSubmit((data) => onSubmit(data, comment.id))}
          >
            <label htmlFor={`description-${comment.id}`}>Commentaire:</label>
            <textarea
              defaultValue={comment.description}
              {...register(`description-${comment.id}`, { required: true })}
              readOnly
              className="comment-content"
            />

            <label htmlFor={`date-${comment.id}`}>Date:</label>
            <input
              type="date"
              defaultValue={comment.date.split("T")[0]}
              {...register(`date-${comment.id}`)}
              readOnly
            />
            <label htmlFor={`recipe_id-${comment.id}`}>Recette:</label>
            <input
              type="text"
              defaultValue={comment.recipe_id}
              {...register(`recipe_id-${comment.id}`, { required: true })}
              readOnly
            />

            <label htmlFor={`user_id-${comment.id}`}>Utilisateur:</label>
            <input
              type="text"
              defaultValue={comment.user_id}
              {...register(`user_id-${comment.id}`, { required: true })}
              readOnly
            />

            <label htmlFor={`is_validated-${comment.id}`}>
              Valider:
              <input
                type="checkbox"
                defaultChecked={comment.is_validated}
                {...register(`is_validated-${comment.id}`)}
              />
            </label>

            <div className="comment-btns-container">
              <button type="submit" className="comment-btn">
                Enregistrer la modification
              </button>
              <button
                type="button"
                className="comment-btn"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Supprimer
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
