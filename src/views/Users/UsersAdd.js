import React, { useState, useRef } from 'react';
import { Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {useHistory} from "react-router-dom";
import Select from 'react-select';

// import { EditorState } from 'draft-js';
// import { Editor } from "react-draft-wysiwyg";
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { baseURL } from '../../httpService';


const roles = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "contributor", label: "Contributor" },
  ];


const UsersAdd = () => {
  const title = 'Admin Users';
  const description = 'Add new Farmers';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

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

  const submit = ()=>{
    if(!name){
      notify('warn', "Please add name ");
      return;
    }

    if(!email){
      notify('warn', "Please add email");
      return;
    }

    if(!password){
       notify('warn', "Please add password");
      return;
    }

    if(!role){
       notify('warn', "Please add role");
      return;
    }


    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    const body = JSON.stringify({"name": name, "email": email, "password":password, "role": role, "mobile":mobile});
    console.log(body);
    fetch(`${baseURL}admin/register`, {method: 'POST', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      notify('success', "Success");
      history.push("/mgt/admin-users");
    })
    .catch((error) => {
      console.log(error);
    });
  }

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

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Add new Admin.</div>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        { /* Authentication Start 
        <h2 className="small-title">Register</h2> */ }
        <Card className="mb-5">
          <Card.Body>
            <Form className="mb-n3">
              <div className="mb-3 filled">
                <CsLineIcons icon="user" />
                <Form.Control type="text" onChange={(e)=>setName(e.target.value)} placeholder="Name" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="phone" />
                <Form.Control type="tel" onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile Number" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="email" />
                <Form.Control type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="key" />
                <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="gender" />
                <Select classNamePrefix="react-select" options={roles} onChange={(e)=>setRole(e.value)} placeholder="Select Role" />
              </div>

            </Form>
          </Card.Body>
        </Card>

        <div className="text-center">
          <div className="shadow d-inline-block">

            <Button variant="primary" onClick={()=>{submit()}} className="btn-icon btn-icon-end" size="lg">
              <span>Submit</span>
              <CsLineIcons icon="chevron-right" />
            </Button>
          </div>
        </div>

        
      </Col>
    </>
  );
};

export default UsersAdd;
