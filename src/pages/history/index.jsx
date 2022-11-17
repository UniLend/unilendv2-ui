import React from 'react';
import HistoryComponent from '../../components/History';
import { allTransaction, positionId } from '../../services/events';

export default function History(props) {
  const { contracts, user, web3 } = props;
  return (
    <>
      {/* <button
        onClick={() =>
          allTransaction(
            contracts.coreContract,
            contracts.positionContract,
            user.address,
            web3
          )
        }
      >
        btn
      </button> */}

      <HistoryComponent {...props} />
    </>
  );
}
