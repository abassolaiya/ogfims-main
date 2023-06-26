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


const SendSms = () => {
  const title = 'Send SMS';
  const description = '';

  const [group, setGroup] = useState(false);
  const [allUser, setAllUser] = useState(false);
  const [custom, setCustom] = useState(true);
  const [reciever, setReciever] = useState('');
  const [message, setMessage] = useState('');

  const [category, setCategory] = useState('');
  const [lga, setLga] = useState('');
  const [farmPractice, setFarmPractice] = useState('');
  const [crops, setCrops] = useState('');
  const [typeOfFarming, setTypeOfFarming] = useState('');

  const [byPrimaryCatrgory, setByPrimaryCatrgory] = useState(false);
  const [commodity, setCommodity] = useState(false);
  const [byLga, setByLga] = useState(false);


  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();

  const notify = (status, noti) => {

    if(status === 'success'){
      toast.success(noti, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'error'){
      toast.error(noti, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'warn'){
      toast.warn(noti, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    if(status === 'info'){
      toast.info(noti, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }


  const SendMessage = (cate, lg, practice, crp, typeOfFarm)=>{

    if(custom && !reciever){
      return notify('warn', "No reciever number");
    }

    if(!message){
      return notify('warn', "Please type message to send");
    }
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    setCategory(cate);
    setLga(lg);
    setCrops(crp);
    setTypeOfFarming(typeOfFarm);
    setFarmPractice(practice);
    const cat = cate && byPrimaryCatrgory ? `&category=${cate}` : '';
    const localG = lg && byLga? `&lga=${lg}`:'';
    const practices = practice ? `&primaryPurposeOfFarming=${practice}`: '';
    const crop = crp && commodity ? `&crops=${crp}`: '';
    const typeOfFarmi = typeOfFarm ? `&typeOfFarming=${typeOfFarm}`: '';

    const body = JSON.stringify({"message": message, "group": group, "reciever": [{msgid: 212, msidn: '+234'+reciever.toString()}] });
    console.log(body);
    console.log(`${baseURL}sms/send?order=desc${cat}${localG}${practices}${crop}${typeOfFarmi}`)
    fetch(`${baseURL}sms/send?order=desc${cat}${localG}${practices}${crop}${typeOfFarmi}`, {method: 'POST', body, headers})
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
      if(responseJson.success){
        notify('success', 'Sent');
      }else{
        notify('error', 'Not sent')
      }
    })
    .catch((error) => {
      // console.log(error);
      notify('error', 'Not sent')
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
              <div className="text-muted font-heading text-small">Send bulk SMS</div>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        { /* Authentication Start 
        <h2 className="small-title">Authentication</h2> */ }
        <Card className="mb-5">
          <Card.Body>
            <Form className="mb-n3">

              <Form.Label>Recipients</Form.Label>

                <Row className="mb-5">
                  <Col className="mb-2" lg="2">
                    <Form.Check 
                      type="radio"
                      name="recipients"
                      value="all"
                      label="All users"
                      checked={allUser}
                      onChange={(e)=>{setAllUser(true); setGroup(true); setCustom(false); setByPrimaryCatrgory(false); setCommodity(false); setByLga(false)}}
                    />
                  </Col>

                  <Col className="mb-2" lg="2">
                    <Form.Check 
                      type="radio"
                      name="recipients"
                      value="custom"
                      label="Custom"
                      checked={custom}
                      onChange={(e)=>{setAllUser(false); setGroup(false); setCustom(true); setByPrimaryCatrgory(false); setCommodity(false); setByLga(false)}}
                    />
                  </Col>
                  

                  <Col className="mb-2" lg="2">
                    <Form.Check 
                      type="radio"
                      name="recipients"
                      value="custom"
                      label="LGA"
                      checked={byLga}
                      onChange={(e)=>{setAllUser(false); setGroup(false); setCustom(false); setByPrimaryCatrgory(false); setCommodity(false); setByLga(true)}}
                    />
                  </Col>

                  <Col className="mb-2" lg="2">
                    <Form.Check 
                      type="radio"
                      name="recipients"
                      value="custom"
                      label="Catrgory"
                      checked={byPrimaryCatrgory}
                      onChange={(e)=>{setAllUser(false); setGroup(false); setCustom(false); setByPrimaryCatrgory(true); setCommodity(false); setByLga(false)}}
                    />
                  </Col>

                  <Col className="mb-2" lg="2">
                    <Form.Check 
                      type="radio"
                      name="recipients"
                      value="custom"
                      label="Commodity"
                      checked={commodity}
                      onChange={(e)=>{setAllUser(false); setGroup(false); setCustom(false); setByPrimaryCatrgory(false); setCommodity(true); setByLga(false)}}
                    />
                  </Col>

                </Row>
              {
                custom ?
                <Col className="mb-5" lg="12">
                  <div className="mb-3 filled">
                    <CsLineIcons icon="phone" />
                    <Form.Control type="number" placeholder="Recipients (without the leading 0)" maxLength={10} onChange={(e)=>{setReciever(e.target.value)}}  />
                  </div>
                </Col> : null
              }

              {
                byPrimaryCatrgory ?
                <Col xs="12" className="mb-5">
                  <div className="mb-3 filled">
                    <Form.Select aria-label="Category" style={{fontSize: 15}} size="sm" onChange={(e)=>{ setCategory(e.target.value);}}>
                      <option value="">Category</option>
                      <option value="farmer">Farmers</option>
                      <option value="trader">Traders</option>
                      <option value="processor">Processors</option>
                      <option value="Off_taker">Off-takers</option>
                      <option value="transporter">Transporters</option>
                    </Form.Select>
                  </div>
                </Col>
                :
                null
              }

              {
                byLga ?
                <Col xs="12" className="mb-5">
                  <div className="mb-3 filled">
                    <Form.Select aria-label="LGA" size="sm" style={{fontSize: 14}} onChange={(e)=>{ setLga(e.target.value);}}>
                      <option value="">LGA</option>
                      {
                        lgas.map((item, i)=>(
                          <option key={i} value={item}>{item}</option>
                        ))
                      }
                    </Form.Select>
                  </div>
                </Col>
                :
                null
              }

              {
                commodity ?
                <Col xs="12" className="mb-5">
                  <div className="mb-3 filled">
                    <Form.Select aria-label="Commodities" style={{fontSize: 15}} size="sm" onChange={(e)=>{ setCrops(e.target.value);}}>
                      <option value="">Commodities</option>
                      <option value="CASSAVA">Cassava</option>
                      <option value="banana">Banana</option>
                      <option value="cocoa">Cocoa</option>
                      <option value="potato">Potato</option>
                      <option value="yam">Yam</option>
                      <option value="plantain">Plantain</option>
                      <option value="sweet_potato">Sweet Potato</option>
                      <option value="cashew">Cashew</option>
                      <option value="cowpea">Cowpea</option>
                      <option value="RICE">Rice</option>
                      <option value="oil palm">Oil Palm</option>
                      <option value="wheat">Wheat</option>
                    </Form.Select>
                  </div>
                </Col>
                :
                null
              }

              <Form.Label>SMS content</Form.Label>
              <div className="mb-3 filled">
                <CsLineIcons icon="message" />
                <Form.Control type="text" as="textarea" rows={6} onChange={(e)=>{setMessage(e.target.value)}}  />
              </div>

              <Button variant="primary" onClick={()=>{SendMessage()}} className="btn-icon btn-icon-end" size="lg">
                <span>Send</span>
                <CsLineIcons icon="chevron-right" />
              </Button>

            </Form>
          </Card.Body>
        </Card>
        
      </Col>
    </>
  );
};

export default SendSms;
