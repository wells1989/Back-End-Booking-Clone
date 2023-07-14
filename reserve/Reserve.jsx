import React from "react";
import "./Reserve.css";
import { faCircleXmark } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/free-solid-svg-icons";
import useFetch from '../../hooks/useFetch';
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const Reserve = ({setOpen, hotelId}) => {
    const [selectedRooms, setSelectedRooms] =useState([]);
    const { data, loading, error } =useFetch(`hotels/rooms${hotelId}`)
    const { dates } = useContext(SearchContext);

    const handleSelect = (e) => {
        const checked = e.target.checked
        const value = e.target.value
        setSelectedRooms(checked ? 
            [...selectedRooms, value] 
            : selectedRooms.filter((item)=> item !== value));
    };

    const getDatesInRange = (startDate,endDate) => {
        const start =  new Date(startDate)
        const end =  new Date(endDate)
        
        const date =  new Date(start.getTime);
        let list = []

        while(date <= end) {
            list.push(new Date(date));
            date.setDate(date.getDate()+1)
        }
        return list;
    };

    const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) =>
            alldates.includes(new Date(date).getTime()));

        return !isFound
    };

    const handleClick = async () => {
        try {
          await Promise.all(
            selectedRooms.map((roomId) => {
              const res = axios.put(`/rooms/availability/${roomId}`, {
                dates: alldates,
              });
              return res.data;
            })
          );
          setOpen(false);
          navigate("/");
        } catch (err) {} 
      };

    return (
        <div className = "reserve">
            <div className = "rContainer">
              <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)}/>  
            
            <span>Select your rooms</span>
            {data.map(item => (
                <div className = "rItemInfo">
                  <div className = "rTitle">{item.title}</div>
                  <div className = "rDescription">{item.description}</div>  
                  <div className = "rMax">{item.maxPeople}</div>
                  <div className = "rPrice">{item.price}</div>    
                  <div>
                    <div className="rSelectRooms">
                    {item.roomNumbers.map((roomNumber) => {
                        <div className="room">
                            <label>{roomNumber.number}</label>
                            <input
                            type="check" value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)}
                            />
                        </div>
                    })}
                    </div>
                    <button onClick = {handleClick} className="rButton">Reserve Now!</button>
                  </div>
                </div>
            ))}

            </div>
        </div>
    )
}

export default Reserve;