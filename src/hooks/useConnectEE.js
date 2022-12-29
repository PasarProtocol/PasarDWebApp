import { DID, storage } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import jwt from 'jsonwebtoken';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { isInAppBrowser } from '../utils/common';
import { essentialsConnector, isUsingEssentialsConnector } from '../components/signin-dlg/EssentialConnectivity';
import { firebaseConfig, DidResolverUrl } from '../config';

if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}

export default function useConnectEE() {
  const signInWithEssentials = async () => {
    const didAccess = new DID.DIDAccess();
    let presentation;
    console.log('Trying to sign in using the connectivity SDK');
    try {
      presentation = await didAccess.requestCredentials({
        claims: [
          DID.simpleIdClaim('Your avatar', 'avatar', false),
          DID.simpleIdClaim('Your name', 'name', false),
          DID.simpleIdClaim('Your description', 'description', false)
        ]
      });
    } catch (e) {
      console.warn('Error while getting credentials', e);
      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.error('Error while trying to disconnect wallet connect session', e);
      }
      return undefined;
    }

    if (presentation) {
      const did = presentation.getHolder().getMethodSpecificId();
      DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
      // verify
      const vp = VerifiablePresentation.parse(JSON.stringify(presentation.toJSON()));
      const sDid = vp.getHolder().toString();
      if (!sDid) {
        console.log('Unable to extract owner DID from the presentation');
        return undefined;
      }
      // generate token
      const name = vp?.getCredential(`name`)?.getSubject()?.getProperty('name') || '';
      const bio = vp?.getCredential(`description`)?.getSubject()?.getProperty('description') || '';
      const userInfo = { sDid, bio, name };
      const token = jwt.sign(userInfo, 'pasar', { expiresIn: 60 * 60 * 24 * 7 });
      const walletAddress = isInAppBrowser()
        ? await window.elastos.getWeb3Provider().address
        : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
      sessionStorage.setItem('PASAR_LINK_ADDRESS', '2');
      sessionStorage.setItem('PASAR_DID', did);
      sessionStorage.setItem('PASAR_TOKEN', token);
      const user = { link: '2', did, token, address: walletAddress };
      return user;
    }
    return undefined;
  };

  const signOutWithEssentials = async (pageRefresh = false) => {
    console.log('Signing out user. Deleting session info');
    sessionStorage.removeItem('PASAR_LINK_ADDRESS');
    sessionStorage.removeItem('PASAR_DID');
    sessionStorage.removeItem('PASAR_TOKEN');
    sessionStorage.removeItem('KYCedProof');
    sessionStorage.removeItem('REWARD_USER');
    try {
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
        await essentialsConnector.getWalletConnectProvider().disconnect();
        await storage.clean(); // clear app instance did cache
      }
      if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
        await window.elastos.getWeb3Provider().disconnect();
    } catch (e) {
      console.error('Error while disconnecting the wallet', e);
    }
    if (pageRefresh) window.location.reload();
  };

  const isConnectedEE = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();

  return {
    isConnectedEE,
    signInWithEssentials,
    signOutWithEssentials
  };
}
