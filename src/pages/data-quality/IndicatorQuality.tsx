import { useState, useMemo } from 'react'
import { Card, Table, Tag, Row, Col, Button, Space, Modal, Form, Input, InputNumber, Switch, message, DatePicker, Empty, Alert } from 'antd'
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'

interface IndicatorItem {
  id: string
  indicatorName: string
  indicatorId: string
  indicatorEnglishName: string
  dataSourceId: string
  relatedResourceId: string
  expectedUpdateTime: string
  actualUpdateTime: string
  updateStatus: 'ontime' | 'delayed'
  nullRate: number
  fluctuationRate: number
  alertEnabled: boolean
  alertThreshold: number
  alertPhones: string
}

// 告警信息接口
interface AlertItem {
  id: string
  time: string
  indicatorId: string
  indicatorName: string
  indicatorEnglishName: string
  dataSourceId: string
  relatedResourceId: string
  type: 'delay'
  typeName: string
  level: 'warning' | 'error'
  message: string
}

const IndicatorQuality = () => {
  const [data, setData] = useState<IndicatorItem[]>([
    { id: '1', indicatorName: '企业信用评分均值', indicatorId: 'IND001', indicatorEnglishName: 'AVG_CREDIT_SCORE', dataSourceId: 'BM00001-068', relatedResourceId: 'RES001', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 07:45', updateStatus: 'ontime', nullRate: 0.02, fluctuationRate: 5.5, alertEnabled: true, alertThreshold: 30, alertPhones: '13800138001' },
    { id: '2', indicatorName: '行政处罚记录数', indicatorId: 'IND002', indicatorEnglishName: 'PENALTY_RECORD_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES002', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 09:30', updateStatus: 'delayed', nullRate: 0.15, fluctuationRate: 42.8, alertEnabled: true, alertThreshold: 30, alertPhones: '13800138002' },
    { id: '3', indicatorName: '社保缴纳企业数', indicatorId: 'IND003', indicatorEnglishName: 'SOCIAL_SECURITY_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES003', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 10:15', updateStatus: 'delayed', nullRate: 0.08, fluctuationRate: 12.3, alertEnabled: true, alertThreshold: 30, alertPhones: '13800138003' },
    { id: '4', indicatorName: '工商注册企业数', indicatorId: 'IND004', indicatorEnglishName: 'BUSINESS_REG_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES004', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 07:58', updateStatus: 'ontime', nullRate: 0.01, fluctuationRate: 3.2, alertEnabled: false, alertThreshold: 30, alertPhones: '' },
    { id: '5', indicatorName: '纳税信用A级占比', indicatorId: 'IND005', indicatorEnglishName: 'TAX_CREDIT_A_RATIO', dataSourceId: 'BM00001-068', relatedResourceId: 'RES005', expectedUpdateTime: '2024-02-01 08:00', actualUpdateTime: '2024-02-01 08:15', updateStatus: 'ontime', nullRate: 0.05, fluctuationRate: 8.7, alertEnabled: true, alertThreshold: 30, alertPhones: '13800138005' },
  ])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)
  const [currentIndicator, setCurrentIndicator] = useState<IndicatorItem | null>(null)
  const [configForm] = Form.useForm()
  
  // 数据来源弹窗状态
  const [sourceModalVisible, setSourceModalVisible] = useState(false)
  
  // 指标监控查询状态
  const [indicatorSearchForm] = Form.useForm()
  const [filterIndicatorId, setFilterIndicatorId] = useState('')
  const [filterIndicatorName, setFilterIndicatorName] = useState('')
  const [filterIndicatorEnName, setFilterIndicatorEnName] = useState('')
  
  // 筛选后的指标数据
  const filteredIndicatorData = useMemo(() => {
    return data.filter(record => {
      if (filterIndicatorId && !record.indicatorId.toLowerCase().includes(filterIndicatorId.toLowerCase())) return false
      if (filterIndicatorName && !record.indicatorName.includes(filterIndicatorName)) return false
      if (filterIndicatorEnName && !record.indicatorEnglishName.toLowerCase().includes(filterIndicatorEnName.toLowerCase())) return false
      return true
    })
  }, [data, filterIndicatorId, filterIndicatorName, filterIndicatorEnName])
  
  // 指标监控查询字段
  const indicatorSearchFields = [
    { name: 'indicatorId', label: '指标ID', component: <Input placeholder="请输入指标ID" allowClear /> },
    { name: 'indicatorName', label: '指标中文名', component: <Input placeholder="请输入指标中文名" allowClear /> },
    { name: 'indicatorEnglishName', label: '指标英文名', component: <Input placeholder="请输入指标英文名" allowClear /> },
  ]

  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '指标ID', dataIndex: 'indicatorId', width: 110 },
    { title: '指标中文名', dataIndex: 'indicatorName', width: 160 },
    { title: '指标英文名', dataIndex: 'indicatorEnglishName', width: 180 },
    { title: '数据来源', dataIndex: 'dataSourceId', width: 120, align: 'left' as const, render: (text: string) => (
      <Button type="link" size="small" onClick={() => setSourceModalVisible(true)} style={{ padding: 0, textAlign: 'left' }}>{text}</Button>
    )},
    { title: '关联资源ID', dataIndex: 'relatedResourceId', width: 110 },
    { title: '预期更新时间', dataIndex: 'expectedUpdateTime', width: 150 },
    { title: '实际更新时间', dataIndex: 'actualUpdateTime', width: 150 },
    {
      title: '更新状态',
      dataIndex: 'updateStatus',
      width: 100,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={status === 'ontime' ? 'success' : 'warning'}>
          {status === 'ontime' ? '准时' : '延迟'}
        </Tag>
      )
    },
    {
      title: '空值率',
      dataIndex: 'nullRate',
      width: 100,
      align: 'center' as const,
      render: (rate: number) => {
        const percent = (rate * 100).toFixed(2)
        const color = rate > 0.1 ? 'error' : rate > 0.05 ? 'warning' : 'success'
        return <Tag color={color}>{percent}%</Tag>
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
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: IndicatorItem) => (
        <Button type="link" size="small" onClick={() => handleConfig(record)}>
          配置
        </Button>
      )
    },
  ]

  const handleConfig = (record: IndicatorItem) => {
    setCurrentIndicator(record)
    configForm.setFieldsValue({
      alertThreshold: record.alertThreshold,
      alertEnabled: record.alertEnabled,
      alertPhones: record.alertPhones
    })
    setIsConfigModalVisible(true)
  }

  const handleConfigSubmit = () => {
    configForm.validateFields().then(values => {
      if (currentIndicator) {
        setData(data.map(item =>
          item.id === currentIndicator.id
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
    { id: '1', time: '2024-02-01 14:32:15', indicatorId: 'IND003', indicatorName: '社保缴纳企业数', indicatorEnglishName: 'SOCIAL_SECURITY_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '2', time: '2024-02-01 14:28:10', indicatorId: 'IND002', indicatorName: '行政处罚记录数', indicatorEnglishName: 'PENALTY_RECORD_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES002', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 09:30更新，延迟90分钟' },
    { id: '3', time: '2024-02-01 14:25:33', indicatorId: 'IND003', indicatorName: '社保缴纳企业数', indicatorEnglishName: 'SOCIAL_SECURITY_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '4', time: '2024-02-01 14:22:18', indicatorId: 'IND003', indicatorName: '社保缴纳企业数', indicatorEnglishName: 'SOCIAL_SECURITY_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES003', type: 'delay', typeName: '更新延迟', level: 'error', message: '预期2024-02-01 08:00更新，实际2024-02-01 10:15更新，延迟135分钟' },
    { id: '5', time: '2024-02-01 14:20:45', indicatorId: 'IND004', indicatorName: '工商注册企业数', indicatorEnglishName: 'BUSINESS_REG_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES004', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:45更新，延迟45分钟' },
    { id: '6', time: '2024-02-01 14:18:30', indicatorId: 'IND005', indicatorName: '纳税信用A级占比', indicatorEnglishName: 'TAX_CREDIT_A_RATIO', dataSourceId: 'BM00001-068', relatedResourceId: 'RES005', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:15更新，延迟15分钟' },
    { id: '7', time: '2024-02-01 14:15:22', indicatorId: 'IND001', indicatorName: '企业信用评分均值', indicatorEnglishName: 'AVG_CREDIT_SCORE', dataSourceId: 'BM00001-068', relatedResourceId: 'RES001', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 08:30更新，延迟30分钟' },
    { id: '8', time: '2024-02-01 14:12:08', indicatorId: 'IND002', indicatorName: '行政处罚记录数', indicatorEnglishName: 'PENALTY_RECORD_COUNT', dataSourceId: 'BM00001-068', relatedResourceId: 'RES002', type: 'delay', typeName: '更新延迟', level: 'warning', message: '预期2024-02-01 08:00更新，实际2024-02-01 09:30更新，延迟90分钟' },
  ])

  // 统计卡片数据
  const statsData = [
    { title: '指标总数', value: data.length, icon: <ClockCircleOutlined /> },
    { title: '准时更新', value: data.filter(item => item.updateStatus === 'ontime').length, icon: <CheckCircleOutlined />, color: '#52c41a' },
    { title: '延迟更新', value: data.filter(item => item.updateStatus === 'delayed').length, icon: <WarningOutlined />, color: '#faad14' },
    { title: '告警数量', value: alertData.length, icon: <CloseCircleOutlined />, color: '#f5222d' },
  ]

  // 告警查询状态
  const [alertSearchForm] = Form.useForm()
  const [filterAlertIndicatorId, setFilterAlertIndicatorId] = useState('')
  const [filterAlertIndicator, setFilterAlertIndicator] = useState('')
  const [filterAlertIndicatorEn, setFilterAlertIndicatorEn] = useState('')

  // 筛选后的告警数据
  const filteredAlertData = useMemo(() => {
    return alertData.filter(alert => {
      if (filterAlertIndicatorId && !alert.indicatorId.toLowerCase().includes(filterAlertIndicatorId.toLowerCase())) return false
      if (filterAlertIndicator && !alert.indicatorName.includes(filterAlertIndicator)) return false
      if (filterAlertIndicatorEn && !alert.indicatorEnglishName.toLowerCase().includes(filterAlertIndicatorEn.toLowerCase())) return false
      return true
    })
  }, [alertData, filterAlertIndicatorId, filterAlertIndicator, filterAlertIndicatorEn])

  // 告警表格列定义
  const alertColumns = [
    { title: '告警时间', dataIndex: 'time', width: 160 },
    { title: '指标ID', dataIndex: 'indicatorId', width: 110 },
    { title: '指标中文名', dataIndex: 'indicatorName', width: 160, ellipsis: true },
    { title: '指标英文名', dataIndex: 'indicatorEnglishName', width: 180 },
    { title: '数据来源', dataIndex: 'dataSourceId', width: 120, align: 'left' as const, render: (text: string) => <Button type="link" onClick={() => setSourceModalVisible(true)} style={{ padding: 0, textAlign: 'left' }}>{text}</Button> },
    { title: '关联资源ID', dataIndex: 'relatedResourceId', width: 110 },
    { title: '告警类型', dataIndex: 'typeName', width: 100, render: (text: string) => <Tag color="warning">{text}</Tag> },
    { title: '告警详情', dataIndex: 'message', width: 320, ellipsis: true },
  ]

  // 告警查询表单字段
  const alertSearchFields = [
    { name: 'indicatorId', label: '指标ID', component: <Input placeholder="请输入指标ID" allowClear /> },
    { name: 'indicatorName', label: '指标中文名', component: <Input placeholder="请输入指标中文名" allowClear /> },
    { name: 'indicatorEnglishName', label: '指标英文名', component: <Input placeholder="请输入指标英文名" allowClear /> },
    { name: 'alertTime', label: '告警时间', component: <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']} /> },
  ]

  // 处理告警查询
  const handleAlertSearch = () => {
    const values = alertSearchForm.getFieldsValue()
    setFilterAlertIndicatorId(values.indicatorId || '')
    setFilterAlertIndicator(values.indicatorName || '')
    setFilterAlertIndicatorEn(values.indicatorEnglishName || '')
    message.success('查询成功')
  }

  // 处理告警重置
  const handleAlertReset = () => {
    alertSearchForm.resetFields()
    setFilterAlertIndicatorId('')
    setFilterAlertIndicator('')
    setFilterAlertIndicatorEn('')
    message.success('重置成功')
  }

  // 处理告警导出
  const handleAlertExport = () => {
    message.success('导出成功')
  }
  
  // 处理指标查询
  const handleIndicatorSearch = () => {
    const values = indicatorSearchForm.getFieldsValue()
    setFilterIndicatorId(values.indicatorId || '')
    setFilterIndicatorName(values.indicatorName || '')
    setFilterIndicatorEnName(values.indicatorEnglishName || '')
    message.success('查询成功')
  }

  // 处理指标重置
  const handleIndicatorReset = () => {
    indicatorSearchForm.resetFields()
    setFilterIndicatorId('')
    setFilterIndicatorName('')
    setFilterIndicatorEnName('')
    message.success('重置成功')
  }

  return (
    <div className="indicator-quality">
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
          scroll={{ x: 1260 }}
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

      {/* 指标监控列表 */}
      <Card title="指标质量监控" style={{ marginBottom: 16 }}>
        <Form form={indicatorSearchForm} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            {indicatorSearchFields.map((field, index) => (
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
                <Button type="primary" icon={<SearchOutlined />} onClick={handleIndicatorSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleIndicatorReset}>重置</Button>
                <Button icon={<ExportOutlined />} onClick={() => message.success('导出成功')}>导出</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={filteredIndicatorData}
          rowKey="id"
          scroll={{ x: 1380 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 预警配置弹窗 */}
      <Modal
        title={`预警配置 - ${currentIndicator?.indicatorName}`}
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
            description="配置指标更新延迟的预警规则，当实际更新时间超过预期更新时间达到设定阈值时触发告警。"
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

export default IndicatorQuality
