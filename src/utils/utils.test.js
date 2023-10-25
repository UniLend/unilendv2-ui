import { sum, fromWei , shortenAddress, fixFormatNumber} from ".";

import { describe, expect, it, vi} from 'vitest'


describe('Utils Functions', ()=> {
    it('should return the correct value for two numbers', () => {
       expect(sum()).toBe(0)
    })

    it('should convert a value from Wei to Ether', () => {
        // Mock the web3 object with a fromWei function
        const web3 = {
          utils: {
            fromWei: vi.fn(() => '10'), // Mock the conversion result
          },
        };
    
        // Value in Wei
        const valInWei = '10000000000000000000';
    
        // Call the fromWei function
        const result = fromWei(web3, valInWei);
    
        // Expect the fromWei function to have been called with the provided value
        expect(web3.utils.fromWei).toHaveBeenCalledWith(valInWei, 'ether');
    
      //   // Expect the result to be the mocked value fromWei
         expect(result).toBe('10');
      });

      it('should return the correct value for an address', () => {
        const address = '0x1234567890abcdef';
        const shortenedAddress = shortenAddress(address);
        expect(shortenedAddress).toBe('0x123....cdef');
    })



    it('should format the number with 6 decimals if it has non-zero digits after the decimal point', () => {
        const formattedNumber = fixFormatNumber(5.123456);
        expect(formattedNumber).toBe('5.123');
      });
    
      it('should format the number with 3 decimals if it has no non-zero digits after the decimal point', () => {
        const formattedNumber = fixFormatNumber(5.000);
        expect(formattedNumber).toBe('5.000000');
      });
    
      it('should format the number with 6 decimals if it has trailing zeros', () => {
        const formattedNumber = fixFormatNumber(5.100000);
        expect(formattedNumber).toBe('5.100');
      });
    
      it('should format negative numbers correctly', () => {
        const formattedNumber = fixFormatNumber(-5.123456);
        expect(formattedNumber).toBe('-5.123');
      });
    
      it('should format integers correctly with 3 decimals', () => {
        const formattedNumber = fixFormatNumber(10);
        expect(formattedNumber).toBe('10.000000');
      });

      it('should format integers correctly with 3 decimals if number is more than 3 digits', () => {
        const formattedNumber = fixFormatNumber(100.453153516);
        expect(formattedNumber).toBe('100.453');
      });




})

