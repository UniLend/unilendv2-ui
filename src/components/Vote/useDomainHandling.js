import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { fetchUserAddressByDomain, fetchUserDomain } from '../../utils/axios';

const useDomainHandling = (address, provider) => {
  const [domainDetail, setDomainDetail] = useState({
    value: '',
    isAddress: false,
  });

  const handleDomain = async () => {
    setDomainDetail({
      value: '',
      isAddress: false,
    });

    try {
      // if (ethers.utils.isAddress(address)) {
      //   const [meta, data] = await Promise.all([
      //     fetchUserDomain(address),
      //     provider.lookupAddress(address),
      //   ]);

      //   setDomainDetail({
      //     value: meta.domain || data,
      //     isAddress: false,
      //   });
      // } else {
      //   const [meta, resolvedAddress] = await Promise.all([
      //     fetchUserAddressByDomain(address),
      //     provider.resolveName(address),
      //   ]);

      //   setDomainDetail({
      //     value: meta.owner || resolvedAddress,
      //     isAddress: true,
      //   });
      // }
    } catch (error) {
      console.error('Error handling domain:', error);
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

  return { domainDetail, handleDomain };
};

export default useDomainHandling;
