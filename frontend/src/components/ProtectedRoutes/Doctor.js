import { Skeleton } from "antd"
import { Navigate } from "react-router-dom"
import useUser from "../../hooks/useUser"


export default function Doctor({element}) {
    const {user, isAuthenticating} = useUser()
    if(isAuthenticating) return <Skeleton/>
    if(!user) return <Navigate to={'/login'} replace={true} />
    if(user.role !== "DOCTOR") return <Navigate to={'/'} replace={true} />
    return element;
}
