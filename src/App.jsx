import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'antd/dist/antd.css';
// internal imports
import { setTheme, setUser, setWeb3, setContracts } from './store/Action';
import MainRoutes from './routes';
import {
  changeNetwork,
  connectWallet,
  getProvider,
  getweb3Instance,
  MetaMaskEventHandler,
} from './services/wallet';
import { coreAbi, helperAbi, positionAbi } from './core/contractData/abi';
import { contractAddress } from './core/contractData/contracts_goerli';
import { getContract } from './services/contracts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.scss';
// import ends here

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const handleTheme = () => {
    dispatch(setTheme(state.theme == 'dark' ? 'light' : 'dark'));
  };

  const { coreAddress, helperAddress, positionAddress } = contractAddress;

  const data = [
    { abi: coreAbi, address: coreAddress },
    { abi: helperAbi, address: helperAddress },
    { abi: positionAbi, address: positionAddress },
  ];

  // setting contract state to store from here

  useEffect(() => {
    (async () => {
      const web3 = await getweb3Instance();
      const user = await connectWallet();
      dispatch(setUser(user))
      dispatch(setWeb3(web3));
      Promise.all(data.map((item) => getContract(web3, item.abi, item.address)))
        .then((res) => {
          const payload = {
            coreContract: res[0],
            helperContract: res[1],
            positionContract: res[2],
          };
          dispatch(setContracts(payload));
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
   

  },[])


  

  // remove this later
  const handleConnect = async () => {
    // const web3 = await getweb3Instance();
    // const userData = await connectWallet(web3);
    // dispatch(setUser(userData));
  };

  return (
    <div className='app_container'>
      <Navbar />
      <div className='app'>
        <MainRoutes {...state} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
