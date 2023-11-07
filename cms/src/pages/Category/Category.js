import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { Link } from "react-router-dom";
import sidebar_menu from "../../constants/sidebar-menu";
import SideBar from "../../components/Sidebar/Sidebar";
import "../styles.css";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../helpers/Loading/Loading";
import empty from "../../assets/images/empty.png";
import {
  getCategories,
  selectAllCategory,
  deleteCategory,
} from "../../redux/categorySlice";
import CategoryModalAdd from "./CategoryModalAdd";
import CategoryModalEdit from "./CategoryModalEdit";

const Category = () => {
  const categories = useSelector(selectAllCategory);
  const { error, loading } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  const toggleModalAdd = () => setModalAdd(!modalAdd);
  const toggleModalEdit = () => setModalEdit(!modalEdit);

  useEffect(() => {
    dispatch(getCategories());
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
        dispatch(deleteCategory(id))
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
    setCategoryId(id);
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
                <h2>Categories List</h2>
                <button className="rows-btn" onClick={toggleModalAdd}>
                  Add Category
                </button>
              </div>
              {loading ? (
                <div className="loading-animate">
                  <Loading></Loading>
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : categories.length !== 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>NAME</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((e, index) => (
                      <tr key={e.id}>
                        <td>
                          <span>{index + 1}</span>
                        </td>
                        <td>
                          <span>{e.name}</span>
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
      {modalAdd && <CategoryModalAdd toggleModalAdd={toggleModalAdd} />}
      {modalEdit && (
        <CategoryModalEdit
          toggleModalEdit={toggleModalEdit}
          categoryId={categoryId}
        />
      )}
    </>
  );
};

export default Category;
