import { Button, notification, Skeleton } from "antd";
import React from "react";
import { useState } from "react";
import Create from "../../components/vaccine/Create";
import Edit from "../../components/vaccine/Edit";
import WhenVaccine from "../../components/vaccine/WhenVaccine";
import VaccineCard from "../../components/vaccines/VaccineCard";
import useFetch from "../../hooks/useFetch";
import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import { doPost } from "../../utils/request";

export default function Index() {
  const [token] = useToken();
  const { data, error, loading, refresh } = useFetch("vaccine-list");
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [vaccine, setVaccine] = useState(null);
  const { isAdmin } = useUser();
  const open = () => {
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };

  const openVaccine = (vaccine) => {
    setVisibleEdit(true);
    setVaccine(vaccine);
  };

  const closeVaccine = () => {
    setVisibleEdit(false);
    setVaccine(null);
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are You Sure?")) return;
      const response = await doPost({
        method: "DELETE",
        token: token,
        path: `vaccine-list/${id}`,
      });
      if (response.ok) {
        notification.success({
          message: "Record Deleted",
        });
        return refresh();
      }
      throw new Error((await response.json()).message);
    } catch (error) {
      notification.error({
        message: error.message || "Something went wrong",
      });
    }
  };

 
 
  return (
    <div className="container py-2">
      <WhenVaccine />
      {loading && <Skeleton />}
      {error && <span className="text-danger">{error.message}</span>}
      {data && (
        <div className="container-fluid">
          <h1>Vaccine List</h1>
          {isAdmin && (
            <Button className="my-2" type="primary" onClick={open}>
              Create
            </Button>
          )}
          {isAdmin && (
            <Create
              visible={visible}
              handleClose={close}
              handleSuccess={refresh}
            />
          )}
          {isAdmin && vaccine && (
            <Edit
              vaccine={vaccine}
              visible={visibleEdit}
              handleClose={closeVaccine}
              handleSuccess={refresh}
            />
          )}
          <div className="row gx-4 gy-4">
            {data.data.map((vaccine) => (
              <div className="col-md-4" key={Math.random()}>
                <VaccineCard
                  vaccine={vaccine}
                  handleDelete={handleDelete}
                  isAdmin={isAdmin}
                  handleEdit={openVaccine}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
