import { Outlet } from "react-router-dom";
import { App, notification } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";

const Template = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnlineStatus = () => {
      if (!navigator.onLine) {
        navigate("/offline");
      }
    };

    checkOnlineStatus();
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, [navigate]);

  notification.config({
    placement: "topRight",
    bottom: 50,
    duration: 2,
    rtl: true,
  });

  return (
    <App
      className="min-h-screen flex justify-center bg-gradient-to-l from-gray-900 via-purple-900 to-gray-800">
      <div className="w-full px-4">
        <Outlet />
      </div>
    </App>
  );
};

export default Template;
