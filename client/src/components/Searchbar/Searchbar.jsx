import { useState, useEffect } from "react";
import "./Searchbar.css";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default function Searchbar({ currentUser }) {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipe`)
      .then((res) => res.json())
      .then((data) =>
        !currentUser ? setDatas(data.slice(0, 10)) : setDatas(data)
      );
  }, [currentUser]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    e.preventDefault();
    setSearch(searchTerm);
  };

  const filteredDatas = datas.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="searchbar">
      <input
        type="search"
        name="searchbar"
        id="searchbar"
        placeholder="Recherchez une recette"
        onChange={handleSearch}
        value={search}
      />
      <div
        className={`resultsContainer ${search.length > 1 ? "hasResults" : ""}`}
      >
        {search.length > 1 && filteredDatas.length > 0
          ? filteredDatas.map((f) => (
              <NavLink
                to={`/details/${f.id}`}
                className="resultLink"
                key={f.id}
                onClick={() => setSearch("")}
              >
                {f.name}
              </NavLink>
            ))
          : search.length > 1 && <div>Aucun résultat correspondant</div>}
      </div>
    </div>
  );
}
Searchbar.defaultProps = {
  currentUser: null,
};

Searchbar.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};
