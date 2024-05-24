import { Skeleton } from "antd"
import useFetch from "../../hooks/useFetch"
import useToken from "../../hooks/useToken"

export default function Appointments({childId}) {
  const [token] = useToken()
  const {data,error,loading} = useFetch(`children/${childId}/appointments`)

  if(loading) return <Skeleton />
  if(error) return <span className="text-danger">{error.message}</span>
  return (
    <div className="py-2">
        <h3>Appointments</h3>
        <table className="table table-sm table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Requested </th>
                <th>Appointed</th>
                <th>Cancelled</th>
                <th>Reason for Visit</th>
            </tr>
        </thead>
        <tbody>
            {
                data.data.map((appointment,index)=>(
                    <tr key={appointment.id}>
                        <td>{++index}</td>
                        <td>{appointment.doctor.name} - {appointment.doctor.email}</td>
                        <td>
                            {new Date(appointment.requested_time).toLocaleDateString() } -
                             {
                                 new Date(appointment.requested_time).toLocaleTimeString()
                             }
                        </td>
                        <td>
                            {
                                appointment.appointed_time && (
                                    <>
                                        {new Date(appointment.appointed_time).toLocaleDateString() } - 
                                        {
                                            new Date(appointment.appointed_time).toLocaleTimeString()
                                        }  
                                    </>
                                )
                            }
                        </td>
                        <td>
                            {appointment.cancelled?"Yes":"No"}
                        </td>
                        <td>
                            {appointment.reason}
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
    </div>
  )
}
