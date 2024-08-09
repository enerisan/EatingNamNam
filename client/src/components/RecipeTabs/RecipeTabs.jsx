import { useLoaderData, Link, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "./RecipeTabs.css";

function RecipeTabs() {
  const recipes = useLoaderData();

  const { currentUser } = useOutletContext();

  const [activeTab, setActiveTab] = useState("");

  const filterRecipes = (tab) => {
    const visibleRecipes = currentUser ? recipes : recipes.slice(0, 10);
    if (tab === "") return visibleRecipes;
    return visibleRecipes.filter((recipe) => {
      if (tab === "végétarien") return recipe.labels.includes("Végétarien");
      if (tab === "sans gluten") return recipe.labels.includes("Sans gluten");
      if (tab === "sans lactose") return recipe.labels.includes("Sans lactose");
      return false;
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(activeTab === tab ? "" : tab);
  };

  const filteredRecipes = filterRecipes(activeTab);

  return (
    <div className="recipes-container">
      <div className="tabs">
        <button
          type="button"
          className={activeTab === "végétarien" ? "active" : ""}
          onClick={() => handleTabChange("végétarien")}
        >
          Végétariennes
        </button>
        <button
          type="button"
          className={activeTab === "sans gluten" ? "active" : ""}
          onClick={() => handleTabChange("sans gluten")}
        >
          Sans Gluten
        </button>
        <button
          type="button"
          className={activeTab === "sans lactose" ? "active" : ""}
          onClick={() => handleTabChange("sans lactose")}
        >
          Sans Lactose
        </button>
      </div>

      <div className="all-recipes">
        {filteredRecipes &&
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.name}</h3>
              <div className="body-recipe-card">
                <img src={recipe.image} alt={recipe.name} />
                <Link to={`/details/${recipe.id}`}>
                  <button type="button" className="buttonDetails">
                    Détails
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RecipeTabs;
