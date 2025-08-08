import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainApp from "./Views/MainApp/MainApp"
import Login from "./Views/Login/Login"
import Register from "./Views/Register/Register";
import AuthRoute from "./Views/AuthRoute/AuthRoute";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn cho trang đăng nhập và đăng ký không cần bảo vệ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Đường dẫn cho trang chính được bảo vệ */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <MainApp />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;