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

const Publication = () => {
  const history = useHistory();
  const title = 'Publications';
  const description = 'Publications resources';

  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const getPublication = ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    fetch(`${baseURL}publications?order=desc`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      setData(responseJson.publications);
    })
    .catch((error) => {
      console.log(error);
    });
  }

   useEffect(() => {
    if(data.length < 1){
     getPublication();
    }
  }, [data]);


    const deleteItem = (id)=>{
        // setLoading(true);
        const headers = {
            "Content-Type":"Application/json",
            'Accept': 'application/json',
            'Authorization':`Bearer ${currentUser.token}`
        }
        fetch(`${baseURL}publications/${id}`, { method:'DELETE', headers }).then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson);
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
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Dessert donut cookie carrot cake icing jujubes.</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
                <NavLink to="/content/publication/add" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>
        </div>
        {/* Title End */}

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
          <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
            {/* Export Dropdown Start */}
            <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
              <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
                <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                  <CsLineIcons icon="download" />
                </Dropdown.Toggle>
              </OverlayTrigger>
              <Dropdown.Menu className="shadow dropdown-menu-end">
                <Dropdown.Item href="#">Copy</Dropdown.Item>
                <Dropdown.Item href="#">Excel</Dropdown.Item>
                <Dropdown.Item href="#">Cvs</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* Export Dropdown End */}

            
          </Col>
        </Row>

        <div className="mb-5">


          {/* List Items Start */}
          {

            data.length > 0 ?
            data.map((item, i)=>(
             
              <Col key={i} className="row-cols-1 row-cols-xl-1 g-2 mb-5">
                  <Card>
                    <Card.Body>
                      <Row className="g-0">
                        <Col xs="12" sm="12" md="4" lg="3" className="pe-4 d-flex justify-content-center row-cols-1">
                          <img src={`${baseURL}${item.thumbnail}`} alt="thumbnail" style={{width: 120, height: 120, objectFit:'contain'}}/>
                        </Col>
                        <Col xs="12"  sm="12" md="8" lg="9" className="col-sm">
                          <h2 className="heading truncate1">
                            {item.title}
                          </h2>
                          <div>
                            <span className="text-small text-muted">{item.fileType}</span>
                            <br />
                            <span> {item.size}</span>
                          </div>
                          <Button variant="primary" onClick={()=> {history.push({pathname:"/content/publication/detail", state:{data:item}})}} className="btn-icon btn-icon-start mt-1">
                            <CsLineIcons icon="edit-square" /> <span>Edit</span>
                          </Button>

                            &nbsp; &nbsp; &nbsp;
                          <Button variant="outline-danger" className="btn-icon btn-icon-start mt-1" onClick={()=>{setShowDeleteModal(true)}}>
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
                      <Button variant="danger" onClick={()=>{deleteItem(item._id); setShowDeleteModal(false)}}>Delete Permanently</Button>
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
                  <div className="cta-1">No publication found !</div>
                  <div className="cta-3 text-primary mb-4">Would you like to add publication?</div>

                   <NavLink to="/content/publication/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
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

export default Publication;
