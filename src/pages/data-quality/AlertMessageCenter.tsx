import { useState, useMemo } from 'react'
import { Card, Table, Tag, Row, Col, Button, Space, Form, Input, Select, Badge, Statistic, Empty } from 'antd'
import { ReloadOutlined, SearchOutlined, ClearOutlined, ApiOutlined, DatabaseOutlined, LineChartOutlined } from '@ant-design/icons'

// 告警来源类型
type AlertSource = 'interface' | 'table' | 'indicator'

// 告警信息接口
interface AlertMessage {
  id: string
  source: AlertSource
  sourceName: string
  objectId: string
  objectName: string
  alertType: string
  alertTime: string
  message: string
  createTime: string // 用于90天过滤
}

const AlertMessageCenter = () => {
  // Mock数据 - 汇总三个来源的告警
  const [alertData] = useState<AlertMessage[]>([
    // 接口质量告警
    { id: '1', source: 'interface', sourceName: '接口质量', objectId: 'API001', objectName: '企业信用查询接口', alertType: '查得率低', alertTime: '2024-02-05 14:32:15', message: '近10分钟查得率15%，低于阈值20%', createTime: '2024-02-05' },
    { id: '2', source: 'interface', sourceName: '接口质量', objectId: 'API003', objectName: '社保信息核验接口', alertType: '响应超时', alertTime: '2024-02-05 14:28:10', message: '平均响应时间3200ms，超过阈值3000ms', createTime: '2024-02-05' },
    { id: '3', source: 'interface', sourceName: '接口质量', objectId: 'API002', objectName: '行政处罚查询接口', alertType: '错误率高', alertTime: '2024-02-05 14:25:33', message: '近30分钟错误率8.5%，超过阈值5%', createTime: '2024-02-05' },
    
    // 库表更新告警
    { id: '4', source: 'table', sourceName: '库表更新', objectId: 'T_PENALTY_RECORD', objectName: '行政处罚记录表', alertType: '更新延迟', alertTime: '2024-02-05 14:22:18', message: '预期2024-02-05 08:00更新，实际2024-02-05 09:30更新，延迟90分钟', createTime: '2024-02-05' },
    { id: '5', source: 'table', sourceName: '库表更新', objectId: 'T_SOCIAL_SECURITY', objectName: '社保缴纳信息表', alertType: '更新延迟', alertTime: '2024-02-05 14:20:45', message: '预期2024-02-05 08:00更新，实际2024-02-05 10:15更新，延迟135分钟', createTime: '2024-02-05' },
    { id: '6', source: 'table', sourceName: '库表更新', objectId: 'T_BUSINESS_REG', objectName: '工商注册信息表', alertType: '更新延迟', alertTime: '2024-02-05 14:15:22', message: '预期2024-02-05 08:00更新，实际2024-02-05 08:45更新，延迟45分钟', createTime: '2024-02-05' },
    
    // 指标质量告警
    { id: '7', source: 'indicator', sourceName: '指标质量', objectId: 'IND002', objectName: '行政处罚记录数', alertType: '更新延迟', alertTime: '2024-02-05 14:12:08', message: '预期2024-02-05 08:00更新，实际2024-02-05 09:30更新，延迟90分钟', createTime: '2024-02-05' },
    { id: '8', source: 'indicator', sourceName: '指标质量', objectId: 'IND003', objectName: '社保缴纳企业数', alertType: '更新延迟', alertTime: '2024-02-05 14:08:30', message: '预期2024-02-05 08:00更新，实际2024-02-05 10:15更新，延迟135分钟', createTime: '2024-02-05' },
    
    // 历史数据（超过90天的示例）
    { id: '9', source: 'interface', sourceName: '接口质量', objectId: 'API001', objectName: '企业信用查询接口', alertType: '查得率低', alertTime: '2023-10-01 10:00:00', message: '历史告警数据', createTime: '2023-10-01' },
  ])

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
    { title: '对象ID', dataIndex: 'objectId', width: 140 },
    { title: '对象名称', dataIndex: 'objectName', width: 180, ellipsis: true },
    { title: '告警类型', dataIndex: 'alertType', width: 120, render: (text: string) => <Tag>{text}</Tag> },
    { title: '告警详情', dataIndex: 'message', width: 300, ellipsis: true },
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
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条（仅显示近90天数据）`,
          }}
          locale={{ emptyText: <Empty description="暂无告警消息" /> }}
        />
      </Card>
    </div>
  )
}

export default AlertMessageCenter
