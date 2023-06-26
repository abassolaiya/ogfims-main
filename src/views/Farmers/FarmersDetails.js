import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';

import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import Select from 'react-select';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseURL } from '../../httpService';


  const lgas = [
    { value: "Abeokuta-North", label:"Abeokuta-North"},
    { value: "Abeokuta-South", label:"Abeokuta-South"},
    { value: "Ado-Odo/Ota", label:"Ado-Odo/Ota"},
    { value: "Ewekoro", label:"Ewekoro"},
    { value: "Ifo", label:"Ifo"},
    { value: "Ijebu-East", label:"Ijebu-East"},
    { value: "Ijebu-North", label:"Ijebu-North"},
    { value: "Ijebu-North-East", label:"Ijebu-North-East"},
    { value: "Ijebu-Ode", label:"Ijebu-Ode"},
    { value: "Ikenne", label:"Ikenne"},
    { value: "Imeko-Afon", label:"Imeko-Afon"},
    { value: "Ipokia", label:"Ipokia"},
    { value: "Obafemi-Owode", label:"Obafemi-Owode"},
    { value: "Odeda", label:"Odeda"},
    { value: "Odogbolu", label:"Odogbolu"},
    { value: "Ogun-Waterside", label:"Ogun-Waterside"},
    { value: "Remo-North", label:"Remo-North"},
    { value: "Shagamu", label:"Shagamu"},
    { value: "Yewa North", label:"Yewa North"}
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const ServiceListOne = [
      {
        id:1,  value: "farmer", label:"Farmers"
      },
      {
         id:2, value: "trader",label:"Traders"
      },
      {
        id:3,  value: "processor",label:"Processors"
      },
      {
         id:4, value: "agro_Dealer",label:"Agro Dealers"
      },

      {
         id:5, value: "extension_worker",label:"Extension Workers"
      },
      {
         id:6, value: "financial_Service_providers",label:"Financial Service Providers"
      },

      {
        id:7,  value: "input_provider", label:"Input Providers"
      },

      {
         id:8, value: "business_development_service_providers", label:"Business Development Service Providers"
      },

      {
         id:9, value: "off_taker", label:"Off-takers"
      },
      {
         id:10, value: "mechanization_service_providers",label:"Mechanization Service Providers"
      },
      {
         id:11, value: "expert",label:"Experts (Plant & Animal)"
      },
      {
         id:12, value: "transporter",label:"Transporters"
      }
  ]

  const CommondityList =[
      {
        id:1,  value: "Cassava", label:"Cassava"
      },
      {
         id:2, value: "Yam",label:"Yam"
      },
      {
        id:3,  value: "Cashew",label:"Cashew"
      },
      {
         id:4, value: "Potato",label:"Potato"
      },
      {
         id:4, value: "Sweet Potato",label:"Sweet Potato"
      },
  ];


  const TypeofFarmingList =[
      {
        id:1,  value: "Crop Farming", label:"Crop Farming"
      },
      {
         id:2, value: "Poultry",label:"Poultry"
      },
      {
        id:3,  value: "Horticulture",label:"Horticulture"
      },
      {
         id:4, value: "Aquaculture",label:"Aquaculture"
      },
      {
         id:4, value: "Livestock",label:"Livestock"
      },
  ];

const FarmersDetails = () => {

  const history = useHistory();
  const location = useLocation();

  const title = 'Profile';
  const description = "User's Profile page";
  const refFileUpload = useRef(null);

  const [data, setData] = useState(location?.state?.data);
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const [genderValue, setGenderValue] = useState( data.sex === 'male' ? genderOptions[0]: genderOptions[1]);
  const [category, setCategory]=useState([]);
  const [typeOfFarming, setTypeOfFarming]=useState([]);
  const [crops, setCrops]=useState([]);

  const [accessToAdvisoryServices, setAccessToAdvisoryServices]=useState(data.accessToAdvisoryServices);
  const [accessToBusinessServiceProviders, setAccessToBusinessServiceProviders]=useState(data.accessToBusinessServiceProviders);
  const [accessToExtensionSuport, setAccessToExtensionSuport]=useState(data.accessToExtensionSuport);
  const [accessToFinancialServiceProviders, setAccessToFinancialServiceProviders]=useState(data.accessToFinancialServiceProviders);
  const [accessToGovernmentLandForFarming, setAccessToGovernmentLandForFarming]=useState(data.accessToGovernmentLandForFarming);
  const [accessToInputProviders, setAccessToInputProviders]=useState(data.accessToInputProviders);
  const [accessToMechanizatServiceProviders, setAccessToMechanizatServiceProviders]=useState(data.accessToMechanizatServiceProviders);
  const [cropManagementTechniques, setCropManagementTechniques]=useState(data.cropManagementTechniques);
  const [farmlandOwnership, setFarmlandOwnership]=useState(data.farmlandOwnership);
  const [soilManagementTechniques, setSoilManagementTechniques]=useState(data.soilManagementTechniques);
  const [incentiveFromGovt, setIncentiveFromGovt]=useState(data.incentiveFromGovt);



  const getLga = lgas.filter((arr, i)=>{ 
    return arr.value === data.lga;
  });
  const [lga, setLga]=useState(getLga);



  const getPrimaryCat = (item)=>{
      ServiceListOne.filter((arr, i)=>{ 
        if(arr.value === item){
         setCategory(prevState =>([...prevState, arr ]));
        }
        
    });
  }

  const loopCat =()=>{
   if(data.primaryCategory){ 
       data.primaryCategory.map((item)=>{
      getPrimaryCat(item);
    })
   }
  }


  const getTypeOffarming = (item)=>{
      TypeofFarmingList.filter((arr, i)=>{ 
        if(arr.value === item){
         setTypeOfFarming(prevState =>([...prevState, arr ]));
        }
        
    });
  }

  const loopTypeFarming =()=>{
   if(data.typeOfFarming){ 
       data.typeOfFarming.map((item)=>{
      getTypeOffarming(item);
    })
   }
  }

  useEffect(()=>{
    if(category.length === 0){
      loopCat();
    }
  },[])

  useEffect(()=>{
    if(typeOfFarming.length === 0){
      loopTypeFarming();
    }
  },[])


  const getCommodity = (item)=>{
      CommondityList.filter((arr, i)=>{ 
        if(arr.value === item){
         setCrops(prevState =>([...prevState, arr ]));
        }
        
    });
  }

  const loopCommodity =()=>{
   if(data.crops){ 
       data.crops.map((item)=>{
      getCommodity(item);
    })
   }
  }

  useEffect(()=>{
    if(crops.length === 0){
      loopCommodity();
    }
  },[])
 
  const onThumbChangeClick = () => {
    if (refFileUpload) {
      refFileUpload.current.dispatchEvent(new MouseEvent('click'));
    }
  };
  const changeThumb = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setThumb(loadEvent.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

    return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small"></div>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        {/* Public Info Start */}
        <h2 className="small-title">{data.name}</h2>
        <Card className="mb-5">
          <Card.Body>
            <Form className="d-flex flex-column">
              <div className="mb-3 mx-auto position-relative" id="imageUpload">
                <img src={data.profileImage ? `${baseURL}${data.profileImage}` : `${baseURL}uploads/user.png`} alt="user" className="rounded-xl border border-separator-light border-4 sw-11 sh-11" id="contactThumbModal" />
                <Button
                  size="sm"
                  variant="separator-light"
                  className="btn-icon btn-icon-only position-absolute rounded-xl s-0 b-0"
                  onClick={onThumbChangeClick}
                >
                  <CsLineIcons icon="upload" className="text-alternate" />
                </Button>
                <Form.Control type="file" ref={refFileUpload} className="file-upload d-none" accept="image/*" onChange={changeThumb} />
              </div>
              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control type="text" placeholder="Name" defaultValue={data.name} />
                </FloatingLabel>
              </div>
              
              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email Address"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="Email" defaultValue={data.email} />
                </FloatingLabel>
              </div>
              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Mobile Number"
                  className="mb-3"
                >
                  <Form.Control type="tel" placeholder="Phone" defaultValue={data.mobileNumber} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="gender" />
                <Select classNamePrefix="react-select" options={genderOptions} value={genderValue} onChange={setGenderValue} placeholder="Select" />
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Age"
                  className="mb-3"
                >
                  <Form.Control type="number" required name="age" defaultValue={data.age} placeholder="Age" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="National Identification Number (NIN)"
                  className="mb-3"
                >
                  <Form.Control type="text" required name="NIN" defaultValue={data.nationalIdentificationNumber} placeholder="NIN" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Household Size"
                  className="mb-3"
                >
                  <Form.Control type="number" required  defaultValue={data.householdSize} placeholder="Household Size" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Town (City)"
                  className="mb-3"
                >
                  <Form.Control type="text" required  defaultValue={data.town} placeholder="Town" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Address"
                  className="mb-3"
                >
                  <Form.Control type="text" required  defaultValue={data.address} placeholder="Address" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Crop Income (Nearest to Naira)"
                  className="mb-3"
                >
                  <Form.Control type="number" required  defaultValue={data.cropsIncome} placeholder="Crop Income" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Total Income Revenue (Nearest to Naira)"
                  className="mb-3"
                >
                  <Form.Control type="number" required  defaultValue={data.totalIncomeRevenue} placeholder="Crop Income" onChange={(e)=>setName(e.target.value)} />
                </FloatingLabel>
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="flag" />
                <Select classNamePrefix="react-select" isSearchable options={lgas} value={lga} onChange={setLga} placeholder="Select LGA" />
              </div>


              <div className="mb-3 filled">
                <CsLineIcons icon="grid-1" />
                <Select classNamePrefix="react-select" isMulti closeMenuOnSelect={false} isSearchable options={ServiceListOne} value={category} onChange={setCategory} placeholder="Select primary Category" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="folders" />
                <Select classNamePrefix="react-select" isMulti closeMenuOnSelect={false} isSearchable options={TypeofFarmingList} value={typeOfFarming} onChange={setTypeOfFarming} placeholder="Type of Farming" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="leaf" />
                <Select classNamePrefix="react-select" isMulti closeMenuOnSelect={false} isSearchable options={CommondityList} value={crops} onChange={setCrops} placeholder="Select Commodities" />
              </div>


              <div className="mb-3 filled">
                <Alert variant="dark"> Have you ever received incentive from Government? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="incentiveFromGovt"
                  type="radio"
                  checked={data.incentiveFromGovt === "yes" ? true : false}
                  onChange={()=>setIncentiveFromGovt(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="incentiveFromGovt"
                  type="radio"
                  checked={data.incentiveFromGovt === "yes" ? false : true}
                  onChange={()=>setIncentiveFromGovt(e.target.value)}
                />
                </Alert>
              </div>


              <div className="mb-3 filled">
                 <Alert variant="dark"> Do you have access to Government land for farming? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToGovernmentLandForFarming"
                  type="radio"
                  checked={data.accessToGovernmentLandForFarming === "yes" ? true : false}
                  onChange={()=>setAccessToGovernmentLandForFarming(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToGovernmentLandForFarming"
                  type="radio"
                  checked={data.accessToGovernmentLandForFarming === "yes" ? false : true}
                  onChange={()=>setAccessToGovernmentLandForFarming(e.target.value)}
                />
                </Alert>
              </div>


              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access to Extension support? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToExtensionSuport"
                  type="radio"
                  checked={data.accessToExtensionSuport === "yes" ? true : false}
                  onChange={()=>setAccessToExtensionSuport(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToExtensionSuport"
                  type="radio"
                  checked={data.accessToExtensionSuport === "yes" ? false : true}
                  onChange={()=>setAccessToExtensionSuport(e.target.value)}
                />
                </Alert>
              </div>


              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access Business Development Service Providers? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToBusinessServiceProviders"
                  type="radio"
                  checked={data.accessToBusinessServiceProviders === "yes" ? true : false}
                  onChange={()=>setAccessToBusinessServiceProviders(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToBusinessServiceProviders"
                  type="radio"
                  checked={data.accessToBusinessServiceProviders === "yes" ? false : true}
                  onChange={()=>setAccessToBusinessServiceProviders(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access Advisory Services? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToAdvisoryServices"
                  type="radio"
                  checked={data.accessToAdvisoryServices === "yes" ? true : false}
                  onChange={()=>setAccessToAdvisoryServices(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToAdvisoryServices"
                  type="radio"
                  checked={data.accessToAdvisoryServices === "yes" ? false : true}
                  onChange={()=>setAccessToAdvisoryServices(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access Financial Service Providers? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToFinancialServiceProviders"
                  type="radio"
                  checked={data.accessToFinancialServiceProviders === "yes" ? true : false}
                  onChange={()=>setAccessToFinancialServiceProviders(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToFinancialServiceProviders"
                  type="radio"
                  checked={data.accessToFinancialServiceProviders === "yes" ? false : true}
                  onChange={()=>setAccessToFinancialServiceProviders(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access Input Providers? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToInputProviders"
                  type="radio"
                  checked={data.accessToInputProviders === "yes" ? true : false}
                  onChange={()=>setAccessToInputProviders(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToInputProviders"
                  type="radio"
                  checked={data.accessToInputProviders === "yes" ? false : true}
                  onChange={()=>setAccessToInputProviders(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have access Mechanization Service Providers? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="accessToMechanizatServiceProviders"
                  type="radio"
                  checked={data.accessToMechanizatServiceProviders === "yes" ? true : false}
                  onChange={()=>setAccessToMechanizatServiceProviders(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="accessToMechanizatServiceProviders"
                  type="radio"
                  checked={data.accessToMechanizatServiceProviders === "yes" ? false : true}
                  onChange={()=>setAccessToMechanizatServiceProviders(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have own your Farm land? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="farmlandOwnership"
                  type="radio"
                  checked={data.farmlandOwnership === "yes" ? true : false}
                  onChange={()=>setFarmlandOwnership(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="farmlandOwnership"
                  type="radio"
                  checked={data.farmlandOwnership === "yes" ? false : true}
                  onChange={()=>setFarmlandOwnership(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have Practice any Soil Management Techniques? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="soilManagementTechniques"
                  type="radio"
                  checked={data.soilManagementTechniques === "yes" ? true : false}
                  onChange={()=>setSoilManagementTechniques(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="soilManagementTechniques"
                  type="radio"
                  checked={data.soilManagementTechniques === "yes" ? false : true}
                  onChange={()=>setSoilManagementTechniques(e.target.value)}
                />
                </Alert>
              </div>

              <div className="mb-3 filled">
                <Alert variant="dark"> Do you have Practice any Crop Management Techniques? <br/> <br/>
                <Form.Check
                  inline
                  label="Yes"
                  name="cropManagementTechniques"
                  type="radio"
                  checked={data.cropManagementTechniques === "yes" ? true : false}
                  onChange={()=>setCropManagementTechniques(e.target.value)}
                />

                <Form.Check
                  inline
                  label="No"
                  name="cropManagementTechniques"
                  type="radio"
                  checked={data.cropManagementTechniques === "yes" ? false : true}
                  onChange={()=>setCropManagementTechniques(e.target.value)}
                />
                </Alert>
              </div>

            </Form>
            <Button variant="primary">Update</Button>
          </Card.Body>
        </Card>
        {/* Public Info End */}



        {/* Email Settings Start 
        <h2 className="small-title">Email Settings</h2>
        <Card className="mb-5">
          <Card.Body>
            <Form className="d-flex flex-column">
              <div className="mb-3 filled custom-control-container">
                <CsLineIcons icon="shield" />
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="securityCheck" defaultChecked />
                  <label className="form-check-label" htmlFor="securityCheck">
                    Security Warnings
                  </label>
                </div>
              </div>
              <div className="mb-3 filled custom-control-container">
                <CsLineIcons icon="money" />
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="budgetCheck" defaultChecked />
                  <label className="form-check-label" htmlFor="budgetCheck">
                    Over Budget
                  </label>
                </div>
              </div>
              <div className="mb-3 filled custom-control-container">
                <CsLineIcons icon="server" />
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="quotaCheck" defaultChecked />
                  <label className="form-check-label" htmlFor="quotaCheck">
                    Quota Warnings
                  </label>
                </div>
              </div>
              <div className="mb-3 filled custom-control-container">
                <CsLineIcons icon="bell" />
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="generalCheck" />
                  <label className="form-check-label" htmlFor="generalCheck">
                    General Notifications
                  </label>
                </div>
              </div>
              <div className="mb-3 filled custom-control-container">
                <CsLineIcons icon="news" />
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="newsletterCheck" />
                  <label className="form-check-label" htmlFor="newsletterCheck">
                    Monthly Newsletter
                  </label>
                </div>
              </div>
            </Form>
            <Button variant="primary">Update</Button>
          </Card.Body>
        </Card>
         Email Settings End */}

        {/* Language Settings Start 
        <h2 className="small-title">Language Settings</h2>
        <Card>
          <Card.Body>
            <Form className="d-flex flex-column">
              <div className="mb-3 filled">
                <CsLineIcons icon="web" />
                <Select classNamePrefix="react-select" options={languageOptions} value={languageValue} onChange={setLanguageValue} placeholder="Select" />
              </div>
            </Form>
            <Button variant="primary">Update</Button>
          </Card.Body>
        </Card>
         Language Settings End */}
      </Col>
    </>
  );
};

export default FarmersDetails;
