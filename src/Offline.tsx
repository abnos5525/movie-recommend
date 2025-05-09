import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Offline() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnlineStatus = () => {
      if (navigator.onLine) {
        navigate('/');
      }
    };

    // اضافه کردن Event Listener برای تغییر وضعیت اتصال
    window.addEventListener('online', checkOnlineStatus);

    // تمیز کردن Event Listener
    return () => {
      window.removeEventListener('online', checkOnlineStatus);
    };
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>شما آفلاین هستید!</h1>
      <button onClick={() => {
        if (navigator.onLine) {
          navigate("/");
        }
      }}>
        صفحه اصلی
      </button>
    </div>
  );
}

export default Offline;