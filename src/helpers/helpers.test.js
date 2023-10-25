import { describe, expect, it, vi} from 'vitest';
import { count_leading_zeros, numberFormat } from './contracts';

describe('All Helper Functions', () => {
    it('count leading zeros for 5 to be 0', () =>{
      expect(count_leading_zeros('5')).toBe(0)
    })
    it('count leading zeros for 00500 to be 0', () =>{
        expect(count_leading_zeros('00500')).toBe(2)
      })

      it('number format for 5000000 ', () =>{
        expect(numberFormat('5000000')).toBe('5,000,000.00')
      })
})