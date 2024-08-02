import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CookieConsentPage.css";
import axios from "axios";

const express = import.meta.env.VITE_API_URL;

export default function CookieConsentPage() {
  const navigate = useNavigate();

  const handleConsent = async (consent) => {
    try {
      await axios.post(
        `${express}/api/cookies/set-cookie-consent`,
        { consent },
        { withCredentials: true }
      );
      localStorage.setItem("userConsent", consent);
      if (consent === "true") {
        toast.success("Cookies acceptées !");
      } else {
        toast.error("Cookies refusés");
      }
      navigate("/connexion");
    } catch (error) {
      console.error("Error setting cookie consent:", error);
      toast.error("Error setting cookie consent");
    }
  };

  return (
    <div className="cookie-consent-page">
      <h1 className="titre-consent">Consentement aux Cookies</h1>
      <p className="p-consent">
        Ce site utilise des cookies pour améliorer votre expérience. Veuillez
        accepter les cookies pour vous connecter.
      </p>
      <div className="buttons-consent">
        <button
          className="btn-consent"
          type="button"
          onClick={() => handleConsent("true")}
        >
          Accepter les cookies
        </button>
        <button
          className="btn-consent"
          type="button"
          onClick={() => handleConsent("false")}
        >
          Refuser les cookies
        </button>
      </div>
    </div>
  );
}
