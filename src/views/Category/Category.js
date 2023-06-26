import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Button, OverlayTrigger, Form, Tooltip, Card, Badge } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CheckAll from 'components/check-all/CheckAll';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import { baseURL } from '../../httpService';

const Category = () => {

  const history = useHistory();

  const title = 'Categories';
  const description = 'List of primary Categories';
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);




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



  const getData = ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     }
    fetch(`${baseURL}category?&order=desc`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      setData(responseJson.categories);
    })
    .catch((error) => {
      console.log(error);
    });
  }


  const deleteItem = (id)=>{
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
     }
     /* eslint no-underscore-dangle: 0 */
    fetch(`${baseURL}category/${id}`, {method: 'DELETE', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      notify('success', "Deleted");
      getData();
    })
    .catch((error) => {
      notify('error', "Error while deleting deleted");
      console.log(error);
    });
  }

   useEffect(() => {
    if(data.length === 0){
     getData();
   }
  }, [data]);

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
              <NavLink to="/content/category/add" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>

        <div className="mb-5">
          {

            data.length > 0 ?
            data.map((item, i)=>(
              <Col xl="12" className="mb-5" key={i} >
                <Card className="mb-2 hover-border-primary">
                  <Row className="g-0 sh-10">
                    <Col xs="auto">
                      <div className="sw-9 sh-9 d-inline-block d-flex justify-content-center align-items-center">
                        <div className="fw-bold text-primary">
                          <CsLineIcons icon="server" />
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <Card.Body className="d-flex flex-column p-0 pe-4 h-100 justify-content-center">
                        <div className="d-flex flex-column">

                          <Row className=" alternate-link">

                            <Col>{item.name}</Col>

                            <Col md="auto">
                              <Button onClick={()=> {history.push({pathname:"/content/category/detail", state:{data:item}})}} className="btn btn-primary btn-icon btn-icon-start" >Edit</Button>
                            </Col>

                            <Col xs lg="2">
                              <Button onClick={()=>{setShowDeleteModal(true)}} className="btn btn-danger btn-icon btn-icon-start" >Delete</Button>
                            </Col>
                          </Row>

                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
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
                  <div className="cta-1">No Category found !</div>
                  <div className="cta-3 text-primary mb-4">Would you like to add Category?</div>

                   <NavLink to="/content/category/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
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

export default Category;
