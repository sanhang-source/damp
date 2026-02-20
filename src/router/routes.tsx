import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

import Login from '../pages/Login'
import Layout from '../components/Layout'
import NotFound from '../pages/NotFound'

// 数据接入模块 - 懒加载
const OrganizationList = lazy(() => import('../pages/data-access/OrganizationList'))
const OrganizationAdd = lazy(() => import('../pages/data-access/OrganizationAdd'))
const OrganizationEdit = lazy(() => import('../pages/data-access/OrganizationEdit'))
const OrganizationDetail = lazy(() => import('../pages/data-access/OrganizationDetail'))
const ContractList = lazy(() => import('../pages/data-access/ContractList'))
const ContractAdd = lazy(() => import('../pages/data-access/ContractAdd'))
const ContractEdit = lazy(() => import('../pages/data-access/ContractEdit'))
const ContractDetail = lazy(() => import('../pages/data-access/ContractDetail'))
const BillingManagement = lazy(() => import('../pages/data-access/BillingManagement'))
const Settlement = lazy(() => import('../pages/data-access/Settlement'))
const SettlementStats = lazy(() => import('../pages/data-access/SettlementStats'))
const BillList = lazy(() => import('../pages/data-access/BillList'))
const BillDetail = lazy(() => import('../pages/data-access/BillDetail'))

// 数据资源模块 - 懒加载
const DataResourceQuery = lazy(() => import('../pages/data-resource/DataResourceQuery'))
const DatabaseTableList = lazy(() => import('../pages/data-resource/DatabaseTableList'))
const DatabaseTableAdd = lazy(() => import('../pages/data-resource/DatabaseTableAdd'))
const DatabaseTableEdit = lazy(() => import('../pages/data-resource/DatabaseTableEdit'))
const FieldManagement = lazy(() => import('../pages/data-resource/FieldManagement'))
const InterfaceList = lazy(() => import('../pages/data-resource/InterfaceList'))
const InterfaceAdd = lazy(() => import('../pages/data-resource/InterfaceAdd'))
const InterfaceEdit = lazy(() => import('../pages/data-resource/InterfaceEdit'))
const InterfaceDetail = lazy(() => import('../pages/data-resource/InterfaceDetail'))
const InterfaceFieldManagement = lazy(() => import('../pages/data-resource/InterfaceFieldManagement'))

// 数据分级分类模块 - 懒加载
const ClassificationList = lazy(() => import('../pages/data-classification/ClassificationList'))
const ClassificationAdd = lazy(() => import('../pages/data-classification/ClassificationAdd'))
const ClassificationEdit = lazy(() => import('../pages/data-classification/ClassificationEdit'))

// 系统管理模块 - 懒加载
const UserList = lazy(() => import('../pages/system/UserList'))
const RoleList = lazy(() => import('../pages/system/RoleList'))
const DictList = lazy(() => import('../pages/system/DictList'))
const DictItemList = lazy(() => import('../pages/system/DictItemList'))

// 数据资产模块 - 懒加载
const AssetCatalog = lazy(() => import('../pages/data-asset/AssetCatalog'))
const AssetLineageMap = lazy(() => import('../pages/data-asset/AssetLineageMap'))
const AssetAdd = lazy(() => import('../pages/data-asset/AssetAdd'))
const AssetEdit = lazy(() => import('../pages/data-asset/AssetEdit'))
const AssetFieldManagement = lazy(() => import('../pages/data-asset/AssetFieldManagement'))

// 数据质量模块 - 懒加载
const InterfaceQuality = lazy(() => import('../pages/data-quality/InterfaceQuality'))
const TableUpdateMonitor = lazy(() => import('../pages/data-quality/TableUpdateMonitor'))
const IndicatorQuality = lazy(() => import('../pages/data-quality/IndicatorQuality'))
const AlertMessageCenter = lazy(() => import('../pages/data-quality/AlertMessageCenter'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/main',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/main/data-access/organization" replace />,
      },
      // 数据接入模块
      {
        path: 'data-access',
        children: [
          { path: 'organization', element: <OrganizationList /> },
          { path: 'organization/add', element: <OrganizationAdd /> },
          { path: 'organization/edit/:id', element: <OrganizationEdit /> },
          { path: 'organization/detail/:id', element: <OrganizationDetail /> },
          { path: 'contract', element: <ContractList /> },
          { path: 'contract/add', element: <ContractAdd /> },
          { path: 'contract/edit/:id', element: <ContractEdit /> },
          { path: 'contract/detail/:id', element: <ContractDetail /> },
          { path: 'billing', element: <BillingManagement /> },
          { path: 'settlement', element: <Settlement /> },
          { path: 'settlement-stats', element: <SettlementStats /> },
          { path: 'bill', element: <BillList /> },
          { path: 'bill/detail/:id', element: <BillDetail /> },
        ],
      },
      // 数据资源模块
      {
        path: 'data-resource',
        children: [
          { path: 'query', element: <DataResourceQuery /> },
          { path: 'database', element: <DatabaseTableList /> },
          { path: 'database/add', element: <DatabaseTableAdd /> },
          { path: 'database/edit/:id', element: <DatabaseTableEdit /> },
          { path: 'database/fields/:id', element: <FieldManagement /> },
          { path: 'interface', element: <InterfaceList /> },
          { path: 'interface/add', element: <InterfaceAdd /> },
          { path: 'interface/edit/:id', element: <InterfaceEdit /> },
          { path: 'interface/detail/:id', element: <InterfaceDetail /> },
          { path: 'interface/fields/:id', element: <InterfaceFieldManagement /> },
        ],
      },
      // 数据分级分类模块
      {
        path: 'data-classification',
        children: [
          { path: 'classification', element: <ClassificationList /> },
          { path: 'classification/add', element: <ClassificationAdd /> },
          { path: 'classification/edit/:id', element: <ClassificationEdit /> },
        ],
      },
      // 数据资产模块
      {
        path: 'data-asset',
        children: [
          { path: 'catalog', element: <AssetCatalog /> },
          { path: 'lineage-map', element: <AssetLineageMap /> },
          { path: 'add', element: <AssetAdd /> },
          { path: 'edit/:id', element: <AssetEdit /> },
          { path: 'fields/:id', element: <AssetFieldManagement /> },
        ],
      },
      // 数据质量模块
      {
        path: 'data-quality',
        children: [
          { path: 'interface', element: <InterfaceQuality /> },
          { path: 'table', element: <TableUpdateMonitor /> },
          { path: 'indicator', element: <IndicatorQuality /> },
          { path: 'alerts', element: <AlertMessageCenter /> },
        ],
      },
      // 系统管理模块
      {
        path: 'system',
        children: [
          { path: 'user', element: <UserList /> },
          { path: 'role', element: <RoleList /> },
          { path: 'dict', element: <DictList /> },
          { path: 'dict/items/:id', element: <DictItemList /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]
