import { useNavigate, useOutletContext } from "react-router-dom";
import "./HomePage.css";
import RecipeTabs from "../../components/RecipeTabs/RecipeTabs";

function HomePage() {
  const { currentUser } = useOutletContext();
  const navigate = useNavigate();

  const handleConnection = () => {
    navigate("/connexion");
  };

  return (
    <div className="homepage">
      <div className="hero-header">
        <div className="content-wrapper">
          <div className="imgcontainer">
            <img
              src="./images/Accueil.jpeg"
              alt="plat cuisiné"
              className="hero-image"
            />
          </div>
        </div>

        <div className="hero-header-container">
          <h1 className="hero-title">Eating Nam Nam</h1>
          <p className="hero-baseline">
            La plateforme leader du partage de recettes "zéro-déchet"
          </p>
          <button
            className="hero-button"
            type="button"
            onClick={handleConnection}
          >
            Découvrir
          </button>
        </div>
      </div>

      <div className="recipe">
        {currentUser === null ? (
          <h1>Découvrez les 10 dernières recettes postées :</h1>
        ) : (
          <h1>Découvrez toutes les recettes</h1>
        )}
        <RecipeTabs />
      </div>
    </div>
  );
}

export default HomePage;
