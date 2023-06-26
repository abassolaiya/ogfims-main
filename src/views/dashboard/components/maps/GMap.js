import React, { useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import { Tooltip, OverlayTrigger, Modal, Button, Container } from 'react-bootstrap';
import { baseURL } from '../../../../httpService';

import "./style.css";

const fetcher = (...args) => fetch(...args).then(response => response.json());
const Marker = ({ children }) => children;


export function GreyDiv(props) {
  return (
    <Container style={{ backgroundColor: '#f4f4f4', borderRadius:5, paddingBottom:5, paddingTop:12, paddingRight:10, paddingLeft:10, margin:10 }}>
      {props.children}
    </Container> //
  );
}

export default function GMap({users, apiKey}) {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [userClicked, setUserClicked] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

 // console.log(currentUser)
  const points = users.map((user, i) => ({
    type: "Feature",
    properties: { cluster: false, id: i, data: user },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(user.coord.lng),
        parseFloat(user.coord.lat)
      ]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });


  const tooltip = (userData)=>{
    return (
      <Tooltip id="tooltip">
        <strong>{userData.properties.data.firstName + userData.properties.data.lastName}</strong> - {userData.properties.data.town} - {userData.properties.data.lga}.
      </Tooltip>
    );
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey}}
        defaultCenter={{ lat: 7.164477, lng: 3.367259 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={cluster.properties.id}
              lat={latitude}
              lng={longitude}
            >
            <OverlayTrigger placement="top" overlay={tooltip(cluster)}>
              <button className="user-marker" onClick={()=>{setCurrentUser(cluster.properties.data); setUserClicked(true);}}>
                <img src="./img/user-pin.png" />
              </button>
              </OverlayTrigger>
            </Marker>
          );
        })}
      </GoogleMapReact>


      <Modal show={userClicked && currentUser} onHide={()=>{setUserClicked(false); setCurrentUser('')}}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center ">
            <img src={currentUser.profileImage ? `${baseURL}${currentUser.profileImage}` : `${baseURL}uploads/user.png`} alt="user" className="d-flex align-self-center rounded-xl border border-separator-light border-4 sw-11 sh-11" id="contactThumbModal" />
          </div>

          <br />

          <GreyDiv>
            <h5>{currentUser.name}</h5>
          </GreyDiv>

          { currentUser.email ?
            <GreyDiv>
              <h5>{currentUser.email}</h5>
            </GreyDiv> : null
          }

          <GreyDiv>
            <h5>{currentUser.sex}</h5>
          </GreyDiv>

          <GreyDiv>
            <h5>{'0'+currentUser.mobileNumber}</h5>
          </GreyDiv>

          <GreyDiv>
            <h5>{currentUser.lga}</h5>
          </GreyDiv>

          <GreyDiv>
            <h5>{currentUser.town}</h5>
          </GreyDiv>

          {/*
            <GreyDiv>
              {
                currentUser.primaryCategory.map((item, i)=>(
                  <Button bsSize="xsmall"> {item} </Button> //
                ))
              }
            </GreyDiv>
            : null
            */
          }

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setCurrentUser(''); setUserClicked(false)}}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
