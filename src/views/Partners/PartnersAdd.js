import React, { useState } from 'react';
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



const PartnersAdd = () => {
  const name = 'Partners';
  const description = 'Add to Partners Items';

  const [title, setTitle] = useState('');
   const [website, setWebsite] = useState('');
  const [order, setOrder] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [featuredImage, setFeaturedImage] = useState('');
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
    if(!title){
      notify('warn', "Please add title to your post");
      return;
    }

    if(!order){
      notify('warn', "Please order");
      return;
    }

    if(!featuredImage){
       notify('warn', "Please add featured image to your post");
      return;
    }

    if(!website){
      notify('warn', "Please website");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    const body = JSON.stringify({"name": title, "url": website, "order": order, "logo":featuredImage});
    // console.log(body);
    fetch(`${baseURL}partners`, {method: 'POST', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      notify('success', "Published");
      history.push("/content/partners");
    })
    .catch((error) => {
      notify('error', "Error while deleting deleted");
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
              <div className="text-muted font-heading text-small">Add to news Items.</div>
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
                <Form.Control type="text" onChange={(e)=>setTitle(e.target.value)} placeholder="Name" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setWebsite(e.target.value)} placeholder="Website url" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="number" onChange={(e)=>setOrder(e.target.value)} placeholder="Display order" />
              </div>

              <br/>
           </Form>


            <div>

            <br/>
            <br/>
            <br/>
              <p>Logo</p>
              <input type="file" accept="image/*" name="image" onChange={(e)=> {handleUploadPhoto(e); console.log(e.target.files[0])}} />
              {
                isUploading ? <Spinner animation="border" variant="primary" /> :  null
              }

              {
                featuredImage ? <h4><br/><img alt="featuredImage" src={baseURL+featuredImage} style={{width:100, height: 100}}/></h4> :null
              }
            </div>

          </Card.Body>
        </Card>
        {/* Authentication End */}

        {/* Type Start 
        <h2 className="small-title">Category</h2>
        <Row className="g-2 mb-5">
          <Col sm="6" lg="3">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" name="databaseType" />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <CsLineIcons icon="database" className="cs-icon icon text-primary" />
                  <span className="heading mt-3 text-body text-primary d-block">MongoDB</span>
                  <span className="text-extra-small fw-medium text-muted d-block">12.0.5</span>
                </span>
              </span>
            </label>
          </Col>
          <Col sm="6" lg="3">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" name="databaseType" />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <CsLineIcons icon="screen" className="cs-icon icon text-primary" />
                  <span className="heading mt-3 text-body text-primary d-block">Redis</span>
                  <span className="text-extra-small fw-medium text-muted d-block">2.11.9</span>
                </span>
              </span>
            </label>
          </Col>
          <Col sm="6" lg="3">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" name="databaseType" />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <CsLineIcons icon="code" className="cs-icon icon text-primary" />
                  <span className="heading mt-3 text-body text-primary d-block">Neo4j</span>
                  <span className="text-extra-small fw-medium text-muted d-block">16.0.2</span>
                </span>
              </span>
            </label>
          </Col>
          <Col sm="6" lg="3">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" name="databaseType" />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <CsLineIcons icon="pentagon" className="cs-icon icon text-primary" />
                  <span className="heading mt-3 text-body text-primary d-block">Riak</span>
                  <span className="text-extra-small fw-medium text-muted d-block">12.0.0</span>
                </span>
              </span>
            </label>
          </Col>
        </Row>
         Type End */}

 
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

export default PartnersAdd;
