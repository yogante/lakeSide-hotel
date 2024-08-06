import React from 'react'
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className='container mt-5'>
      <h2>Welcome to Admin Panel</h2>
      <hr />
      <Link to={"/existing-room"}>Manage Room</Link><br />
      <Link to={"/existing-bookings"}>Manage Bookings</Link>
    </div>
  )
}

export default Admin