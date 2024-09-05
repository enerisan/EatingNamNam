import "./ContactPage.css";
import BackButton from "../../components/BackButton/BackButton";

export default function ContactPage() {
  return (
    <>
      <BackButton />
      <div className="about-container">
        <h1 className="about-title">Contactez-Nous</h1>
        <div className="about-content">
          <p>
            Si vous avez des questions, des suggestions ou simplement envie de
            discuter de cuisine, n'hésitez pas à nous contacter. Vous pouvez
            nous envoyer un email à{" "}
            <span className="email">contact@eatingnammam.fr</span> ou nous
            suivre sur nos réseaux sociaux.
          </p>
        </div>
      </div>
    </>
  );
}
