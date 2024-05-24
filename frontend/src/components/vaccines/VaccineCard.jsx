import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import useUser from '../../hooks/useUser'

export default function VaccineCard({vaccine, handleDelete, isAdmin,handleEdit}) {
  
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
       </div>
       {
           isAdmin && (
               <div className="card-footer">
                   <Button
                    type='primary'
                    danger
                    onClick={()=>handleDelete(vaccine.id)}
                   >
                       Delete
                   </Button>
                   <Button
                    type='primary'
                    
                    onClick={()=>handleEdit(vaccine)}
                   >
                       Edit
                   </Button>
               </div>
           )
       }
   </div>
  )
}
