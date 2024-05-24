import { Skeleton } from 'antd'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BookAppointment from '../components/doctor/BookAppointment'
import DoctorCard from '../components/doctor/DoctorCard'
import useFetch from '../hooks/useFetch'
import useUser from '../hooks/useUser'

export default function DoctorsPage() {
  const {user} = useUser()  
  const navigate = useNavigate()
  const {data,error,loading} = useFetch("doctors")
  const [visible, setVisible] = useState(false)
  const [doctor, setDoctor] = useState(null)

  const open = (doc) =>{
      setDoctor(doc)
      setVisible(true)
  }

  const close = () =>{
      setVisible(false)
      setDoctor(null)
}
  if(loading) return <Skeleton />
  if(error) return <span className="text-danger">{error.message}</span>
  return (
    <div className="container py-2">
        {doctor && <BookAppointment doctor={doctor} handleClose={close} visible={visible}/>}
        <div className="row gx-4 hy-4">
            {
                data.data.map(doctor=>(
                    <div className="col-md-4" key={Math.random()}>
                        <DoctorCard doctor={doctor} handleBooking={user?open:()=>navigate('/login')}/>
                    </div>
                ))
            }
        </div>
    </div>
  )
}
