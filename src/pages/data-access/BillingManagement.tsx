import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  message,
  Row,
  Col,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface BillingRecord {
  id: string
  orgName: string
  pendingQueryCount: number
  pendingHitCount: number
  statDate: string
  lastSettlementDate: string
}

const BillingManagement = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [, setSelectedRows] = useState<BillingRecord[]>([])

  const [data] = useState<BillingRecord[]>([
    {
      id: '1',
      orgName: '上海生腾数据科技有限公司',
      pendingQueryCount: 20000,
      pendingHitCount: 20000,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-18',
    },
    {
      id: '2',
      orgName: '上海凭安征信服务有限公司',
      pendingQueryCount: 16430,
      pendingHitCount: 16430,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-18',
    },
    {
      id: '3',
      orgName: '武汉凌禹信息科技有限公司',
      pendingQueryCount: 10185,
      pendingHitCount: 10185,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-18',
    },
    {
      id: '4',
      orgName: '中胜信用管理有限公司',
      pendingQueryCount: 10000,
      pendingHitCount: 10000,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-18',
    },
    {
      id: '5',
      orgName: '杭州微风企科技有限公司',
      pendingQueryCount: 8500,
      pendingHitCount: 8200,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-15',
    },
    {
      id: '6',
      orgName: '企查查科技股份有限公司',
      pendingQueryCount: 12000,
      pendingHitCount: 11500,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-10',
    },
    {
      id: '7',
      orgName: '盟浪可持续数字科技（深圳）有限责任公司',
      pendingQueryCount: 8000,
      pendingHitCount: 7800,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-08',
    },
    {
      id: '8',
      orgName: '上海烯牛信息技术有限公司',
      pendingQueryCount: 6500,
      pendingHitCount: 6200,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-05',
    },
    {
      id: '9',
      orgName: '北京视野智慧数字科技有限公司',
      pendingQueryCount: 5000,
      pendingHitCount: 4800,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-06-01',
    },
    {
      id: '10',
      orgName: '北京法海风控科技有限公司',
      pendingQueryCount: 4200,
      pendingHitCount: 4000,
      statDate: '2025-05-31',
      lastSettlementDate: '2025-05-28',
    },
  ])

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '数源机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 280,
    },
    {
      title: '待结算查询量',
      dataIndex: 'pendingQueryCount',
      key: 'pendingQueryCount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '待结算查得量',
      dataIndex: 'pendingHitCount',
      key: 'pendingHitCount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '调用量统计日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 130,
      align: 'center' as const,
    },
    {
      title: '最近结算日期',
      dataIndex: 'lastSettlementDate',
      key: 'lastSettlementDate',
      width: 130,
      align: 'center' as const,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: BillingRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleSettlement(record)}
          >
            结算
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => handleSettlementStats(record)}
          >
            结算统计
          </Button>
        </Space>
      ),
    },
  ]

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('查询成功')
    }, 500)
  }

  const handleReset = () => {
    form.resetFields()
    handleSearch()
  }

  const handleExport = () => {
    const csvContent = [
      ['序号', '数源机构名称', '待结算查询量', '待结算查得量', '调用量统计日期', '最近结算日期'].join(','),
      ...data.map((item, index) => [
        index + 1,
        item.orgName,
        item.pendingQueryCount,
        item.pendingHitCount,
        item.statDate,
        item.lastSettlementDate
      ].join(','))
    ].join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `数据接入计费管理_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    message.success('导出成功')
  }

  const handleSettlement = (record: BillingRecord) => {
    navigate('/main/data-access/settlement', { replace: true, state: { orgName: record.orgName } })
  }

  const handleSettlementStats = (record: BillingRecord) => {
    navigate('/main/data-access/settlement-stats', { replace: true, state: { orgName: record.orgName } })
  }

  return (
    <div className="billing-management">
      {/* 搜索区域 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item
                name="orgName"
                label="数源机构名称"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入数源机构名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={16} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card
        title="数据接入计费管理"
        extra={
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (_: any, rows: BillingRecord[]) => setSelectedRows(rows),
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
          }}
        />
      </Card>
    </div>
  )
}

export default BillingManagement
