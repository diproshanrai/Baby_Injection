import { Skeleton } from 'antd'
import React from 'react'
import { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import BookVaccine from './BookVaccine'
import VaccineCard from './VaccineCard'

export default function Vaccines({childId,months}) {
   const {data,error,loading} = useFetch("vaccine-list",{months:months})
   const [vaccineId, setVaccineId] = useState(null);
   const [visible, setVisible] = useState(false);

   const open = (id)=>{
        setVaccineId(id)
        setVisible(true)
   }

   const close = ()=>{
       setVisible(false)
       setVaccineId(null)
   }

   if(loading) return <Skeleton />
   if(error) return <span className="text-danger">{error.message}</span>
    return (
    <>
        <h3>Recomended Vaccines</h3>
        
        {vaccineId && <BookVaccine visible={visible} childId={childId} vaccineId={vaccineId} handleClose={close}/>}
        <div className="row py-2 gx-4 gy-4">
        {
            data.data.map(vaccine=>(
                <div className="col-md-6" key={vaccine.id}>
                    <VaccineCard vaccine={vaccine} handleBooking={()=>open(vaccine.id)}/>
                </div>
            ))
        }
    </div>
    </>
  )
}
