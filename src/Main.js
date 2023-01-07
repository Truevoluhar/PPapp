import "./styles.css";
import "./cards.css";
import "./createproject.css";
import "./projectdata.css";
import { useEffect, useState, useContext, createContext } from "react";
import foto from "../img/foto.jpg";
import { json, useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Routes, useHistory } from "react-router-dom";
import { render } from "react-dom";
import { Map } from "./Map";
import imgUniting from "../img/img_uniting.png";
import handsVoting from "../img/hands-voting.jpg";
import imgGrb from "../img/grb.png";
import imgGlasIn from "../img/glas_in.png";
import imgGlasOut from "../img/glas_out.png";

import axios from "axios";

const Main = (props) => {
  let navigate = useNavigate();
  let [success, setSuccess] = useState(false);

  let storageUser = sessionStorage.getItem("username");
  let fetchedUsers;

  useEffect(() => {
    fetch("https://backend.jonpetek.repl.co/users/isauth", {
      method: "GET",
      headers: { "Content-Type": "application/JSON" }
    })
      .then((resolve) => resolve.json())
      .then((data) => {
        fetchedUsers = data;
        console.log(fetchedUsers);
        if (fetchedUsers.length > 0) {
          for (let i = 0; i < fetchedUsers.length; i++) {
            if (storageUser === fetchedUsers[i].loggedUser) {
              setSuccess(true);
            } else {
              navigate("/login");
            }
          }
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        navigate("/");
        console.log(error);
      });
  }, []);
  if (success) {
    return (
      <div>
        <Projects />
      </div>
    );
  }
};

const VotesContext = createContext();

const Projects = (props) => {
  let navigate = useNavigate();

  const [clicker, setClicker] = useState(false);
  const [projects, setProjects] = useState([]);
  const [numVotes, setNumVotes] = useState(null);
  const [voteMsg, setVoteMsg] = useState("");
  const [filterProjects, setFilterProjects] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [coords, setCoords] = useState([]);
  const [latlng, setLatlng] = useState();
  const [rerender, setRerender] = useState(false);
  const latlngArr = [];

  const containers = [];

  const handleClick = (event, i) => {
    if (clicker) {
      setClicker(false);
    } else {
      let openkey = event.target.getAttribute("openkey");
      localStorage.setItem("openIndex", openkey);
      setClicker(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await fetch("https://backend.jonpetek.repl.co/users/pridobiprojekte", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then((resolve) => resolve.json())
        .then((data) => {
          setProjects(data);
          setFilterProjects(data);
          console.log(data);
          data.forEach((d) => {
            let obj = {
              lat: d.latprojekta,
              lng: d.lngprojekta
            };
            if (d.latprojekta !== undefined && d.lngprojekta !== undefined) {
              latlngArr.push(obj);
            }
          });
          console.log(latlngArr);
          setLatlng(latlngArr);
          setRerender(true);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log("fetchData ran");
    }
    fetchData();
  }, []);

  const searchOnChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (searchInput !== "") {
      setFilterProjects([]);
      let fltr = projects.filter((p) =>
        p.naslovprojekta.includes(e.target.value)
      );
      setFilterProjects(fltr);
    } else {
      setFilterProjects(projects);
    }
    console.log(filterProjects);
  };

  console.log(latlngArr);

  if (rerender) {
    if (!clicker) {
      for (let i = 0; i < filterProjects.length; i++) {
        containers.push(
          <CardContainer
            onClick={handleClick}
            key={i}
            openkey={i}
            title={filterProjects[i].naslovprojekta}
            photo={`https://backend.jonpetek.repl.co/images/${filterProjects[i].nalozifotografijo}`}
            opis={filterProjects[i].opisprojekta}
          />
        );
      }
      return (
        <div>
          <Header />
          <div>
            <button className="button-6">klik</button>
            <ProjectData />
            <Map markers={latlng} />
          </div>
          <div className="naslov-pregled-container">
            <p className="naslov-pregled">
              {projects.length > 0
                ? "Pregled vseh predlaganih projektov"
                : "Ni projektov za prikaz"}
            </p>
            <label htmlFor="searchbar" style={{ fontSize: "1.2rem" }}>
              Išči med projekti
            </label>
            <div className="searchBarContainer">
              <input id="searchbar" onChange={searchOnChange} />
            </div>
          </div>
          <div className="main-cont">{containers}</div>
          <div className="ustvariprojektbuttoncontainer">
            <button
              className="button-6"
              onClick={() => navigate("/ustvariprojekt")}
            >
              Ustvari projekt
            </button>
          </div>
          <div className="full-container">
            <VoteOnMain />
          </div>
        </div>
      );
    } else {
      let OI = localStorage.getItem("openIndex");
      let data = projects[OI];
      let getVotes = projects[OI].glasovi;
      let singleMarker = {
        lat: projects[OI].latprojekta,
        lng: projects[OI].lngprojekta
      };
      const glasuj = () => {
        fetch("https://backend.jonpetek.repl.co/users/glasuj", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data })
        })
          .then((resolve) => resolve.json())
          .then((data) => {
            console.log(data);
            console.log(data[0].glasovi);
            setNumVotes(data[0].glasovi);
            setVoteMsg("Vaš glas je oddan.");
          })
          .catch((error) => console.log(error));
      };
      return (
        <div>
          <Header />
          <div>
            <ProjectData />
            <Map markers={singleMarker} />
          </div>
          <div className="main-cont">
            <VotesContext.Provider value={getVotes}>
              <SingleCard
                onClick={handleClick}
                title={projects[OI].naslovprojekta}
                opis={projects[OI].opisprojekta}
                value={projects[OI].ocenjenavrednostprojekta}
                loc={projects[OI].lokacijaprojekta}
                description={projects[OI].opisizvajanjaprojekta}
                impact={projects[OI].vplivprojekta}
                photo={`https://backend.jonpetek.repl.co/images/${projects[OI].nalozifotografijo}`}
                glasujLayer2={glasuj}
                msgLayer2={voteMsg}
                votesLayer2={numVotes === null ? getVotes : numVotes}
              />
            </VotesContext.Provider>
          </div>
        </div>
      );
    }
  }
};

