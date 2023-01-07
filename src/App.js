import "./styles.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main, Projects, SingleCard, CreateProject } from "./Main.js";
import { MainVoting } from "./Voting.js";
import introFoto from "../img/intro2.png";
import imgUniting from "../img/img_uniting.png";
import imgAppAbout from "../img/img_app_about.png";
import imgGrb from "../img/grb.png";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Intro />} />
        <Route path="oaplikaciji" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="main" element={<Main />} />
        <Route path="projects" element={<Projects />} />
        <Route path="ustvariprojekt" element={<CreateProject />} />
        <Route path="glasovanje" element={<MainVoting />} />
      </Routes>
    </BrowserRouter>
  );
}

const Intro = (props) => {
  let navigate = useNavigate();
  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };
  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate("/oaplikaciji");
  };
  return (
    <div className="App">
      <img src={imgGrb} className="introFoto" alt="" />
      <img src={introFoto} className="introFoto" alt="" />
      <h1 className="main-title">
        Lokalni <br /> Projektant
      </h1>
      <h4>
        Pozdravljeni v testnem okolju aplikacije Participativni proračun za
        občine.
      </h4>
      <form onSubmit={handleAboutClick}>
        <button className="button-5">O aplikaciji</button>
      </form>
      <div className="logRegContainer">
        <form onSubmit={handleLoginClick}>
          <button className="button-6" type="submit">
            Prijava
          </button>
        </form>
        <form onSubmit={handleRegisterClick}>
          <button className="button-6" type="submit">
            Registracija
          </button>
        </form>
      </div>
    </div>
  );
};

const Register = (props) => {
  let navigate = useNavigate();
  let [success, setSuccess] = useState(false);
  let [error, setError] = useState(null);
  let [message, setMessage] = useState("");

  let data = {};

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    fetch("https://backend.jonpetek.repl.co/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    })
      .then((resolve) => resolve.json())
      .then((data) => {
        if (data === "Uporabnik registriran.") {
          setSuccess(true);
          setMessage(data);
          console.log(data);
          navigate("/login");
        } else {
          setSuccess(false);
          setError(data);
          setMessage(data);
        }
      })
      .catch((error) => {
        setMessage(data);
        console.log(error);
      });
    console.log(data.username);
    console.log(data.password);
  };
  return (
    <div className="App">
      <img src={imgGrb} className="introFoto" alt="" />
      <form onSubmit={handleSubmit}>
        <h1>REGISTRACIJA</h1>
        <p>
          Registracija v testno okolje je možna za vse uporabnike. <br />
          Registracijo v produkcijsko okolje pa lahko omejimo glede na vaše
          želje in zahteve.
          <br />
          Ob registraciji se ustvari standardni uporabniški račun, brez
          skrbniških in administratorskih pravic.
        </p>
        <br />
        <label htmlFor="username">Uporabniško ime:</label>
        <br />
        <input type="text" id="username" name="username" className="regInput" />
        <br />
        <label htmlFor="password">Geslo:</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          className="regInput"
        />
        <br />
        <label htmlFor="checkpassword">Ponovi geslo:</label>
        <br />
        <input
          type="password"
          id="checkpassword"
          name="checkpassword"
          className="regInput"
        />
        <br />
        <button className="button-6" type="submit">
          Registriraj račun
        </button>
        <h3>{message}</h3>
      </form>
    </div>
  );
};

