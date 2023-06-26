import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {useHistory, useLocation} from "react-router-dom";
// import { EditorState } from 'draft-js';
// import { Editor } from "react-draft-wysiwyg";
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { baseURL } from '../../httpService';

const PartnerEditor = () => {

  const location = useLocation();

  const name = 'Edit Partner';
  const description = 'Edit ';
  const [title, setTitle] = useState(location.state.data?.name);
  /* eslint no-underscore-dangle: 0 */
  const [id, setId] = useState(location.state.data?._id);
  const [website, setWebsite] = useState(location.state.data?.url);
  const [order, setOrder] = useState(location.state.data?.order);
  const [isUploading, setIsUploading] = useState(false);
  const [logo, setLogo] = useState(location.state.data?.logo);

  const refFileUpload = useRef(null);
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();
  const editorRef = useRef(null);

  /* eslint no-underscore-dangle: 0 */
  console.log(location.state.data?._id);

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


  const submit = ()=>{

    if(!title){
      notify('warn', "Please add excerpt");
      return;
    }

     if(!website){
      notify('warn', "Please add content");
      return;
    }
 /* 
   if(!featuredImage){
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


    const body = JSON.stringify({"name": title, "url": website, "order": order, "logo":logo});
     // console.log(body);
    fetch(`${baseURL}partners/${id}`, {method: 'PUT', body, headers})
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


  const onThumbChangeClick = () => {
    if (refFileUpload) {
      refFileUpload.current.dispatchEvent(new MouseEvent('click'));
    }
  };


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
    setLogo(responseJson.data);
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
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Name" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={website} onChange={(e)=>setWebsite(e.target.value)} placeholder="Website url" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="number" value={order} onChange={(e)=>setOrder(e.target.value)} placeholder="Display order" />
              </div>

              <br/>
           </Form>


           <div>

            <br/>
            <br/>
            <br/>
              <p>Logo</p>
              {
                isUploading ? <Spinner animation="border" variant="primary" /> :  null
              }
            </div>


            <div className="mb-3 mx-auto position-relative" id="imageUpload">
              <img src={baseURL+logo} alt="user" className="rounded-xl border border-separator-light border-4 sw-11 sh-11" id="contactThumbModal" />
              <Button
                size="sm"
                variant="separator-light"
                className="btn-icon btn-icon-only position-absolute rounded-xl s-0 b-0"
                onClick={onThumbChangeClick}
              >
                <CsLineIcons icon="upload" className="text-alternate" />
              </Button>
              <Form.Control type="file" ref={refFileUpload} className="file-upload d-none" accept="image/*" onChange={(e)=>handleUploadPhoto(e)} />
            </div>


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

export default PartnerEditor;
