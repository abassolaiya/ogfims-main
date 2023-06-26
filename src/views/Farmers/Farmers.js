import React, { useState, useEffect, useRef }  from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
const _ = require('lodash');
import { NavLink, useParams, useHistory  } from 'react-router-dom';
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


const Farmers = () => {
  const history = useHistory();

  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const { color, themeValues } = useSelector((state) => state.settings);
  // console.log(themeValues);
  const title = 'Farmers';
  const description = 'Farmers';
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);

  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [lga, setLga] = useState('');
  const [farmPractice, setFarmPractice] = useState('');
  const [crops, setCrops] = useState('');
  const [typeOfFarming, setTypeOfFarming] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const getData = (pag, perPag, cate, lg, s, practice, crp, typeOfFarm)=>{
    setPending(true);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    setCategory(cate);
    setPerPage(perPag);
    setPage(pag);
    setLga(lg);
    setCrops(crp);
    setTypeOfFarming(typeOfFarm);
    setFarmPractice(practice);
    const cat = cate ? `&category=${cate}` : '';
    const localG = lg? `&lga=${lg}`:'';
    const searchQ = s ? `&s=${s}` : '';
    const practices = practice ? `&primaryPurposeOfFarming=${practice}`: '';
    const crop = crp ? `&crops=${crp}`: '';
    const typeOfFarmi = typeOfFarm ? `&typeOfFarming=${typeOfFarm}`: '';
    console.log(`${baseURL}user?order=desc${cat}${localG}&limit=${perPag}&page=${pag}${searchQ}${practices}${crop}${typeOfFarmi}`)
    fetch(`${baseURL}user?order=desc${cat}${localG}&limit=${perPag}&page=${pag}${searchQ}${practices}${crop}${typeOfFarmi}`, {method: 'GET', headers})
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
      if(responseJson.users){
        setData(responseJson.users);
        setTotal(responseJson.total);
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
     getData(page, perPage, category, lga, searchQuery, farmPractice, crops, typeOfFarming);
   }
  }, [data]);



  const search = (q)=>{
    setCategory('');
    setPerPage(15);
    setPage(0);
    setLga('');
    setSearchQuery(q);
    getData(page, perPage, category, lga, searchQuery, farmPractice, crops, typeOfFarming);
  }

