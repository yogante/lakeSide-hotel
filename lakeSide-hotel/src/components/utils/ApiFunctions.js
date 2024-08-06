import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:9192"
})

export const getHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
}

/** this function adds a new room room to the database */
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData()
  formData.append("photo", photo)
  formData.append("roomType", roomType)
  formData.append("roomPrice", roomPrice)

  const response = await api.post("/rooms/add/new-room", formData, {
    headers: getHeader()
  })
  if (response.status === 201) {
    return true
  } else {
    return false
  }
}

/** this function gets all room types from three database */
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types")
    return response.data
  } catch (error) {
    throw new Error("Error fetching room types.")
  }
}

/** this function gets all rooms from the database */
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms")
    return result.data

  } catch (error) {
    throw new Error("Error fetching rooms")

  }
}
/** this function deletes a room by the id */
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`)
    return result.data
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`)
  }
}

/** this function update a room by the id */
export async function updateRoom(roomId, roomData) {
  const formData = new FormData()
  formData.append("roomType", roomData.roomType)
  formData.append("roomPrice", roomData.roomPrice)
  formData.append("photo", roomData.photo)
  const response = await api.put(`/rooms/update/${roomId}`, formData)
  return response
}

/**this function gets a room  by Id */
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`)
    return result.data
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`)
  }
}

/** This function save a new booking to the database */
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data)
    } else {
      throw new Error(`Error booking room : ${error.message}`)
    }
  }
}

/** This function gets all bookings from the database */
export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings")
    return result.data
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.message}`)

  }
}

/** this function get booking by the confirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
    return result.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data)
    } else {
      throw new Error(`Error find booking : ${error.message}`)
    }
  }
}

/** this function cancels booking */
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
    return result.data
  } catch (error) {
    throw new Error(`Error cancellling booking : ${error.message}`)
  }
}
/** this function gets all available room from the database with a given dates and room type*/
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const result = await api.get(
    `rooms/available-rooms/?checkInDate=${checkInDate}
    &checkOutDate=${checkOutDate}&roomType=${roomType}`
  )
  return result
}

export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration)
    return response.data

  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data)
    } else {
      throw new Error(`User registration error : ${error.message}`)
    }
  }
}


export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    throw error

  }
}


export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader()
    })
    return response.data

  } catch (error) {
    return error.message
  }
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    console.error("Error fetching bookings:", error.message)
    throw new Error("Failed to fetch bookings")
  }
}