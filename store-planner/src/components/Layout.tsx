import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, DatabaseOutlined, TagsOutlined, AppstoreOutlined, PartitionOutlined, BarsOutlined, TableOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Головна</Link>,
    },
    {
      key: '/warehouses',
      icon: <DatabaseOutlined />,
      label: <Link to="/warehouses">Склади</Link>,
    },
    {
      key: '/sections',
      icon: <PartitionOutlined />,
      label: <Link to="/sections">Секції</Link>,
    },
    {
      key: '/products',
      icon: <TagsOutlined />,
      label: <Link to="/products">Товари</Link>,
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Категорії</Link>,
    },
    {
      key: '/racks',
      icon: <BarsOutlined />,
      label: <Link to="/racks">Стелажі</Link>,
    },
    {
      key: '/shelves',
      icon: <TableOutlined />,
      label: <Link to="/shelves">Полиці</Link>,
    },
    {
      key: '/cells',
      icon: <AppstoreAddOutlined />,
      label: <Link to="/cells">Комірки</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
          Система управління складом
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 