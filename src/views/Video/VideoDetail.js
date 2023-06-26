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

const VideoEditor = () => {

  const location = useLocation();

  const name = 'Edit Video';
  const description = 'Edit ';
  const [title, setTitle] = useState(location.state.data?.title);
  const [url, setUrl] = useState(location.state.data.url);
  const [isUploading, setIsUploading] = useState(false);
  /* eslint no-underscore-dangle: 0 */
  const [id, setId] = useState(location.state.data?._id);

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

     if(!url){
      notify('warn', "Please add url");
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


    const body = JSON.stringify({"title": title, "url": url});
      console.log(body);
    fetch(`${baseURL}video/${id}`, {method: 'PUT', body, headers})
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


   const handleUploadVid = (event)=>{     
    const formdata = new FormData();
    formdata.append('filetoupload',event.target.files[0]);

    fetch(`${baseURL}file-upload`, {
      method: 'POST',
      body: formdata
    })
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson);
    setIsUploading(false)
    setUrl(responseJson.data);
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

            <Form.Label> Title</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
              </div>

              <Form.Label>Upload Video</Form.Label>
              <div className="mb-3 filled">
                <input type="file" accept="video/*" name="video" onChange={(e)=> {handleUploadVid(e); console.log(e.target.files[0])}} />
              </div>

              <Form.Label>Video URL</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="video URL" />
              </div>



              <br/>

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

export default VideoEditor;