const Login = (props) => {
  let navigate = useNavigate();

  let [success, setSuccess] = useState(true);
  let [error, setError] = useState(null);
  let [message, setMessage] = useState("");

  let data = {};
  useEffect(() => {
    let storageUser = sessionStorage.getItem("username");
    let fetchedUsers;
    console.log(storageUser);

    fetch("https://backend.jonpetek.repl.co/users/isauth", {
      method: "GET",
      headers: { "Content-Type": "application/JSON" }
    })
      .then((resolve) => resolve.json())
      .then((data) => {
        fetchedUsers = data;
        console.log(fetchedUsers);
        if (fetchedUsers.length > 0 && storageUser !== null) {
          for (let i = 0; i < fetchedUsers.length; i++) {
            if (storageUser === fetchedUsers[i].loggedUser) {
              console.log(fetchedUsers[i]);
              setSuccess(true);
              navigate("/main");
            }
          }
        } else {
          setSuccess(false);
        }
      })
      .catch((error) => {
        return (
          <div>
            <h3>Napaka na strežniku</h3>
          </div>
        );
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    sessionStorage.setItem("username", data.username);
    fetch("https://backend.jonpetek.repl.co/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data })
    })
      .then((resolve) => resolve.json())
      .then((data) => {
        if (data === "Uporabnik uspešno prijavljen.") {
          setSuccess(true);
          setMessage(data);
          console.log(data);
          navigate("/main");
        } else {
          setSuccess(false);
          setError(data);
          setMessage(data);
        }
      })
      .catch((error) => {
        setMessage(data);
        console.log(error);
      });
    console.log(data.username);
    console.log(data.password);
    console.log(data.checkpassword);
  };

  if (!success) {
    return (
      <div className="App">
        <img src={imgGrb} className="introFoto" alt="" />
        <form onSubmit={handleSubmit}>
          <h1>Prijava</h1>
          <p>
            Prijava v testno okolje je glede pravic uporabe za vse uporabniške
            račune enaka, v produkcijskem okolju pa se uporabniški računi delijo
            na administratorje, skrbnike in uporabnike.
          </p>
          <br />
          <label htmlFor="username">Uporabniško ime:</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            className="regInput"
          />
          <br />
          <label htmlFor="password">Geslo:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            className="regInput"
          />
          <br />
          <button className="button-6" type="submit">
            Prijava
          </button>
          <h3>{message}</h3>
        </form>
      </div>
    );
  }
};

const About = (props) => {
  let navigate = useNavigate();
  return (
    <div>
      <div class="main-container">
        <div class="flex-container">
          <img src={imgAppAbout} className="introFoto" alt="" />
        </div>
      </div>
      <div className="text-container">
        <h2 className="aboutTitle">O APLIKACIJI</h2>
        <h3 className="aboutSubTitle">
          <b>Kaj pravzaprav je aplikacija "Participativni proračun"?</b>
        </h3>
        <p className="aboutText">
          Aplikacija "Participativni proračun" je interaktivna aplikacija za
          lokalne skupnosti, s katero lahko občina vsem svojim občanom omogoči
          neposredo sodelovanje pri odločanju o projektih v občini. Občina
          določi višino finančnih sredstev, na podlagi tega pa se v aplikacijo
          podajajo predlogi različnih projektov, se o njih glasuje in na koncu
          izbere najboljše.
        </p>

        <h3 className="aboutSubTitle">
          Zakaj je aplikacija koristna za občino?
        </h3>
        <p className="aboutText">
          Občinska uprava z aplikacijo vključi širši krog svojih občanov v
          neposredno odločanje glede projektov, investicij in drugih upravnih
          zadev občine. S tem imajo občani večji občutek participacije pri
          upravljanju, kar se je v preteklosti že izkazalo kot zelo koristna
          praksa za dolgoročno delovanje občinske uprave.
        </p>

        <h3 className="aboutSubTitle">Kako je aplikacija sestavljena?</h3>
        <p className="aboutText">
          <b>Aplikacijo sestavljajo trije glavni deli:</b> <br />
          <br />
          Prvi del je vnos oziroma objava projektov glede na občino ali glede na
          posamezne vasi / dele občine. Vsak projekt ima obvezne podatke, ima
          vsebinski opis in finančno opredelitev ter fotografijo (opcijsko).{" "}
          <br />
          <br />
          Drugi del je glasovanje za posamezne projekte. Vsak uporabniški račun
          lahko odda določeno število glasov (za število se izvajalci dogovorimo
          z občino) za različne projekte v občini, število glasov se zbira,
          šteje in analizira v podatkovni bazi, nato pa se po pretečenem roku za
          glasovanje na posebni podstrani objavijo rezultati glasovanja.
        </p>

        <h3 className="aboutSubTitle">
          Zakaj je aplikacija koristna za občino?
        </h3>
        <p className="aboutText">
          Občinska uprava z aplikacijo vključi širši krog svojih občanov v
          neposredno odločanje glede projektov, investicij in drugih upravnih
          zadev občine. S tem imajo občani večji občutek participacije pri
          upravljanju, kar se je v preteklosti že pokazalo kot zelo koristna
          praksa za dolgoročno delovanje občinske uprave.
        </p>
      </div>
      <div className="back-button-container">
        <button className="button-6" onClick={() => navigate(-1)}>
          Nazaj
        </button>
      </div>
    </div>
  );
};

export { App, Login, Register };