const CardContainer = (props) => {
  let navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    localStorage.setItem("openIndex", props.openkey);
    navigate("/posamezniprojekt");
  };

  return (
    <div className="card-container">
      <h2 className="naslov">{props.title}</h2>
      <img className="foto" src={props.photo} alt="" />
      <p className="opis">{props.opis}</p>
      <button
        className="button-7"
        openkey={props.openkey}
        onClick={props.onClick}
      >
        Poglej projekt
      </button>
    </div>
  );
};

const SingleCard = (props) => {
  let navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  return (
    <div className="main-container">
      <div className="flex-container">
        <div className="text-container">
          <h2 className="aboutTitle">{props.title}</h2>
          <div className="foto-center">
            <img className="foto-single" src={props.photo} alt="" />
          </div>
          <Vote
            glasujLayer1={props.glasujLayer2}
            msgLayer1={props.msgLayer2}
            votesLayer1={props.votesLayer2}
          />
          <h4 className="aboutSubTitle">Opis in namen projekta</h4>
          <p className="aboutText">{props.opis}</p>
          <h4 className="aboutSubTitle">Ocenjena vrednost projekta</h4>
          <p className="aboutText">{props.value}</p>
          <h4 className="aboutSubTitle">Lokacija izvajanja projekta</h4>
          <p className="aboutText">{props.loc}</p>
          <h4 className="aboutSubTitle">Opis izvajanja projekta</h4>
          <p className="aboutText">{props.description}</p>
          <h4 className="aboutSubTitle">Vpliv projekta na življenje občanov</h4>
          <p className="aboutText">{props.impact}</p>
        </div>
        <div className="back-button-container">
          <button className="button-6" onClick={props.onClick}>
            Nazaj
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="main-header-container">
      <div className="main-header-text-container">
        <h1 className="main-title-1">
          Lokalni
          <br />
          projektant
        </h1>
      </div>
      <div className="main-header-photo-container">
        <img src={imgGrb} alt="" className="main-header-photo" />
        <img src={imgUniting} alt="" className="main-header-photo" />
      </div>
      <div className="main-header-button-container">
        <p className="aboutText">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit
          nemo, ullam ratione iure provident saepe tempore, amet consequuntur
          minima, voluptatem eos molestias quod asperiores eaque consequatur ea
          nihil non aperiam?
        </p>
      </div>
    </div>
  );
};

