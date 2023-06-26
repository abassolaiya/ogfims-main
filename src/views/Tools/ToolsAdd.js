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

const ToolsAdd = () => {
  const name = 'Tools';
  const description = 'Add to Tools Items';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [playstore, setPlaystore] = useState('');
  const [appstore, setAppstore] = useState('');
  const [website, setWebsite] = useState('');
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

  const submit = ()=>{
    if(!title){
      notify('warn', "Please add title");
      return;
    }

    if(!content){
      notify('warn', "Please add content");
      return;
    }

    if(!featuredImage){
      notify('warn', "Please upload thumbnail");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    const body = JSON.stringify({"title": title, "body": content, "thumbnail": featuredImage, "playstore": playstore, "appstore": appstore, "url": website, "category": category});
    // console.log(body);
    fetch(`${baseURL}tools`, {method: 'POST', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {
      notify('success', "Published");
      history.push("/content/tools");
     // console.log(responseJson)
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

              <br />

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setPlaystore(e.target.value)} placeholder="Playstore url" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setAppstore(e.target.value)} placeholder="Appstore url" />
              </div>

              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" onChange={(e)=>setWebsite(e.target.value)} placeholder="Tools Website" />
              </div>

            </Form>

            <div>

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
            </div>

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

export default ToolsAdd;
