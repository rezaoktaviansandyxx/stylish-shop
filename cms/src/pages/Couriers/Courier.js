import React, { useEffect, useState } from "react";
import sidebar_menu from "../../constants/sidebar-menu";
import SideBar from "../../components/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCourier,
  getCouriers,
  selectAllCouriers,
} from "../../redux/courierSlice";
import DashboardHeader from "../../components/DashboardHeader";
import empty from "../../assets/images/empty.png";
import CourierModalAdd from "./CourierModalAdd";
import Swal from "sweetalert2";
import CourierModalEdit from "./CourierModalEdit";

const Courier = () => {
  const couriers = useSelector(selectAllCouriers);
  const { error, loading } = useSelector((state) => state.couriers);
  const dispatch = useDispatch();

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [courierId, setCourierId] = useState(0);

  useEffect(() => {
    dispatch(getCouriers());
  }, [dispatch]);

  const toggleModalAdd = () => setModalAdd(!modalAdd);
  const toggleModalEdit = () => setModalEdit(!modalEdit);

  const deletes = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCourier(id))
          .unwrap()
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err.message,
              footer: err.stack,
            });
          });
      }
    });
  };

  const update = (id) => {
    setCourierId(id);
    toggleModalEdit();
  };

  return (
    <>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />
        <div className="dashboard-body">
          <div className="dashboard-content">
            <DashboardHeader />
            <div className="dashboard-content-container">
              <div className="dashboard-content-header">
                <h2>Courier List</h2>
                <button className="rows-btn" onClick={toggleModalAdd}>
                  Add Courier
                </button>
              </div>
              {loading ? (
                <div className="loading-animate">
                  <div className="empty">
                    <img src={empty} alt="" />
                    <h1>Loading...</h1>
                  </div>
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : couriers && couriers.length !== 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>IMAGE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couriers.map((e, index) => (
                      <tr key={e.id}>
                        <td>
                          <span>{index + 1}</span>
                        </td>
                        <td>
                          <span>{e.name}</span>
                        </td>
                        <td>
                          <span>Rp. {e.price}</span>
                        </td>
                        <td>
                          <span>
                            <img
                              src={`http://localhost:3000/uploads/${e.image}`}
                              style={{ width: "200px", height: "200px" }}
                              alt="courier"
                            ></img>
                          </span>
                        </td>
                        <td>
                          <div>
                            <button
                              onClick={() => deletes(e.id)}
                              className="action-btn-delete"
                            >
                              Delete
                            </button>
                            <button
                              className="action-btn-update"
                              onClick={() => update(e.id)}
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty">
                  <img src={empty} alt="" />
                  <h1>The table is empty! Try adding some!</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalAdd && <CourierModalAdd toggleModalAdd={toggleModalAdd} />}
      {modalEdit && (
        <CourierModalEdit
          toggleModalEdit={toggleModalEdit}
          courierId={courierId}
        />
      )}
    </>
  );
};

export default Courier;
