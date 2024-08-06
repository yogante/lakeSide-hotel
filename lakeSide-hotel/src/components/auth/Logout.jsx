import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

const Logout = () => {

  const navigate = useNavigate()

  const auth = useContext(AuthContext)

  const handleLogout = () => {
    auth.handleLogout()

    navigate("/", { state: { message: "You have been logout." } })
  }

  const isLoggedIn = auth.user !== null

  return isLoggedIn ? (
    <>
      <li>
        <Link className='dropdown-item' to={"/profile"}>
          Profile
        </Link>
      </li>

      <li>
        <hr className='dropdown-divider' />
      </li>
      <button className='dropdown-item' onClick={handleLogout}>
        Logout
      </button>

    </>
  ) : null
}

export default Logout
