import { useState } from 'react'
import {
  Card,
  Button,
  Table,
  Space,
  message,
  Descriptions,
  Typography
} from 'antd'
import {
  ArrowLeftOutlined,
  ExportOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

// 结算概览数据接口
interface SettlementOverview {
  orgName: string
  orgId: string
  settledAmount: number
  statDate: string
  totalQueryCount: number
  totalHitCount: number
  frozenQueryCount: number
  frozenHitCount: number
  settledQueryCount: number
  settledHitCount: number
  pendingQueryCount: number
  pendingHitCount: number
}

// 接口结算明细接口
interface ApiSettlementDetail {
  id: string
  apiId: string
  apiName: string
  billingMode: string
  totalQueryCount: number
  totalHitCount: number
  frozenQueryCount: number
  frozenHitCount: number
  settledQueryCount: number
  settledHitCount: number
  pendingQueryCount: number
  pendingHitCount: number
  settledAmount: number
}

const SettlementStats = () => {
  const navigate = useNavigate()
  const [loading] = useState(false)

  // 结算概览数据（与原型一致）
  const overviewData: SettlementOverview = {
    orgName: '上海生腾数据科技有限公司',
    orgId: 'DS-00001',
    settledAmount: 53000.00,
    statDate: '2025-05-31',
    totalQueryCount: 100000,
    totalHitCount: 92000,
    frozenQueryCount: 0,
    frozenHitCount: 0,
    settledQueryCount: 20000,
    settledHitCount: 12000,
    pendingQueryCount: 80000,
    pendingHitCount: 80000
  }

  // 接口结算明细数据（与原型一致）
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [detailData] = useState<ApiSettlementDetail[]>([
    {
      id: '1',
      apiId: 'API-000001',
      apiName: '企业工商详情',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '2',
      apiId: 'API-000002',
      apiName: '企业年报信息',
      billingMode: '查得计费',
      totalQueryCount: 95000,
      totalHitCount: 93500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 95000,
      settledHitCount: 93500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 6058.00
    },
    {
      id: '3',
      apiId: 'API-000003',
      apiName: '股东信息（工商登记）',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '4',
      apiId: 'API-000004',
      apiName: '企业人员董监高信息',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '5',
      apiId: 'API-000005',
      apiName: '股权穿透(四层)',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '6',
      apiId: 'API-000006',
      apiName: '开庭公告核查',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '7',
      apiId: 'API-000007',
      apiName: '立案信息核查',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '8',
      apiId: 'API-000008',
      apiName: '法院公告核查',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '9',
      apiId: 'API-000009',
      apiName: '限制高消费核查【董监高】',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    },
    {
      id: '10',
      apiId: 'API-000010',
      apiName: '被执行人核查【董监高】',
      billingMode: '查得计费',
      totalQueryCount: 4900,
      totalHitCount: 4500,
      frozenQueryCount: 0,
      frozenHitCount: 0,
      settledQueryCount: 4900,
      settledHitCount: 4500,
      pendingQueryCount: 0,
      pendingHitCount: 0,
      settledAmount: 1280.00
    }
  ])

  // 接口结算明细表格列
  const detailColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '接口ID',
      dataIndex: 'apiId',
      width: 130
    },
    {
      title: '接口名称',
      dataIndex: 'apiName',
      width: 200
    },
    {
      title: '计费模式',
      dataIndex: 'billingMode',
      width: 100,
      align: 'center' as const
    },
    {
      title: '累计查询量',
      dataIndex: 'totalQueryCount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '累计查得量',
      dataIndex: 'totalHitCount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '冻结查询量',
      dataIndex: 'frozenQueryCount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '冻结查得量',
      dataIndex: 'frozenHitCount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '已结算查询量',
      dataIndex: 'settledQueryCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '已结算查得量',
      dataIndex: 'settledHitCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '待结算查询量',
      dataIndex: 'pendingQueryCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '待结算查得量',
      dataIndex: 'pendingHitCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '已结算金额（元）',
      dataIndex: 'settledAmount',
      width: 140,
      align: 'right' as const,
      render: (val: number) => val.toFixed(2)
    }
  ]

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="settlement-stats-page">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/main/data-access/billing', { replace: true })}>
              返回
            </Button>
            <Text strong style={{ fontSize: 16 }}>结算统计</Text>
          </Space>
        }
      >
        {/* 结算概览 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
            结算概览
          </Text>
          <Descriptions bordered column={2} className="info-descriptions">
            <Descriptions.Item label="数源机构名称" className="col-1">{overviewData.orgName}</Descriptions.Item>
            <Descriptions.Item label="数源机构ID" className="col-2">{overviewData.orgId}</Descriptions.Item>
            <Descriptions.Item label="已结算金额（元）" className="col-1">{overviewData.settledAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Descriptions.Item>
            <Descriptions.Item label="调用量统计日期" className="col-2">{overviewData.statDate}</Descriptions.Item>
            <Descriptions.Item label="累计查询量" className="col-1">{overviewData.totalQueryCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="累计查得量" className="col-2">{overviewData.totalHitCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="冻结查询量" className="col-1">{overviewData.frozenQueryCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="冻结查得量" className="col-2">{overviewData.frozenHitCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="已结算查询量" className="col-1">{overviewData.settledQueryCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="已结算查得量" className="col-2">{overviewData.settledHitCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="待结算查询量" className="col-1">{overviewData.pendingQueryCount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="待结算查得量" className="col-2">{overviewData.pendingHitCount.toLocaleString()}</Descriptions.Item>
          </Descriptions>
        </div>

        {/* 接口结算明细 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong style={{ fontSize: 16 }}>
              接口结算明细
            </Text>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </div>
          <Table
            columns={detailColumns}
            dataSource={detailData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1500 }}
            pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
        }}
          />
        </div>
      </Card>
    </div>
  )
}

export default SettlementStats
