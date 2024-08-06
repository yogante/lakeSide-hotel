import React, { useState } from "react";


const RoomFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("")

  const handleSelectChange = (e) => {
    const selectedType = e.target.value
    setFilter(selectedType)

    const filteredRooms = Object.values(data).filter((room) =>
      room.roomType.toLowerCase().includes(selectedType.toLowerCase())
    )
    setFilteredData(filteredRooms)
  }

  const clearFilter = () => {
    setFilter("")
    setFilteredData(data)
  }

  const roomTypes = ["", ...new Set(Object.values(data).map((room) => room.roomType))]

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="room-type-filter">
        filter room by type
      </span>
      <select
        className="form-select"
        aria-label="room type filter"
        value={filter}
        onChange={handleSelectChange}>
        <option value="">select a room type to filter....</option>
        {roomTypes.map((type, index) => (
          <option key={index} value={String(type)}>
            {String(type)}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel" type="button"
        onClick={clearFilter}>Clear filter
      </button>
    </div>
  )
}

export default RoomFilter