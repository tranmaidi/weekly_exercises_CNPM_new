import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, ShoppingOutlined, HeartOutlined, HistoryOutlined } from '@ant-design/icons';
import { Menu, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import React, { useContext, useState } from 'react';

const Header = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">>> check auth: ", auth)
  const items = [
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={"/products"}>Sản phẩm</Link>,
      key: 'products',
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to={"/favorites"}>Yêu thích</Link>,
      key: 'favorites',
      icon: <HeartOutlined />,
    },
    {
      label: <Link to={"/view-history"}>Đã xem</Link>,
      key: 'view-history',
      icon: <HistoryOutlined />,
    },

    {
      label: `Welcome ${auth?.user?.email ?? ""}`,
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated ? [
          {
            label: <Link to={"/admin/products"}>Quản lý sản phẩm</Link>,
            key: 'admin-products',
          },
          {
            label: <Link to={"/admin/user"}>Quản lý người dùng</Link>,
            key: 'admin-users',
          },
          {
            type: 'divider',
          },
          {
            label: <span onClick={() => {
              localStorage.clear("access_token");
              setAuth({
                isAuthenticated: false,
                user: {
                  email: "",
                  name: ""
                }
              })
              // Thông báo đăng xuất
              notification.info({
                message: "Đã đăng xuất",
                description: "Bạn đã đăng xuất thành công. Một số chức năng sẽ bị hạn chế."
              });
              navigate("/");
            }}>Đăng xuất</span>,
            key: 'logout',
          }
        ] : [
          {
            label: <Link to={"/login"}>Đăng nhập</Link>,
            key: 'login',
          }
        ]),
      ],
    },
  ];

  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}

export default Header;
