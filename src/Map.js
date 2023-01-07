import "./styles.css";
import "./cards.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { render } from "react-dom";
import { Wrapper } from "@googlemaps/react-wrapper";

import GoogleMaps from "simple-react-google-maps";

const Map = (props) => {
  return (
    <div className="mapdiv">
      <GoogleMaps
        apiKey={"AIzaSyA_SEDYczf0fvEGhy9UqrkixL-B7XB-tfE"}
        style={{ height: "405px", width: "100%" }}
        zoom={12}
        center={{ lat: 46.04999658508657, lng: 14.509674071031089 }}
        markers={props.markers}
        /* markers={[
          { lat: 46.05162139999999, lng: 14.5053764 },
          { lat: 37.5224764, lng: -121.0842499 },
          { lat: 37.3224764, lng: -120.0842499 }
        ]} */
      />
    </div>
  );
};

export { Map };
