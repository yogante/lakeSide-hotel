import React, { useEffect, useState } from 'react'
import { bookRoom, getRoomById } from '../utils/ApiFunctions'
import moment from 'moment'
import { Form, FormControl, Button } from 'react-bootstrap'
import BookingSummary from './BookingSummary'
import { useNavigate, useParams } from 'react-router-dom'

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [roomPrice, setRoomPrice] = useState(0)

  const currentUser = localStorage.getItem("userId")

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: ""
  })

  const { roomId } = useParams()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBooking({ ...booking, [name]: value })
    setErrorMessage("")
  }


  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId)
      setRoomPrice(response.roomPrice)
    } catch (error) {
      throw new Error(error)
    }
  }

  useEffect(() => {
    getRoomPriceById(roomId)
  }, [roomId])

  const calculatePayment = () => {
    const checkInDate = moment(booking.checkInDate)
    const checkOutDate = moment(booking.checkOutDate)
    const diffInDays = checkOutDate.diff(checkInDate, "days")
    const price = roomPrice ? roomPrice : 0
    return diffInDays * price
  }

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numOfAdults)
    const childrenCount = parseInt(booking.numOfChildren)
    const totalCount = adultCount + childrenCount
    return totalCount >= 1 && adultCount >= 1
  }
  const isCheckOutDateValid = () => {
    if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
      setErrorMessage("Check out date must come before check-in date.")
      return false
    } else {
      setErrorMessage("")
      return true
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
      e.stopPropagation()
    } else {
      setIsSubmitted(true)
    }
    setIsValidated(true)
  }

  const handleFormSubmit = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking)
      setIsSubmitted(true)
      navigate("/booking-success", { state: { message: confirmationCode } })
    } catch (error) {
      setErrorMessage(error.message)
      console.log(errorMessage)
      navigate("/booking-success", { state: { error: errorMessage } })
    }
  }

  return (
    <>
      <div className='container mb-5'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card card-body mt-5'>
              <h4 className='card card-title' style={{ padding: 0, border: 0 }}>Reserve Room</h4>

              <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor='guestFullName' className='hotel-color'>Full Name : </Form.Label>
                  <Form.Control
                    required
                    type='text'
                    id='guestFullName'
                    name='guestFullName'
                    value={booking.guestFullName}
                    placeholder='Enter your full name'
                    onChange={handleInputChange}
                  />

                  <Form.Control.Feedback type='invalid'>
                    Plesae enter your fullname
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor='guestEmail' className='hotel-color'>Email : </Form.Label>
                  <Form.Control
                    required
                    type='email'
                    id='guestEmail'
                    name='guestEmail'
                    value={booking.guestEmail}
                    placeholder='Enter your e-mail'
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Please enter your email address
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend>Lodging period</legend>
                  <div className='row'>
                    <div className='col-6'>
                      <Form.Label htmlFor='checkInDate' className='hotel-color'>Check-In Date : </Form.Label>
                      <Form.Control
                        required
                        type='date'
                        id='checkInDate'
                        name='checkInDate'
                        value={booking.checkInDate}
                        placeholder='Check-In Date'
                        min={moment().format("MMM Do YYYY")}
                        onChange={handleInputChange}
                      />

                      <Form.Control.Feedback type='invalid'>
                        Please select a check-in-date.
                      </Form.Control.Feedback>
                    </div>


                    <div className='col-6'>
                      <Form.Label htmlFor='checkOutDate' className='hotel-color'>Check-Out Date : </Form.Label>
                      <Form.Control
                        required
                        type='date'
                        id='checkOutDate'
                        name='checkOutDate'
                        value={booking.checkOutDate}
                        placeholder='Check-Out Date'
                        min={moment().format("MMM Do YYYY")}
                        onChange={handleInputChange}
                      />

                      <Form.Control.Feedback type='invalid'>
                        Please select a check-Out-date.
                      </Form.Control.Feedback>
                    </div>

                    {errorMessage && <p className='error-message text-danger'>{errorMessage}</p>}
                  </div>
                </fieldset>

                <fieldset style={{ border: "2px" }}>
                  <legend>Number of Guest </legend>
                  <div className='row'>
                    <div className='col-6'>
                      <Form.Label htmlFor='numOfAdults ' className='hotel-color'>Adults : </Form.Label>
                      <Form.Control
                        required
                        type='number'
                        id='numOfAdults'
                        name='numOfAdults'
                        value={booking.numOfAdults}
                        min={1}
                        placerholder='0'
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type='invalid'>
                        Please select at least 1 adult.
                      </Form.Control.Feedback>
                    </div>

                    <div className='col-6'>
                      <Form.Label htmlFor='numOfChildren' className='hotel-color'>Children : </Form.Label>
                      <Form.Control
                        required
                        type='number'
                        id='numOfChildren'
                        name='numOfChildren'
                        value={booking.numOfChildren}
                        placerholder="0"
                        min={0}
                        onChange={handleInputChange}
                      />

                      <Form.Control.Feedback type='invalid'>
                        Select 0 if no children.
                      </Form.Control.Feedback>
                    </div>
                  </div>
                </fieldset>

                <div className='form-group mt-2 mb-2'>
                  <button type='submit' className='btn btn-hotel'>
                    Continue
                  </button>
                </div>
              </Form>
            </div>
          </div>

          <div className='col-md-4'>
            {isSubmitted && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                onConfirm={handleFormSubmit}
                isFormValid={isValidated}
              />
            )}

          </div>



        </div >


      </div >
    </>

  )
}

export default BookingForm