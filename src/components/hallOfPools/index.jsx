import React from 'react'
import ManageToken from '../ManageTokens/ManageToken';
import PoolCard from './poolCard';
import './styles/index.scss'
export default function HallOfPoolsComponent(props) {

React.useEffect(()=> {
  console.log("Props", props);
},[])
  
  return (
    <div className='hallodpools_container'>
       <div className='banner'>
        <img src="https://s3-alpha-sig.figma.com/img/683b/33c8/804db7da34c89968fa0480d52879aafa?Expires=1667779200&Signature=VbjLjLIcalsBWgGilAuDLugM6ebCQhCwCFXaVnByHx37Q-0bTt1ZG4jenFhq6gxsfDJKefWFDwT0a0WAXPIuhl4vwHAmNtGeBfP5RrWcgIqkl7-LpwaxjuxmswDQ8stDnR2lGYjx8NPw2XXHlMNRWgJE1ohBJ5akhil8oB1KQ~eE8ULBlN5aplJrcY6eMuBy1H6zGb71vDuXZ3GyHYfSPI-0ioqpFV-ztvBXvZC9GgtUj963WcnOocPV52Cjj2-~Gn4yO8DCrkvWTpEIJcSxyHoff3RGuS-HBW7MzCRrM7CCBYlYDJqUvz7cIzjWiSYLyUBhJ~U2zsA5esTP0FSREg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" alt="" />
       </div>

       <ManageToken/>

       <div className='poolcard_container'>
         {
          new Array(6).fill(0).map(() => <PoolCard />)
         }
       </div>
    </div>
  )
}