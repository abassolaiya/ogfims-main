import React, { useState, useRef } from 'react';
import { Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {useHistory} from "react-router-dom";

// import { EditorState } from 'draft-js';
// import { Editor } from "react-draft-wysiwyg";
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { baseURL } from '../../httpService';


const ProcessorsAdd = () => {
  const title = 'Processors';
  const description = 'Add new Processor';

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [lga, setLga] = useState('');
  const [town, setTown] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [geolocation, setGeolocation] = useState('');
  const [maritalstatus, setMaritaStatus] = useState(false);
  const [householdnumber, setHouseHold] = useState('');
  const [education, setEducation] = useState('');
  const [monthlyfarmincome, setMonthlyFarmIncome] = useState('');
  const [annualfarmincome, setAnnualFarmIncome] = useState('');
  const [farmsize, setFarmSize] = useState('');
  const [farmtype, setFarmType] = useState('');
  const [totalproductioncost, setTotalProductionCost] = useState('');
  const [totalincome, setTotalIncome] = useState('');
  const [seedvarieties, setSeedvarieties] = useState('');
  const [cropmanagment, setCropManagment] = useState('');
  const [soilmanagment, setSoilManagment] = useState('');
  const [cropyields, setCropYields] = useState('');
  const [extensionsupportaccess, setExtensionSupportAccess] = useState('');
  const [inputproviders, setInputProviders] = useState('');
  const [bdsproviders, setDdsProviders] = useState('');
  const [offtakers, setOffTakers] = useState('');
  const [financialserviceproviders, setFinancialServiceProviders] = useState('');
  const [nin, setNin] = useState('');


  const [featuredImage, setFeaturedImage] = useState('');
  const [isUploading, setIsUploading] = useState('');
  
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();

  const notify = (status, message) => {

    if(status === 'success'){
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'error'){
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'warn'){
      toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'info'){
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const postNews = ()=>{
    if(!firstname){
      notify('warn', "Please add firstname ");
      return;
    }

    if(!lastname){
      notify('warn', "Please add lastname");
      return;
    }

    if(!nin){
       notify('warn', "Please add nin");
      return;
    }

    if(!age){
       notify('warn', "Please add age");
      return;
    }

    if(!sex){
       notify('warn', "Please provide sex");
      return;
    }

    if(!lga){
       notify('warn', "Please provide local govt");
      return;
    }


    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    const postBody = JSON.stringify({"firstname": firstname, "lastname": lastname, "age": age, "sex":sex, "lga": lga, "town": town, "mobilenumber": mobilenumber });
    // console.log(body);
    fetch(`${baseURL}publications`, {method: 'POST', postBody, headers})
    .then((response) => response.json())
    .then((responseJson) => {
      notify('success', "Published");
     // history.push("/content/news");
    })
    .catch((error) => {
      console.log(error);
    });
  }




/*
  const handleUploadPhoto = (event)=>{        
        const formdata = new FormData();
        formdata.append('filetoupload',event.target.files[0]);

        fetch(`${baseURL}file-upload`, {
          method: 'POST',
          body: formdata
        })
        .then((response) => response.json())
        .then((responseJson) => {
        console.log('response', responseJson);
        setIsUploading(false)
        setThumbnail(responseJson.data);
        })
        .catch((error) => {
        alert('Error');
        console.log('error', error);
        setIsUploading(false)
        });
    };

*/


const handleUploadPhoto = (event)=>{      
    const formdata = new FormData();
    formdata.append('file',event.target.files[0]);
    formdata.append("uploadpreset", "rw57hcmc");
    formdata.append("publicid", "dh4arprvl");
    formdata.append("apikey", "632441573341924");

    fetch('https://api.cloudinary.com/v11/dh4arprvl/:resourcetype/upload',{
      method: 'POST',
      body: formdata
    })
    .then((response) => response.json())
    .then((responseJson) => {
    console.log('response', responseJson);
    setIsUploading(false)
    setFeaturedImage(responseJson.url);
    })
    .catch((error) => {
    alert('Error');
    console.log('error', error);
    setIsUploading(false)
    });
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
              <div className="text-muted font-heading text-small">Add to Processors Items.</div>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        { /* Authentication Start 
        <h2 className="small-title">Authentication</h2> */ }
        <Card className="mb-5">
          <Card.Body>
            <Form className="mb-n3">
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setFirstName(e.target.value)} placeholder="First Name" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setLastName(e.target.value)} placeholder="Last Name" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="number" onChange={(e)=>setAge(e.target.value)} placeholder="Age" />
              </div>


            </Form>
          </Card.Body>
        </Card>
        
      </Col>
    </>
  );
};

export default ProcessorsAdd;
