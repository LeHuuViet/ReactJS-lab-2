/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import React from 'react';
import { ISignUpParams } from '../../../models/auth';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { getErrorMessageResponse } from '../../../utils';
import { replace } from 'connected-react-router';
import logo from '../../../logo-420-x-108.png';
import SignUpForm from '../components/SignUpForm';

const SignUpPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locations, setLocations] = useState([]);

  const getLocation = React.useCallback(async () => {
    setLoading(true);

    const json = await dispatch(fetchThunk(API_PATHS.getLocation, 'get'));

    setLoading(false);

    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      setLocations(json.data);
      return;
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const onSignUp = React.useCallback(
    async (values: ISignUpParams) => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(fetchThunk(API_PATHS.signUp, 'post', values));
      setLoading(false);
      if (json?.code === RESPONSE_STATUS_SUCCESS) {
        alert('Chúc mừng bạn đã đăng ký thành công');
        dispatch(replace(ROUTES.login));
        return;
      }
      setErrorMessage(getErrorMessageResponse(json));
    },
    [dispatch],
  );

  return (
    <div
      className="container"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <img src={logo} alt="" style={{ maxWidth: '250px', margin: '32px' }} />
      <SignUpForm onSignUp={onSignUp} loading={loading} errorMessage={errorMessage} locations={locations} />
    </div>
  );
};

export default SignUpPage;
