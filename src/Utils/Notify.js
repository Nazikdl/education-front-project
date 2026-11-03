import toast from "react-hot-toast";

const notify = (type, message) => {
  toast[type](message, {
    style: {
      direction: "rtl",
      fontFamily: "Yekan",
      fontSize: "14px",
    },
    duration: 3000,
    position: "top-center",
  });
};

export default notify;