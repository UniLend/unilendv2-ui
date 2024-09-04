import gateLogo from '../../assets/gateWallet.svg';
import infinityLogo from '../../assets/infinity-logo.svg';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { GatewalletConnector } from 'gatewallet-wagmi-connector';
import exodusLogo from '../../assets/exodus.svg';
//connector for infinity wallet
export const infinityWallet = ({ chains, projectId }) => ({
  id: 'Infinity',
  name: 'Infinity Wallet',
  iconUrl: infinityLogo,
  iconBackground: '#fff',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.gateio.gateio',
    ios: 'https://apps.apple.com/us/app/gate-io-buy-bitcoin-crypto/id1294998195',
    mobile: 'https://www.gate.io/mobileapp',
    qrCode: 'https://www.gate.io/web3',
    chrome:
      'https://chromewebstore.google.com/detail/gate-wallet/cpmkedoipcpimgecpmgpldfpohjplkpp',
    browserExtension: 'https://www.gate.io/web3',
  },
  ios: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend putting Gate Wallet on your home screen for faster access to your wallet.',
          step: 'install',
          title: 'Open the Gate Wallet app',
        },
        {
          description:
            'After you scan, a connection prompt will appear for you to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan button',
        },
      ],
    },
  },
  qrCode: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend putting Gate Wallet on your home screen for faster access to your wallet.',
          step: 'install',
          title: 'Open the Gate Wallet app',
        },
        {
          description:
            'After you scan, a connection prompt will appear for you to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan button',
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend pinning Gate Wallet to your taskbar for quicker access to your wallet.',
          step: 'install',
          title: 'Install the Gate Wallet extension',
        },
        {
          description:
            'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
          step: 'create',
          title: 'Create or Import a Wallet',
        },
        {
          description:
            'Once you set up your wallet, click below to refresh the browser and load up the extension.',
          step: 'refresh',
          title: 'Refresh your browser',
        },
      ],
    },
  },
  createConnector: () => {
    const connector = new InjectedConnector({
      chains: chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    });
    return {
      connector,
    };
  },
});

// Connector for Gate Wallet
export const gateWallet = ({ chains }) => ({
  id: 'Gate',
  name: 'Gate Wallet',
  iconUrl: gateLogo,
  iconBackground: '#fff',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=com.gateio.gateio',
    ios: 'https://apps.apple.com/us/app/gate-io-buy-bitcoin-crypto/id1294998195',
    mobile: 'https://www.gate.io/mobileapp',
    qrCode: 'https://www.gate.io/web3',
    chrome:
      'https://chromewebstore.google.com/detail/gate-wallet/cpmkedoipcpimgecpmgpldfpohjplkpp',
    browserExtension: 'https://www.gate.io/web3',
  },
  ios: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend putting Gate Wallet on your home screen for faster access to your wallet.',
          step: 'install',
          title: 'Open the Gate Wallet app',
        },
        {
          description:
            'After you scan, a connection prompt will appear for you to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan button',
        },
      ],
    },
  },
  qrCode: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend putting Gate Wallet on your home screen for faster access to your wallet.',
          step: 'install',
          title: 'Open the Gate Wallet app',
        },
        {
          description:
            'After you scan, a connection prompt will appear for you to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan button',
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: 'https://www.gate.io/learn',
      steps: [
        {
          description:
            'We recommend pinning Gate Wallet to your taskbar for quicker access to your wallet.',
          step: 'install',
          title: 'Install the Gate Wallet extension',
        },
        {
          description:
            'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
          step: 'create',
          title: 'Create or Import a Wallet',
        },
        {
          description:
            'Once you set up your wallet, click below to refresh the browser and load up the extension.',
          step: 'refresh',
          title: 'Refresh your browser',
        },
      ],
    },
  },
  createConnector: () => {
    const connector = new GatewalletConnector({
      chains: chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    });
    return {
      connector,
    };
  },
});

// connector for Exodus Wallet
export const exodusWallet = ({ chains, projectID }) => ({
  id: 'exodus',
  name: 'Exodus Wallet',
  iconUrl: exodusLogo,
  iconBackground: '#ffffff',
  installed:
    typeof window !== 'undefined' && window.ethereum?.isExodus === true,
  downloadUrls: {
    android:
      'https://play.google.com/store/apps/details?id=exodusmovement.exodus&referrer=utm_source%3Dexodus-website%26utm_content%3Ddownload-page%26utm_campaign%3Ddownload-page%26referrer%3Dhttps%3A%2F%2Fwww.google.com%2F',
    ios: 'https://apps.apple.com/app/apple-store/id1414384820?pt=118366236&ct=download&mt=8',
    browserExtension:
      'https://chrome.google.com/webstore/detail/exodus/aholpfdialjgjfhomihkjbmgjidlcdno',
  },

  extension: {
    instructions: {
      learnMoreUrl: 'https://www.exodus.com/',
      steps: [
        {
          description:
            'We recommend pinning Exodus Wallet to your taskbar for quicker access to your wallet.',
          step: 'install',
          title: 'Install the Exodus Wallet extension',
        },
        {
          description:
            'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
          step: 'create',
          title: 'Create or Import a Wallet',
        },
        {
          description:
            'Once you set up your wallet, click below to refresh the browser and load up the extension.',
          step: 'refresh',
          title: 'Refresh your browser',
        },
      ],
    },
  },
  ios: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: 'https://www.exodus.com/',
      steps: [
        {
          description:
            'We recommend putting Exodus Wallet on your home screen for faster access to your wallet.',
          step: 'install',
          title: 'Open the Exodus Wallet ios app',
        },
        {
          description:
            'After you scan, a connection prompt will appear for you to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan button',
        },
      ],
    },
  },

  createConnector: () => {
    return {
      connector: new InjectedConnector({
        chains,
        shimDisconnect: true,
      }),
    };
  },
});
