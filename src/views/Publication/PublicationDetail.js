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

const NewsEditor = () => {

  const location = useLocation();

  const name = 'Edit News';
  const description = 'Edit ';
  
  /* eslint no-underscore-dangle: 0 */
  const [id, setId] = useState(location.state.data?._id);
  const [title, setTitle] = useState(location.state.data?.title);
  const [descriptions, setDescriptions] = useState(location.state.data?.body);
  const [category, setCategory] = useState(location.state.data?.category);
  const [size, setSize] = useState(location.state.data?.size);
  const [fileType, setFileType] = useState(location.state.data?.fileType);
  const [url, setUrl] = useState(location.state.data?.url);
  const [thumbnail, setThumbnail] = useState(location.state.data?.thumbnail);
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const refFileUpload = useRef(null);
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

     if(!descriptions){
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


    const body = JSON.stringify({"title": title, "body": descriptions, "thumbnail":thumbnail, "url": url, "size": size, "fileType": fileType });
     // console.log(body);
    fetch(`${baseURL}publications/${id}`, {method: 'PUT', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {

      console.log(responseJson)
      notify('success', "Edited");
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


  const handleUploadDoc = (event)=>{      
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
                <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Publication Title" />
              </div>

              <Form.Label>Upload document</Form.Label>

              <div className="mb-3 filled">
                <input type="file" accept="application/*" name="doc" onChange={(e)=> {handleUploadDoc(e); console.log(e.target.files[0])}} />
              </div>

              <Form.Label>Doc URL</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Document URL" />
              </div>

              <Form.Label>Document size</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={size}  onChange={(e)=>setSize(e.target.value)} placeholder="Document Size" />
              </div>



              <br/>
{/*
              <Editor
                initialEditorState={content}
                toolbarClassName="mb-3"
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                onEditorStateChange={onEditorStateChange()}
              />
*/}
              <Form.Label>Publication descriptions / Meta data</Form.Label> 
              {/* // */}
              <Editor
                tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
                onInit={(evt, editor) => {editorRef.current = editor}}
                initialValue={descriptions}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | link table bullist numlist outdent indent | ' +
                    'removeformat | image media code ',
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  file_picker_callback: (cb, value, meta) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    input.addEventListener('change', (e) => {
                      const file = e.target.files[0];

                      const reader = new FileReader();
                      reader.addEventListener('load', () => {
                        const uid = `blobid ${(new Date()).getTime()}`;
                        const { blobCache } =  editorRef.current.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(uid, file, base64);
                        blobCache.add(blobInfo);
                        cb(blobInfo.blobUri(), { title: file.name });
                      });
                      reader.readAsDataURL(file);
                    });

                    input.click();
                  },
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                }}
                onEditorChange={log}
              />

            </Form>


           <div>

            <br/>
            <br/>
            <br/>
              <p>Cover Image</p>
              {
                isUploading ? <Spinner animation="border" variant="primary" /> :  null
              }
            </div>


            <div className="mb-3 mx-auto position-relative" id="imageUpload">
              <img src={baseURL+thumbnail} alt="user" className="rounded-xl border border-separator-light border-4 sw-11 sh-11" id="contactThumbModal" />
              <Button
                size="sm"
                variant="separator-light"
                className="btn-icon btn-icon-only position-absolute rounded-xl s-0 b-0"
                onClick={onThumbChangeClick}
              >
                <CsLineIcons icon="upload" className="text-alternate" />
              </Button>
              <Form.Control type="file" ref={refFileUpload} className="file-upload d-none" accept="image/*" onChange={(e)=>handleUploadDoc(e)} />
            </div>


          </Card.Body>
        </Card>


         <h2 className="small-title">Document Type</h2>
        <Row className="g-2 mb-5">
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="pdf" name="type" onChange={(e)=>setFileType(e.target.value)} />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">PDF</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="doc" name="type" onChange={(e)=>setFileType(e.target.value)} />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">Doc</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="excel" name="type" onChange={(e)=>setFileType(e.target.value)} />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">Excel sheet</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
        </Row>

        {/* Type Start */}
        <h2 className="small-title">Type</h2>
        <Row className="g-2 mb-5">
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="general" name="cat" onChange={(e)=>setCategory(e.target.value)} />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">General</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="farmer" name="cat" onChange={(e)=>setCategory(e.target.value)} />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">Farmer</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="agro-dealer" name="cat" onChange={(e)=>setCategory(e.target.value)}  />
              <span className="card form-check-label w-100">
                <span className="card-body text-center">
                  <span className="heading text-body text-primary">Agro dealer</span>
                  <span className="display-4 d-block"> </span>
                  <span className="text-small text-muted d-block"> </span>
                </span>
              </span>
            </label>
          </Col>
        </Row>
   

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

export default NewsEditor;
