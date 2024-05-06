// App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import Navbar from './components/Navbar';
import Carousel from './pages/Carousel';
import Admin_Login from './pages/AdminLogin';
import Login from './pages/Login';
import Footer from './components/Footer';
import UserRegister from './pages/UserRegister';
import UserProfile from './pages/UserProfile';
import UserFeedback from './pages/UserFeedback';
import UserBooking from './pages/UserBooking';
import PrivateRoute from './PrivateRoute';
import OwnerPrivateRoute from './OwnerPrivateRoute';
import AdminPrivateRoute from './AdminPrivateRoute';
import OwerRegister from './pages/OwerRegister';
import OwnerProfile from './pages/OwnerProfile';
import UserList from './pages/UserList';
import OwnerList from './pages/OwnerList';
import FeedbackList from './pages/FeedbackList';
import Apartments from './pages/Apartments';
import AddApartments from './pages/AddApartments';
import MyUsers from './pages/MyUsers';
import ApartmentDetails from './pages/ApartmentDetails';
import UserDetails from './pages/UserDetails';
import OwnerDetails from './pages/OwnerDetails';
import Card from './components/card';
import OwnerApartmentDetails from './pages/OwnerApartmentDetails';
import MyPayments from './pages/MyPayments';
import UserChangePasword from './pages/UserChangePasword';
import OwnerChangePasword from './pages/OwnerChangePasword';
import SearchData from './pages/SearchData';
import AdminChangePasword from './pages/AdminChangePasword';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<><Carousel /><Card /><Footer/></>} />
          <Route path="admin_login" element={<Admin_Login />} />
          <Route path="login" element={<Login />} />
          <Route path="cregister" element={<UserRegister />} />
          <Route path="oregister" element={<OwerRegister />} />
          <Route path="cprofile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="oprofile" element={<OwnerPrivateRoute element={<OwnerProfile />} />} />
          <Route path="sendfeedback" element={<PrivateRoute element={<UserFeedback />} />} />
          <Route path="cbooking" element={<UserBooking />} />
          <Route path="users" element={<AdminPrivateRoute element={<UserList />} />} />
          <Route path="udetails/:id" element={<AdminPrivateRoute element={<UserDetails />} />} />
          <Route path="owners" element={<AdminPrivateRoute element={<OwnerList />} />} />
          <Route path="odetails/:id" element={<AdminPrivateRoute element={<OwnerDetails />} />} />
          <Route path="feedbacks" element={<AdminPrivateRoute element={<FeedbackList />} />} />
          <Route path="apartments" element={<Apartments />} />
          <Route path="addapartments" element={ <AddApartments />} />
          <Route path="apartmentdetails/:id" element={<PrivateRoute element={<ApartmentDetails />} />} />
          <Route path="oapartmentdetails/:id" element={<OwnerPrivateRoute element={<OwnerApartmentDetails />} />} />
          <Route path="myPayments" element={<OwnerPrivateRoute element={<MyPayments />} />} />
          <Route path="myUsers" element={<OwnerPrivateRoute element={<MyUsers />} />} />
          <Route path="user-change" element={<PrivateRoute element={<UserChangePasword />} />} />
          <Route path="owner-change" element={<OwnerPrivateRoute element={<OwnerChangePasword />} />} />
          <Route path="admin-change" element={<AdminPrivateRoute element={<AdminChangePasword />} />} />
          <Route path="search-results" element={<SearchData />} />
          <Route path="reset-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
