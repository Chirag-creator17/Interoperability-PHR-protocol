import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HeaderComponent from "./components/header/HeaderComponent";
import { LoginComponent } from "./components/login/LoginComponent";
import { OtpInputComponent } from "./components/login/OtpInput";
import { UserDashComponent } from "./components/dashboard/UserDashComponent";
import { GrantedRequestComponent } from "./components/dashboard/GrantedRequestComponent";
import { GrantRequestComponent } from "./components/dashboard/GrantRequestComponent";
import { LoginOtherComponent } from "./components/login/LoginOtherComponent";
import { OtherDashComponent } from "./components/dashboard/DashboardOtherComponent";
import {CreateDocumentComp} from "./components/createPHR/CreatePHRComponent.jsx";
export default function App() {
  return (
    <div>
      <HeaderComponent/>
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/otp" element={<OtpInputComponent />} />
          <Route path="/dashboard" element={<UserDashComponent />} />
          <Route path="/dashboardOther" element={<OtherDashComponent />} />
          <Route path="/grantedRequest" element={<GrantedRequestComponent />} />
          <Route path="/grantRequest" element={<GrantRequestComponent />} />
          <Route path="/loginOther" element={<LoginOtherComponent />} />
          <Route path="/createPHR" element={<CreateDocumentComp />} />
        </Routes>
      </Router>
    </div>
  );
}
