import { Button, DatePicker, notification, Skeleton } from "antd";
import {differenceInMonths} from 'date-fns'
import { useState } from "react";
import SetDate from "../components/appointment/SetDate";
import useFetch from "../hooks/useFetch";
import useToken from "../hooks/useToken";
import { doPost } from "../utils/request";

export default function BookingsPage() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [token] = useToken();
  const [visible, setVisible] = useState(false)
  const [appointment,setAppointment] = useState(null)


  const open = (appointment)=>{
    setAppointment(appointment)
    setVisible(true)
  } 

  const close = ()=>{
    setVisible(false)
    setAppointment(null)
  } 

  const { data, error, loading, refresh } = useFetch(
    "doctors/appointments",
    { from, to },
    token
  );

  const handleCancel = async (id)=>{
    try{
        if(!window.confirm("Are You Sure?")) return;
        const response = await doPost({method:"PUT", path:`doctors/${id}/appointments`,body:{cancelled:1},token:token})
        if(response.ok){
            notification.success({
                message:"Cancelled"
            })
            return refresh()
        }
        throw new Error(await(response.json()).message)
    }catch(err){
        notification.error({
            message: err.message||"Something Went Wrong"
        })
    }
  }
 const currentDate = new Date()
  return (
    <div className="container">
      <h1>Bookings</h1>
      {appointment && <SetDate appointment={appointment} visible={visible} handleClose={close} success={refresh}/>}
      <div className="card w-100">
        <DatePicker.RangePicker
          className="w-100"
          showTime
          onChange={(date, dateString) => {
            setFrom(dateString[0]);
            setTo(dateString[1]);
          }}
        />
      </div>
      {loading && <Skeleton />}
      {error && <span className="text-danger">{error.message}</span>}
      {data && (
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Child</th>
              <th>Child Age</th>
              <th>Parent</th>
              <th>Parent Email</th>
              <th>Reason For Visit</th>
              <th>Requested Date</th>
              <th>Appointed Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{++index}</td>
                <td>{appointment.child.name}</td>
                <td>{differenceInMonths(currentDate,new Date(appointment.child.dob))} Months </td>
                <td>{appointment.user.name}</td>
                <td>{appointment.user.email}</td>
                <td>{appointment.reason}</td>
                <td>
                  {new Date(appointment.requested_time).toLocaleDateString()} -
                  {new Date(appointment.requested_time).toLocaleTimeString()}
                </td>
                <td>
                  {appointment.appointed_time? (
                    <>
                      {new Date(
                        appointment.appointed_time
                      ).toLocaleDateString()}{" "}
                      -
                      {new Date(
                        appointment.appointed_time
                      ).toLocaleTimeString()}
                    </>
                  ):(appointment.cancelled||<Button
                    type="primary"
                    onClick={()=>open(appointment)}
                  >
                    Set Appointment
                  </Button>)}
                </td>
                <td>{appointment.cancelled ? "Cancelled" : 
                    <Button
                        type="primary"
                        danger
                        onClick={()=>handleCancel(appointment.id)}
                    >
                        Cancel
                    </Button>
                }</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
