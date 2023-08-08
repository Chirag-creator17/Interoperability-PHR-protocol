import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HeaderComponent from "./components/header/HeaderComponent";
import { LoginComponent } from "./components/login/LoginComponent";
import { OtpInputComponent } from "./components/login/OtpInput";
import { UserDashComponent } from "./components/dashboard/UserDashComponent";
import { ActiveRequestComponent } from "./components/dashboard/ActiveRequestComponent";
export default function App() {
  return (
    <div>
      <HeaderComponent />
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/otp" element={<OtpInputComponent />} />
          <Route path="/dashboard" element={<UserDashComponent />} />
          <Route path="/activeRequest" element={<ActiveRequestComponent />} />
        </Routes>
      </Router>
    </div>
  );
}
