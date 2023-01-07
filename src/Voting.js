import "./styles.css";
import "./cards.css";
import "./createproject.css";
import "./projectdata.css";
import "./votingpage.css";
import { useEffect, useState, useContext, createContext } from "react";
import { json, useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Routes, useHistory } from "react-router-dom";
import { Map } from "./Map";

const MainVoting = (props) => {
  let projectContainer = [];
  let [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("https://backend.jonpetek.repl.co/users/pridobiprojekte", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((resolve) => resolve.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate("/main");
  };

  for (let i = 0; i < projects.length; i++) {
    projectContainer.push(
      <ShowProject
        projectTitle={projects[i].naslovprojekta}
        projectText={projects[i].opisprojekta}
        projectValue={projects[i].ocenjenavrednostprojekta + " €"}
      />
    );
  }
  return (
    <div>
      <h3>Main voting page</h3>
      {projectContainer}
      <button onClick={handleClick} className="button-6">
        Nazaj
      </button>
    </div>
  );
};

const ShowProject = (props) => {
  return (
    <div className="shoproject-container">
      <h3>{props.projectTitle}</h3>
      <p>{props.projectText}</p>
      <h5>{props.projectValue}</h5>
      <button className="button-6">Glasuj</button>
    </div>
  );
};

export { MainVoting };
