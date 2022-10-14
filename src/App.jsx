import { useEffect } from 'react';
import './App.scss';
import { setTheme, setUser, setWeb3 } from './store/Action';
import MainRoutes from './routes';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import { connectWallet, getProvider, getweb3Instance } from './services/wallet';
import { coreAbi, helperAbi } from './core/contractData/abi';
import {
  coreAddress,
  helperAddress,
} from './core/contractData/contracts_goerli.json';
import { getContract } from './services/contracts';

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const handleTheme = () => {
    dispatch(setTheme(state.theme == 'dark' ? 'light' : 'dark'));
  };

  const data = [
    { abi: coreAbi, address: coreAddress },
    { abi: helperAbi, address: helperAddress },
  ];

  useEffect(() => {
    (async () => {
      const web3 = await getweb3Instance();
      Promise.all(data.map((item) => getContract(web3, item.abi, item.address)))
        .then((res) => {
          console.log(res);
          dispatch(setWeb3(web3));
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const handleConnect = async () => {
    const web3 = await getweb3Instance();
    const userData = await connectWallet(web3);
    dispatch(setUser(userData));
  };
  console.log('web3 from state', state.user);
  useEffect(() => {
    document.body.setAttribute('class', state.theme);
  }, [state.theme]);

  return (
    <div className='app_container'>
      <Navbar />
      <div className='app'>
        <MainRoutes {...state} />
      </div>
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}

export default App;
