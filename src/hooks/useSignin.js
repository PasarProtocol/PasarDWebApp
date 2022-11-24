import { useContext } from 'react';
import { SigninContext } from '../contexts/SigninContext';

// ----------------------------------------------------------------------

const useSignIn = () => useContext(SigninContext);

export default useSignIn;
