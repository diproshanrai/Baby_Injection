import { Button, notification } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import useToken from '../../hooks/useToken'
import { doPost } from '../../utils/request'

export default function BookedVaccineCard({booking, refresh}) {
  const [token] = useToken()
  const handleCancel = async ()=>{
      try {
          if(!window.confirm("Are You Sure?")) return;
          const response = await doPost({method:"DELETE", path:`vaccines/${booking.id}`,token:token})
          if(response.ok){
             notification.success({
                  message:"Booking Cancelled"
              })
              return refresh()
          }
          throw new Error((await response.json()).message)
      } catch (error) {
          notification.error({
              message:error.message||"Something Went Wrong"
          })
      }
  }  

  const handleComplete = async ()=>{
      try {
        if(!window.confirm("Are You Sure?")) return;
        const response = await doPost({method:"PUT",path:`vaccines/${booking.id}`,body:{
            childId: booking.child.id,
            completed: true
        }, token: token})  
        if(response.ok){
            notification.success({
                message: "Marked As Complete"
            })
            return refresh()
        }
        throw new Error((await response.json()).message)
      } catch (error) {
         notification.error({
             message:error.message||"Something Went Wrong"
         }) 
      }
  }
  return (
    <div className="card">
        <div className="card-header">
            {booking.vaccine.name}
        </div>
        <div className="card-body">
            <p className='py-1'>{new String(booking.vaccine.description).substring(0,100)}
           <Link className='mx-1' to={`/vaccine/${booking.vaccine.id}`}>Read More</Link>

            </p>
            <div className="py-1">
                <div>Date: {new Date(booking.dueDate).toLocaleDateString()}</div>
                <div>Status: {booking.completed?"Completed":"Not Completed"}</div>
            </div>
          
        </div>
        {booking.completed || (<div className="card-footer">
       
                <Button
                type='primary'
                danger
                onClick={handleCancel}
            >
                    Cancel Booking
            </Button>
       

       
            <Button
            type='primary'
           
            onClick={handleComplete}
        >
                Mark As Complete
        </Button>
          
      
        </div>)}
    </div>
  )
}
