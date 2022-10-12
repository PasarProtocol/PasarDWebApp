// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { SigninProvider } from './contexts/SigninContext';
import { SettingsProvider } from './contexts/SettingsContext';
import App from './App';

// ----------------------------------------------------------------------
const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  <HelmetProvider>
    <SettingsProvider>
      <SigninProvider>
        <BrowserRouter>
          <Web3ReactProvider getLibrary={getLibrary}>
            <App />
          </Web3ReactProvider>
        </BrowserRouter>
      </SigninProvider>
    </SettingsProvider>
  </HelmetProvider>,
  document.getElementById('root')
);