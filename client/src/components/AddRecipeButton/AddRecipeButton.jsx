import { NavLink } from "react-router-dom";
import "./AddRecipeButton.css";

export default function AddRecipeButton() {
  return (
    <NavLink NavLink to="/ajout-recette" className="btn-add-recipe">
      Ajouter une nouvelle recette
    </NavLink>
  );
}
