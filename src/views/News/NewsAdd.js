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



const NewsAdd = () => {
  const name = 'News';
  const description = 'Add to news Items';

  const [title, setTitle] = useState('');
   const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [featuredImage, setFeaturedImage] = useState('');
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
      setContent(editorRef.current.getContent());
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

  const postNews = ()=>{
    if(!title){
      notify('warn', "Please add title to your post");
      return;
    }

    if(!content){
      notify('warn', "Please add content to your post");
      return;
    }

    if(!category){
      notify('warn', "Please select your post category");
      return;
    }

    if(!featuredImage){
       notify('warn', "Please add featured image to your post");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    const body = JSON.stringify({"title": title, "content": content, "category": category, "featured_image":featuredImage});
    // console.log(body);
    fetch(`${baseURL}posts`, {method: 'POST', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        notify('success', "Published");
      history.push("/content/news");
    }else{
      notify('error', "Something went wrong");
    }
      
      // history.push("/news/list");
    })
    .catch((error) => {
      console.log(error);
      notify('error', error);
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
       // console.log('response', responseJson);
        setIsUploading(false)
        setFeaturedImage(responseJson.data);
        })
        .catch((error) => {
        alert('Error');
        console.log('error', error);
        setIsUploading(false)
        });
    };
  /* 


const handleUploadPhoto = (event)=>{      
    const formdata = new FormData();
    formdata.append('file',event.target.files[0]);
    formdata.append("upload_preset", "rw57hcmc");
    formdata.append("public_id", "dh4arprvl");
    formdata.append("api_key", "632441573341924");

    fetch('https://api.cloudinary.com/v1_1/dh4arprvl/:resource_type/upload',{
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
*/

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
                <Form.Control type="text" onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
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

              <Editor
                tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
                onInit={(evt, editor) => {editorRef.current = editor}}
                initialValue=''
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
                        const id = `blobid ${(new Date()).getTime()}`;
                        const { blobCache } =  editorRef.current.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
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
              <p>Featured Image</p>
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

        {/* Plan Start */}
        <h2 className="small-title">Category</h2>
        <Row className="g-2 mb-5">
          <Col lg="4">
            <label className="form-check custom-card w-100 position-relative p-0 m-0">
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="general" name="type" onChange={(e)=>setCategory(e.target.value)} />
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
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="farmer" name="type" onChange={(e)=>setCategory(e.target.value)} />
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
              <input type="radio" className="form-check-input position-absolute e-2 t-2 z-index-1" value="agro-dealer" name="type" onChange={(e)=>setCategory(e.target.value)}  />
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

            <Button variant="primary" onClick={()=>{postNews()}} className="btn-icon btn-icon-end" size="lg">
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

export default NewsAdd;
