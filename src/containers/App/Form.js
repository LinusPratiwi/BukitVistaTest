import React,{useState,useEffect} from "react";
import ArrivalModal from "./ArrivalModal"
import "./Modal.css"

function Form({data}){
    const [arrivalTime, setArrivalTime] = useState("");
    const [bookingCode, setBookingCode] = useState("");
    const [bookings,setBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);


    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
    }

    function getGuests() {
    fetch("https://bv-online-assessment.herokuapp.com/api/bookings/").then((result) => {
      result.json().then((resp) => {
        // console.warn(resp)
        setBookings(resp)
      })
    })
  }


    function updateArrival(){
        const arrival_time = {arrivalTime}
        fetch(`https://bv-online-assessment.herokuapp.com/api/bookings/${bookingCode}`,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(arrival_time)
        }).then(result => {
            result.json().then(response =>{
                getGuests()
            })
            
        })
    }


    function handleChange(event){
       
        const bookingcode = event.target.value;
        const targetbooking = data.filter(value => {
            return value.booking_code.includes(bookingcode)
        })
        setBookings(targetbooking);
        setBookingCode(targetbooking.booking_code);
        setArrivalTime(targetbooking.arrival_time);
        
    }

    return(
        <div id="form">
            <h3>Your booking code</h3>
            <input type="text" placeholder={makeid(10)}
            onChange={handleChange}
            
            />
            <br/>
            {bookings.map(booking => {
                return <div>
                    <br/>
                    <img src={booking.profile_picture} alt="img_guest"/><br/>
                    <p>Hi, {booking.guest_name}</p>
                    <p>Thank you for booking with Bukit Vista. Here are the details of your current booking:</p>
                    <p>Property name : <strong>{booking.property_name}</strong></p>
                    <p>Check in date : <strong>{booking.check_in_date}</strong> &emsp; Check out date : <strong>{booking.check_out_date}</strong></p>
                    <p>Arrival time : <button onClick={() => {
                        setModalOpen(true);
                    }}>
                    { booking.arrival_time === "" ? "Please set your arrival time" : booking.arrival_time}</button></p>
                    {modalOpen && <ArrivalModal setOpenModal={setModalOpen} />}
                    </div>
            })}
        </div>
    )
}

export default Form