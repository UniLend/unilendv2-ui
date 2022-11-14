export const getAllEvents = async (contract, event) => {
  try {
    const result = await contract.getPastEvents(
      event,
      {
        // filter: filter,
        // filter: {indexedParameter: value}
        fromBlock: 0,
        toBlock: 'latest',
      },
      function (error, events) {
        if (error) {
          console.log(error);
        }
      }
    );
    return result.map((item) => item.returnValues);
  } catch (error) {
    return error;
  }
};
