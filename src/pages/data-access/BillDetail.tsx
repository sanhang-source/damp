import { useState, useEffect } from 'react'
import { Card, Button, Table, Space, message } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

const BillDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // 与原型数据完全一致
      setData([
        { id: '1', apiId: 'API-000001', apiName: '企业工商详情', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 1000, freeHitCount: 0, unitPrice: 0.10, totalPrice: 350.00 },
        { id: '2', apiId: 'API-000002', apiName: '企业年报信息', billingMode: '查得计费', queryCount: 95000, hitCount: 93500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 9350.00 },
        { id: '3', apiId: 'API-000003', apiName: '股东信息（工商登记）', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '4', apiId: 'API-000004', apiName: '企业人员董监高信息', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '5', apiId: 'API-000005', apiName: '股权穿透(四层)', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '6', apiId: 'API-000006', apiName: '企业主要人员', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '7', apiId: 'API-000007', apiName: '企业对外投资', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '8', apiId: 'API-000008', apiName: '企业工商详情', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '9', apiId: 'API-000009', apiName: '企业工商详情', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
        { id: '10', apiId: 'API-000010', apiName: '企业工商详情', billingMode: '查得计费', queryCount: 4900, hitCount: 4500, freeQueryCount: 0, freeHitCount: 0, unitPrice: 0.10, totalPrice: 450.00 },
      ])
      setLoading(false)
    }, 500)
  }, [id])

  const handleBack = () => navigate('/main/data-access/bill', { replace: true })

  const handleConfirm = () => {
    message.success('确认对账成功')
  }

  const handleCancel = () => {
    message.success('撤销对账成功')
  }

  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '接口ID', dataIndex: 'apiId', width: 120 },
    { title: '接口名称', dataIndex: 'apiName', width: 180 },
    { title: '计费模式', dataIndex: 'billingMode', width: 100, align: 'center' as const },
    { title: '计费查询量', dataIndex: 'queryCount', width: 120, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '计费查得量', dataIndex: 'hitCount', width: 120, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '免费测试查询量', dataIndex: 'freeQueryCount', width: 140, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '免费测试查得量', dataIndex: 'freeHitCount', width: 140, align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '单价（元）', dataIndex: 'unitPrice', width: 100, align: 'right' as const, render: (val: number) => val.toFixed(2) },
    { title: '总价（元）', dataIndex: 'totalPrice', width: 120, align: 'right' as const, render: (val: number) => val.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
  ]

  return (
    <div className="bill-detail">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <span>账单明细</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<CloseCircleOutlined />} onClick={handleCancel}>
              撤销对账
            </Button>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleConfirm}>
              确认对账
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

export default BillDetail