const columns = [
  
  {
    name: "",
    cell: (row) => <img alt="" src={row.profileImage ? row.profileImage.replace(/^http:\/\//i, 'https://') : baseURL+'uploads/user.png'} width={40} height={40} style={{borderRadius:40, margin:5}} />,
    allowOverflow: true, 
    sortable: false
  },
  {
    name: "First Name",
    selector: (row)=>row.firstName,
    sortable: true
  },

  {
    name: "Last Name",
    selector: (row)=>row.lastName,
    sortable: true
  },
  {
    name: "Mobile",
    selector: (row)=>row.mobileNumber,
    sortable: true
  },

  {
    name: "LGA",
    selector: (row)=>row.lga,
    sortable: true
  },

  {
    name: "Town/Village",
    selector: (row)=>row.city,
    sortable: true
  },
  
  {
    name: "Age",
    selector: (row)=>row.age,
    sortable: true
  },
  {
    name: "Sex",
    selector: (row)=>row.sex,
    sortable: true
  }
];
  


    const deleteUser = (res)=>{
      setLoading(true);
      const headers = {
        "Content-Type":"Application/json",
        'Accept': 'application/json',
        'Authorization':`Bearer ${currentUser.token}`
      }
      const body = JSON.stringify(res);
      fetch(`${baseURL}user`, { method:'DELETE', headers, body }).then((response) => response.json())
      .then((responseJson) => {
        // // console.log(responseJson);
        // setData(responseJson.data);
        // setTotal(responseJson.total);
        toast.success("User deleted!");
        handleClearRows();
        setLoading(false);
        getData(page, perPage, category, lga, searchQuery, farmPractice, crops, typeOfFarming);
      }).catch((error) => {
        setLoading(false);
        toast.error("Error");
        // console.log(error);
      });
    }

    const convertArrayOfObjectsToCSV=(array)=> {
      let result;
      const columnDelimiter = ',';
      const lineDelimiter = '\n';
      const keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      array.forEach((item) => {
          let ctr = 0;
          keys.forEach(key => {
              if (ctr > 0) result += columnDelimiter;

              result += item[key];
              // eslint-disable-next-line no-plusplus
              ctr++;
          });
          result += lineDelimiter;
      });

      return result;
    }


  const downloadCSV = (jsonData) => {
    // Flatten the JSON child array
    const flattenedData = _.flattenDeep(jsonData);

    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(flattenedData);
    if (csv == null) return;
    const fileName = Date.now();
    const filename = `ogfims-export-${fileName}.csv`;

    // Modify each individual header in the CSV
    const lines = csv.split('\n');
    if (lines.length > 0) {
      const header = lines[0];
      const headers = header.split(',');
      const modifiedHeaders = headers.map((h) => {
        const modifiedHeader = h
          .replace(/[^\w\s]/g, '') // Remove non-alphanumeric and non-space characters
          .replace(/_/g, ' ') // Replace underscores with spaces
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
          .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word
        return modifiedHeader;
      });
      lines[0] = modifiedHeaders.join(',');
      csv = lines.join('\n');
    }

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  };


    const handleImport = (event)=>{
      setIsUploading(true);       
      const formdata = new FormData();
      formdata.append('file',event.target.files[0]);
      fetch(`${baseURL}user/import`, {
        method: 'POST',
        body: formdata
      })
      .then((response) => response.json())
      .then((responseJson) => {
        getData(page, perPage, category, lga, searchQuery, farmPractice, crops, typeOfFarming);
        toast.success(responseJson.message);
        setIsUploading(false)
      })
      .catch((error) => {
        alert('Error');
        toast.error("Unable to import data try again!");
        console.log('error', error);
        setIsUploading(false)
      });
    };

    const handleSort = async (column, sortDirection) => {
    /// reach out to some API and get new data using or sortField and sortDirection
    // e.g. https://api.github.com/search/repositories?q=blog&sort=${column.sortField}&order=${sortDirection}

      // setData(remoteData);
    };

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        // console.log(state.selectedRows)
    }, []);

      // Toggle the state so React Data Table changes to clearSelectedRows are triggered
    const handleClearRows = () => {
        setToggleClearRows(!toggledClearRows);
    }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        {/* Title Start */}
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4 text-capitalize">{ !category ? title : category  }</h1>
              <div className="text-muted font-heading text-small">{description}</div>
            </Col>

            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />
              <Button style={{fontSize: 14}}  variant="outline-primary" size="md" onClick={handleButtonClick}>Import</Button>
            </Col>

            {data.length > 0 ? 
              <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
                <Button style={{fontSize: 14}}  variant="outline-primary" size="md" onClick={() => downloadCSV(data)}>Export</Button>
              </Col>
              :null
            }
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/mgt/farmers/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
            </Col>
          </Row>
        </div>
        {/* Title End */}

        {/* User Cards Start */} 

      { //
        data.length > 0 ?
        <Row>
          <Card>
            <Card.Body>
              <DataTable
                theme={color === 'dark-green' ? "myDark" : 'default' }
                columns={columns}
                data={data}
                selectableRows
                striped = {color === 'dark-green' ? false : true }
                pointerOnHover
                highlightOnHover
                selectableRowsHighlight
                keyField="id"
                progressPending={isLoading}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggledClearRows}
                pagination
                onSort={handleSort}
                sortServer
                onRowClicked={(e)=>{history.push({pathname:"/mgt/farmers/details", state:{data:e}})}}
                paginationTotalRows={total}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[15, 30, 45, 60]}
                paginationServer
                onChangePage={(e)=>getData(e, perPage, category, lga, searchQuery, farmPractice, crops, typeOfFarming)}
                onChangeRowsPerPage={(e)=>getData(page, e, category, lga, searchQuery, farmPractice, crops, typeOfFarming)}
                contextActions={<div><Button variant="primary" onClick={() => downloadCSV(selectedRows)}>Export</Button>&nbsp; &nbsp; <Button onClick={()=>setShowDeleteModal(true)} variant="danger">Delete</Button></div>}
                contextMessage={{ singular: 'User', plural: 'Users', message: 'selected' }}

                actions={
                  <Row >
                    <Row className="mb-3">

                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <div className="input-group mb-3" size="sm" style={{fontSize: 14}}>
                          <input type="text" name="search" placeholder="Search" className="form-control" aria-label="search" id="search-box" />
                          <button type="submit" onClick={()=> {search(document.getElementById('search-box').value);}} className="input-group-text"><CsLineIcons icon="search" /></button>
                        </div>
                      </Col>

                      
                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <Form.Select aria-label="Category" style={{fontSize: 15}} size="sm" onChange={(e)=>{ getData(page, perPage, e.target.value, lga, searchQuery, farmPractice, crops, typeOfFarming);}}>
                          <option value="">Category</option>
                          <option value="farmer">Farmers</option>
                          <option value="agroMarketer">Agro Marketer</option>
                          <option value="processor">Processors</option>
                          <option value="offtaker">Off-takers</option>
                          <option value="logistic">Transport/Logistics</option>
                          <option value="extension">Extension Workers</option>
                          <option value="mechanizationService">Mechanization Service</option>
                          <option value="inputDelear">Input Delears</option>
                          <option value="bds">Business Development Service</option>

                        </Form.Select>
                      </Col>
                        
                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <Form.Select aria-label="LGA" size="sm" style={{fontSize: 14}} onChange={(e)=>{getData(page, perPage, category, e.target.value, searchQuery, farmPractice, crops, typeOfFarming);}}>
                          <option value="">LGA</option>
                          {
                            lgas.map((item, i)=>(
                              <option key={i} value={item}>{item}</option>
                            ))
                          }
                          
                        </Form.Select>
                      </Col>
                      
                     
                    </Row>

                    <Row className="mb-3 w-100">

                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <Form.Select aria-label="Crops" style={{fontSize: 15}} size="sm" onChange={(e)=>{getData(page, perPage, category, lga, searchQuery, farmPractice, e.target.value, typeOfFarming);}}>
                          <option value="">Crops</option>
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
                      </Col>


                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <Form.Select aria-label="Category" style={{fontSize: 15}} size="sm" onChange={(e)=>{getData(page, perPage, category, lga, searchQuery, farmPractice, crops, e.target.value);}}>
                          <option value="">Type of Farming</option>
                          <option value="crop_farming">Crop</option>
                          <option value="livestocks">Livestock</option>
                        </Form.Select>
                      </Col>

                      <Col xs="12" sm="12" md="6" lg="3" xl="4">
                        <Form.Select aria-label="Practice" style={{fontSize: 15}} size="sm" onChange={(e)=>{ getData(page, perPage, category, lga, searchQuery, e.target.value, crops, typeOfFarming);}}>
                          <option value="">Farm Practice</option>
                          <option value="commercial">Commercial</option>
                          <option value="subsistence">Subsistence</option>
                        </Form.Select>
                      </Col>
                    </Row>

                  </Row>
              }
            />
            </Card.Body>
          </Card>
        </Row>
          :
          <Card className="mb-5">
            <Card.Body className="sh-50 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <img src="/img/illustration/icon-launch.webp" className="theme-filter" alt="launch" />
                <div className="cta-1">No user found !</div>
                <div className="cta-3 text-primary mb-4">Would you like to add user?</div>
                <NavLink to="/mgt/farmers/add" variant="primary" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
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

export default Farmers;
