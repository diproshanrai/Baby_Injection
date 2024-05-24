import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

export default function VaccineCard({vaccine, handleBooking}) {
  return (
   <div className="card">
       <div className="card-header">{vaccine.name}</div>
       <div className="card-body">
           <div>
               Months: {vaccine.months}
           </div>
           <p className='py-1'>{new String(vaccine.description).substring(0,100)}
           <Link className='mx-1' to={`/vaccine/${vaccine.id}`}>Read More</Link>
           </p>
           <Button
            onClick={handleBooking}
           >
               Book Vaccine
           </Button>
       </div>
   </div>
  )
}
