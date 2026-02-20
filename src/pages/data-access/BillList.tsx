import { useState } from 'react'
import { Card, Form, Input, Select, Button, Table, Space, Tag, Row, Col, DatePicker, message } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined, ExportOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'


const { Option } = Select
const { RangePicker } = DatePicker

const BillList = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading] = useState(false)
  const [expandSearch, setExpandSearch] = useState(false)

  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '账单ID', dataIndex: 'billId', width: 180 },
    { title: '数源机构名称', dataIndex: 'orgName', width: 220, ellipsis: true },
    { title: '对账查询量', dataIndex: 'queryCount', width: 120, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '对账查得量', dataIndex: 'hitCount', width: 120, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '对账日期', dataIndex: 'reconcileDate', width: 120, align: 'center' as const },
    { title: '对账状态', dataIndex: 'status', width: 100, align: 'center' as const, render: (status: string) => {
      const colorMap: Record<string, string> = {
        '待确认': 'warning',
        '已确认': 'success',
      }
      return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
    }},
    { title: '对账人', dataIndex: 'reconciler', width: 100, align: 'center' as const },
    { title: '操作', key: 'action', width: 120, align: 'center' as const, fixed: 'right' as const, render: (_: any, record: any) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/main/data-access/bill/detail/${record.id}`, { replace: true })}>
        账单明细
      </Button>
    )},
  ]

  // 与原型数据完全一致
  const data = [
    { id: '1', billId: 'SJJRZD20251011010', orgName: '上海生腾数据科技有限公司', queryCount: 20000, hitCount: 20000, reconcileDate: '2025-06-18', status: '待确认', reconciler: '赵六' },
    { id: '2', billId: 'SJJRZD20251011009', orgName: '上海凭安征信服务有限公司', queryCount: 16430, hitCount: 16430, reconcileDate: '2025-06-18', status: '待确认', reconciler: '赵六' },
    { id: '3', billId: 'SJJRZD20251011008', orgName: '武汉凌禹信息科技有限公司', queryCount: 10185, hitCount: 10185, reconcileDate: '2025-06-18', status: '已确认', reconciler: '赵六' },
    { id: '4', billId: 'SJJRZD20251011007', orgName: '中胜信用管理有限公司', queryCount: 10000, hitCount: 10000, reconcileDate: '2025-06-18', status: '已确认', reconciler: '赵六' },
    { id: '5', billId: 'SJJRZD20251011006', orgName: '北京金堤科技有限公司', queryCount: 9850, hitCount: 9850, reconcileDate: '2025-06-17', status: '已确认', reconciler: '赵六' },
    { id: '6', billId: 'SJJRZD20251011005', orgName: '百行征信有限公司', queryCount: 8750, hitCount: 8750, reconcileDate: '2025-06-17', status: '已确认', reconciler: '赵六' },
    { id: '7', billId: 'SJJRZD20251011004', orgName: '苏州企业征信服务有限公司', queryCount: 7200, hitCount: 7200, reconcileDate: '2025-06-17', status: '已确认', reconciler: '赵六' },
    { id: '8', billId: 'SJJRZD20251011003', orgName: '浙江汇信科技有限公司', queryCount: 6500, hitCount: 6500, reconcileDate: '2025-06-16', status: '已确认', reconciler: '赵六' },
    { id: '9', billId: 'SJJRZD20251011002', orgName: '福建省企业信用信息管理有限公司', queryCount: 5200, hitCount: 5200, reconcileDate: '2025-06-16', status: '已确认', reconciler: '赵六' },
    { id: '10', billId: 'SJJRZD20251011001', orgName: '四川省大数据中心', queryCount: 4800, hitCount: 4800, reconcileDate: '2025-06-16', status: '已确认', reconciler: '赵六' },
  ]

  const handleSearch = () => {
    message.success('查询成功')
  }

  const handleReset = () => {
    form.resetFields()
    handleSearch()
  }

  const handleExport = () => {
    // 模拟导出功能
    const csvContent = [
      ['序号', '账单ID', '数源机构名称', '对账查询量', '对账查得量', '对账日期', '对账状态', '对账人'].join(','),
      ...data.map((item, index) => [
        index + 1,
        item.billId,
        item.orgName,
        item.queryCount,
        item.hitCount,
        item.reconcileDate,
        item.status,
        item.reconciler,
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `数据接入账单管理_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    message.success('导出成功')
  }

  return (
    <div className="bill-list">
      {/* 查询栏 - 与数据接入机构管理页面样式一致 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="orgName" label="数据机构名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数据机构名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="billId" label="账单ID" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入账单ID" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="对账状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择对账状态" allowClear>
                  <Option value="全部">全部</Option>
                  <Option value="待确认">待确认</Option>
                  <Option value="已确认">已确认</Option>
                  <Option value="已撤销">已撤销</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {expandSearch && (
            <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
              <Col span={8}>
                <Form.Item name="reconcileDateRange" label="对账日期" style={{ marginBottom: 0 }}>
                  <RangePicker
                    placeholder={['开始日期', '结束日期']}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="link" onClick={() => setExpandSearch(!expandSearch)}>
                  {expandSearch ? <><UpOutlined /> 收起</> : <><DownOutlined /> 展开</>}
                </Button>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
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

      {/* 列表 - 标题改为"数据接入账单管理" */}
      <Card
        className="table-card"
        title="数据接入账单管理"
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default BillList
