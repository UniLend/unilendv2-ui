import {tokensBYSymbol, tokensByAddress } from './constants';

export function getTokenLogo(address){
    if(tokensBYSymbol[address]){
        return tokensBYSymbol[address]['logo'];
    } 
    else {
        return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ic2MtMWZ2bmFkei0xIGhxdFlVTyIgc3R5bGU9ImNvbG9yOiByZ2IoODYsIDkwLCAxMDUpOyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSI0LjkzIiB5MT0iNC45MyIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48L3N2Zz4=`;
    }
}

export function getTokenSymbol(address){
    if(tokensBYSymbol[address]){
        return tokensBYSymbol[address]['symbol'];
    } 
    else {
        return `Token`;
    }
}

export function getToken(symbol){
    
    if(tokensBYSymbol[symbol]){
        return tokensBYSymbol[symbol];
    } 
   else {
    const token = {
        'logo': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ic2MtMWZ2bmFkei0xIGhxdFlVTyIgc3R5bGU9ImNvbG9yOiByZ2IoODYsIDkwLCAxMDUpOyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSI0LjkzIiB5MT0iNC45MyIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48L3N2Zz4=',
        'address': '',
        'symbol': ''
    }
    return token;
   }
}

export function getTokenByAddress(addr){
    if(tokensByAddress[addr]){
        return tokensByAddress[addr];
    } 
   else {
    const token = {
        'logo': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ic2MtMWZ2bmFkei0xIGhxdFlVTyIgc3R5bGU9ImNvbG9yOiByZ2IoODYsIDkwLCAxMDUpOyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSI0LjkzIiB5MT0iNC45MyIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48L3N2Zz4=',
        'address': '',
        'symbol': ''
    }
    return token;
   }
}