const CreateProject = (props) => {
  let [images, setImages] = useState([]);
  let [imageURLs, setImageURLs] = useState([]);
  let [formSuccess, setFormSuccess] = useState(false);
  let [photoSuccess, setPhotoSuccess] = useState(false);
  let [koordinate, setKoordinate] = useState("");
  let [koordinateString, setKoordinateString] = useState("");

  let navigate = useNavigate();
  let data = {};
  let fotoName;

  function showFotoName() {}

  useEffect(() => {
    if (images.length < 1) return;
    const newImageURLs = [];
    images.forEach((image) => newImageURLs.push(URL.createObjectURL(image)));
    setImageURLs(newImageURLs);
    console.log(koordinate);
  }, [images]);

  const onImageChange = (e) => {
    fotoName = document.getElementById("fileinput");
    alert("Selected file: " + fotoName.files.item(0).name);
    let inputNameHolder = document.getElementById("photonameholder");
    inputNameHolder.value = fotoName.files.item(0).name;
    setImages([...e.target.files]);
  };

  const inputKoordinate = (e) => {
    e.preventDefault();
    e.target.value = koordinate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log(data);
    console.log(images);
    console.log(imageURLs);
    const image = images[0];
    fetch("https://backend.jonpetek.repl.co/users/predlagajprojekt", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ data })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.nalozifotografijo);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    // add the file to the FormData object
    const fd = new FormData();
    fd.append("avatar", image);

    // send `POST` request
    fetch("https://backend.jonpetek.repl.co/users/uploadimage", {
      method: "POST",
      body: fd
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error(err));
  };

  const getCoords = (e) => {
    e.preventDefault();
    let lokacijaprojekta = document.querySelector("#lokacijaprojekta");
    let koordinateprojekta = document.querySelector("#koordinateprojekta");
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${lokacijaprojekta.value}&key=AIzaSyA_SEDYczf0fvEGhy9UqrkixL-B7XB-tfE`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        setKoordinate(data.results[0].geometry.location);
        console.log(data.results[0].geometry.location);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="createproject-container">
      <form onSubmit={handleSubmit} className="flexform">
        <h1 className="main-title-1">Predlagaj projekt</h1>
        <p>
          Izpolni vsa spodnja polja in pritisni "Predlagaj" gumb, da se projekt
          shrani in objavi v aplikaciji.
        </p>
        <br />
        <label htmlFor="naslovprojekta">Naslov projekta:</label>
        <br />
        <input type="text" name="naslovprojekta" className="regInputText" />
        <br />

        <label htmlFor="opisprojekta">Opis projekta:</label>
        <br />
        <textarea name="opisprojekta" className="regInputMoreText" />
        <br />
        <label htmlFor="ocenjenavrednostprojekta">
          Ocenjena vrednost projekta:
        </label>
        <br />
        <input name="ocenjenavrednostprojekta" className="regInputText" />
        <br />
        <label htmlFor="lokacijaprojekta">Točna lokacija projekta:</label>
        <br />
        <input
          name="lokacijaprojekta"
          className="regInputText"
          id="lokacijaprojekta"
        />
        <br />
        <label htmlFor="koordinateprojekta">Lat koordinate projekta:</label>
        <br />
        <input
          type="text"
          name="latprojekta"
          className="regInputText"
          value={koordinate !== "" ? koordinate.lat : ""}
          onChange={inputKoordinate}
        />
        <br />
        <label htmlFor="koordinateprojekta">Lng koordinate projekta:</label>
        <br />
        <input
          type="text"
          name="lngprojekta"
          className="regInputText"
          value={koordinate !== "" ? koordinate.lng : ""}
          onChange={inputKoordinate}
        />
        <br />
        <label htmlFor="opisizvajanjaprojekta">
          Kako se bo projekt izvajal:
        </label>
        <br />
        <textarea name="opisizvajanjaprojekta" className="regInputMoreText" />
        <br />
        <label htmlFor="vplivprojekta">
          Kako bo projekt vplival na izboljšanje življenja občanov?
        </label>
        <br />
        <textarea name="vplivprojekta" className="regInputMoreText" />
        <br />
        <label htmlFor="nalozifotografijo">Naloži fotografijo</label>
        <br />
        <input
          id="fileinput"
          type="file"
          name="nalozifotografijo"
          multiple
          accept="image/*"
          onChange={onImageChange}
        />
        <br />
        <input id="photonameholder" name="photonameholder" />
        <button type="submit" className="button-6">
          Predlagaj
        </button>
      </form>
      <form onSubmit={getCoords}>
        <button>Pridobi koordinate</button>
      </form>
      <button className="button-6" onClick={() => navigate("/main")}>
        Prekliči
      </button>
      {imageURLs.map((imageSrc, i) => (
        <img src={imageSrc} alt="" key={i} />
      ))}
    </div>
  );
};

const ProjectData = (props) => {
  return (
    <div className="bar-container">
      <div className="filler"></div>
      <div className="bar-border">
        <h3 className="title">Skupni proračun:</h3>
        <p className="text">100.000 EUR</p>
      </div>
      <div className="bar-border">
        <h3 className="title">Vrednost predlogov:</h3>
        <p className="text">100.000 EUR</p>
      </div>
      <div className="bar">
        <h3 className="title">Predlagati možno v terminu:</h3>
        <p className="text">26.12.2022 - 13.2.2023</p>
      </div>
      <div className="bar">
        <h3 className="title">Glasovati možno v terminu:</h3>
        <p className="text">26.12.2022 - 13.2.2023</p>
      </div>
      <div className="filler"></div>
    </div>
  );
};

const Vote = (props) => {
  const votes = useContext(VotesContext);

  return (
    <div className="glasuj-maincont">
      <div className="glasuj-container">
        <div className="glasuj-button-container">
          <button className="button-glasuj" onClick={props.glasujLayer1}>
            Glasuj
          </button>
        </div>
        <div className="stevilo-glasov">
          <h3 className="h3">Število glasov:</h3>
          <h2 className="h2">{props.votesLayer1}</h2>
        </div>
      </div>
      <p>{props.msgLayer1}</p>
    </div>
  );
};

const VoteOnMain = (props) => {
  let navigate = useNavigate();
  const onMouseEnter = (e) => {
    e.target.src = imgGlasIn;
  };
  const onMouseLeave = (e) => {
    e.target.src = imgGlasOut;
  };
  const goToVotePage = () => {
    navigate("/glasovanje");
  };
  return (
    <div className="voteonmain-container">
      <div className="voteonmain-title">
        <p style={{ fontSize: "5rem" }}>GLASUJ</p>
        ZA NAJBOLJŠI PROJEKT
      </div>
      <img
        src={imgGlasOut}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        alt=""
        className="main-header-photo"
        id="glas-grafika"
      />
      <h4 className="voteonmain-text">
        Klikni na gumb "Poglej projekt" zgoraj na posameznem projektu ali pa
        klikni na spodnji gumb "Pregled glasovanja" in se odloči tam.
      </h4>
      <div className="ustvariprojektbuttoncontainer">
        <button className="pregledglasovanjabutton" onClick={goToVotePage}>
          Pregled glasovanja
        </button>
      </div>
    </div>
  );
};

export { Main, Projects, SingleCard, CreateProject };
