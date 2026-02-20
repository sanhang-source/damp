import { useRoutes } from 'react-router-dom'
import { routes } from './routes'

// 使用 useRoutes Hook 渲染路由配置
export const AppRoutes = () => {
  return useRoutes(routes)
}

// 导出路由配置，供其他用途使用
export { routes }

// 导出路由路径常量，方便在代码中引用
export const ROUTES = {
  HOME: '/main',
  LOGIN: '/login',
  
  // 数据接入
  DATA_ACCESS: {
    ORGANIZATION: '/main/data-access/organization',
    ORGANIZATION_ADD: '/main/data-access/organization/add',
    ORGANIZATION_EDIT: (id: string) => `/main/data-access/organization/edit/${id}`,
    ORGANIZATION_DETAIL: (id: string) => `/main/data-access/organization/detail/${id}`,
    CONTRACT: '/main/data-access/contract',
    CONTRACT_ADD: '/main/data-access/contract/add',
    CONTRACT_EDIT: (id: string) => `/main/data-access/contract/edit/${id}`,
    CONTRACT_DETAIL: (id: string) => `/main/data-access/contract/detail/${id}`,
    BILLING: '/main/data-access/billing',
    SETTLEMENT: '/main/data-access/settlement',
    SETTLEMENT_STATS: '/main/data-access/settlement-stats',
    BILL: '/main/data-access/bill',
    BILL_DETAIL: (id: string) => `/main/data-access/bill/detail/${id}`,
  },
  
  // 数据资源
  DATA_RESOURCE: {
    QUERY: '/main/data-resource/query',
    DATABASE: '/main/data-resource/database',
    DATABASE_ADD: '/main/data-resource/database/add',
    DATABASE_EDIT: (id: string) => `/main/data-resource/database/edit/${id}`,
    DATABASE_FIELDS: (id: string) => `/main/data-resource/database/fields/${id}`,
    INTERFACE: '/main/data-resource/interface',
    INTERFACE_ADD: '/main/data-resource/interface/add',
    INTERFACE_EDIT: (id: string) => `/main/data-resource/interface/edit/${id}`,
    INTERFACE_DETAIL: (id: string) => `/main/data-resource/interface/detail/${id}`,
    INTERFACE_FIELDS: (id: string) => `/main/data-resource/interface/fields/${id}`,
  },
  
  // 数据分级分类
  DATA_CLASSIFICATION: {
    LIST: '/main/data-classification/classification',
    ADD: '/main/data-classification/classification/add',
    EDIT: (id: string) => `/main/data-classification/classification/edit/${id}`,
  },
  
  // 数据资产
  DATA_ASSET: {
    CATALOG: '/main/data-asset/catalog',
    LINEAGE_MAP: '/main/data-asset/lineage-map',
    ADD: '/main/data-asset/add',
    EDIT: (id: string) => `/main/data-asset/edit/${id}`,
    FIELDS: (id: string) => `/main/data-asset/fields/${id}`,
  },
  
  // 数据质量
  DATA_QUALITY: {
    INTERFACE: '/main/data-quality/interface',
    TABLE: '/main/data-quality/table',
    INDICATOR: '/main/data-quality/indicator',
    ALERTS: '/main/data-quality/alerts',
  },
  
  // 系统管理
  SYSTEM: {
    USER: '/main/system/user',
    ROLE: '/main/system/role',
    DICT: '/main/system/dict',
    DICT_ITEMS: (id: string) => `/main/system/dict/items/${id}`,
  },
} as const
