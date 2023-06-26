import React, { useState, useEffect }  from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Clamp from 'components/clamp';
import { baseURL } from '../../httpService';

const AgroDealer = () => {
  const title = 'Agro Dealer';
  const description = 'Agro Dealer';
  const [data, setData] = useState([]);

  const getData = ()=>{
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     }
    fetch(`${baseURL}partners`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      setData(responseJson.partners);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if(data.length < 1){
     getData();
   }
  }, [data]);


  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">{description}</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/mgt/agro-dealer/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        {/* User Cards Start */}
        

        {
        data.length > 0 ?
        <Row className="row-cols-1 row-cols-md-3 row-cols-xxl-4 g-2">
        {
        data.map((item, i)=>(
          <Col key={i}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="sw-9 sh-9 position-relative mb-3 mx-auto">
                  <img src="/img/profile/profile-1.webp" className="img-fluid rounded-xl" alt="thumb" />
                </div>
                <h5 className="card-title">Blaine Cottrell</h5>
                <Clamp tag="span" clamp="3" className="mb-1 text-muted sh-8">
                  Muffin cheesecake sesame snaps. Donut lollipop chocolate cake. Cheesecake oat cake croissant topping lemon sweet roll.
                </Clamp>
                <div className="d-flex flex-row justify-content-center w-100 mt-4">
                  <NavLink to="/instructor/detail" className="btn btn-outline-primary me-1">
                    Permissions
                  </NavLink>
                  <Button variant="outline-primary" className="btn-icon btn-icon-only">
                    <CsLineIcons icon="more-horizontal" />
                  </Button>
                </div>
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
                <div className="cta-1">No Agro Dealer found !</div>
                <div className="cta-3 text-primary mb-4">Would you like to add farmer?</div>
                <NavLink to="/mgt/agro-dealer/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                  <CsLineIcons icon="plus" /> <span>Add New</span>
                </NavLink>
              </div>
            </Card.Body>
          </Card>
        }
        {/* User Cards End */}
      </Col>
    </>
  );
};

export default AgroDealer;
