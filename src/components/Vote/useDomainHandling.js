import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { fetchUserAddressByDomain, fetchUserDomain } from "../../utils/axios";

// const useDomainHandling = (initialAddress = "") => {
//   const [address, setAddress] = useState(initialAddress);
//   console.log("useHOOK_ADDR", address);
//   const [valid, setValid] = useState(ethers.utils.isAddress(initialAddress));
//   const [domainDetail, setDomainDetail] = useState({
//     value: "",
//     isAddress: false,
//   });
//   console.log("domainDetail", domainDetail);
//   const alchemyId = import.meta.env.VITE_ALCHEMY_ID;
//   const key = `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`;
//   // const provider = new ethers.providers.JsonRpcProvider(key);
//   const provider = useMemo(() => {
//     return new ethers.providers.JsonRpcProvider(key);
//   }, []);
//   console.log("VOTE_PROVIDER_KEY", key);
//   console.log("VOTE_PROVIDER", provider);

//   //   const provider = useMemo(() => new ethers.providers.JsonRpcProvider(), []);

//   const handleDomain = async () => {
//     setDomainDetail({ value: "", isAddress: false });
//     if (valid) {
//       const meta = await fetchUserDomain(address);
//       const data = await provider.lookupAddress(address);
//       console.log("DATA", data);
//       setDomainDetail({
//         value: meta.domain ? meta.domain : data,
//         isAddress: false,
//       });
//     } else {
//       const meta = await fetchUserAddressByDomain(address);
//       const resolvedAddress = await provider.resolveName(address);
//       console.log("ADDRESS", resolvedAddress);
//       setDomainDetail({
//         value: meta.owner ? meta.owner : resolvedAddress,
//         isAddress: true,
//       });
//     }
//   };

//   useEffect(() => {
//     let timeoutId;
//     if (address) {
//       timeoutId = setTimeout(() => {
//         handleDomain();
//       }, 500);
//     }
//     return () => clearTimeout(timeoutId);
//   }, [address, valid]);

//   const handleAddress = (inputAddress) => {
//     setAddress(inputAddress);
//     const isValid = ethers.utils.isAddress(inputAddress);
//     setValid(isValid);
//     handleDomain();
//   };

//   return { address, valid, domainDetail, handleAddress };
// };

const useDomainHandling = (address, provider) => {
  const [domainDetail, setDomainDetail] = useState({
    value: "",
    isAddress: false,
  });

  const handleDomain = async () => {
    setDomainDetail({
      value: "",
      isAddress: false,
    });

    try {
      if (ethers.utils.isAddress(address)) {
        const [meta, data] = await Promise.all([
          fetchUserDomain(address),
          provider.lookupAddress(address),
        ]);

        setDomainDetail({
          value: meta.domain || data,
          isAddress: false,
        });
      } else {
        const [meta, resolvedAddress] = await Promise.all([
          fetchUserAddressByDomain(address),
          provider.resolveName(address),
        ]);

        setDomainDetail({
          value: meta.owner || resolvedAddress,
          isAddress: true,
        });
      }
    } catch (error) {
      console.error("Error handling domain:", error);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (address) {
      timeoutId = setTimeout(() => {
        handleDomain();
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [address, 500]);

  //   return { address, domainDetail, handleDomain, provider };
  return { domainDetail, handleDomain };
};

export default useDomainHandling;
