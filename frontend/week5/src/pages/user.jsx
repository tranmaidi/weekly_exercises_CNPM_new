import { Button, notification, Table } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserApi();
      if (!res?.message) {
        setDataSource(res)
      } else {
        notification.error({
          message: "Unauthorized",
          description: res.message
        })
      }
    }
    fetchUser();
  }, [])

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    }
  ]

  return (
    <div style={{ padding: 30 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to={'/products'}><Button>Quản lý Sản phẩm</Button></Link>
      </div>
      <Table
        bordered
        dataSource={dataSource} columns={columns}
        rowKey={"_id"}
      />
    </div>
  )
}

export default UserPage;
