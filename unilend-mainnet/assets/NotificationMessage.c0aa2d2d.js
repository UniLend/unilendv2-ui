import { b_ as notification, b1 as jsx, b$ as CheckCircleOutlined, c0 as CloseCircleOutlined } from "./index.a9e8707a.js";
const notificationMessage = "";
function NotificationMessage(result, msg) {
  return notification.open({
    mesage: {
      result
    },
    description: result === "success" ? msg : msg,
    onClick: () => {
    },
    className: "notification_class",
    closeIcon: false,
    duration: 5,
    icon: result == "success" ? /* @__PURE__ */ jsx(CheckCircleOutlined, {
      style: {
        color: "green"
      }
    }) : /* @__PURE__ */ jsx(CloseCircleOutlined, {
      style: {
        color: "red"
      }
    })
  });
}
export {
  NotificationMessage as N
};
