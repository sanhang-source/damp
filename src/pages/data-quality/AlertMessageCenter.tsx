import { useState, useMemo } from 'react'
import { Card, Table, Tag, Row, Col, Button, Space, Form, Input, Select, Badge, Statistic, Empty, Modal, Descriptions } from 'antd'
import { ReloadOutlined, SearchOutlined, ClearOutlined, ApiOutlined, DatabaseOutlined, LineChartOutlined } from '@ant-design/icons'

// 告警来源类型
type AlertSource = 'interface' | 'table' | 'indicator'

// 影响产品信息
interface ImpactProduct {
  productId: string
  productName: string
  customerName: string
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
interface AlertMessage {
  id: string
  source: AlertSource
  sourceName: string
  objectId: string
  objectName: string
  sourceOrgId: string // 数源机构ID
  impactProducts: ImpactProduct[] // 影响产品列表
  alertType: string
  alertTime: string
  message: string
  createTime: string // 用于90天过滤
}

const AlertMessageCenter = () => {
  // Mock数据 - 汇总三个来源的告警（增加数源机构ID和影响产品列表）
  const [alertData] = useState<AlertMessage[]>([
    // 接口质量告警
    { 
      id: '1', source: 'interface', sourceName: '接口质量', objectId: 'API001', objectName: '企业信用查询接口', 
      sourceOrgId: 'DS-00001', 
      impactProducts: [
        { productId: 'PRD001', productName: '企业风控查询服务', customerName: '中国工商银行股份有限公司深圳分行' },
        { productId: 'PRD002', productName: '企业信用评估服务', customerName: '招商银行股份有限公司' },
      ],
      alertType: '查得率低', alertTime: '2024-02-05 14:32:15', message: '近10分钟查得率15%，低于阈值20%', createTime: '2024-02-05' 
    },
    { 
      id: '2', source: 'interface', sourceName: '接口质量', objectId: 'API003', objectName: '社保信息核验接口', 
      sourceOrgId: 'DS-00003',
      impactProducts: [
        { productId: 'PRD003', productName: '社保信息查询服务', customerName: '深圳市人力资源和社会保障局' },
      ],
      alertType: '响应超时', alertTime: '2024-02-05 14:28:10', message: '平均响应时间3200ms，超过阈值3000ms', createTime: '2024-02-05' 
    },
    { 
      id: '3', source: 'interface', sourceName: '接口质量', objectId: 'API002', objectName: '行政处罚查询接口', 
      sourceOrgId: 'DS-00002',
      impactProducts: [
        { productId: 'PRD004', productName: '行政处罚查询服务', customerName: '中国建设银行股份有限公司' },
        { productId: 'PRD005', productName: '企业信用报告服务', customerName: '中国平安保险（集团）股份有限公司' },
        { productId: 'PRD006', productName: '合规风控查询服务', customerName: '腾讯科技（深圳）有限公司' },
      ],
      alertType: '错误率高', alertTime: '2024-02-05 14:25:33', message: '近30分钟错误率8.5%，超过阈值5%', createTime: '2024-02-05' 
    },
    
    // 库表更新告警
    { 
      id: '4', source: 'table', sourceName: '库表更新', objectId: 'T_PENALTY_RECORD', objectName: '行政处罚记录表', 
      sourceOrgId: 'DS-00002',
      impactProducts: [
        { productId: 'PRD004', productName: '行政处罚查询服务', customerName: '中国建设银行股份有限公司' },
      ],
      alertType: '更新延迟', alertTime: '2024-02-05 14:22:18', message: '预期2024-02-05 08:00更新，实际2024-02-05 09:30更新，延迟90分钟', createTime: '2024-02-05' 
    },
    { 
      id: '5', source: 'table', sourceName: '库表更新', objectId: 'T_SOCIAL_SECURITY', objectName: '社保缴纳信息表', 
      sourceOrgId: 'DS-00003',
      impactProducts: [
        { productId: 'PRD003', productName: '社保信息查询服务', customerName: '深圳市人力资源和社会保障局' },
        { productId: 'PRD007', productName: '员工背景调查服务', customerName: '华为技术有限公司' },
      ],
      alertType: '更新延迟', alertTime: '2024-02-05 14:20:45', message: '预期2024-02-05 08:00更新，实际2024-02-05 10:15更新，延迟135分钟', createTime: '2024-02-05' 
    },
    { 
      id: '6', source: 'table', sourceName: '库表更新', objectId: 'T_BUSINESS_REG', objectName: '工商注册信息表', 
      sourceOrgId: 'DS-00001',
      impactProducts: [
        { productId: 'PRD001', productName: '企业风控查询服务', customerName: '中国工商银行股份有限公司深圳分行' },
        { productId: 'PRD002', productName: '企业信用评估服务', customerName: '招商银行股份有限公司' },
        { productId: 'PRD005', productName: '企业信用报告服务', customerName: '中国平安保险（集团）股份有限公司' },
      ],
      alertType: '更新延迟', alertTime: '2024-02-05 14:15:22', message: '预期2024-02-05 08:00更新，实际2024-02-05 08:45更新，延迟45分钟', createTime: '2024-02-05' 
    },
    
    // 指标质量告警
    { 
      id: '7', source: 'indicator', sourceName: '指标质量', objectId: 'IND002', objectName: '行政处罚记录数', 
      sourceOrgId: 'DS-00002',
      impactProducts: [
        { productId: 'PRD004', productName: '行政处罚查询服务', customerName: '中国建设银行股份有限公司' },
      ],
      alertType: '更新延迟', alertTime: '2024-02-05 14:12:08', message: '预期2024-02-05 08:00更新，实际2024-02-05 09:30更新，延迟90分钟', createTime: '2024-02-05' 
    },
    { 
      id: '8', source: 'indicator', sourceName: '指标质量', objectId: 'IND003', objectName: '社保缴纳企业数', 
      sourceOrgId: 'DS-00003',
      impactProducts: [
        { productId: 'PRD003', productName: '社保信息查询服务', customerName: '深圳市人力资源和社会保障局' },
      ],
      alertType: '更新延迟', alertTime: '2024-02-05 14:08:30', message: '预期2024-02-05 08:00更新，实际2024-02-05 10:15更新，延迟135分钟', createTime: '2024-02-05' 
    },
    
    // 历史数据（超过90天的示例）
    { 
      id: '9', source: 'interface', sourceName: '接口质量', objectId: 'API001', objectName: '企业信用查询接口', 
      sourceOrgId: 'DS-00001',
      impactProducts: [
        { productId: 'PRD001', productName: '企业风控查询服务', customerName: '中国工商银行股份有限公司深圳分行' },
      ],
      alertType: '查得率低', alertTime: '2023-10-01 10:00:00', message: '历史告警数据', createTime: '2023-10-01' 
    },
  ])

  // 弹窗状态
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [isOrgModalVisible, setIsOrgModalVisible] = useState(false)
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<SourceOrg | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<ImpactProduct[]>([])

  // 筛选状态
  const [searchForm] = Form.useForm()
  const [filterSource, setFilterSource] = useState<AlertSource | ''>('')
  const [filterType, setFilterType] = useState('')
  const [filterObjectId, setFilterObjectId] = useState('')
  const [filterObjectName, setFilterObjectName] = useState('')

  // 90天过滤
  const filteredByDate = useMemo(() => {
    const now = new Date('2024-02-05') // 当前时间
    const ninetyDaysAgo = new Date(now)
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    return alertData.filter(alert => {
      const createDate = new Date(alert.createTime)
      return createDate >= ninetyDaysAgo
    })
  }, [alertData])

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return filteredByDate.filter(alert => {
      if (filterSource && alert.source !== filterSource) return false
      if (filterType && alert.alertType !== filterType) return false
      if (filterObjectId && !alert.objectId.toLowerCase().includes(filterObjectId.toLowerCase())) return false
      if (filterObjectName && !alert.objectName.includes(filterObjectName)) return false
      return true
    })
  }, [filteredByDate, filterSource, filterType, filterObjectId, filterObjectName])

  // 统计卡片数据
  const statsData = [
    { 
      title: '告警总数', 
      value: filteredData.length,
      icon: <Badge count={filteredData.length} style={{ backgroundColor: '#f5222d' }} />
    },
    { 
      title: '接口质量告警', 
      value: filteredData.filter(item => item.source === 'interface').length,
      icon: <ApiOutlined style={{ color: '#1890ff' }} />
    },
    { 
      title: '库表更新告警', 
      value: filteredData.filter(item => item.source === 'table').length,
      icon: <DatabaseOutlined style={{ color: '#52c41a' }} />
    },
    { 
      title: '指标质量告警', 
      value: filteredData.filter(item => item.source === 'indicator').length,
      icon: <LineChartOutlined style={{ color: '#faad14' }} />
    },
  ]

  // 点击查看数源机构详情
  const handleViewSourceOrg = (orgId: string) => {
    // Mock数源机构数据
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

  // 获取合作状态颜色
  const getCooperationStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '合作中': 'success',
      '意向合作': 'processing',
      '结束合作': 'default',
      '终止合作': 'error',
    }
    return colorMap[status] || 'default'
  }

  // 表格列定义
  const columns = [
    {
      title: '告警来源',
      dataIndex: 'sourceName',
      width: 100,
      render: (text: string, record: AlertMessage) => {
        const colorMap: Record<AlertSource, string> = {
          'interface': 'blue',
          'table': 'green',
          'indicator': 'orange'
        }
        return <Tag color={colorMap[record.source]}>{text}</Tag>
      }
    },
    { title: '告警时间', dataIndex: 'alertTime', width: 160 },
    { title: '对象ID', dataIndex: 'objectId', width: 130 },
    { title: '接口中文名', dataIndex: 'objectName', width: 160, ellipsis: true },
    { 
      title: '数源机构ID', 
      dataIndex: 'sourceOrgId', 
      width: 120,
      render: (text: string) => (
        <Button type="link" size="small" onClick={() => handleViewSourceOrg(text)}>
          {text}
        </Button>
      )
    },
    { 
      title: '影响产品ID', 
      key: 'impactProducts',
      width: 180,
      render: (_: any, record: AlertMessage) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => handleViewImpactProducts(record.impactProducts)}
        >
          {record.impactProducts.map(p => p.productId).join(', ')}
        </Button>
      )
    },
    { title: '告警类型', dataIndex: 'alertType', width: 110, render: (text: string) => <Tag>{text}</Tag> },
    { title: '告警详情', dataIndex: 'message', width: 260, ellipsis: true },
  ]

  // 告警类型选项（根据实际数据动态生成）
  const alertTypeOptions = [
    { label: '查得率低', value: '查得率低' },
    { label: '响应超时', value: '响应超时' },
    { label: '错误率高', value: '错误率高' },
    { label: '更新延迟', value: '更新延迟' },
  ]

  // 处理查询
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setFilterSource(values.source || '')
    setFilterType(values.alertType || '')
    setFilterObjectId(values.objectId || '')
    setFilterObjectName(values.objectName || '')
  }

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields()
    setFilterSource('')
    setFilterType('')
    setFilterObjectId('')
    setFilterObjectName('')
  }

  return (
    <div className="alert-message-center">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                prefix={stat.icon}
                valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 告警列表 */}
      <Card title="告警消息列表">
        <Form form={searchForm} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="source" label="告警来源">
                <Select placeholder="请选择告警来源" allowClear>
                  <Select.Option value="interface">接口质量</Select.Option>
                  <Select.Option value="table">库表更新</Select.Option>
                  <Select.Option value="indicator">指标质量</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="alertType" label="告警类型">
                <Select placeholder="请选择告警类型" allowClear options={alertTypeOptions} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="objectId" label="对象ID">
                <Input placeholder="请输入对象ID" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="objectName" label="对象名称">
                <Input placeholder="请输入对象名称" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                <Button icon={<ClearOutlined />} onClick={handleReset}>重置</Button>
                <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>刷新</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条（仅显示近90天数据）`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
          }}
          locale={{ emptyText: <Empty description="暂无告警消息" /> }}
        />
      </Card>

      {/* 数源机构详情弹窗 */}
      <Modal
        title="数源机构详情"
        open={isOrgModalVisible}
        onCancel={() => setIsOrgModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrg && (
          <>
            <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="数源机构ID">{selectedOrg.orgId}</Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码">{selectedOrg.creditCode}</Descriptions.Item>
              <Descriptions.Item label="数源机构名称">{selectedOrg.orgName}</Descriptions.Item>
              <Descriptions.Item label="数源机构简称">{selectedOrg.orgShortName}</Descriptions.Item>
              <Descriptions.Item label="联系人">{selectedOrg.contactName || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedOrg.contactPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系邮箱">{selectedOrg.contactEmail || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系地址">
                {selectedOrg.region} {selectedOrg.detailAddress}
              </Descriptions.Item>
              <Descriptions.Item label="数源机构类型">
                <Tag>{selectedOrg.orgType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="数源准入日期">{selectedOrg.accessDate}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{selectedOrg.remark || '-'}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="合作信息" bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="合作状态">
                <Tag color={getCooperationStatusColor(selectedOrg.cooperationStatus)}>
                  {selectedOrg.cooperationStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="生效中合同数量">3</Descriptions.Item>
            </Descriptions>

            <Descriptions title="征信客户经理信息" bordered column={2}>
              <Descriptions.Item label="客户经理姓名">{selectedOrg.managerName || '-'}</Descriptions.Item>
              <Descriptions.Item label="客户经理电话">{selectedOrg.managerPhone || '-'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      {/* 影响产品列表弹窗 */}
      <Modal
        title="影响产品列表"
        open={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={null}
        width={700}
      >
        <Table
          columns={[
            { title: '产品ID', dataIndex: 'productId', width: 120 },
            { title: '产品名称', dataIndex: 'productName', width: 200, ellipsis: true },
            { title: '服务客户', dataIndex: 'customerName', ellipsis: true },
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

export default AlertMessageCenter
