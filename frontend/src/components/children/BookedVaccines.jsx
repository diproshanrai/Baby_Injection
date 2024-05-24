import { Skeleton } from 'antd'
import { refresh } from 'less'
import React from 'react'
import useFetch from '../../hooks/useFetch'
import useToken from '../../hooks/useToken'
import BookedVaccineCard from './BookedVaccineCard'

export default function BookedVaccines({childId}) {
    const [token] = useToken()
    const {data,error,loading} = useFetch("vaccines",{childId:childId},token)
    if(loading) return <Skeleton />
    if(error) return <span className="text-danger">{error.message}</span>
    return (
       <>
            <h3>Booked Vaccines</h3>
            <div className="row py-2 gx-4 gy-4">
            {
                data.data.map(booking=>(
                    <div className="col-md-6" key={booking.id}>
                        <BookedVaccineCard booking={booking} refresh={refresh}/>
                    </div>
                ))
            }
        </div>
       </>
    )
}
