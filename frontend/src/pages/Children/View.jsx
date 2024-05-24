import { Skeleton } from "antd";
import { differenceInMonths } from "date-fns";
import React from "react";
import { useParams } from "react-router-dom";
import Appointments from "../../components/children/Appointments";
import BookedVaccines from "../../components/children/BookedVaccines";
import EditChild from "../../components/children/EditChild";
import Vaccines from "../../components/children/Vaccines";
import useFetch from "../../hooks/useFetch";
import useToken from "../../hooks/useToken";

export default function View() {
  const { id } = useParams();
  const [token] = useToken();
  const { loading, data, error, refresh } = useFetch(
    `children/${id}`,
    {},
    token
  );
  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <div className="container">
      <EditChild handleSuccess={refresh} child={data.data} token={token} />
      <Vaccines childId={data.data.id} months={differenceInMonths(new Date(),new Date(data.data.dob))}/>
      <BookedVaccines childId={data.data.id}/>
      <Appointments childId={data.data.id}/>
    </div>
  );
}
