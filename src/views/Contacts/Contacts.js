import React, { useState, useRef, useEffect } from 'react';
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

const Contact = () => {
  const name = 'Contact';
  const description = 'Contact';
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [address, setAddress] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  const [featuredImage, setFeaturedImage] = useState('');
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();
  const editorRef = useRef(null);

  console.log(currentUser.token);

  const log = () => {
    if (editorRef.current){
      // console.log(editorRef.current.getContent());
      // setContent(editorRef.current.getContent());
    }
  };

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

  const getContact = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
     fetch(`${baseURL}contact/63be7ca47ec18f6690c235a2`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {

      console.log(responseJson)
      setPhone1(responseJson.contact.phone1);
      setPhone2(responseJson.contact.phone2);
      setEmail1(responseJson.contact.email1);
      setEmail2(responseJson.contact.email2);
      setAddress(responseJson.contact.address);
      // history.push("/content/banners");
      // history.push("/news/list");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(()=> {
    if(!phone1){
      getContact();
    }
  },[]);

  const submit = ()=>{

    if(!phone1){
      notify('warn', "Please add phone1");
      return;
    }

     if(!phone2){
      notify('warn', "Please add phone2");
      return;
    }

     if(!email1){
      notify('warn', "Please add email 1");
      return;
    }

     if(!email2){
      notify('warn', "Please add email 2");
      return;
    }

     if(!address){
      notify('warn', "Please add address");
      return;
    }

    /* if(!featuredImage){
      notify('warn', "Please add image");
      return;
    }

    if(order < 1 ){
      notify('warn', "Please add Display order");
      return; 
    } */

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }


    const body = JSON.stringify({ "phone1": phone1, "phone2": phone2, "email1": email1, "email2":email2, "address": address });
     console.log(body);
    fetch(`${baseURL}contact/63be7ca47ec18f6690c235a2`, {method: 'PUT', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {

      console.log(responseJson)
      notify('success', "Published");
      // history.push("/content/banners");
      // history.push("/news/list");
    })
    .catch((error) => {
      console.log(error);
    });
  }


  const handleUploadPhoto = (event)=>{      
    const formdata = new FormData();
    formdata.append('filetoupload',event.target.files[0]);
    fetch(`${baseURL}file-upload`,{
      method: 'POST',
      body: formdata
    })
    .then((response) => response.json())
    .then((responseJson) => {
    console.log('response', responseJson);
    setIsUploading(false)
    setFeaturedImage(responseJson.data);
    })
    .catch((error) => {
    alert('Error');
    console.log('error', error);
    setIsUploading(false)
    });
  };



  return (
    <>
      <HtmlHead title={name} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{name}</h1>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        { /* Authentication Start 
        <h2 className="small-title">Authentication</h2> */ }
        <Card className="mb-5">
          <Card.Body>
            <Form className="mb-n3">
              <Form.Label>Phone Number one</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="phone" />
                <Form.Control type="number" value={phone1} onChange={(e)=>setPhone1(e.target.value)} placeholder="Phone 1" />
              </div>


              <Form.Label>Phone Number Two</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="phone" />
                <Form.Control type="number" value={phone2} onChange={(e)=>setPhone2(e.target.value)} placeholder="Phone 2" />
              </div>


              <Form.Label>Email One</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="email" />
                <Form.Control type="email" value={email1} onChange={(e)=>setEmail1(e.target.value)} placeholder="Email 1" />
              </div>

              <Form.Label>Email Two</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="email" />
                <Form.Control type="email" value={email2} onChange={(e)=>setEmail2(e.target.value)} placeholder="Email 2" />
              </div>

              <Form.Label>Address</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="pin" />
                <Form.Control type="text" as="textarea" rows={3} value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address" />
              </div>


            </Form>


          {/*  <div>

            <br/>
            <br/>
            <br/>
              <p>Thumbnail</p>
              <input type="file" accept="image/*" name="image" onChange={(e)=> {handleUploadPhoto(e); console.log(e.target.files[0])}} />
              {
                isUploading ? <Spinner animation="border" variant="primary" /> :  null
              }

              {
                featuredImage ? <h4><br/><img alt="featuredImage" src={baseURL+featuredImage} style={{width:100, height: 100}}/></h4> :null
              }
            </div> */}


          </Card.Body>
        </Card>
   

        <div className="text-center">
          <div className="shadow d-inline-block">

            <Button variant="primary" onClick={()=>{submit()}} className="btn-icon btn-icon-end" size="lg">
              <span>Publish</span>
              <CsLineIcons icon="chevron-right" />
            </Button>
          </div>
        </div>
        {/* Plan End */}
      </Col>
    </>
  );
};

export default Contact;
