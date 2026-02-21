import React, { useState, useMemo } from 'react'
import { Card, Table, Tag, Row, Col, Button, Modal, Form, Input, InputNumber, Switch, message, Space, Badge, Empty, Select, Typography, Alert, DatePicker } from 'antd'
import { 
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  ApiOutlined,
  StopOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'


const { Option } = Select
const { Text } = Typography

// 影响产品信息
interface ImpactProduct {
  productId: string
  productName: string
  customerNames: string[] // 服务客户列表
}

// 数源机构信息
interface SourceOrg {
  orgId: string
  orgName: string
  orgShortName: string
  creditCode: string
  orgType: string
  contactName: string
  contactPhone: string
  contactEmail: string
  region: string
  detailAddress: string
  accessDate: string
  cooperationStatus: string
  remark: string
  managerName: string
  managerPhone: string
}

// 告警信息接口
interface AlertItem {
  id: string
  time: string
  interfaceId: string
  interfaceName: string
  sourceOrgId: string // 数源机构ID
  impactProducts: ImpactProduct[] // 影响产品列表
  type: 'queryRate' | 'responseTime' | 'errorRate'
  typeName: string
  level: 'warning' | 'error'
  message: string
  timeWindow: '10m' | '30m'  // 时间窗口
  value: number
  threshold: number
  status: 'pending' | 'processed'  // 处理状态
  processTime?: string  // 处理时间
  processRemark?: string  // 处理备注
}

// 监控规则配置
interface AlertRule {
  timeWindow: '10m' | '30m'
  queryRateThreshold: number      // 查得率阈值(%)
  responseTimeThreshold: number   // 响应时间阈值(ms)
  errorRateThreshold: number      // 报错率阈值(%)
}

interface InterfaceMonitorItem {
  id: string
  interfaceName: string
  interfaceId: string
  sourceOrgId: string  // 数据源机构ID
  impactProducts: ImpactProduct[]  // 服务产品列表
  // 10分钟窗口数据
  queryRate10m: number
  avgResponseTime10m: number
  errorRate10m: number
  totalCalls10m: number
  // 30分钟窗口数据
  queryRate30m: number
  avgResponseTime30m: number
  errorRate30m: number
  totalCalls30m: number
  // 月度统计数据
  queryRateMonth: number
  avgResponseTimeMonth: number
  errorRateMonth: number
  totalCallsMonth: number
  // 年度统计数据
  queryRateYear: number
  avgResponseTimeYear: number
  errorRateYear: number
  totalCallsYear: number
  // 状态
  status: 'normal' | 'warning' | 'error'
  // 预警配置
  alertEnabled: boolean
  alertPhones: string
  rules: AlertRule[]
}

const InterfaceQuality = () => {
  // 当前Tab：'realtime' | 'month' | 'year'
  const [activeTab, setActiveTab] = useState('realtime')
  
  // 数据状态（10条，增加数据源机构ID和服务产品列表）
  const [data, setData] = useState<InterfaceMonitorItem[]>([
    { id: '1', interfaceName: '企业信用查询', interfaceId: 'API001', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD001', productName: '企业风控查询服务', customerNames: ['中国工商银行股份有限公司深圳分行', '招商银行股份有限公司'] }, { productId: 'PRD002', productName: '企业信用评估服务', customerNames: ['中国银行股份有限公司', '中国建设银行股份有限公司'] }], queryRate10m: 99.8, avgResponseTime10m: 120, errorRate10m: 0.01, totalCalls10m: 1250, queryRate30m: 99.7, avgResponseTime30m: 125, errorRate30m: 0.02, totalCalls30m: 3750, queryRateMonth: 99.75, avgResponseTimeMonth: 123, errorRateMonth: 0.015, totalCallsMonth: 112500, queryRateYear: 99.72, avgResponseTimeYear: 128, errorRateYear: 0.018, totalCallsYear: 1350000, status: 'normal', alertEnabled: true, alertPhones: '13800138001', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '2', interfaceName: '行政处罚查询', interfaceId: 'API002', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD004', productName: '行政处罚查询服务', customerNames: ['中国建设银行股份有限公司', '中国银行股份有限公司'] }, { productId: 'PRD005', productName: '企业信用报告服务', customerNames: ['中国平安银行股份有限公司'] }, { productId: 'PRD006', productName: '司法诉讼查询服务', customerNames: ['中国民生银行股份有限公司'] }], queryRate10m: 95.5, avgResponseTime10m: 450, errorRate10m: 0.15, totalCalls10m: 890, queryRate30m: 96.2, avgResponseTime30m: 380, errorRate30m: 0.12, totalCalls30m: 2670, queryRateMonth: 95.8, avgResponseTimeMonth: 415, errorRateMonth: 0.135, totalCallsMonth: 80100, queryRateYear: 95.6, avgResponseTimeYear: 420, errorRateYear: 0.14, totalCallsYear: 961200, status: 'warning', alertEnabled: true, alertPhones: '13800138002', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '3', interfaceName: '社保信息查询', interfaceId: 'API003', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行', '招商银行股份有限公司'] }], queryRate10m: 85.2, avgResponseTime10m: 820, errorRate10m: 0.68, totalCalls10m: 560, queryRate30m: 88.5, avgResponseTime30m: 680, errorRate30m: 0.48, totalCalls30m: 1680, queryRateMonth: 86.8, avgResponseTimeMonth: 750, errorRateMonth: 0.58, totalCallsMonth: 50400, queryRateYear: 87.2, avgResponseTimeYear: 760, errorRateYear: 0.55, totalCallsYear: 604800, status: 'error', alertEnabled: true, alertPhones: '13800138003', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '4', interfaceName: '工商信息查询', interfaceId: 'API004', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD002', productName: '企业信用评估服务', customerNames: ['中国银行股份有限公司'] }], queryRate10m: 99.9, avgResponseTime10m: 150, errorRate10m: 0.01, totalCalls10m: 1520, queryRate30m: 99.8, avgResponseTime30m: 155, errorRate30m: 0.02, totalCalls30m: 4560, queryRateMonth: 99.85, avgResponseTimeMonth: 152, errorRateMonth: 0.015, totalCallsMonth: 136800, queryRateYear: 99.82, avgResponseTimeYear: 158, errorRateYear: 0.018, totalCallsYear: 1641600, status: 'normal', alertEnabled: false, alertPhones: '', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '5', interfaceName: '纳税信用查询', interfaceId: 'API005', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD008', productName: '纳税信用查询服务', customerNames: ['中国光大银行股份有限公司'] }], queryRate10m: 99.2, avgResponseTime10m: 200, errorRate10m: 0.03, totalCalls10m: 780, queryRate30m: 99.4, avgResponseTime30m: 195, errorRate30m: 0.03, totalCalls30m: 2340, queryRateMonth: 99.3, avgResponseTimeMonth: 197, errorRateMonth: 0.028, totalCallsMonth: 70200, queryRateYear: 99.28, avgResponseTimeYear: 202, errorRateYear: 0.032, totalCallsYear: 842400, status: 'normal', alertEnabled: true, alertPhones: '13800138005', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '6', interfaceName: '司法诉讼查询', interfaceId: 'API006', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD005', productName: '企业信用报告服务', customerNames: ['中国平安银行股份有限公司'] }, { productId: 'PRD009', productName: '司法诉讼查询服务', customerNames: ['中国农业银行股份有限公司', '交通银行股份有限公司'] }], queryRate10m: 97.5, avgResponseTime10m: 280, errorRate10m: 0.08, totalCalls10m: 650, queryRate30m: 98.1, avgResponseTime30m: 265, errorRate30m: 0.06, totalCalls30m: 1950, queryRateMonth: 97.8, avgResponseTimeMonth: 272, errorRateMonth: 0.07, totalCallsMonth: 58500, queryRateYear: 97.6, avgResponseTimeYear: 275, errorRateYear: 0.075, totalCallsYear: 702000, status: 'warning', alertEnabled: true, alertPhones: '13800138006', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '7', interfaceName: '知识产权查询', interfaceId: 'API007', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD006', productName: '知识产权查询服务', customerNames: ['中国民生银行股份有限公司'] }], queryRate10m: 99.5, avgResponseTime10m: 180, errorRate10m: 0.02, totalCalls10m: 920, queryRate30m: 99.6, avgResponseTime30m: 175, errorRate30m: 0.015, totalCalls30m: 2760, queryRateMonth: 99.55, avgResponseTimeMonth: 177, errorRateMonth: 0.018, totalCallsMonth: 82800, queryRateYear: 99.52, avgResponseTimeYear: 179, errorRateYear: 0.019, totalCallsYear: 993600, status: 'normal', alertEnabled: true, alertPhones: '13800138007', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '8', interfaceName: '招投标信息查询', interfaceId: 'API008', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD009', productName: '招投标信息查询服务', customerNames: ['中国农业银行股份有限公司'] }, { productId: 'PRD010', productName: '政府采购查询服务', customerNames: ['交通银行股份有限公司', '中国光大银行股份有限公司'] }], queryRate10m: 96.8, avgResponseTime10m: 350, errorRate10m: 0.11, totalCalls10m: 480, queryRate30m: 97.5, avgResponseTime30m: 320, errorRate30m: 0.09, totalCalls30m: 1440, queryRateMonth: 97.1, avgResponseTimeMonth: 335, errorRateMonth: 0.10, totalCallsMonth: 43200, queryRateYear: 96.9, avgResponseTimeYear: 342, errorRateYear: 0.105, totalCallsYear: 518400, status: 'warning', alertEnabled: true, alertPhones: '13800138008', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '9', interfaceName: '海关进出口查询', interfaceId: 'API009', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD010', productName: '海关进出口查询服务', customerNames: ['交通银行股份有限公司'] }], queryRate10m: 99.1, avgResponseTime10m: 220, errorRate10m: 0.04, totalCalls10m: 580, queryRate30m: 99.3, avgResponseTime30m: 215, errorRate30m: 0.035, totalCalls30m: 1740, queryRateMonth: 99.2, avgResponseTimeMonth: 217, errorRateMonth: 0.038, totalCallsMonth: 52200, queryRateYear: 99.15, avgResponseTimeYear: 219, errorRateYear: 0.039, totalCallsYear: 626400, status: 'normal', alertEnabled: true, alertPhones: '13800138009', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
    { id: '10', interfaceName: '环保处罚查询', interfaceId: 'API010', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD007', productName: '员工背景调查服务', customerNames: ['中国民生银行股份有限公司'] }, { productId: 'PRD004', productName: '行政处罚查询服务', customerNames: ['中国建设银行股份有限公司'] }], queryRate10m: 94.2, avgResponseTime10m: 520, errorRate10m: 0.22, totalCalls10m: 320, queryRate30m: 95.8, avgResponseTime30m: 480, errorRate30m: 0.18, totalCalls30m: 960, queryRateMonth: 95.0, avgResponseTimeMonth: 500, errorRateMonth: 0.20, totalCallsMonth: 28800, queryRateYear: 94.8, avgResponseTimeYear: 505, errorRateYear: 0.205, totalCallsYear: 345600, status: 'error', alertEnabled: true, alertPhones: '13800138010', rules: [{ timeWindow: '10m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }, { timeWindow: '30m', queryRateThreshold: 95, responseTimeThreshold: 500, errorRateThreshold: 1 }] },
  ])

  // 告警记录（10条，不分级别，增加数源机构ID和影响产品列表）
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [alertData, setAlertData] = useState<AlertItem[]>([
    { id: '1', time: '2024-02-01 14:32:15', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行', '招商银行股份有限公司'] }], type: 'queryRate', typeName: '查得率过低', level: 'error', message: '查得率85.2%，低于阈值95%', timeWindow: '10m', value: 85.2, threshold: 95, status: 'pending' },
    { id: '2', time: '2024-02-01 14:31:20', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行'] }], type: 'responseTime', typeName: '响应超时', level: 'error', message: '平均响应820ms，超过阈值500ms', timeWindow: '10m', value: 820, threshold: 500, status: 'pending' },
    { id: '3', time: '2024-02-01 14:30:45', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国建设银行股份有限公司'] }], type: 'errorRate', typeName: '报错率过高', level: 'error', message: '报错率1.68%，超过阈值1%', timeWindow: '10m', value: 1.68, threshold: 1, status: 'pending' },
    { id: '4', time: '2024-02-01 14:28:10', interfaceId: 'API002', interfaceName: '行政处罚查询', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD004', productName: '行政处罚查询服务', customerNames: ['中国建设银行股份有限公司', '中国银行股份有限公司'] }, { productId: 'PRD005', productName: '企业信用报告服务', customerNames: ['中国平安银行股份有限公司'] }], type: 'responseTime', typeName: '响应超时', level: 'error', message: '平均响应650ms，超过阈值500ms', timeWindow: '30m', value: 650, threshold: 500, status: 'pending' },
    { id: '5', time: '2024-02-01 14:25:33', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行'] }], type: 'queryRate', typeName: '查得率过低', level: 'error', message: '查得率88.5%，低于阈值95%', timeWindow: '30m', value: 88.5, threshold: 95, status: 'processed', processTime: '2024-02-01 14:35:00', processRemark: '已联系上游系统确认数据延迟' },
    { id: '6', time: '2024-02-01 14:22:18', interfaceId: 'API002', interfaceName: '行政处罚查询', sourceOrgId: 'DS-00002', impactProducts: [{ productId: 'PRD004', productName: '行政处罚查询服务', customerNames: ['中国建设银行股份有限公司', '交通银行股份有限公司', '中国农业银行股份有限公司'] }], type: 'errorRate', typeName: '报错率过高', level: 'error', message: '报错率1.12%，超过阈值1%', timeWindow: '30m', value: 1.12, threshold: 1, status: 'processed', processTime: '2024-02-01 14:30:00', processRemark: '网络抖动导致，已恢复正常' },
    { id: '7', time: '2024-02-01 14:20:45', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行'] }], type: 'errorRate', typeName: '报错率过高', level: 'error', message: '报错率1.48%，超过阈值1%', timeWindow: '30m', value: 1.48, threshold: 1, status: 'pending' },
    { id: '8', time: '2024-02-01 14:18:30', interfaceId: 'API003', interfaceName: '社保信息查询', sourceOrgId: 'DS-00003', impactProducts: [{ productId: 'PRD003', productName: '社保信息查询服务', customerNames: ['中国工商银行股份有限公司深圳分行', '招商银行股份有限公司', '中信银行股份有限公司'] }, { productId: 'PRD007', productName: '员工背景调查服务', customerNames: ['中国民生银行股份有限公司'] }], type: 'responseTime', typeName: '响应超时', level: 'error', message: '平均响应680ms，超过阈值500ms', timeWindow: '30m', value: 680, threshold: 500, status: 'pending' },
    { id: '9', time: '2024-02-01 14:15:22', interfaceId: 'API001', interfaceName: '企业信用查询', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD001', productName: '企业风控查询服务', customerNames: ['中国工商银行股份有限公司深圳分行', '招商银行股份有限公司', '中国建设银行股份有限公司'] }, { productId: 'PRD002', productName: '企业信用评估服务', customerNames: ['中国银行股份有限公司'] }], type: 'queryRate', typeName: '查得率过低', level: 'error', message: '查得率94.5%，低于阈值95%', timeWindow: '10m', value: 94.5, threshold: 95, status: 'processed', processTime: '2024-02-01 14:25:00', processRemark: '监控阈值调整，已忽略' },
    { id: '10', time: '2024-02-01 14:12:08', interfaceId: 'API005', interfaceName: '纳税信用查询', sourceOrgId: 'DS-00001', impactProducts: [{ productId: 'PRD008', productName: '纳税信用查询服务', customerNames: ['中国光大银行股份有限公司'] }], type: 'responseTime', typeName: '响应超时', level: 'error', message: '平均响应520ms，超过阈值500ms', timeWindow: '10m', value: 520, threshold: 500, status: 'pending' },
  ])

  // 弹窗状态
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)
  const [currentInterface, setCurrentInterface] = useState<InterfaceMonitorItem | null>(null)
  const [currentMetric, setCurrentMetric] = useState<{ type: 'queryRate' | 'responseTime' | 'errorRate', timeWindow: '10m' | '30m' } | null>(null)
  const [configForm] = Form.useForm()
  
  // 告警处理弹窗状态
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<AlertItem | null>(null)
  const [selectedAlerts, setSelectedAlerts] = useState<AlertItem[]>([])
  const [isBatchProcess, setIsBatchProcess] = useState(false)
  const [processForm] = Form.useForm()
  
  // 批量选择状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  
  // 数源机构详情弹窗状态
  const [isOrgModalVisible, setIsOrgModalVisible] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<SourceOrg | null>(null)
  
  // 影响产品列表弹窗状态
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<ImpactProduct[]>([])
  
  // 查询栏状态
  const [searchForm] = Form.useForm()
  const [filterInterfaceName, setFilterInterfaceName] = useState('')
  const [filterInterfaceId, setFilterInterfaceId] = useState('')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return data.filter(record => {
      if (filterInterfaceName && !record.interfaceName.includes(filterInterfaceName)) return false
      if (filterInterfaceId && !record.interfaceId.toLowerCase().includes(filterInterfaceId.toLowerCase())) return false
      return true
    })
  }, [data, filterInterfaceName, filterInterfaceId])

  // 处理查询
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setFilterInterfaceName(values.interfaceName || '')
    setFilterInterfaceId(values.interfaceId || '')
    message.success('查询成功')
  }

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields()
    setFilterInterfaceName('')
    setFilterInterfaceId('')
    message.success('重置成功')
  }

  // 实时表格列定义（增加数据源机构ID和服务产品ID）
  const realtimeColumns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '接口ID', dataIndex: 'interfaceId', width: 100 },
    { title: '接口名称', dataIndex: 'interfaceName', width: 140, ellipsis: true },
    { 
      title: '接口状态', 
      dataIndex: 'status',
      width: 90, 
      align: 'center' as const,
      render: (status: string) => (
        <Badge 
          status={status === 'normal' ? 'success' : 'error'} 
          text={status === 'normal' ? '正常' : '告警'}
        />
      )
    },
    { 
      title: '数据源机构ID', 
      dataIndex: 'sourceOrgId', 
      width: 130,
      render: (text: string) => (
        <Button type="link" size="small" onClick={() => handleViewSourceOrg(text)} style={{ padding: 0, textAlign: 'left' }}>
          BM00001-068
        </Button>
      )
    },
    { 
      title: '服务产品ID', 
      key: 'impactProducts',
      width: 180,
      render: (_: any, record: InterfaceMonitorItem) => {
        const formatProductId = (id: string) => {
          const num = id.replace(/\D/g, '')
          return `CR${num.padStart(4, '0')}`
        }
        return (
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewImpactProducts(record.impactProducts)}
            style={{ padding: 0, whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.5' }}
          >
            {record.impactProducts.map(p => formatProductId(p.productId)).join(', ')}
          </Button>
        )
      }
    },
    { title: '查得率(10分钟)', key: 'queryRate10m', width: 160, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => (
      <Space>
        <Tag color={record.queryRate10m >= 95 ? 'success' : 'error'}>
          {record.queryRate10m.toFixed(2)}%
        </Tag>
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'queryRate', '10m')}>
          <SettingOutlined />
        </Button>
      </Space>
    )},
    { title: '查得率(30分钟)', key: 'queryRate30m', width: 160, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => (
      <Space>
        <Tag color={record.queryRate30m >= 95 ? 'success' : 'error'}>
          {record.queryRate30m.toFixed(2)}%
        </Tag>
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'queryRate', '30m')}>
          <SettingOutlined />
        </Button>
      </Space>
    )},
    { title: '平均响应(10分钟)', key: 'avgResponseTime10m', width: 170, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => {
      const color = record.avgResponseTime10m <= 500 ? 'success' : 'error'
      return (
        <Space>
          <Tag color={color}>{record.avgResponseTime10m}ms</Tag>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'responseTime', '10m')}>
            <SettingOutlined />
          </Button>
        </Space>
      )
    }},
    { title: '平均响应(30分钟)', key: 'avgResponseTime30m', width: 170, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => {
      const color = record.avgResponseTime30m <= 500 ? 'success' : 'error'
      return (
        <Space>
          <Tag color={color}>{record.avgResponseTime30m}ms</Tag>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'responseTime', '30m')}>
            <SettingOutlined />
          </Button>
        </Space>
      )
    }},
    { title: '报错率(10分钟)', key: 'errorRate10m', width: 160, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => (
      <Space>
        <Tag color={record.errorRate10m < 0.01 ? 'success' : 'error'}>
          {(record.errorRate10m * 100).toFixed(2)}%
        </Tag>
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'errorRate', '10m')}>
          <SettingOutlined />
        </Button>
      </Space>
    )},
    { title: '报错率(30分钟)', key: 'errorRate30m', width: 160, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => (
      <Space>
        <Tag color={record.errorRate30m < 0.01 ? 'success' : 'error'}>
          {(record.errorRate30m * 100).toFixed(2)}%
        </Tag>
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => handleConfig(record, 'errorRate', '30m')}>
          <SettingOutlined />
        </Button>
      </Space>
    )},
    { title: '调用次数(10分钟)', key: 'totalCalls10m', width: 150, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => record.totalCalls10m.toLocaleString() },
    { title: '调用次数(30分钟)', key: 'totalCalls30m', width: 150, align: 'center' as const, render: (_: any, record: InterfaceMonitorItem) => record.totalCalls30m.toLocaleString() },
    { title: '预警状态', dataIndex: 'alertEnabled', width: 95, align: 'center' as const, render: (enabled: boolean) => (
      <Badge status={enabled ? 'processing' : 'default'} text={enabled ? '已开启' : '已关闭'} />
    )},
  ]

  // 月度统计表格列定义（增加数据源机构ID和服务产品ID）
  const monthColumns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '接口ID', dataIndex: 'interfaceId', width: 100 },
    { title: '接口名称', dataIndex: 'interfaceName', width: 140, ellipsis: true },
    { 
      title: '接口状态', 
      dataIndex: 'status',
      width: 90, 
      align: 'center' as const,
      render: (status: string) => (
        <Badge 
          status={status === 'normal' ? 'success' : 'error'} 
          text={status === 'normal' ? '正常' : '告警'}
        />
      )
    },
    { 
      title: '数据源机构ID', 
      dataIndex: 'sourceOrgId', 
      width: 130,
      render: (text: string) => (
        <Button type="link" size="small" onClick={() => handleViewSourceOrg(text)} style={{ padding: 0, textAlign: 'left' }}>
          BM00001-068
        </Button>
      )
    },
    { 
      title: '服务产品ID', 
      key: 'impactProducts',
      width: 180,
      render: (_: any, record: InterfaceMonitorItem) => {
        const formatProductId = (id: string) => {
          const num = id.replace(/\D/g, '')
          return `CR${num.padStart(4, '0')}`
        }
        return (
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewImpactProducts(record.impactProducts)}
            style={{ padding: 0, whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.5' }}
          >
            {record.impactProducts.map(p => formatProductId(p.productId)).join(', ')}
          </Button>
        )
      }
    },
    {
      title: '查得率',
      key: 'queryRate',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.queryRateMonth >= 95 ? 'success' : 'error'
        return <Tag color={color}>{record.queryRateMonth.toFixed(2)}%</Tag>
      }
    },
    {
      title: '平均响应',
      key: 'avgResponseTime',
      width: 130,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.avgResponseTimeMonth <= 500 ? 'success' : 'error'
        return <Tag color={color}>{record.avgResponseTimeMonth}ms</Tag>
      }
    },
    {
      title: '报错率',
      key: 'errorRate',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.errorRateMonth < 0.01 ? 'success' : 'error'
        return <Tag color={color}>{(record.errorRateMonth * 100).toFixed(2)}%</Tag>
      }
    },
    {
      title: '总调用次数',
      key: 'totalCalls',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => record.totalCallsMonth.toLocaleString()
    },
    { title: '统计月度', key: 'statMonth', width: 100, align: 'center' as const, render: () => '2024年2月' },
  ]

  // 年度统计表格列定义（增加数据源机构ID和服务产品ID）
  const yearColumns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '接口ID', dataIndex: 'interfaceId', width: 100 },
    { title: '接口名称', dataIndex: 'interfaceName', width: 140, ellipsis: true },
    { 
      title: '接口状态', 
      dataIndex: 'status',
      width: 90, 
      align: 'center' as const,
      render: (status: string) => (
        <Badge 
          status={status === 'normal' ? 'success' : 'error'} 
          text={status === 'normal' ? '正常' : '告警'}
        />
      )
    },
    { 
      title: '数据源机构ID', 
      dataIndex: 'sourceOrgId', 
      width: 130,
      render: (text: string) => (
        <Button type="link" size="small" onClick={() => handleViewSourceOrg(text)} style={{ padding: 0, textAlign: 'left' }}>
          BM00001-068
        </Button>
      )
    },
    { 
      title: '服务产品ID', 
      key: 'impactProducts',
      width: 180,
      render: (_: any, record: InterfaceMonitorItem) => {
        const formatProductId = (id: string) => {
          const num = id.replace(/\D/g, '')
          return `CR${num.padStart(4, '0')}`
        }
        return (
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewImpactProducts(record.impactProducts)}
            style={{ padding: 0, whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.5' }}
          >
            {record.impactProducts.map(p => formatProductId(p.productId)).join(', ')}
          </Button>
        )
      }
    },
    {
      title: '查得率',
      key: 'queryRate',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.queryRateYear >= 95 ? 'success' : 'error'
        return <Tag color={color}>{record.queryRateYear.toFixed(2)}%</Tag>
      }
    },
    {
      title: '平均响应',
      key: 'avgResponseTime',
      width: 130,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.avgResponseTimeYear <= 500 ? 'success' : 'error'
        return <Tag color={color}>{record.avgResponseTimeYear}ms</Tag>
      }
    },
    {
      title: '报错率',
      key: 'errorRate',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => {
        const color = record.errorRateYear < 0.01 ? 'success' : 'error'
        return <Tag color={color}>{(record.errorRateYear * 100).toFixed(2)}%</Tag>
      }
    },
    {
      title: '总调用次数',
      key: 'totalCalls',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: InterfaceMonitorItem) => record.totalCallsYear.toLocaleString()
    },
    { title: '统计年度', key: 'statYear', width: 100, align: 'center' as const, render: () => '2024年' },
  ]

  // 统计卡片数据
  const statsData = [
    { title: '接口总数', value: data.length, color: '#1890ff', icon: <ApiOutlined /> },
    { title: '正常接口', value: data.filter(item => item.status === 'normal').length, color: '#52c41a', icon: <CheckCircleOutlined /> },
    { title: '告警接口', value: data.filter(item => item.status === 'warning' || item.status === 'error').length, color: '#faad14', icon: <WarningOutlined /> },
    { title: '未处理告警', value: alertData.filter(item => item.status === 'pending').length, color: '#f5222d', icon: <StopOutlined /> },
  ]

  const handleConfig = (record: InterfaceMonitorItem, metricType: 'queryRate' | 'responseTime' | 'errorRate', timeWindow: '10m' | '30m') => {
    setCurrentInterface(record)
    setCurrentMetric({ type: metricType, timeWindow })
    
    const ruleIndex = timeWindow === '10m' ? 0 : 1
    const rule = record.rules[ruleIndex]
    
    // 根据指标类型设置对应的表单值
    const formValues: any = {
      alertEnabled: record.alertEnabled,
      alertPhones: record.alertPhones,
    }
    
    if (metricType === 'queryRate') {
      formValues.queryRateThreshold = rule?.queryRateThreshold || 95
    } else if (metricType === 'responseTime') {
      formValues.responseTimeThreshold = rule?.responseTimeThreshold || 500
    } else if (metricType === 'errorRate') {
      formValues.errorRateThreshold = rule?.errorRateThreshold || 1
    }
    
    configForm.setFieldsValue(formValues)
    setIsConfigModalVisible(true)
  }

  const handleConfigSubmit = () => {
    configForm.validateFields().then(values => {
      if (currentInterface && currentMetric) {
        const { type, timeWindow } = currentMetric
        const ruleIndex = timeWindow === '10m' ? 0 : 1
        
        setData(data.map(item => {
          if (item.id !== currentInterface.id) return item
          
          // 创建新的规则数组，复制原有规则
          const newRules = [...item.rules]
          
          // 只更新当前配置的指标阈值
          if (type === 'queryRate') {
            newRules[ruleIndex] = { ...newRules[ruleIndex], queryRateThreshold: values.queryRateThreshold }
          } else if (type === 'responseTime') {
            newRules[ruleIndex] = { ...newRules[ruleIndex], responseTimeThreshold: values.responseTimeThreshold }
          } else if (type === 'errorRate') {
            newRules[ruleIndex] = { ...newRules[ruleIndex], errorRateThreshold: values.errorRateThreshold }
          }
          
          return { 
            ...item, 
            alertEnabled: values.alertEnabled,
            alertPhones: values.alertPhones,
            rules: newRules
          }
        }))
        message.success('预警配置保存成功')
        setIsConfigModalVisible(false)
        setCurrentMetric(null)
      }
    })
  }

  // 告警查询状态
  const [alertSearchForm] = Form.useForm()
  const [filterAlertInterfaceId, setFilterAlertInterfaceId] = useState('')
  const [filterAlertInterface, setFilterAlertInterface] = useState('')
  const [filterAlertStatus, setFilterAlertStatus] = useState<'pending' | 'processed' | ''>('pending')
  
  // 告警分页状态
  const [alertPagination, setAlertPagination] = useState({ current: 1, pageSize: 5 })

  // 筛选后的告警数据
  const filteredAlertData = useMemo(() => {
    return alertData.filter(alert => {
      if (filterAlertInterfaceId && !alert.interfaceId.toLowerCase().includes(filterAlertInterfaceId.toLowerCase())) return false
      if (filterAlertInterface && !alert.interfaceName.includes(filterAlertInterface)) return false
      if (filterAlertStatus && alert.status !== filterAlertStatus) return false
      return true
    })
  }, [alertData, filterAlertInterfaceId, filterAlertInterface, filterAlertStatus])

  // 告警表格列定义
  const alertColumns = [
    { title: '告警时间', dataIndex: 'time', width: 160 },
    { title: '接口ID', dataIndex: 'interfaceId', width: 100 },
    { title: '接口名称', dataIndex: 'interfaceName', width: 130, ellipsis: true },
    { 
      title: '数据源机构ID', 
      dataIndex: 'sourceOrgId', 
      width: 130,
      render: (text: string) => (
        <Button type="link" size="small" onClick={() => handleViewSourceOrg(text)} style={{ padding: 0, textAlign: 'left' }}>
          BM00001-068
        </Button>
      )
    },
    { 
      title: '服务产品ID', 
      key: 'impactProducts',
      width: 180,
      render: (_: any, record: AlertItem) => {
        const formatProductId = (id: string) => {
          const num = id.replace(/\D/g, '')
          return `CR${num.padStart(4, '0')}`
        }
        return (
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewImpactProducts(record.impactProducts)}
            style={{ padding: 0 }}
          >
            {record.impactProducts.map(p => formatProductId(p.productId)).join(', ')}
          </Button>
        )
      }
    },
    { title: '告警类型', dataIndex: 'typeName', width: 110, render: (text: string) => (
      <Tag color="error">{text}</Tag>
    )},
    { title: '告警详情', dataIndex: 'message', width: 280, ellipsis: true, render: (text: string, record: AlertItem) => (
      <span>{record.timeWindow === '10m' ? '近10分钟' : '近30分钟'}，{text}</span>
    )},
    { title: '当前值', key: 'value', width: 90, align: 'center' as const, render: (_: any, record: AlertItem) => (
      <Text type="danger" strong>
        {record.type === 'responseTime' ? `${record.value}ms` : `${record.value}%`}
      </Text>
    )},
    { title: '阈值', key: 'threshold', width: 90, align: 'center' as const, render: (_: any, record: AlertItem) => (
      <Text type="secondary">
        {record.type === 'responseTime' ? `${record.threshold}ms` : `${record.threshold}%`}
      </Text>
    )},
    { title: '处理状态', dataIndex: 'status', width: 90, align: 'center' as const, render: (status: string) => (
      status === 'pending' ? (
        <Tag color="warning">待处理</Tag>
      ) : (
        <Tag color="success">已处理</Tag>
      )
    )},
    { title: '处理时间', dataIndex: 'processTime', width: 160, render: (text: string) => text || '-' },
    { title: '处理备注', dataIndex: 'processRemark', width: 160, ellipsis: true, render: (text: string) => text || '-' },
    { title: '操作', key: 'action', width: 80, fixed: 'right' as const, render: (_: any, record: AlertItem) => (
      <Button 
        type="link" 
        size="small" 
        disabled={record.status === 'processed'}
        onClick={() => handleProcessAlert(record)}
      >
        处理
      </Button>
    )},
  ]

  // 告警查询表单字段（增加告警时间和处理状态）
  const alertSearchFields = [
    { name: 'interfaceId', label: '接口ID', component: <Input placeholder="请输入接口ID" allowClear /> },
    { name: 'interfaceName', label: '接口名称', component: <Input placeholder="请输入接口名称" allowClear /> },
    { name: 'alertTime', label: '告警时间', component: (
      <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} />
    )},
    { name: 'alertStatus', label: '处理状态', component: (
      <Select placeholder="请选择处理状态" allowClear>
        <Option value="pending">待处理</Option>
        <Option value="processed">已处理</Option>
      </Select>
    )},
  ]

  // 处理告警查询
  const handleAlertSearch = () => {
    const values = alertSearchForm.getFieldsValue()
    setFilterAlertInterfaceId(values.interfaceId || '')
    setFilterAlertInterface(values.interfaceName || '')
    setFilterAlertStatus(values.alertStatus || '')
    message.success('查询成功')
  }

  // 处理告警重置
  const handleAlertReset = () => {
    alertSearchForm.resetFields()
    setFilterAlertInterfaceId('')
    setFilterAlertInterface('')
    setFilterAlertStatus('pending')
    message.success('重置成功')
  }

  // 处理告警导出
  const handleAlertExport = () => {
    message.success('导出成功')
  }

  // 点击查看数源机构详情
  const handleViewSourceOrg = (orgId: string) => {
    const mockOrgData: Record<string, SourceOrg> = {
      'DS-00001': {
        orgId: 'DS-00001',
        orgName: '上海生腾数据科技有限公司',
        orgShortName: '生腾数据',
        creditCode: '91310106MA1FY86D4M',
        orgType: '商业数据',
        contactName: '张三',
        contactPhone: '13800138001',
        contactEmail: 'zhangsan@shengteng.com',
        region: '上海市/上海市/浦东新区',
        detailAddress: '张江高科技园区',
        accessDate: '2024-01-01',
        cooperationStatus: '合作中',
        remark: '主要提供企业信用数据服务',
        managerName: '赵六',
        managerPhone: '15158136666',
      },
      'DS-00002': {
        orgId: 'DS-00002',
        orgName: '深圳市市场监督管理局',
        orgShortName: '深圳市监局',
        creditCode: '11440300MB2C92051N',
        orgType: '政府机构',
        contactName: '李四',
        contactPhone: '13800138002',
        contactEmail: 'lisi@szamr.gov.cn',
        region: '广东省/深圳市/福田区',
        detailAddress: '福田区深南大道7010号',
        accessDate: '2023-06-01',
        cooperationStatus: '合作中',
        remark: '提供行政处罚、工商注册等政务数据',
        managerName: '钱七',
        managerPhone: '15158137777',
      },
      'DS-00003': {
        orgId: 'DS-00003',
        orgName: '深圳市人力资源和社会保障局',
        orgShortName: '深圳人社局',
        creditCode: '11440300695559836P',
        orgType: '政府机构',
        contactName: '王五',
        contactPhone: '13800138003',
        contactEmail: 'wangwu@szhrss.gov.cn',
        region: '广东省/深圳市/福田区',
        detailAddress: '福田区深南大道8005号',
        accessDate: '2023-08-15',
        cooperationStatus: '合作中',
        remark: '提供社保缴纳相关数据',
        managerName: '孙八',
        managerPhone: '15158138888',
      },
    }
    setSelectedOrg(mockOrgData[orgId] || null)
    setIsOrgModalVisible(true)
  }

  // 点击查看影响产品列表
  const handleViewImpactProducts = (products: ImpactProduct[]) => {
    setSelectedProducts(products)
    setIsProductModalVisible(true)
  }

  // 打开处理告警弹窗（单条）
  const handleProcessAlert = (record: AlertItem) => {
    setCurrentAlert(record)
    setSelectedAlerts([])
    setIsBatchProcess(false)
    processForm.setFieldsValue({
      remark: ''
    })
    setIsProcessModalVisible(true)
  }

  // 打开批量处理弹窗
  const handleBatchProcess = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要处理的告警')
      return
    }
    const selected = alertData.filter(alert => selectedRowKeys.includes(alert.id))
    setSelectedAlerts(selected)
    setCurrentAlert(null)
    setIsBatchProcess(true)
    processForm.setFieldsValue({
      remark: ''
    })
    setIsProcessModalVisible(true)
  }

  // 提交告警处理
  const handleProcessSubmit = () => {
    processForm.validateFields().then(values => {
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      
      if (isBatchProcess && selectedAlerts.length > 0) {
        // 批量处理
        setAlertData(alertData.map(alert => {
          if (selectedAlerts.some(sel => sel.id === alert.id)) {
            return {
              ...alert,
              status: 'processed',
              processTime: now,
              processRemark: values.remark
            }
          }
          return alert
        }))
        message.success(`成功处理 ${selectedAlerts.length} 条告警`)
        setSelectedRowKeys([])
      } else if (currentAlert) {
        // 单条处理
        setAlertData(alertData.map(alert =>
          alert.id === currentAlert.id
            ? {
                ...alert,
                status: 'processed',
                processTime: now,
                processRemark: values.remark
              }
            : alert
        ))
        message.success('告警处理成功')
      }
      setIsProcessModalVisible(false)
    })
  }

  // 查询表单字段（接口列表）- 删除健康状态
  const searchFields = [
    { name: 'interfaceId', label: '接口ID', component: <Input placeholder="请输入接口ID" allowClear /> },
    { name: 'interfaceName', label: '接口名称', component: <Input placeholder="请输入接口名称" allowClear /> },
  ]



  return (
    <div className="interface-quality">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{stat.title}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color }}>
                  {stat.icon && <span style={{ marginRight: 8 }}>{stat.icon}</span>}
                  {stat.value}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 实时告警 */}
      <Card 
        title="实时告警" 
        style={{ marginBottom: 16 }}
      >
        {/* 告警查询栏 - 4个查询项，无展开收起 */}
        <Form form={alertSearchForm} style={{ marginBottom: 16 }} initialValues={{ alertStatus: 'pending' }}>
          <Row gutter={24}>
            {alertSearchFields.map((field, index) => (
              <Col span={6} key={index}>
                <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
                  {field.component}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Row gutter={24} align="middle">
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleAlertSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleAlertReset}>重置</Button>
                <Button icon={<ExportOutlined />} onClick={handleAlertExport}>导出</Button>
                <Button type="primary" onClick={handleBatchProcess} disabled={selectedRowKeys.length === 0}>
                  批量处理 ({selectedRowKeys.length})
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 告警数据表格 */}
        <Table
          columns={alertColumns}
          dataSource={filteredAlertData}
          rowKey="id"
          size="small"
          scroll={{ x: 1600 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => {
              setSelectedRowKeys(keys)
            },
            getCheckboxProps: (record: AlertItem) => ({
              disabled: record.status === 'processed',
            }),
          }}
          pagination={{ 
            current: alertPagination.current,
            pageSize: alertPagination.pageSize,
            showSizeChanger: true, 
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (page, pageSize) => {
              setAlertPagination({ current: page, pageSize: pageSize || 5 })
            }
          }}
          locale={{ emptyText: <Empty description="暂无告警信息" /> }}
        />
      </Card>

      {/* 接口质量监控Tab页 */}
      <Card 
        title="接口质量监控"
        extra={
          <Space>
            <Button 
              type={activeTab === 'realtime' ? 'primary' : 'default'}
              onClick={() => setActiveTab('realtime')}
            >
              实时统计
            </Button>
            <Button 
              type={activeTab === 'month' ? 'primary' : 'default'}
              onClick={() => setActiveTab('month')}
            >
              月度统计
            </Button>
            <Button 
              type={activeTab === 'year' ? 'primary' : 'default'}
              onClick={() => setActiveTab('year')}
            >
              年度统计
            </Button>
          </Space>
        }
      >
        {/* 查询栏 */}
        <Form form={searchForm} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            {searchFields.map((field, index) => (
              <Col span={8} key={index}>
                <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
                  {field.component}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Row gutter={24} align="middle">
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
                <Button icon={<ExportOutlined />} onClick={() => message.success('导出成功')}>导出</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        
        {/* 数据表格 */}
        <Table
          columns={activeTab === 'realtime' ? realtimeColumns : activeTab === 'month' ? monthColumns : yearColumns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: activeTab === 'realtime' ? 1750 : 1300 }}
          pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
        }}
        />
      </Card>

      {/* 预警配置弹窗 */}
      <Modal
        title={`预警配置 - ${currentInterface?.interfaceName} - ${currentMetric?.timeWindow === '10m' ? '近10分钟' : '近30分钟'}${currentMetric?.type === 'queryRate' ? '查得率' : currentMetric?.type === 'responseTime' ? '响应时间' : '报错率'}阈值`}
        open={isConfigModalVisible}
        onOk={handleConfigSubmit}
        onCancel={() => {
          setIsConfigModalVisible(false)
          setCurrentMetric(null)
        }}
        okText="保存"
        cancelText="取消"
        width={400}
      >
        <Form form={configForm} layout="vertical">
          <Alert
            message={`配置${currentMetric?.timeWindow === '10m' ? '近10分钟' : '近30分钟'}${currentMetric?.type === 'queryRate' ? '查得率' : currentMetric?.type === 'responseTime' ? '响应时间' : '报错率'}预警阈值`}
            description={currentMetric?.type === 'queryRate' ? '当查得率低于阈值时触发预警' : currentMetric?.type === 'responseTime' ? '当平均响应时间超过阈值时触发预警' : '当报错率超过阈值时触发预警'}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          {currentMetric?.type === 'queryRate' && (
            <Form.Item
              name="queryRateThreshold"
              label="查得率阈值(%)"
              rules={[{ required: true, message: '请输入查得率阈值' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} max={100} />
            </Form.Item>
          )}
          
          {currentMetric?.type === 'responseTime' && (
            <Form.Item
              name="responseTimeThreshold"
              label="响应时间阈值(ms)"
              rules={[{ required: true, message: '请输入响应时间阈值' }]}
            >
              <InputNumber style={{ width: '100%' }} min={100} max={10000} />
            </Form.Item>
          )}
          
          {currentMetric?.type === 'errorRate' && (
            <Form.Item
              name="errorRateThreshold"
              label="报错率阈值(%)"
              rules={[{ required: true, message: '请输入报错率阈值' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} max={100} />
            </Form.Item>
          )}

          <Form.Item
            name="alertEnabled"
            label="预警开关"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item
            name="alertPhones"
            label="预警手机号"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
          >
            <Input placeholder="请输入接收预警的手机号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 告警处理弹窗 */}
      <Modal
        title={isBatchProcess ? `批量处理告警 (${selectedAlerts.length}条)` : '处理告警消息'}
        open={isProcessModalVisible}
        onOk={handleProcessSubmit}
        onCancel={() => setIsProcessModalVisible(false)}
        okText="确认处理"
        cancelText="取消"
        width={500}
      >
        <Form form={processForm} layout="vertical">
          <Form.Item
            name="remark"
            label="处理备注"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入处理备注（选填），如：已联系上游系统、已修复、监控阈值调整等"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 数据源机构弹窗 */}
      <Modal
        title="数据源机构"
        open={isOrgModalVisible}
        onCancel={() => setIsOrgModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsOrgModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {selectedOrg && (
          <div>
            <p><strong>数据源机构ID：</strong>BM00001-068</p>
            <p><strong>数据源机构名称：</strong>{selectedOrg.orgName}</p>
          </div>
        )}
      </Modal>

      {/* 产品列表弹窗 */}
      <Modal
        title="产品列表"
        open={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsProductModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        <Table
          columns={[
            { title: '产品ID', dataIndex: 'productId', width: 100, render: (text: string) => {
              const num = text.replace(/\D/g, '')
              return `CR${num.padStart(4, '0')}`
            }},
            { title: '产品名称', dataIndex: 'productName', width: 220, ellipsis: true },
            { title: '服务客户名称', dataIndex: 'customerNames', ellipsis: true, render: (names: string[]) => names.join('、') },
          ]}
          dataSource={selectedProducts}
          rowKey="productId"
          pagination={false}
          size="small"
          bordered
        />
      </Modal>
    </div>
  )
}

export default InterfaceQuality
