import React,{useEffect, useState} from 'react';
import { Row, Col, Dropdown, Card, Button, Form } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import { NavLink } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Glide from 'components/carousel/Glide';
import Clamp from 'components/clamp';
import 'react-circular-progressbar/dist/styles.css';
import MarkerClusterer from '@google/markerclusterer'
import GMap from './components/maps/GMap'
// import Chart from "react-apexcharts";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { baseURL } from '../../httpService';
import { Line } from 'react-chartjs-2';

const defaultProps = {
    center: {
      lat: 7.164477,
      lng: 3.367259
    },
    zoom: 9
};


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  PointElement,
  LineElement,
  Filler
);



export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Categories',
    },
  },
};


export const purposeoffarmingOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Farm practice',
    },
  },
};

export const typeoffarmingOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Type of Farming',
    },
  },
};


export const cropsOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Farm productivity',
    },
  },
};


export const lgaOptions = {
 // indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Local Government',
    },
  },
};


const lgas = [
        "Abeokuta-North",
        "Abeokuta-South",
        "Ado-Odo/Ota",
        "Ewekoro",
        "Ifo",
        "Ijebu-East",
        "Ijebu-North",
        "Ijebu-North-East",
        "Ijebu-Ode",
        "Ikenne",
        "Imeko-Afon",
        "Ipokia",
        "Obafemi-Owode",
        "Odeda",
        "Odogbolu",
        "Ogun-Waterside",
        "Remo-North",
        "Shagamu",
        "Yewa-North",
        "Yewa-South"
      ];


