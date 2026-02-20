import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Tag,
  message,
  DatePicker,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  ExportOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'


const { Option } = Select
const { RangePicker } = DatePicker

interface Contract {
  id: string
  contractId: string
  contractName: string
  contractNo: string
  orgName: string
  remainingDays: number | string
  contractType: string
  startDate: string
  endDate: string
  status: string
}

const ContractList = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [expandSearch, setExpandSearch] = useState(false)
  const [data, _setData] = useState<Contract[]>([
    {
      id: '1',
      contractId: 'CON-2025-00001',
      contractName: '2025年度启信宝数据采购合同',
      contractNo: 'DP-CT-20250101001',
      orgName: '上海生腾数据科技有限公司',
      remainingDays: 900,
      contractType: '主合同',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: '生效中',
    },
    {
      id: '2',
      contractId: 'CON-2025-00002',
      contractName: '2024年度启信宝数据采购合同',
      contractNo: 'DP-CT-20240101001',
      orgName: '上海生腾数据科技有限公司',
      remainingDays: 540,
      contractType: '主合同',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: '生效中',
    },
    {
      id: '3',
      contractId: 'CON-2025-00003',
      contractName: '2023年度启信宝数据采购合同',
      contractNo: 'DP-CT-20230101001',
      orgName: '上海生腾数据科技有限公司',
      remainingDays: 180,
      contractType: '主合同',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      status: '生效中',
    },
    {
      id: '4',
      contractId: 'CON-2025-00004',
      contractName: '2022年度启信宝数据采购合同',
      contractNo: 'DP-CT-20220101001',
      orgName: '上海生腾数据科技有限公司',
      remainingDays: '-',
      contractType: '主合同',
      startDate: '2022-01-01',
      endDate: '2024-12-31',
      status: '已结束',
    },
    {
      id: '5',
      contractId: 'CON-2025-00005',
      contractName: '2025年度凭安征信数据采购合同',
      contractNo: 'DP-CT-20250101002',
      orgName: '上海凭安征信服务有限公司',
      remainingDays: 900,
      contractType: '主合同',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: '生效中',
    },
    {
      id: '6',
      contractId: 'CON-2025-00006',
      contractName: '2024年度凭安征信数据采购合同',
      contractNo: 'DP-CT-20240101002',
      orgName: '上海凭安征信服务有限公司',
      remainingDays: 540,
      contractType: '主合同',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: '生效中',
    },
    {
      id: '7',
      contractId: 'CON-2025-00007',
      contractName: '2023年度凭安征信数据采购合同',
      contractNo: 'DP-CT-20230101002',
      orgName: '上海凭安征信服务有限公司',
      remainingDays: 180,
      contractType: '主合同',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      status: '生效中',
    },
    {
      id: '8',
      contractId: 'CON-2025-00008',
      contractName: '2022年度凭安征信数据采购合同',
      contractNo: 'DP-CT-20220101002',
      orgName: '上海凭安征信服务有限公司',
      remainingDays: '-',
      contractType: '主合同',
      startDate: '2022-01-01',
      endDate: '2024-12-31',
      status: '已结束',
    },
    {
      id: '9',
      contractId: 'CON-2025-00009',
      contractName: '2025年度凌禹数据采购合同',
      contractNo: 'DP-CT-20250101003',
      orgName: '武汉凌禹信息科技有限公司',
      remainingDays: 900,
      contractType: '补充协议',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: '生效中',
    },
    {
      id: '10',
      contractId: 'CON-2025-00010',
      contractName: '2024年度凌禹数据采购合同',
      contractNo: 'DP-CT-20240101003',
      orgName: '武汉凌禹信息科技有限公司',
      remainingDays: 540,
      contractType: '补充协议',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: '生效中',
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
      title: '合同ID',
      dataIndex: 'contractId',
      key: 'contractId',
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 280,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 180,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '数源机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 220,
    },
    {
      title: '合同剩余期限',
      dataIndex: 'remainingDays',
      key: 'remainingDays',
      width: 120,
      align: 'center' as const,
      render: (days: number | string) => {
        if (typeof days === 'number') {
          return <span style={{ color: days <= 180 ? '#ff4d4f' : 'inherit' }}>{days}天</span>
        }
        return days
      },
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === '主合同' ? 'blue' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '合同到期日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '生效中': 'success',
          '已结束': 'default',
          '已终止': 'error',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      fixed: 'right' as const,
      render: (_: any, record: Contract) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
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

  const handleAdd = () => {
    navigate('/main/data-access/contract/add', { replace: true })
  }

  const handleView = (record: Contract) => {
    navigate(`/main/data-access/contract/detail/${record.id}`, { replace: true })
  }

  const handleEdit = (record: Contract) => {
    navigate(`/main/data-access/contract/edit/${record.id}`, { replace: true })
  }



  return (
    <div className="contract-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="orgName" label="数源机构名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数源机构名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contractName" label="合同名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入合同名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remainingDays" label="合同剩余期限" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择合同剩余期限" allowClear>
                  <Option value="0-30">30天内</Option>
                  <Option value="30-90">30-90天</Option>
                  <Option value="90-180">90-180天</Option>
                  <Option value="180+">180天以上</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {expandSearch && (
            <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
              <Col span={8}>
                <Form.Item name="contractId" label="合同ID" style={{ marginBottom: 0 }}>
                  <Input placeholder="请输入合同ID" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="合同状态" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择合同状态" allowClear>
                    <Option value="生效中">生效中</Option>
                    <Option value="已结束">已结束</Option>
                    <Option value="已终止">已终止</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="endDateRange" label="合同到期日期" style={{ marginBottom: 0 }}>
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button
                  type="link"
                  onClick={() => setExpandSearch(!expandSearch)}
                >
                  {expandSearch ? <><UpOutlined /> 收起</> : <><DownOutlined /> 展开</>}
                </Button>
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

      <Card
        className="table-card"
        title="数源机构合同管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
            <Button icon={<ExportOutlined />} onClick={() => message.success('导出成功')}>
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
          scroll={{ x: 1400 }}
          pagination={{
            total: data.length,
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

export default ContractList
