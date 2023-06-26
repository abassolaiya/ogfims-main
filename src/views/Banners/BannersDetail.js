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

const BannersDetail = () => {

  const location = useLocation();

  const name = 'Edit Banner';
  const description = 'Edit ';
  const [title, setTitle] = useState(location.state.data?.title);
  const [content, setContent] = useState(location.state.data?.content);
  const [excerpt, setExcerpt] = useState(location.state.data?.excerpt);
  const [order, setOrder] = useState(location.state.data?.order);

  /* eslint no-underscore-dangle: 0 */
  const [postid, setId] = useState(location.state.data?._id);
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(location.state.data?.image);
  const refFileUpload = useRef(null);
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();
  const editorRef = useRef(null);

  /* eslint no-underscore-dangle: 0 */
  // console.log(location.state.data?._id);

  const log = () => {
    if (editorRef.current){
      // // console.log(editorRef.current.getContent());
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
      notify('warn', "Please add title");
      return;
    }

    if(!excerpt){
      notify('warn', "Please add excerpt");
      return;
    }

    if(!featuredImage){
      notify('warn', "Please add image");
      return;
    }

    if(order < 1 ){
      notify('warn', "Please add Display order");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }

    const body = JSON.stringify({"title": title, "image": featuredImage, "excerpt": excerpt, "order": order});
     // // console.log(body);
    fetch(`${baseURL}banners/${postid}`, {method: 'PUT', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {

      // console.log(responseJson)
      notify('success', "Published");
      // history.push("/content/banners");
      // history.push("/news/list");
    })
    .catch((error) => {
      // console.log(error);
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
    // console.log('response', responseJson);
    setIsUploading(false)
    setFeaturedImage(responseJson.data);
    })
    .catch((error) => {
    alert('Error');
    // console.log('error', error);
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
               <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
              </div>

              <Form.Label>Display Order</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" value={order} onChange={(e)=>setOrder(e.target.value)} placeholder="Display order" />
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
              <Form.Label>Body</Form.Label>

              <Editor
                tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
                onInit={(evt, editor) => {editorRef.current = editor}}
                initialValue={content}
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
              <p>Banner Image</p>
              {
                isUploading ? <Spinner animation="border" variant="primary" /> :  null
              }
            </div>


            <div className="mb-3 mx-auto position-relative" id="imageUpload">
              <img src={baseURL+featuredImage} alt="user" style={{maxWidth: '100%'}} id="contactThumbModal" />
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

export default BannersDetail;
