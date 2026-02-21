import { useState, useMemo } from 'react'
import { Card, Table, Tag, Row, Col, Button, Space, Modal, Form, Input, InputNumber, Switch, message, DatePicker, Empty, Alert } from 'antd'
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'



interface TableMonitorItem {
  id: string
  tableName: string
  tableId: string
  tableEnglishName: string
  dataSourceId: string
  relatedProductId: string
  expectedUpdateTime: string
  actualUpdateTime: string
  updateStatus: 'ontime' | 'delayed'
  fluctuationRate: number
  alertEnabled: boolean
  alertThreshold: number
  alertPhones: string
}

// 告警信息接口
interface AlertItem {
  id: string
  time: string
  tableId: string
  tableName: string
  tableEnglishName: string
  dataSourceId: string
  relatedProductId: string
  type: 'delay'
  typeName: string
  level: 'warning' | 'error'
  message: string
}

const TableUpdateMonitor = () => {
  const [data, setData] = useState<TableMonitorItem[]>([
    { id: '1', tableName: '企业信用评分表', tableId: 'T_CREDIT_SCORE', tableEnglishName: 'T_CREDIT_SCORE', dataSourceId: 'BM00001-068', relatedProductId: 'PRD001', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 07:45', updateStatus: 'ontime', fluctuationRate: 5.5, alertEnabled: true, alertThreshold: 20, alertPhones: '13800138001' },
    { id: '2', tableName: '行政处罚记录表', tableId: 'T_PENALTY_RECORD', tableEnglishName: 'T_PENALTY_RECORD', dataSourceId: 'BM00001-068', relatedProductId: 'PRD002', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 09:30', updateStatus: 'delayed', fluctuationRate: 42.8, alertEnabled: true, alertThreshold: 20, alertPhones: '13800138002' },
    { id: '3', tableName: '社保缴纳信息表', tableId: 'T_SOCIAL_SECURITY', tableEnglishName: 'T_SOCIAL_SECURITY', dataSourceId: 'BM00001-068', relatedProductId: 'PRD003', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 10:15', updateStatus: 'delayed', fluctuationRate: 12.3, alertEnabled: true, alertThreshold: 20, alertPhones: '13800138003' },
    { id: '4', tableName: '工商注册信息表', tableId: 'T_BUSINESS_REG', tableEnglishName: 'T_BUSINESS_REG', dataSourceId: 'BM00001-068', relatedProductId: 'PRD004', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 07:58', updateStatus: 'ontime', fluctuationRate: 3.2, alertEnabled: false, alertThreshold: 20, alertPhones: '' },
    { id: '5', tableName: '纳税信用等级表', tableId: 'T_TAX_CREDIT', tableEnglishName: 'T_TAX_CREDIT', dataSourceId: 'BM00001-068', relatedProductId: 'PRD005', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 08:15', updateStatus: 'ontime', fluctuationRate: 8.7, alertEnabled: true, alertThreshold: 20, alertPhones: '13800138005' },
  ])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)
  const [currentTable, setCurrentTable] = useState<TableMonitorItem | null>(null)
  const [configForm] = Form.useForm()
  
  // 数据来源弹窗状态
  const [sourceModalVisible, setSourceModalVisible] = useState(false)
  
  // 表监控查询状态
  const [tableSearchForm] = Form.useForm()
  const [filterTableId, setFilterTableId] = useState('')
  const [filterTableName, setFilterTableName] = useState('')
  const [filterTableEnName, setFilterTableEnName] = useState('')
  
  // 筛选后的表数据
  const filteredTableData = useMemo(() => {
    return data.filter(record => {
      if (filterTableId && !record.tableId.toLowerCase().includes(filterTableId.toLowerCase())) return false
      if (filterTableName && !record.tableName.includes(filterTableName)) return false
      if (filterTableEnName && !record.tableEnglishName.toLowerCase().includes(filterTableEnName.toLowerCase())) return false
      return true
    })
  }, [data, filterTableId, filterTableName, filterTableEnName])
  
  // 表监控查询字段
  const tableSearchFields = [
    { name: 'tableId', label: '库表ID', component: <Input placeholder="请输入库表ID" allowClear /> },
    { name: 'tableName', label: '库表中文名', component: <Input placeholder="请输入库表中文名" allowClear /> },
    { name: 'tableEnglishName', label: '库表英文名', component: <Input placeholder="请输入库表英文名" allowClear /> },
  ]
  
  // 处理表监控查询
  const handleTableSearch = () => {
    const values = tableSearchForm.getFieldsValue()
    setFilterTableId(values.tableId || '')
    setFilterTableName(values.tableName || '')
    setFilterTableEnName(values.tableEnglishName || '')
    message.success('查询成功')
  }
  
  // 处理表监控重置
  const handleTableReset = () => {
    tableSearchForm.resetFields()
    setFilterTableId('')
    setFilterTableName('')
    setFilterTableEnName('')
    message.success('重置成功')
  }

  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '库表ID', dataIndex: 'tableId', width: 150 },
    { title: '库表中文名', dataIndex: 'tableName', width: 160 },
    { title: '库表英文名', dataIndex: 'tableEnglishName', width: 150 },
    { title: '数据来源', dataIndex: 'dataSourceId', width: 120, align: 'left' as const, render: (text: string) => (
      <Button type="link" size="small" onClick={() => setSourceModalVisible(true)} style={{ padding: 0, textAlign: 'left' }}>{text}</Button>
    )},
    { title: '关联产品ID', dataIndex: 'relatedProductId', width: 110 },
    { title: '预期更新时间', dataIndex: 'expectedUpdateTime', width: 150, align: 'center' as const },
    { title: '实际更新时间', dataIndex: 'actualUpdateTime', width: 150, align: 'center' as const },
    {
      title: '更新状态',
      dataIndex: 'updateStatus',
      width: 100,
      align: 'center' as const,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          'ontime': { color: 'success', text: '准时' },
          'delayed': { color: 'warning', text: '延迟' }
        }
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '数据波动率',
      dataIndex: 'fluctuationRate',
      width: 110,
      align: 'center' as const,
      render: (rate: number) => {
        const color = rate > 30 ? 'error' : rate > 15 ? 'warning' : 'success'
        return <Tag color={color}>{rate.toFixed(1)}%</Tag>
      }
    },
    {
      title: '预警状态',
      dataIndex: 'alertEnabled',
      width: 100,
      align: 'center' as const,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'blue' : 'default'}>{enabled ? '已开启' : '已关闭'}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: TableMonitorItem) => (
        <Button type="link" size="small" onClick={() => handleConfig(record)}>配置</Button>
      )
    },
  ]

  const handleConfig = (record: TableMonitorItem) => {
    setCurrentTable(record)
    configForm.setFieldsValue({
      alertThreshold: record.alertThreshold,
      alertEnabled: record.alertEnabled,
      alertPhones: record.alertPhones
    })
    setIsConfigModalVisible(true)
  }

  const handleConfigSubmit = () => {
    configForm.validateFields().then(values => {
      if (currentTable) {
        setData(data.map(item =>
          item.id === currentTable.id
            ? { ...item, alertThreshold: values.alertThreshold, alertEnabled: values.alertEnabled, alertPhones: values.alertPhones }
            : item
        ))
        message.success('预警配置保存成功')
        setIsConfigModalVisible(false)
      }
    })
  }

  // 实时告警数据（只有更新延迟类型）
  const [alertData] = useState<AlertItem[]>([
    { id: '1', time: '2024-02-01 14:32:15', tableId: 'T_SOCIAL_SECURITY', tableName: '社保缴纳信息表', tableEnglishName: 'T_SOCIAL_SECURITY', dataSourceId: 'BM00001-068', relatedProductId: 'PRD003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '2', time: '2024-02-01 14:28:10', tableId: 'T_PENALTY_RECORD', tableName: '行政处罚记录表', tableEnglishName: 'T_PENALTY_RECORD', dataSourceId: 'BM00001-068', relatedProductId: 'PRD002', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 09:30更新，延迟90分钟' },
    { id: '3', time: '2024-02-01 14:25:33', tableId: 'T_SOCIAL_SECURITY', tableName: '社保缴纳信息表', tableEnglishName: 'T_SOCIAL_SECURITY', dataSourceId: 'BM00001-068', relatedProductId: 'PRD003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '4', time: '2024-02-01 14:22:18', tableId: 'T_SOCIAL_SECURITY', tableName: '社保缴纳信息表', tableEnglishName: 'T_SOCIAL_SECURITY', dataSourceId: 'BM00001-068', relatedProductId: 'PRD003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '5', time: '2024-02-01 14:20:45', tableId: 'T_BUSINESS_REG', tableName: '工商注册信息表', tableEnglishName: 'T_BUSINESS_REG', dataSourceId: 'BM00001-068', relatedProductId: 'PRD004', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:45更新，延迟45分钟' },
    { id: '6', time: '2024-02-01 14:18:30', tableId: 'T_TAX_CREDIT', tableName: '纳税信用等级表', tableEnglishName: 'T_TAX_CREDIT', dataSourceId: 'BM00001-068', relatedProductId: 'PRD005', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:15更新，延迟15分钟' },
    { id: '7', time: '2024-02-01 14:15:22', tableId: 'T_CREDIT_SCORE', tableName: '企业信用评分表', tableEnglishName: 'T_CREDIT_SCORE', dataSourceId: 'BM00001-068', relatedProductId: 'PRD001', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:30更新，延迟30分钟' },
    { id: '8', time: '2024-02-01 14:12:08', tableId: 'T_PENALTY_RECORD', tableName: '行政处罚记录表', tableEnglishName: 'T_PENALTY_RECORD', dataSourceId: 'BM00001-068', relatedProductId: 'PRD002', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 09:30更新，延迟90分钟' },
  ])

  // 统计卡片数据
  const statsData = [
    { title: '库表总数', value: data.length, icon: <ClockCircleOutlined /> },
    { title: '准时更新', value: data.filter(item => item.updateStatus === 'ontime').length, icon: <CheckCircleOutlined />, color: '#52c41a' },
    { title: '延迟更新', value: data.filter(item => item.updateStatus === 'delayed').length, icon: <WarningOutlined />, color: '#faad14' },
    { title: '告警数量', value: alertData.length, icon: <CloseCircleOutlined />, color: '#f5222d' },
  ]

  // 告警查询状态
  const [alertSearchForm] = Form.useForm()
  const [filterAlertTableId, setFilterAlertTableId] = useState('')
  const [filterAlertTable, setFilterAlertTable] = useState('')
  const [filterAlertTableEn, setFilterAlertTableEn] = useState('')

  // 筛选后的告警数据
  const filteredAlertData = useMemo(() => {
    return alertData.filter(alert => {
      if (filterAlertTableId && !alert.tableId.toLowerCase().includes(filterAlertTableId.toLowerCase())) return false
      if (filterAlertTable && !alert.tableName.includes(filterAlertTable)) return false
      if (filterAlertTableEn && !alert.tableEnglishName.toLowerCase().includes(filterAlertTableEn.toLowerCase())) return false
      return true
    })
  }, [alertData, filterAlertTableId, filterAlertTable, filterAlertTableEn])

  // 告警表格列定义
  const alertColumns = [
    { title: '告警时间', dataIndex: 'time', width: 160 },
    { title: '库表ID', dataIndex: 'tableId', width: 150 },
    { title: '库表中文名', dataIndex: 'tableName', width: 140, ellipsis: true },
    { title: '库表英文名', dataIndex: 'tableEnglishName', width: 150 },
    { title: '数据来源', dataIndex: 'dataSourceId', width: 120, align: 'left' as const, render: (text: string) => <Button type="link" onClick={() => setSourceModalVisible(true)} style={{ padding: 0, textAlign: 'left' }}>{text}</Button> },
    { title: '关联产品ID', dataIndex: 'relatedProductId', width: 110 },
    { title: '告警类型', dataIndex: 'typeName', width: 100, render: (text: string) => <Tag color="warning">{text}</Tag> },
    { title: '告警详情', dataIndex: 'message', width: 240, ellipsis: true },
  ]

  // 告警查询表单字段
  const alertSearchFields = [
    { name: 'tableId', label: '库表ID', component: <Input placeholder="请输入库表ID" allowClear /> },
    { name: 'tableName', label: '库表中文名', component: <Input placeholder="请输入库表中文名" allowClear /> },
    { name: 'tableEnglishName', label: '库表英文名', component: <Input placeholder="请输入库表英文名" allowClear /> },
    { name: 'alertTime', label: '告警时间', component: <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']} /> },
  ]

  // 处理告警查询
  const handleAlertSearch = () => {
    const values = alertSearchForm.getFieldsValue()
    setFilterAlertTableId(values.tableId || '')
    setFilterAlertTable(values.tableName || '')
    setFilterAlertTableEn(values.tableEnglishName || '')
    message.success('查询成功')
  }

  // 处理告警重置
  const handleAlertReset = () => {
    alertSearchForm.resetFields()
    setFilterAlertTableId('')
    setFilterAlertTable('')
    setFilterAlertTableEn('')
    message.success('重置成功')
  }

  // 处理告警导出
  const handleAlertExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="table-update-monitor">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{stat.title}</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color || '#1890ff' }}>
                  {stat.icon && <span style={{ marginRight: 8 }}>{stat.icon}</span>}
                  {stat.value}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 实时告警 */}
      <Card title="实时告警" style={{ marginBottom: 16 }}>
        <Form form={alertSearchForm} style={{ marginBottom: 16 }}>
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
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          columns={alertColumns}
          dataSource={filteredAlertData}
          rowKey="id"
          size="small"
          scroll={{ x: 1200 }}
          pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ['10', '50', '100', '500', '1000', '5000', '8000'],
          onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 5 })
        }}
          locale={{ emptyText: <Empty description="暂无告警信息" /> }}
        />
      </Card>

      {/* 表监控列表 */}
      <Card title="库表质量监控" style={{ marginBottom: 16 }}>
        <Form form={tableSearchForm} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            {tableSearchFields.map((field, index) => (
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
                <Button type="primary" icon={<SearchOutlined />} onClick={handleTableSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleTableReset}>重置</Button>
                <Button icon={<ExportOutlined />} onClick={() => message.success('导出成功')}>导出</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={filteredTableData}
          rowKey="id"
          scroll={{ x: 1220 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 预警配置弹窗 */}
      <Modal
        title={`预警配置 - ${currentTable?.tableName}`}
        open={isConfigModalVisible}
        onOk={handleConfigSubmit}
        onCancel={() => setIsConfigModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={configForm} layout="vertical">
          <Alert
            message="监控规则说明"
            description="配置库表更新延迟的预警规则，当实际更新时间超过预期更新时间达到设定阈值时触发告警。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Card title="更新延迟预警规则" size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              name="alertThreshold"
              label="延迟阈值(分钟)"
              rules={[{ required: true, message: '请输入延迟阈值' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} max={1440} placeholder="请输入延迟阈值，如超过30分钟延迟则触发告警" />
            </Form.Item>
          </Card>
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

      {/* 数据来源弹窗 */}
      <Modal
        title="数据来源"
        open={sourceModalVisible}
        onCancel={() => setSourceModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSourceModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        <div>
          <p><strong>数据来源ID：</strong>BM00001-068</p>
          <p><strong>数据来源名称：</strong></p>
        </div>
      </Modal>
    </div>
  )
}

export default TableUpdateMonitor
