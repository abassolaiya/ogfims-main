import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { baseURL } from '../../httpService';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../../auth/authSlice'

const Login = () => {
  const title = 'Login';
  const description = 'Login Page';
  const [progress, setProgress] =React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });

  const initialValues = { email: '', password: '' };
  const { currentUser } = useSelector((state) => state.auth);

  console.log(currentUser);

  useEffect(()=>{
    if(currentUser?.email){
      history.replace('/');
    }
  },[currentUser]);

  const onSubmit = async(values) => {
    setErrorText('');
    setProgress(true);
    if (!values.email) {
      toast.error('Please enter correct email');
      return;
    }
    if (!values.password) {
      toast.error('Please enter Password');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let body = JSON.stringify(values);
   await fetch(`${baseURL}admin/login`,
      {method: 'POST', headers: headers, body})
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        if(responseJson.success === true){
          dispatch(setCurrentUser({user:responseJson.user, login:true}));
          localStorage.setItem('ogfimsAdmin', JSON.stringify(responseJson.user));
          history.replace("/");          
        }else{
          setErrorText(responseJson.message);
        }
        setProgress(false);
      })
      .catch((error) => {
        setProgress(false);
        setErrorText(error.message);
        console.log(error);
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
         {/* <div className="mb-5">
            <h1 className="display-3 text-white">Multiple Niches</h1>
            <h1 className="display-3 text-white">Ready for Your Project</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
          </p>
          <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Learn More
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11 align-items-center" style={{marginBottom: 50, display:'flex', justifyContent:'center'}}>
          <NavLink to="/" >
            <img  src='img/logo/logo.png' width={150}  />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Welcome back,</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Please use your credentials to login.</p>
          
        </div>
        <div>
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>

            { errorText ? 
              <div class="alert alert-danger" role="alert">
                {errorText}
              </div> 
              : null
            }

            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="email" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                Forgot?
              </NavLink>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>

            <Button disabled={progress} type="submit">
            { !progress ?
              <>
                Login
              </>
              :
             <>
               <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Authenticating...
              </>
            }
            </Button>


          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Login;
