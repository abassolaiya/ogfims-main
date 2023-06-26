import React, { useState, useEffect }  from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Clamp from 'components/clamp';
import DataTable, { createTheme } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseURL } from '../../httpService';


const lgas = [
            "Abeokuta-North",
            "Abeokuta-South",
            "Ado-Odo/Ota",
            "Ewekoro",
            "Ifo",
            "Ijebu-East",
            "Ijebu-North",
            "Ijebu-North-East",
            "Ijebu-Ode",
            "Ikenne",
            "Imeko-Afon",
            "Ipokia",
            "Obafemi-Owode",
            "Odeda",
            "Odogbolu",
            "Ogun-Waterside",
            "Remo-North",
            "Shagamu",
            "Yewa North"
        ];

createTheme(
  'myDark',
  {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    background: {
      default: '#242424',
    },
    context: {
      background: '#e1ffe1',
      text: '#222222',
    },
    divider: {
      default: '#333333',
    },
    button: {
      default: '#6a9a33',
      hover: 'rgba(0,0,0,.08)',
      focus: 'rgba(255,255,255,.12)',
      disabled: 'rgba(255, 255, 255, .34)',
    },
    sortFocus: {
      default: '#e1ffe1',
    },
  },
  'dark',
);


const Users = () => {
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const { color, themeValues } = useSelector((state) => state.settings);
  // console.log(themeValues);
  const title = 'Admin Users';
  const description = 'Admin Users';
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);

  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getData = ()=>{
    setPending(true);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${currentUser.token}`
    }
    fetch(`${baseURL}admin`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
       // console.log(responseJson);
      if(responseJson.users){
        setData(responseJson.users);
        setPending(false);
      }
    })
    .catch((error) => {
      // console.log(error);
      setPending(false);
    });
  }

  useEffect(() => {
    if(data.length < 1){
     getData();
   }
  }, [data]);

    const deleteUser = (res)=>{
      setLoading(true);
      const headers = {
        "Content-Type":"Application/json",
        'Accept': 'application/json',
        'Authorization':`Bearer ${currentUser.token}`
      }
      const body = JSON.stringify(res);
      fetch(`${baseURL}farmers/`, { method:'DELETE', headers, body }).then((response) => response.json())
      .then((responseJson) => {
        // // console.log(responseJson);
        // setData(responseJson.data);
        // setTotal(responseJson.total);
        toast.success("Success!");
        setLoading(false);
        getData();
      }).catch((error) => {
        setLoading(false);
        toast.error("Error");
        // console.log(error);
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
              <h1 className="mb-2 pb-0 display-4 text-capitalize">Admin Users</h1>
              <div className="text-muted font-heading text-small">{description}</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/mgt/admin-users/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        {/* User Cards Start */}

      {
        data.length > 0 ?
        <Row className="row-cols-1 row-cols-xl-2 g-2 mb-5">
        { data.map((item, i)=>(
          <Col key={i}>
            <Card>
              <Card.Body>
                <Row className="g-0">
                  <Col xs="12" sm="auto" className="pe-4 d-flex justify-content-center">
                    <img src={baseURL+'uploads/user.png'} className="theme-filter" alt="email icon" width={70} height={70} />
                  </Col>
                  <Col xs="12" className="col-sm">
                    <NavLink to="#" className="heading mb-2 d-inline-block">
                      {item.name}
                    </NavLink>
                    <p>
                     {item.email}
                    </p>
                    <Button variant="outline-primary" className="btn-icon btn-icon-start mt-1">
                      <CsLineIcons icon="edit-square" /> <span>Edit</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          ))
          }
          </Row>
          :
          <Card className="mb-5">
            <Card.Body className="sh-50 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <img src="/img/illustration/icon-launch.webp" className="theme-filter" alt="launch" />
                <div className="cta-1">No user found !</div>
                <div className="cta-3 text-primary mb-4">Would you like to add user?</div>
                <NavLink to="/mgt/admin-users/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                  <CsLineIcons icon="plus" /> <span>Add New</span>
                </NavLink>
              </div>
            </Card.Body>
          </Card>
      }
      { /* User Cards End */ }


         { /* Delete Modal Start */ }

        <Modal
          show={showDeleteModal}
          onHide={()=>setShowDeleteModal(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete User Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this record? <br/>
            This action will delete the record permanently
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowDeleteModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={()=>{deleteUser(selectedRows); setShowDeleteModal(false)}}>Delete Permanently</Button>
          </Modal.Footer>
        </Modal>

         { /* Delete Modal End */ }

      </Col>
    </>
  );
};

export default Users;
