import { Button, Checkbox, Typography } from "@mui/material";

import React, { useEffect, useState } from "react";

import "./Users.scss";

import Input from '../../Components/Input/Input'

import { KeyboardArrowLeft as KeyboardArrowLeftIcon, KeyboardArrowRight as KeyboardArrowRightIcon, DeleteOutline as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import EditModal from "../../Components/EditModal/EditModal";
import Loader from "../../Components/Loader/Loader";


type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isCheck?: boolean;
}

type StateType = {
  users: User[],
  dispUsers: User[],
  searchData: User[]
}

export default function Users() {

  const [selIndex, setSelIndex] = useState(1);
  const [selSlot, setSelSlot] = useState(1);

  const [isCall, setIsCall] = useState(false);

  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [searchText, setSearchText] = useState("");

  const [isChecked, setIsChecked] = useState<boolean[]>([])

  const [idArr, setIdArr] = useState<boolean[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [state, setState] = useState<StateType>({
    users: [],
    dispUsers: [],
    searchData: []
  });


  let arr;

  const lenPerPage = 10

  if (totalUsers > lenPerPage) {
    arr = new Array(Math.ceil(totalUsers / lenPerPage)).fill("");
  } else {
    arr = new Array(1).fill("");
  }


  useEffect(() => {
    const makeCall = async () => {
      setIsCall(true)
      const url = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`;

      try {
        const res = await fetch(url)
        const data = await res.json()

        if (res.status === 200) {
          setIsCall(false)
          setTotalUsers(data.length)
          setState((state: StateType) => ({
            ...state,
            users: data,
            dispUsers: data.slice(0, lenPerPage)
          }));
          const val = Math.ceil(data.length / lenPerPage)
          setIsChecked(new Array(val).fill(false))
        }
      } catch (error) {
        console.log({
          error,
        });
      }
    }
    makeCall();
  }, []);


  const handlePage = (val: string | number) => {
    let newAction: any
    let newUsers: User[] = []
    let search = searchText.length > 0
    if (val === "next" && selIndex < totalUsers / lenPerPage) {
      newAction = selIndex + 1
      setSelIndex(newAction);
      setSelSlot(selSlot + 1);
      newUsers = search ? state.searchData.slice(selIndex * lenPerPage, newAction * lenPerPage) : state.users.slice(selIndex * lenPerPage, newAction * lenPerPage)
    } else if (val === "back" && selIndex > 1) {
      newAction = selIndex - 1
      setSelIndex(newAction);
      setSelSlot(selSlot - 1);
      newUsers = search ? state.searchData.slice((selIndex - 2) * lenPerPage, newAction * lenPerPage) : state.users.slice((selIndex - 2) * lenPerPage, newAction * lenPerPage)
    } else if (typeof val === "number") {
      newAction = val
      setSelIndex(newAction);
      setSelSlot(val)
      newUsers = search ? state.searchData.slice((val - 1) * lenPerPage, newAction * lenPerPage) : state.users.slice((val - 1) * lenPerPage, newAction * lenPerPage)
    }


    if (newUsers.length > 0)
      setState((state: StateType) => ({
        ...state,
        dispUsers: newUsers
      }));

    let end = selSlot * lenPerPage

    if (end > totalUsers)
      end = totalUsers
  };

  function handleSearch(val: string, users?: User[]) {
    if ((selIndex > 1 || selSlot > 1) && !users) {
      setSelIndex(1);
      setSelSlot(1);
    }
    setSearchText(val)
    const arr = users && users?.length > 0 ? users : state.users
    const searchArr = arr.filter((user: any) => {
      const { length } = Object.keys(user)
      let found = false
      Object.keys(user).forEach((key: any, index: number) => {
        if (typeof user[key] === "string" && user[key].toLowerCase().includes(val.toLowerCase())) {
          found = true
          return
        }
        if (length - 1 === index)
          return
      })
      return found
    })
    setTotalUsers(searchArr.length)
    setState((state: StateType) => ({
      ...state,
      searchData: searchArr,
      dispUsers: searchArr.slice(0, lenPerPage)
    }));
  }

  function handleDelete(uId?: string) {
    const search = searchText.length > 0
    if (uId) {
      let res = state.searchData.filter((user: User) => user.id !== uId)
      let res1 = state.users.filter((user: User) => user.id !== uId)
      if (search) {
        setTotalUsers(res.length)
        if (selSlot > Math.ceil(res.length / lenPerPage)) {
          setSelIndex(selIndex - 1);
          setSelSlot(selSlot - 1)
          setState((state: StateType) => ({
            ...state,
            searchData: res,
            users: res1,
            dispUsers: res.slice((selSlot - 2) * lenPerPage, (selSlot - 1) * lenPerPage)
          }));
        } else {
          setState((state: StateType) => ({
            ...state,
            searchData: res,
            users: res1,
            dispUsers: res.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
          }));
        }
      } else {
        setTotalUsers(res1.length)
        if (selSlot > Math.ceil(res1.length / lenPerPage)) {
          setSelIndex(selIndex - 1);
          setSelSlot(selSlot - 1)
          setState((state: StateType) => ({
            ...state,
            users: res1,
            dispUsers: res1.slice((selSlot - 2) * lenPerPage, (selSlot - 1) * lenPerPage)
          }));
        } else {
          setState((state: StateType) => ({
            ...state,
            users: res1,
            dispUsers: res1.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
          }));
        }
      }
    } else {
      const newArr = state.users.filter((user: User) => !user.isCheck)
      setState((state: StateType) => ({
        ...state,
        users: newArr,
      }));
      if (search) {
        const newUsers = state.searchData.filter((user: User) => !user.isCheck)
        const val = Math.ceil(newUsers.length / lenPerPage)
        setIsChecked(new Array(val).fill(false))
        setTotalUsers(newUsers.length)
        if (selSlot > Math.ceil(newUsers.length / lenPerPage)) {
          setSelIndex(selIndex - 1);
          setSelSlot(selSlot - 1)
          setState((state: StateType) => ({
            ...state,
            dispUsers: newUsers.slice((selSlot - 2) * lenPerPage, (selSlot - 1) * lenPerPage)
          }));
        } else {
          setState((state: StateType) => ({
            ...state,
            dispUsers: newUsers.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
          }));
        }
        setState((state: StateType) => ({
          ...state,
          searchData: newUsers
        }));
        // handleSearch(searchText, newArr)
      } else {
        const val = Math.ceil(newArr.length / lenPerPage)
        setIsChecked(new Array(val).fill(false))
        // setSelIndex(1);
        // setSelSlot(1)
        setTotalUsers(newArr.length)
        if (selSlot > Math.ceil(newArr.length / lenPerPage)) {
          setSelIndex(selIndex - 1);
          setSelSlot(selSlot - 1)
          setState((state: StateType) => ({
            ...state,
            dispUsers: newArr.slice((selSlot - 2) * lenPerPage, (selSlot - 1) * lenPerPage)
          }));
        } else {
          setState((state: StateType) => ({
            ...state,
            dispUsers: newArr.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
          }));
        }
      }
    }
  }

  function handleCheck(uId?: string) {
    let select = searchText.length > 0
    if (uId) {
      const newArr = state.users.map((user: User, index: number) => user.id === uId ? ({ ...user, isCheck: !state.users[index].isCheck }) : user)
      if (select) {
        const newArr1 = state.searchData.map((user: User, index: number) => user.id === uId ? ({ ...user, isCheck: !state.searchData[index].isCheck }) : user)
        const newDispUsers = newArr1.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
        setState((state: StateType) => ({
          ...state,
          users: newArr,
          searchData: newArr1,
          dispUsers: newDispUsers
        }));
      } else {
        const newDispUsers = newArr.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
        setState((state: StateType) => ({
          ...state,
          users: newArr,
          dispUsers: newDispUsers
        }));
      }
    } else {
      const checkedArr = isChecked
      checkedArr[selSlot - 1] = !checkedArr[selSlot - 1]
      setIsChecked(checkedArr)


      const arr: User[] = state.dispUsers
      let newArr: any[] = idArr
      arr.forEach((user: User) => {
        const ind = newArr.indexOf(user.id)
        if (ind === -1)
          newArr.push(user.id)
        else {
          newArr.splice(ind, 1)
        }
      })
      setIdArr(newArr)
      const newDispUsers: User[] = arr.map((user: User) => ({ ...user, isCheck: !!isChecked[selSlot - 1] }))
      const idObj: any = newArr.reduce((prev, value) => {
        return { ...prev, [value]: true };
      }, {});

      const newUsers = state.users.map((user: User) => ({ ...user, isCheck: !!idObj[parseInt(user.id)] }))
      if (select) {
        const newSearchData = state.searchData.map((user: User) => ({ ...user, isCheck: !!idObj[parseInt(user.id)] }))

        setState((state: StateType) => ({
          ...state,
          dispUsers: newDispUsers,
          users: newUsers,
          searchData: newSearchData
        }));
      } else {
        setState((state: StateType) => ({
          ...state,
          dispUsers: newDispUsers,
          users: newUsers,
        }));
      }
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user)
  }

  function closeAction() {
    setSelectedUser(null);
  }

  function onSubmit(detail: any) {
    if (selectedUser) {
      let search = searchText.length > 0
      const { name, email, role } = detail
      console.log({ detail })
      const arr = state.users.map((user: User) => {
        if (user.id === selectedUser.id) {
          return { ...user, name, email, role }
        } else return user
      })
      if (search) {
        handleSearch(searchText, arr)
        setState((state: StateType) => ({
          ...state,
          users: arr,
        }));
      } else {
        const newDispUsers = arr.slice((selSlot - 1) * lenPerPage, selSlot * lenPerPage)
        setState((state: StateType) => ({
          ...state,
          users: arr,
          dispUsers: newDispUsers
        }));
      }
    }
  }

  return (
    <div className="admin-wrapper">
      <Loader {...{ isCall }} />
      <EditModal open={selectedUser !== null} {...{ selectedUser, closeAction, onSubmit }} />
      <div className="admin-users-box">
        <Typography className="users-header">
          Users
        </Typography>
        <div className="user-search-container">
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <table className="user-table">
          <tr>
            <th>
              <Checkbox checked={!!isChecked[selSlot - 1]} onClick={() => handleCheck("")} />
            </th>
            <th>
              <Typography className="table-head-text" variant="body1">
                Name
              </Typography>
            </th>
            <th>
              <Typography className="table-head-text" variant="body1">
                Email
              </Typography>
            </th>
            <th>
              <Typography className="table-head-text" variant="body1">
                Role
              </Typography>
            </th>
            <th>
              <Typography className="table-head-text" variant="body1">
                Actions
              </Typography>
            </th>
          </tr>
          {state.dispUsers.map((data: User) => {
            const { name, id, email, role } = data
            return (
              <tr key={id} style={{ background: data.isCheck ? "#d6d6d6" : "none" }}>
                <td>
                  <Checkbox checked={!!data.isCheck} id={id} onClick={() => handleCheck(id)} />
                </td>
                <td>
                  <Typography className="table-data-text" variant="body1">
                    {name}
                  </Typography>
                </td>
                <td>
                  <Typography className="table-data-text" variant="body1">
                    {email}
                  </Typography>
                </td>
                <td>
                  <Typography className="table-data-text" variant="body1">
                    {role}
                  </Typography>
                </td>
                <td>
                  <div
                    className="icons-wrapper"
                  >
                    <EditIcon className="edit-icon" onClick={() => handleEdit(data)} />
                    <DeleteIcon className="delete-icon" onClick={() => handleDelete(id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
        <div className="users-pagination-data-container">
          <Button className="sel-delete-btn" onClick={() => handleDelete()}>
            <Typography className="sel-delete-btn-text">Delete Selected</Typography>
          </Button>
          <div className="bottom-container-right">
            <Typography className="users-pagination-text">
              Showing {(selSlot - 1) * lenPerPage + 1} to{" "}
              {selSlot * lenPerPage > totalUsers ? totalUsers : selSlot * lenPerPage} of {totalUsers} entries
            </Typography>
            <div className="users-pagination-container">
              <div className="users-pagination">
                <KeyboardArrowLeftIcon
                  className="users-pagination-icon"
                  onClick={() => handlePage("back")}
                />
              </div>
              {arr.map((_, index) => {
                return (
                  <div className="users-pagination">
                    <Typography
                      className={
                        selIndex === index + 1
                          ? "users-pagination-content selected"
                          : "users-pagination-content"
                      }
                      onClick={() => handlePage(index + 1)}
                    >
                      {index + 1}
                    </Typography>
                  </div>
                );
              })}
              <div className="users-pagination">
                <KeyboardArrowRightIcon
                  className="users-pagination-icon"
                  onClick={() => handlePage("next")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