const DashboardAnalysis = () => {
  const title = 'Dashboard';
  const description = '';

  const [count, setCount]= useState('');
  const [purposeoffarming, setPurposeoffarming]=useState('');
  const [cropsData, setCropsData]=useState('');
  const [typeoffarming, setTypeoffarming]=useState('');
  const [lgaData, setLgaData] = useState('');
  const [users, setUsers] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [lga, setLga] = useState('');

  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [googlemapsapi, setGoogleMapsApi] = useState('');




  /* generate random cordinates */

const getRandomCoordinate=(lat1, lon1, lat2, lon2)=>{
  // Ensure lat2 is greater than lat1
  if (lat2 < lat1) {
    [lat1, lat2] = [lat2, lat1];
  }

  // Ensure lon2 is greater than lon1
  if (lon2 < lon1) {
    [lon1, lon2] = [lon2, lon1];
  }

  // Generate a random latitude between lat1 and lat2
  const lat = Math.random() * (lat2 - lat1) + lat1;

  // Generate a random longitude between lon1 and lon2
  const lng = Math.random() * (lon2 - lon1) + lon1;

  // Return the random coordinates as an object
  return { lat, lng };
}



  const getUsers = (pag, perPag, cate, lg)=>{
    setPending(true);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    setCategory(cate);
    setPerPage(perPage);
    setPage(pag);
    setLga(lg);
    const cat = cate ? `&category=${cate}` : '';
    const localG = lg? `&lga=${lg}`:'';
    const endPoint = `${baseURL}user?limit=10000&page=1&order=desc${cat}${localG}`;
    // console.log(endPoint)
    fetch(endPoint, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      // generate random coords for users;
      const newuser = responseJson.users.map(item => {
        return{
        coord: {lat:item[cate].latitude,lng:item[cate].longitude},
        ...item
        }
      });
      setUsers(newuser);
      // console.log(newuser);
      setPending(false);
    })
    .catch((error) => {
      // console.log(error);
      setPending(false);
    });
  }


  useEffect(()=>{
        if(users.length === 0){
           getUsers(page, perPage, category, lga);
        }
    },[users]);

  
  const getSettings = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Authorization':`Bearer ${currentUser.token}`
    }
     fetch(`${baseURL}settings/63eb32f6a11bca78138358bb`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      setGoogleMapsApi(responseJson.setting.google_maps_api);
      //console.log(responseJson.setting.google_maps_api)
      history.push("/content/banners");
      history.push("/news/list");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(()=>{
    if(!googlemapsapi){
       getSettings();
    }
  },[]);

  //console.log(googlemapsapi);

  const countUsers = ()=>{
   // setPending(true);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     }

    fetch(`${baseURL}user/count`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson);
      
      setCount(responseJson);
     // setPending(false);
    })
    .catch((error) => {
      // console.log(error);
     // setPending(false);
    });
  
  }
    useEffect(()=>{
      if(!count){
        countUsers();
      }
    },[]);

    const countPurposeOfFarming = ()=>{
     // setPending(true);
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
       }

      fetch(`${baseURL}user/count-purpose-of-farming`, {method: 'GET', headers})
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        
        setPurposeoffarming(responseJson);
       // setPending(false);
      })
      .catch((error) => {
        // console.log(error);
       // setPending(false);
      });
    
    }
    useEffect(()=>{
      if(!purposeoffarming){
        countPurposeOfFarming();
      }
    },[]);


    const countTypeOfFarming = ()=>{
     // setPending(true);
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
       }

      fetch(`${baseURL}user/count-type-of-farming`, {method: 'GET', headers})
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        
        setTypeoffarming(responseJson);
       // setPending(false);
      })
      .catch((error) => {
        // console.log(error);
       // setPending(false);
      });
    
    }
    useEffect(()=>{
      if(!typeoffarming){
        countTypeOfFarming();
      }
    },[]);


    const countCrops = ()=>{
     // setPending(true);
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
       }

      fetch(`${baseURL}user/count-crops`, {method: 'GET', headers})
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        
        setCropsData(responseJson);
       // setPending(false);
      })
      .catch((error) => {
        // console.log(error);
       // setPending(false);
      });
    
    }
    useEffect(()=>{
      if(!cropsData){
        countCrops();
      }
    },[]);


    const countLga = ()=>{
     // setPending(true);
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
       }

      fetch(`${baseURL}user/count-lga`, {method: 'GET', headers})
      .then((response) => response.json())
      .then((responseJson) => {
       // console.log(responseJson);
        setLgaData(responseJson);
       // setPending(false);
      })
      .catch((error) => {
        // console.log(error);
       // setPending(false);
      });
    
    }
    useEffect(()=>{
      if(!lgaData){
        countLga();
      }
    },[]);


  const nFormatter = (n) => {
    let da
    if (n < 1e3){
     da = n;
   }
    if (n >= 1e3){
      /* eslint-disable-next-line no-useless-concat */
      da = `${+(n / 1e3).toFixed(1)} K`;
    }
    return da;
  };


  const geoCod = (text, arr)=>{
       const res =  text.split(" ");
       return res[arr];
    }



  const data = {
    labels: ['Farmers', 'Agro Marketers', 'Processors', 'Off Takers', 'Logistics', 'Extension Workers', 'Input Delears', 'Business Development Services', 'Mechanization Services'],
    datasets: [
      {
        data: [
          count.farmers,
          count.agroMarketer,
          count.processors,
          count.offtakers,
          count.logistic,
          count.extension_workers,
          count.inputDelear,
          count.bds,
          count.mechanizationService,
        ],
        backgroundColor: [
          'rgba(0,128,0, 0.4)'
        ],
        borderColor: [
          'rgba(0,128,0, 1)'

        ],
        borderWidth: 2,
        fill: true,
      }
    ],
  };

  const purposeoffarmingChart = {
    labels:['commercial', 'subsistence'],
    datasets: [
      {
        label: 'Farm practice',
        data: [
          purposeoffarming.commercial,
          purposeoffarming.subsistence,
          ],
        backgroundColor: [
          'rgba(0,128,0, 0.5)',
          'rgba(255,165,0, 0.5)',
          
        ],
        borderColor: [
          'rgba(0,128,0, 0.8)',
          'rgba(255,165,0, 0.8)',
        ],
      borderWidth: 1,
      }
    ],
  };


  const typeoffarmingChart = {
    labels:['Crop Farming', 'Livestocks'],
    datasets: [
      {
        label: 'Type of Farming',
        data: [
          typeoffarming.cropfarming,
          typeoffarming.livestocks
          ],
        backgroundColor: [
          'rgba(0,128,0, 0.5)',
          'rgba(255,165,0, 0.5)',
          
        ],
        borderColor: [
          'rgba(0,128,0, 0.8)',
          'rgba(255,165,0, 0.8)',
        ],
      borderWidth: 1,
      }
    ],
  };


  const cropsChart = {
    labels:["Cassava", "Banana", "Maize", "Cocoa", "Potato", "Yam", "Plantain", "Cashew", "Sweet potato", "Cowpea", "Rice", "Oil palm", "Wheat", "Sesame", "Soy","Cotton", "Horticulture" ],
    datasets: [
      {
        label: 'Farm productivity',
        data: [
          cropsData.cassava,
          cropsData.banana,
          cropsData.maize,
          cropsData.cocoa,
          cropsData.potato,
          cropsData.yam,
          cropsData.plantain,
          cropsData.cashew,
          cropsData.sweet_potato,
          cropsData.cowpea,
          cropsData.rice,
          cropsData.oil_palm,
          cropsData.wheat,
          cropsData.sesame,
          cropsData.soy,
          cropsData.cotton,
          cropsData.horticulture
          ],
        backgroundColor: [
          'rgba(0,128, 0, 0.4)',
        ],
        borderColor: [
          'rgba(0,128,0, 1)',
        ],
      borderWidth: 2,
      fill: true,
      }
    ],
  };

    const lgaChart = {
    labels:[
          "Abeokuta-North",
          'Abeokuta-South',
          "Ado-Odo/Ota",
          "Ewekoro",
          "Ifo",
          "Ijebu-East",
          "Ijebu-North",
          "Ijebu-North-East",
          "Ijebu-Ode",
          "Ikenne",
          "Imeko-Afon",
          "Ipokia",
          "Obafemi-Owode",
          "Odeda",
          "Odogbolu",
          "Ogun-Waterside",
          "Remo-North",
          "Shagamu",
          "Yewa North",
          "Yewa South"
        ],
    datasets: [
      {
        data: [
         // 666,888,463,998,1523,987,333,1246, 567,459,1687, 876, 1233, 546, 733, 1455, 988, 900, 668
          
          lgaData.Abeokuta_North,
          lgaData.Abeokuta_South,
          lgaData.Ado_Odo,
          lgaData.Ewekoro,
          lgaData.Ifo,
          lgaData.Ijebu_East,
          lgaData.Ijebu_North,
          lgaData.Ijebu_North_East,
          lgaData.Ijebu_Ode,
          lgaData.Ikenne,
          lgaData.Imeko_Afon,
          lgaData.Ipokia,
          lgaData.Obafemi_Owode,
          lgaData.Odeda,
          lgaData.Odogbolu,
          lgaData.Ogun_Waterside,
          lgaData.Remo_North,
          lgaData.Shagamu,
          lgaData.Yewa_North,
          lgaData.Yewa_South
          
        ],
        backgroundColor: [
          'rgba(0,128,0, 0.4)'
          
        ],
        borderColor: [
          'rgba(0,128,0, 1)'
        ],
        borderWidth: 2,
      fill: true,
      }
    ],
  };


  const setGoogleMapRef = async(map, maps) =>{
    const googleMapRef = map;
    const googleRef = maps;
    const markers = users.map((item) => {
      return new googleRef.Marker({position: item.coord});
    });
    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      gridSize: 80,
      minimumClusterSize: 2
    })
  }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Dashboard for managing OGFIMS </div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <Dropdown className="ms-1 w-100 w-md-auto" align="end">
                { /* <Dropdown.Toggle className="end w-100 w-md-auto" variant="outline-primary">
                  All Projects
                </Dropdown.Toggle> */ }
                <Dropdown.Menu>
                  <Dropdown.Item>Production Server</Dropdown.Item>
                  <Dropdown.Item>Mongo Sandbox</Dropdown.Item>
                  <Dropdown.Item>Public Storage</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
        {/* Title End */}



        <Row>
          {/* Introduction Banner Start */}
          <Col lg="8" className="mb-5">
            <Card className="sh-45 h-lg-100 position-relative bg-theme">
              <img src="/img/illustration/database.webp" className="card-img h-100 position-absolute theme-filter" alt="card image" />
              <div className="card-img-overlay d-flex flex-column justify-content-end bg-transparent">
                <div className="mb-4">
                  <div className="cta-1 mb-2 w-75 w-sm-50">Welcome to OGFIMS Admin Dashboard</div>
                  <div className="w-50 text-alternate">Manage users and user groups, send sms, email and push notification to users and more.</div>
                </div>
                <div>
                  <NavLink to="/mgt/farmers" className="btn btn-icon btn-icon-start btn-primary mt-3 stretched-link">
                    <CsLineIcons icon="chevron-right" />
                    <span>Getting Started</span>
                  </NavLink>
                </div>
              </div>
            </Card>
          </Col>
          {/* Introduction Banner End */}

          {/* Introduction List Start */}
          <Col lg="4" className="mb-5">
            <Card className="mb-2 hover-border-primary">
              <Row className="g-0 sh-9">
                <Col xs="auto">
                  <div className="sw-9 sh-9 d-inline-block d-flex justify-content-center align-items-center">
                    <div className="fw-bold text-primary">
                      <CsLineIcons icon="user" />
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column p-0 pe-4 h-100 justify-content-center">
                    <div className="d-flex flex-column">
                      <NavLink to="/" className="stretched-link alternate-link">
                        Add New User
                      </NavLink>
                      <div className="text-small text-muted text-truncate">Add new user on board.</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="mb-2 hover-border-primary">
              <Row className="g-0 sh-9">
                <Col xs="auto">
                  <div className="sw-9 sh-9 d-inline-block d-flex justify-content-center align-items-center">
                    <div className="fw-bold text-primary">
                      <CsLineIcons icon="message" />
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column p-0 pe-4 h-100 justify-content-center">
                    <div className="d-flex flex-column">
                      <NavLink to="/comm/sms" className="stretched-link alternate-link">
                        Broadcast SMS
                      </NavLink>
                      <div className="text-small text-muted text-truncate">Send bulk sms to group of users.</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="mb-2 hover-border-primary">
              <Row className="g-0 sh-9">
                <Col xs="auto">
                  <div className="sw-9 sh-9 d-inline-block d-flex justify-content-center align-items-center">
                    <div className="fw-bold text-primary">
                      <CsLineIcons icon="email" />
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column p-0 pe-4 h-100 justify-content-center">
                    <div className="d-flex flex-column">
                      <NavLink to="/comm/email" className="stretched-link alternate-link">
                        Broadcast Email
                      </NavLink>
                      <div className="text-small text-muted text-truncate">Send bulk email to group of users.</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="hover-border-primary">
              <Row className="g-0 sh-9">
                <Col xs="auto">
                  <div className="sw-9 sh-9 d-inline-block d-flex justify-content-center align-items-center">
                    <div className="fw-bold text-primary">
                      <CsLineIcons icon="bell" />
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column p-0 pe-4 h-100 justify-content-center">
                    <div className="d-flex flex-column">
                      <NavLink to="/comm/push-notification" className="stretched-link alternate-link">
                        Send Push Notification
                      </NavLink>
                      <div className="text-small text-muted text-truncate">Send push notification to mobile app users.</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          {/* Introduction List End */}
        </Row>
       
        <Row >
          <Col xs="12" xl="5" lg="5" className="mb-5">
            <Card className="h-100">
              <Card.Body>

                {/* Stats Start */}
                <h2 className="small-title">User Categories</h2>
                <Row className="gx-2">
                  <Col className="p-0">
                    <Glide
                      options={{
                        gap: 0,
                        rewind: false,
                        bound: true,
                        perView: 6,
                        breakpoints: {
                          400: { perView: 1 },
                          600: { perView: 2 },
                          1400: { perView: 3 },
                          1600: { perView: 3 },
                          1900: { perView: 5 },
                          3840: { perView: 6 },
                        },
                      }}
                    >
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="user" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Farmers</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.farmers)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="shop" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Agro Marketer</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.agroMarketer)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="suitcase" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Extension Workers</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.extension_workers)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="building-large" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Processors</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.processors)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="shipping" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Off Takers</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.offtakers)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="car" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Logistics</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.logistic)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>

                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="suitcase" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Business Development Services</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.bds)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>

                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="scissors" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Input Delear</p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.inputDelear)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>

                      <Glide.Item>
                        <Card className="sh-20 hover-border-primary mb-5">
                          <Card.Body className="p-4 text-center align-items-center d-flex flex-column justify-content-between">
                            <div className="d-flex sh-5 sw-5 bg-gradient-light mb-3 align-items-center justify-content-center rounded-xl">
                              <CsLineIcons icon="gear" className="text-white" />
                            </div>
                            <p className="mb-0 lh-1">Mechanization Services </p>
                            <p className="cta-3 mb-0 text-primary">{nFormatter(count.mechanizationService)}</p>
                          </Card.Body>
                        </Card>
                      </Glide.Item>
                    </Glide>
                  </Col>
                </Row>
                {/* Stats End */}
              </Card.Body>
            </Card>
          </Col>

          <Col xs="12" xl="7" lg="7" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Line options={options} data={data} />
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row >
          <Col xs="12" xl="8" lg="8" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Line options={cropsOptions} data={cropsChart} />
              </Card.Body>
            </Card>
          </Col>

          <Col xs="12" xl="4" lg="4" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Doughnut data={typeoffarmingChart} options={typeoffarmingOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row >
          <Col xs="12" xl="4" lg="4" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Pie data={purposeoffarmingChart} options={purposeoffarmingOptions} />
              </Card.Body>
            </Card>
          </Col>

          <Col xs="12" xl="8" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Line options={lgaOptions} data={lgaChart} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row >
          <Col xs="12" xl="12" className="mb-5">
            <Card className="h-100">
              <Card.Body>
                <Row xs="auto" style={{padding:20}}>
                    <Col>
                      <Form.Select aria-label="Category" value={category} style={{fontSize: 15}} size="sm" onChange={(e)=>{getUsers(page, perPage, e.target.value, lga);}}>
                        <option value="">Select category</option>
                        <option value="farmer">Farmers</option>
                        <option value="trader">Traders</option>
                        <option value="processor">Processors</option>
                        <option value="off_taker">Off-takers</option>
                        <option value="transporter">Transporters</option>
                      </Form.Select>
                    </Col>
                      
                    <Col>
                      <Form.Select aria-label="LGA" size="sm" style={{fontSize: 14}} onChange={(e)=>{getUsers(page, perPage, category, e.target.value);}}>
                        <option value="">LGA</option>
                        {
                          lgas.map((item, i)=>(
                            <option key={i} value={item}>{item}</option>
                          ))
                        }
                        
                      </Form.Select>
                    </Col>
                  </Row>

                <div style={{ height: '50vh', width: '100%' }}>
                {googlemapsapi ?
                  <GMap users={users} apiKey={googlemapsapi}/>
                  : null
                }

                </div>
               </Card.Body>
            </Card>
          </Col>
        </Row>

          {/* Categories End */}

        {/* Charts Start */}

        {/* Charts End */}


      </Col>
    </>
  );
};

export default DashboardAnalysis;
