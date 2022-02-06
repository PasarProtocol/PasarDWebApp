import { useContext } from 'react';
import { SigninContext } from '../contexts/SigninContext';

// ----------------------------------------------------------------------

const useSignin = () => useContext(SigninContext);

export default useSignin;
