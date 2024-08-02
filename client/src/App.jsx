import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CookieConsent from "react-cookie-consent";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import fetchAuth from "./lib/auth";
import "./App.css";

const express = import.meta.env.VITE_API_URL;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showConsentBanner, setShowConsentBanner] = useState(true);

  useEffect(() => {
    const fetchConsentStatus = async () => {
      try {
        const response = await axios.get(
          `${express}/api/cookies/get-cookie-consent`,
          { withCredentials: true }
        );
        const { consent } = response.data;

        if (consent === "true" || consent === "false") {
          setShowConsentBanner(false);
        }
      } catch (error) {
        console.error("Error fetching cookie consent status:", error);
      }
    };

    fetchConsentStatus();
    fetchAuth().then((response) => setCurrentUser(response));
  }, []);

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
        toast.error("Cookies refusées");
      }
      setShowConsentBanner(false);
    } catch (error) {
      console.error("Error setting cookie consent:", error);
      toast.error("Error setting cookie consent");
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
      {showConsentBanner && (
        <CookieConsent
          onAccept={() => handleConsent("true")}
          onDecline={() => handleConsent("false")}
          enableDeclineButton
          buttonText="Accepter"
          declineButtonText="Refuser"
          cookieName="userConsent"
          expires={365}
        >
          Ce site utilise des cookies pour améliorer votre expérience.
          Acceptez-vous l'utilisation des cookies ?
        </CookieConsent>
      )}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      {currentUser ? (
        <p className="hello">Bonjour {currentUser.firstname} ! </p>
      ) : (
        ""
      )}
      <Outlet context={{ currentUser, setCurrentUser }} />
      <Footer />
    </div>
  );
}

export default App;
