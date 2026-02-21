import { useState, useEffect, useMemo } from 'react'
import { 
  Card, Button, Space, Input, message, Table, 
  Row, Col, Modal, Form
} from 'antd'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  DownOutlined, 
  UpOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { 
  getAllAssets, 
  getAllServices, 
  getFullLineageData,
} from '../../services/lineageService'
import type { DataAsset, ProductService, SourceTable, Customer, LineageData } from '../../types/lineage'

// 扁平化的血缘记录（一行一条映射）
interface FlatLineageRecord {
  key: string
  assetId: string
  assetName: string
  assetNameEn: string
  assetForm: string
  assetCategory: string
  sourceTableId: string
  sourceTableName: string
  sourceTableComment: string
  sourceOrgId: string
  updateFrequency: string
  sourceSystem: string
  serviceId: string
  serviceName: string
  serviceType: string
  customerName: string
  customerFullName: string
  customerType: string
}

const AssetLineageMap = () => {
  // 数据状态
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [flatData, setFlatData] = useState<FlatLineageRecord[]>([])
  
  // 筛选状态
  const [searchForm] = Form.useForm()
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [filterSourceOrgId, setFilterSourceOrgId] = useState<string>('')
  const [filterSourceTableName, setFilterSourceTableName] = useState<string>('')
  const [filterSourceTableComment, setFilterSourceTableComment] = useState<string>('')
  const [filterAssetName, setFilterAssetName] = useState<string>('')
  const [filterAssetNameEn, setFilterAssetNameEn] = useState<string>('')
  const [filterServiceName, setFilterServiceName] = useState<string>('')
  const [filterCustomerFullName, setFilterCustomerFullName] = useState<string>('')
  
  // 来源机构弹窗状态
  const [sourceOrgModalVisible, setSourceOrgModalVisible] = useState(false)
  const [selectedSourceOrg, setSelectedSourceOrg] = useState<FlatLineageRecord | null>(null)

  // 加载初始数据
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [assetsRes, , lineageRes] = await Promise.all([
        getAllAssets(),
        getAllServices(),
        getFullLineageData(),
      ])
      processFlatData(assetsRes, lineageRes)
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理扁平化数据（一行一条映射）
  const processFlatData = (assetList: DataAsset[], lineage: LineageData) => {
    const sourceMap = new Map<string, SourceTable>()
    const assetMap = new Map<string, DataAsset>()
    const serviceMap = new Map<string, ProductService>()
    const customerMap = new Map<string, Customer>()

    lineage.nodes.forEach(node => {
      if (node.type === 'source' && node.data) sourceMap.set(node.id, node.data as SourceTable)
      if (node.type === 'asset' && node.data) assetMap.set(node.id, node.data as DataAsset)
      if (node.type === 'service' && node.data) serviceMap.set(node.id, node.data as ProductService)
      if (node.type === 'customer' && node.data) customerMap.set(node.id, node.data as Customer)
    })

    // 构建关系映射
    const sourceToAsset = new Map<string, Set<string>>()
    const assetToService = new Map<string, Set<string>>()
    const serviceToCustomer = new Map<string, Set<string>>()

    lineage.edges.forEach(edge => {
      if (sourceMap.has(edge.source) && assetMap.has(edge.target)) {
        const set = sourceToAsset.get(edge.target) || new Set()
        set.add(edge.source)
        sourceToAsset.set(edge.target, set)
      }
      if (assetMap.has(edge.source) && serviceMap.has(edge.target)) {
        const set = assetToService.get(edge.source) || new Set()
        set.add(edge.target)
        assetToService.set(edge.source, set)
      }
      if (customerMap.has(edge.target)) {
        const set = serviceToCustomer.get(edge.source) || new Set()
        set.add(edge.target)
        serviceToCustomer.set(edge.source, set)
      }
    })

    // 生成扁平化记录（笛卡尔积展开）
    const records: FlatLineageRecord[] = []
    
    assetList.forEach(asset => {
      const sourceIds = sourceToAsset.get(asset.id) || new Set()
      const serviceIds = assetToService.get(asset.id) || new Set()
      
      if (sourceIds.size === 0 || serviceIds.size === 0) {
        records.push({
          key: `${asset.id}-none-none`,
          assetId: asset.assetId,
          assetName: asset.assetName,
          assetNameEn: asset.assetNameEn,
          assetForm: asset.assetForm,
          assetCategory: asset.assetCategory,
          sourceTableId: '',
          sourceTableName: '',
          sourceTableComment: '',
          sourceOrgId: '',
          updateFrequency: '',
          sourceSystem: '',
          serviceId: '',
          serviceName: serviceIds.size === 0 ? '未关联服务' : '',
          serviceType: '',
          customerName: '',
          customerFullName: '',
          customerType: '',
        })
        return
      }

      Array.from(sourceIds).forEach(sourceId => {
        const source = sourceMap.get(sourceId)
        if (!source) return

        Array.from(serviceIds).forEach(serviceId => {
          const service = serviceMap.get(serviceId)
          if (!service) return

          const customerIds = serviceToCustomer.get(serviceId) || new Set()
          
          if (customerIds.size === 0) {
            records.push({
              key: `${asset.id}-${sourceId}-${serviceId}-none`,
              assetId: asset.assetId,
              assetName: asset.assetName,
              assetNameEn: asset.assetNameEn,
              assetForm: asset.assetForm,
              assetCategory: asset.assetCategory,
              sourceTableId: (92 - parseInt(source.id.replace(/\D/g, '') || '0')).toString().padStart(6, '0'),
              sourceTableName: source.tableName,
              sourceTableComment: source.tableComment,
              sourceOrgId: source.sourceOrgId,
              updateFrequency: source.updateFrequency,
              sourceSystem: source.sourceSystem,
              serviceId: service.serviceId,
              serviceName: service.serviceName,
              serviceType: service.serviceType,
              customerName: '-',
              customerFullName: '-',
              customerType: '',
            })
          } else {
            Array.from(customerIds).forEach(customerId => {
              const customer = customerMap.get(customerId)
              if (!customer) return

              records.push({
                key: `${asset.id}-${sourceId}-${serviceId}-${customerId}`,
                assetId: asset.assetId,
                assetName: asset.assetName,
                assetNameEn: asset.assetNameEn,
                assetForm: asset.assetForm,
                assetCategory: asset.assetCategory,
                sourceTableId: (92 - parseInt(source.id.replace(/\D/g, '') || '0')).toString().padStart(6, '0'),
                sourceTableName: source.tableName,
                sourceTableComment: source.tableComment,
                sourceOrgId: source.sourceOrgId,
                updateFrequency: source.updateFrequency,
                sourceSystem: source.sourceSystem,
                serviceId: service.serviceId,
                serviceName: service.serviceName,
                serviceType: service.serviceType,
                customerName: customer.customerName,
                customerFullName: customer.customerFullName,
                customerType: customer.customerType,
              })
            })
          }
        })
      })
    })

    setFlatData(records)
  }

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return flatData.filter(record => {
      // 数据来源机构ID筛选
      if (filterSourceOrgId && !record.sourceOrgId.toLowerCase().includes(filterSourceOrgId.toLowerCase())) return false

      // 源表英文名筛选
      if (filterSourceTableName && !record.sourceTableName.toLowerCase().includes(filterSourceTableName.toLowerCase())) return false

      // 源表中文名筛选
      if (filterSourceTableComment && !record.sourceTableComment.includes(filterSourceTableComment)) return false

      // 数据资产中文名筛选
      if (filterAssetName && !record.assetName.includes(filterAssetName)) return false

      // 数据资产英文名筛选
      if (filterAssetNameEn && !record.assetNameEn.toLowerCase().includes(filterAssetNameEn.toLowerCase())) return false

      // 产品名称筛选
      if (filterServiceName && !record.serviceName.includes(filterServiceName)) return false

      // 客户名称筛选
      if (filterCustomerFullName && !record.customerFullName.includes(filterCustomerFullName)) return false

      return true
    })
  }, [flatData, filterSourceOrgId, filterSourceTableName, filterSourceTableComment, filterAssetName, filterAssetNameEn, filterServiceName, filterCustomerFullName])

  // 统计分析
  const stats = useMemo(() => {
    const uniqueAssets = new Set(flatData.map(r => r.assetId)).size
    const uniqueSources = new Set(flatData.filter(r => r.sourceTableName).map(r => r.sourceTableName)).size
    const uniqueServices = new Set(flatData.filter(r => r.serviceId).map(r => r.serviceId)).size
    const uniqueCustomers = new Set(flatData.filter(r => r.customerName && r.customerName !== '-').map(r => r.customerName)).size
    const unlinkedAssets = new Set(flatData.filter(r => r.serviceName === '未关联服务').map(r => r.assetId)).size
    return { total: flatData.length, uniqueAssets, uniqueSources, uniqueServices, uniqueCustomers, unlinkedAssets }
  }, [flatData])

  // 查看来源机构详情
  const handleViewSourceOrg = (record: FlatLineageRecord) => {
    setSelectedSourceOrg(record)
    setSourceOrgModalVisible(true)
  }

  // 表格列定义
  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '数据源机构ID', dataIndex: 'sourceOrgId', width: 130, align: 'left' as const, render: (text: string, record: FlatLineageRecord) => (
      text ? <Button type="link" size="small" onClick={() => handleViewSourceOrg(record)} style={{ padding: 0, textAlign: 'left' }}>BM00001-068</Button> : '-'
    )},
    { title: '数据源表ID', dataIndex: 'sourceTableId', width: 110, render: (text: string) => text || '-' },
    { title: '数据源表中文名', dataIndex: 'sourceTableComment', width: 160, ellipsis: true, render: (text: string) => text || '-' },
    { title: '数据源表英文名', dataIndex: 'sourceTableName', width: 160, ellipsis: true, render: (text: string) => text || '-' },
    { title: '数据资产ID', dataIndex: 'assetId', width: 120, render: (text: string) => text || '-' },
    { title: '数据资产中文名', dataIndex: 'assetName', width: 180, ellipsis: true, render: (text: string) => text || '-' },
    { title: '数据资产英文名', dataIndex: 'assetNameEn', width: 180, ellipsis: true, render: (text: string) => text || '-' },
    { title: '产品ID', dataIndex: 'serviceId', width: 100, render: (text: string) => {
      if (!text) return '-'
      const num = text.replace(/\D/g, '') // 提取数字
      return `CR${num.padStart(4, '0')}`
    }},
    { title: '产品名称', dataIndex: 'serviceName', width: 180, ellipsis: true, render: (text: string) => text || '-' },
    { title: '客户名称', dataIndex: 'customerFullName', width: 200, ellipsis: true, render: (text: string) => text || '-' },
  ]

  // 统计卡片数据
  const statsData = [
    { title: '数据源表（个）', value: stats.uniqueSources, color: '#52c41a' },
    { title: '数据资产（项）', value: stats.uniqueAssets, color: '#1890ff' },
    { title: '服务产品（个）', value: stats.uniqueServices, color: '#fa8c16' },
    { title: '服务客户（个）', value: stats.uniqueCustomers, color: '#722ed1' },
  ]

  // 处理导出
  const handleExport = () => {
    message.success('导出成功')
  }

  // 查询表单字段
  const searchFields = [
    { name: 'sourceOrgId', label: '数据源机构ID', component: <Input placeholder="请输入数据源机构ID" allowClear /> },
    { name: 'sourceTableComment', label: '数据源表中文名', component: <Input placeholder="请输入数据源表中文名" allowClear /> },
    { name: 'sourceTableName', label: '数据源表英文名', component: <Input placeholder="请输入数据源表英文名" allowClear /> },
    { name: 'assetName', label: '数据资产中文名', component: <Input placeholder="请输入数据资产中文名" allowClear /> },
    { name: 'assetNameEn', label: '数据资产英文名', component: <Input placeholder="请输入数据资产英文名" allowClear /> },
    { name: 'serviceName', label: '产品名称', component: <Input placeholder="请输入产品名称" allowClear /> },
    { name: 'customerFullName', label: '客户名称', component: <Input placeholder="请输入客户名称" allowClear /> },
  ]

  const visibleSearchFields = searchExpanded ? searchFields : searchFields.slice(0, 3)

  // 处理查询
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setFilterSourceOrgId(values.sourceOrgId || '')
    setFilterSourceTableName(values.sourceTableName || '')
    setFilterSourceTableComment(values.sourceTableComment || '')
    setFilterAssetName(values.assetName || '')
    setFilterAssetNameEn(values.assetNameEn || '')
    setFilterServiceName(values.serviceName || '')
    setFilterCustomerFullName(values.customerFullName || '')
    message.success('查询成功')
  }

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields()
    setFilterSourceOrgId('')
    setFilterSourceTableName('')
    setFilterSourceTableComment('')
    setFilterAssetName('')
    setFilterAssetNameEn('')
    setFilterServiceName('')
    setFilterCustomerFullName('')
    message.success('重置成功')
  }

  return (
    <div className="asset-lineage-map">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{stat.title}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 查询栏 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24}>
            {visibleSearchFields.map((field, index) => (
              <Col span={8} key={index}>
                <Form.Item name={field.name} label={field.label} style={{ marginBottom: 16 }}>
                  {field.component}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Row gutter={24} align="middle">
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="link" onClick={() => setSearchExpanded(!searchExpanded)}>
                  {searchExpanded ? <><UpOutlined /> 收起</> : <><DownOutlined /> 展开</>}
                </Button>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card 
        title="数据血缘关系" 
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="key"
          scroll={{ x: 1800 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
          }}
        />
      </Card>

      {/* 数据源机构弹窗 */}
      <Modal
        title="数据源机构"
        open={sourceOrgModalVisible}
        onCancel={() => setSourceOrgModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSourceOrgModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {selectedSourceOrg && (
          <div>
            <p><strong>数据源机构ID：</strong>BM00001-068</p>
            <p><strong>数据源机构名称：</strong>市市场监督管理局</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AssetLineageMap
