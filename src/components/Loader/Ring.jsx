// import React from "react";
// import "./styles/ring.scss";
// import ring from "../../assets/Eclipse-loader.gif";
// export default function Ring() {
//   return (
//     <div className="ring_loader">
//       <img src={ring} alt="" />
//     </div>
//   );
// }

import React from "react";
import "./styles/ring.scss";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Ring() {
  const antIcon = <LoadingOutlined style={{ fontSize: 132 }} spin />;
  return (
    <div className="ring_loader">
      <Spin className="loader_main" indicator={antIcon} />
    </div>
  );
}
