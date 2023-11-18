import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import sidebar_menu from "../../constants/sidebar-menu";
import SideBar from "../../components/Sidebar/Sidebar";
import "../styles.css";
import { deleteUsers, getUsers, userSelectors,sortByRole } from "../../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

import Loading from "../../helpers/Loading/Loading";
import empty from "../../assets/images/empty.png";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
const CustomerList = () => {
  const dispatch = useDispatch();
  const users = useSelector(userSelectors.selectAll);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false);
  const [userId, setUserId] = useState(0)
  const toggleModalAdd = () => setModalAdd(!modalAdd);
  const toggleModalEdit = () => setModalEdit(!modalEdit);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

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
        Swal.fire("Deleted!", "User has been deleted.", "success");
        dispatch(deleteUsers(id));
      }
    });
  };
  const update = (id) => {
    setUserId(id);
    toggleModalEdit();
  };
  const adminRole = users.filter((user) => user.role === "user");
  return (
    <>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />
        <div className="dashboard-body">
          <div className="dashboard-content">
            <DashboardHeader />

            <div className="dashboard-content-container">
              <div className="dashboard-content-header">
                <h2>User List</h2>
                <button className="rows-btn" type="button" onClick={toggleModalAdd}>
                  Add Admin
                </button>
              </div>
              <p>Role : </p>
              <div className="user-role">
                <Link to={"/adminList"}>
                <button className="user-btn">Admin</button>
                </Link>
                <Link to={"/user"}>
                <button className="user-btn">All User</button>
                </Link>
              </div>
              {status === "loading" ? (
                <div className="loading-animate">
                  <Loading></Loading>
                </div>
              ) : status === "rejected" ? (
                <p>{error}</p>
              ) : users.length !== 0 ? (
                <table>
                  <thead>
                  <th>No.</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>IMAGE</th>
                    <th>ROLE</th>
                    <th>ADDRESS</th>
                    <th>GENDER</th>
                    <th>BIRTHDAY</th>
                    <th>PHONE</th>
                    <th>ACTION</th>
                  </thead>

                  <tbody>
                    {adminRole.map((admin, index) => (
                      <tr key={admin.id}>
                           <td>
                          <span>{index + 1}</span>
                        </td>
                        <td>
                          <span>{admin.name}</span>
                        </td>
                        <td>
                          <span>{admin.email}</span>
                        </td>
                        <td>
                        <span>
                            <img
                             src={`https://storage.cloud.google.com/${admin.image}`}
                              style={{ width: "100px", height: "100px" }}
                              alt="Brand"
                            ></img>
                           
                          </span>
                        </td>
                        <td>
                          <span>{admin.role}</span>
                        </td>
                        <td>
                          <span>{admin.address}</span>
                        </td>
                        <td>
                        <span>{admin.gender === null ? "-" : admin.gender === 'man' ? 'Male': 'Female'}</span>
                        </td>
                        <td>
                          <span>{admin.birthday ? admin.birthday.slice(0, 10) : ""}</span>
                        </td>
                        <td>
                          <span>{admin.phone_number}</span>
                        </td>
                        <td>
                          <div>
                            <button
                            onClick={() => deletes(admin.id)}
                            className="action-btn-delete"
                          >
                            Delete
                          </button>
                          <button className="action-btn-update" 
                              onClick={() => update(admin.id)}>
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
      {modalAdd && <AddUser toggleModalAdd={toggleModalAdd}/>}
      {modalEdit && <UpdateUser toggleModalEdit={toggleModalEdit} userId={userId}/>}
    </>
  );
};

export default CustomerList;