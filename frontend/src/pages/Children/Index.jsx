import { Button, notification, Skeleton } from "antd";
import React from "react";
import useFetch from "../../hooks/useFetch";
import useToken from "../../hooks/useToken";
import {differenceInMonths} from 'date-fns'
import CreateChild from "../../components/children/CreateChild";
import { doPost } from "../../utils/request";
import { Link } from "react-router-dom";

export default function Index() {
  const [token] = useToken();
  const { data, error, loading, refresh } = useFetch(
    "children",
    { oldestFirst: true },
    token
  );
  const handleDelete = async (id) =>{
    try{
        if(!window.confirm("Are You Sure?")) return;
        const response = await doPost({method:"DELETE", path:`children/${id}`,token: token})
        if(response.ok){
            refresh()
            return notification.success({
                message:"Record Deleted"
            })
        }
        throw new Error(await response.json().message)
    }catch(err){
        notification.error({
            message: err.message||"Failed To Delete"
        })
    }
  }
  const currentDate = new Date()
  return (
    <div className="container">
      {loading && <Skeleton />}
      {error && <span className="text-danger">{error.message}</span>}
      {data && (
        <div className="card my-2">
          <div className="card-header">Children</div>
          <div className="card-body">
                <table className="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.data.map((child,index)=>(
                                <tr key={Math.random()}>
                                    <td>
                                        {++index}
                                    </td>
                                    <td>
                                        {child.name}
                                    </td>
                                    <td>
                                        {new Date(child.dob).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {differenceInMonths(currentDate, new Date(child.dob))} Months 
                                        
                                    </td>
                                    <td>
                                        <Link
                                            to={`${child.id}`}
                                            className="btn btn-primary btn-sm mx-2"
                                        >
                                            View
                                        </Link>
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={()=>handleDelete(child.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

          </div>
        </div>
      )}
      <CreateChild handleSuccess={refresh} token={token}/>
    </div>
  );
}
