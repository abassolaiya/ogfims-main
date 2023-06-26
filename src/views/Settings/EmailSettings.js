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

const EmailSettings = () => {
  const name = 'Email Settings';
  const description = 'Email Settings';
  const [mailchimpApikey, setMailchimpapikey] = useState('');

  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();
  const editorRef = useRef(null);

  // console.log(currentUser.token);


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

  const getSettings = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
     fetch(`${baseURL}settings/63eb32f6a11bca78138358bb`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {

      // console.log(responseJson)
      setMailchimpapikey(responseJson.setting.mailchimp_apikey);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(()=> {
    if(!mailchimpApikey){
      getSettings();
    }
  },[mailchimpApikey]);

  const submit = ()=>{

    if(!mailchimpApikey){
      notify('warn', "Please add mailchimp API key");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }


    const body = JSON.stringify({ mailchimp_apikey: mailchimpApikey});
     console.log(body);
    fetch(`${baseURL}settings/63eb32f6a11bca78138358bb`, {method: 'PUT', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {

      // console.log(responseJson)
      notify('success', "Published");
      // history.push("/content/banners");
      // history.push("/news/list");
    })
    .catch((error) => {
      console.log(error);
    });
  }


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
            <p>Mailchimp email service was used for the system email, find the settings below</p>
            <Form className="mb-n3">
              <div className="mb-3 filled">
               <Form.Label>Mailchimp API key</Form.Label>
                <Form.Control type="text" value={mailchimpApikey} onChange={(e)=>setMailchimpapikey(e.target.value)} />
              </div>
            </Form>
          </Card.Body>
        </Card>
   

        <div className="text-center">
          <div className="shadow d-inline-block">

            <Button variant="primary" onClick={()=>{submit()}} className="btn-icon btn-icon-end" size="lg">
              <span>Update</span>
              <CsLineIcons icon="chevron-right" />
            </Button>
          </div>
        </div>
        {/* Plan End */}
      </Col>
    </>
  );
};

export default EmailSettings;
