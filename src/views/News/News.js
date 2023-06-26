import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Button, OverlayTrigger, Form, Tooltip, Card, Badge } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CheckAll from 'components/check-all/CheckAll';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseURL } from '../../httpService';

const NewsDatabase = () => {

  const history = useHistory();

  const title = 'News';
  const description = 'List of news items';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [posts, setPosts] = useState([]);
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const getNews = ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     }
    fetch(`${baseURL}posts?order=desc`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
     console.log(responseJson);
      setPosts(responseJson.posts);
    })
    .catch((error) => {
      console.log(error);
    });
  }

   useEffect(() => {
    if(posts.length < 1){
     getNews();
   }
  }, [posts]);


     const deleteItem = ()=>{
        // setLoading(true);
        const headers = {
            "Content-Type":"Application/json",
            'Accept': 'application/json',
            'Authorization':`Bearer ${currentUser.token}`
        }
        //console.log(selectedPost);
        fetch(`${baseURL}posts/${selectedPost}`, { method:'DELETE', headers }).then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson);
            setSelectedPost('');
            // setData(responseJson.data);
            // setTotal(responseJson.total);
            toast.success("Success!");
           // setLoading(false);
        }).catch((error) => {
           // setLoading(false);
            toast.error("Error");
            console.log(error);
        });
    }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        {/* Title End */}


          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">{description}</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/content/news/add" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>

        <Row className="mb-3">
          <Col md="5" lg="3" xxl="2" className="mb-1">
            {/* Search Start */}
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
              <Form.Control type="text" placeholder="Search" />
              <span className="search-magnifier-icon">
                <CsLineIcons icon="search" />
              </span>
              <span className="search-delete-icon d-none">
                <CsLineIcons icon="close" />
              </span>
            </div>
            {/* Search End */}
          </Col>
          
        </Row>

        <div className="mb-5">
          {/* List Items Start */}
          {
            posts.length > 0 ?
            posts.map((item, i)=>( 
                <Col key={i} className="row-cols-1 row-cols-xl-1 g-2 mb-5">
                  <Card>
                    <Card.Body>
                      <Row className="g-0">
                        <Col xs="12" sm="12" md="4" lg="3" className="pe-4 d-flex justify-content-center row-cols-1">
                          <img src={`${baseURL}${item.featured_image}`} alt="featured image" />
                        </Col>
                        <Col xs="12"  sm="12" md="8" lg="9" className="col-sm">
                          <h2 className="heading truncate1">
                            {item.title}
                          </h2>
                          <div>
                            <span className="text-small text-muted">{item.category}</span>
                            <br />
                            <span className="truncate2" dangerouslySetInnerHTML={{__html: item.content}}/>
                          </div>
                          <Button variant="primary" onClick={()=> {history.push({pathname:"/content/news/detail", state:{data:item}})}} className="btn-icon btn-icon-start mt-1">
                            <CsLineIcons icon="edit-square" /> <span>Edit</span>
                          </Button>
                            &nbsp; &nbsp; &nbsp;
                          <Button variant="outline-danger" className="btn-icon btn-icon-start mt-1" onClick={()=>{setSelectedPost(item._id); setShowDeleteModal(true)}}>
                            <CsLineIcons icon="bin" /> <span>Delete</span>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  { /* Delete Modal Start */ }

                  <Modal
                    show={showDeleteModal}
                    onHide={()=>setShowDeleteModal(false)}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete this record? <br/>
                      This action will delete the record permanently
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={()=>setShowDeleteModal(false)}>
                        Close
                      </Button>
                       {/* eslint no-underscore-dangle: 0 */}
                      <Button variant="danger" onClick={()=>{deleteItem(); setShowDeleteModal(false)}}>Delete Permanently</Button>
                    </Modal.Footer>
                  </Modal>

                   { /* Delete Modal End */ }
                </Col>
              
              )
            ):
            <Card className="mb-5">
              <Card.Body className="sh-50 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <img src="/img/illustration/icon-launch.webp" className="theme-filter" alt="launch" />
                  <div className="cta-1">No News found !</div>
                  <div className="cta-3 text-primary mb-4">Would you like to add News?</div>

                   <NavLink to="/content/news/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                      <CsLineIcons icon="plus" /> <span>Add New</span>
                   </NavLink>

                </div>
              </Card.Body>
            </Card>
         }
          {/* List Items End */}
        </div>
      </Col>
    </>
  );
};

export default NewsDatabase;
