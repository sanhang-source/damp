import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './pages/Login'
import Layout from './components/Layout'

// 数据接入模块
import OrganizationList from './pages/data-access/OrganizationList'
import OrganizationAdd from './pages/data-access/OrganizationAdd'
import OrganizationEdit from './pages/data-access/OrganizationEdit'
import OrganizationDetail from './pages/data-access/OrganizationDetail'
import ContractList from './pages/data-access/ContractList'
import ContractAdd from './pages/data-access/ContractAdd'
import ContractEdit from './pages/data-access/ContractEdit'
import ContractDetail from './pages/data-access/ContractDetail'
import BillingManagement from './pages/data-access/BillingManagement'
import Settlement from './pages/data-access/Settlement'
import SettlementStats from './pages/data-access/SettlementStats'
import BillList from './pages/data-access/BillList'
import BillDetail from './pages/data-access/BillDetail'

// 数据资源模块
import DataResourceQuery from './pages/data-resource/DataResourceQuery'
import DatabaseTableList from './pages/data-resource/DatabaseTableList'
import DatabaseTableAdd from './pages/data-resource/DatabaseTableAdd'
import DatabaseTableEdit from './pages/data-resource/DatabaseTableEdit'
import FieldManagement from './pages/data-resource/FieldManagement'
import InterfaceList from './pages/data-resource/InterfaceList'
import InterfaceAdd from './pages/data-resource/InterfaceAdd'
import InterfaceEdit from './pages/data-resource/InterfaceEdit'
import InterfaceDetail from './pages/data-resource/InterfaceDetail'
import InterfaceFieldManagement from './pages/data-resource/InterfaceFieldManagement'

// 数据分级分类模块
import ClassificationList from './pages/data-classification/ClassificationList'
import ClassificationAdd from './pages/data-classification/ClassificationAdd'
import ClassificationEdit from './pages/data-classification/ClassificationEdit'

// 系统管理模块
import UserList from './pages/system/UserList'
import RoleList from './pages/system/RoleList'
import DictList from './pages/system/DictList'
import DictItemList from './pages/system/DictItemList'

// 数据资产模块
import AssetCatalog from './pages/data-asset/AssetCatalog'
import AssetLineageMap from './pages/data-asset/AssetLineageMap'
import AssetAdd from './pages/data-asset/AssetAdd'
import AssetEdit from './pages/data-asset/AssetEdit'
import AssetFieldManagement from './pages/data-asset/AssetFieldManagement'

// 数据质量模块
import InterfaceQuality from './pages/data-quality/InterfaceQuality'
import TableUpdateMonitor from './pages/data-quality/TableUpdateMonitor'
import IndicatorQuality from './pages/data-quality/IndicatorQuality'
import NotFound from './pages/NotFound'

// GitHub Pages 重定向处理组件
function RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 检查sessionStorage中是否有重定向信息
    const redirectData = sessionStorage.getItem('redirect')
    if (redirectData) {
      const { path, query, hash } = JSON.parse(redirectData)
      sessionStorage.removeItem('redirect')
      // 构建完整路径并导航
      const fullPath = path + (query ? '?' + query : '') + (hash ? '#' + hash : '')
      if (fullPath !== location.pathname) {
        navigate(fullPath, { replace: true })
      }
    }
  }, [navigate, location])

  return null
}

function App() {
  // 获取基础路径（GitHub Pages子路径部署）
  const basename = import.meta.env.BASE_URL || '/'

  return (
    <BrowserRouter basename={basename}>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Layout />}>
          <Route index element={<Navigate to="/main/data-access/organization" replace />} />

          {/* 数据接入模块 */}
          <Route path="data-access">
            <Route path="organization" element={<OrganizationList />} />
            <Route path="organization/add" element={<OrganizationAdd />} />
            <Route path="organization/edit/:id" element={<OrganizationEdit />} />
            <Route path="organization/detail/:id" element={<OrganizationDetail />} />
            <Route path="contract" element={<ContractList />} />
            <Route path="contract/add" element={<ContractAdd />} />
            <Route path="contract/edit/:id" element={<ContractEdit />} />
            <Route path="contract/detail/:id" element={<ContractDetail />} />
            <Route path="billing" element={<BillingManagement />} />
            <Route path="settlement" element={<Settlement />} />
            <Route path="settlement-stats" element={<SettlementStats />} />
            <Route path="bill" element={<BillList />} />
            <Route path="bill/detail/:id" element={<BillDetail />} />
          </Route>

          {/* 数据资源模块 */}
          <Route path="data-resource">
            <Route path="query" element={<DataResourceQuery />} />
            <Route path="database" element={<DatabaseTableList />} />
            <Route path="database/add" element={<DatabaseTableAdd />} />
            <Route path="database/edit/:id" element={<DatabaseTableEdit />} />
            <Route path="database/fields/:id" element={<FieldManagement />} />
            <Route path="interface" element={<InterfaceList />} />
            <Route path="interface/add" element={<InterfaceAdd />} />
            <Route path="interface/edit/:id" element={<InterfaceEdit />} />
            <Route path="interface/detail/:id" element={<InterfaceDetail />} />
            <Route path="interface/fields/:id" element={<InterfaceFieldManagement />} />
          </Route>

          {/* 数据分级分类模块 */}
          <Route path="data-classification">
            <Route path="classification" element={<ClassificationList />} />
            <Route path="classification/add" element={<ClassificationAdd />} />
            <Route path="classification/edit/:id" element={<ClassificationEdit />} />
          </Route>

          {/* 数据资产模块 */}
          <Route path="data-asset">
            <Route path="catalog" element={<AssetCatalog />} />
            <Route path="lineage-map" element={<AssetLineageMap />} />
            <Route path="add" element={<AssetAdd />} />
            <Route path="edit/:id" element={<AssetEdit />} />
            <Route path="fields/:id" element={<AssetFieldManagement />} />
          </Route>

          {/* 数据质量模块 */}
          <Route path="data-quality">
            <Route path="interface" element={<InterfaceQuality />} />
            <Route path="table" element={<TableUpdateMonitor />} />
            <Route path="indicator" element={<IndicatorQuality />} />
          </Route>

          {/* 系统管理模块 */}
          <Route path="system">
            <Route path="user" element={<UserList />} />
            <Route path="role" element={<RoleList />} />
            <Route path="dict" element={<DictList />} />
            <Route path="dict/items/:id" element={<DictItemList />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
