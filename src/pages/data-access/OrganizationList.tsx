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
  Modal,
  message,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DownOutlined,
  UpOutlined,
  ExportOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface Organization {
  id: string
  orgId: string
  orgName: string
  creditCode: string
  orgType: string
  cooperationStatus: string
  contractCount: number
  resourceCount: number
  annualReviewDays: number
}

const OrganizationList = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [expandSearch, setExpandSearch] = useState(false)
  const [contractModalVisible, setContractModalVisible] = useState(false)

  const [data, _setData] = useState<Organization[]>([
    {
      id: '1',
      orgId: 'DS-00001',
      orgName: '上海生腾数据科技有限公司',
      creditCode: '91310106MA1FY86D4M',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 4,
      resourceCount: 26,
      annualReviewDays: 360,
    },
    {
      id: '2',
      orgId: 'DS-00002',
      orgName: '上海凭安征信服务有限公司',
      creditCode: '91310105312565457T',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 3,
      resourceCount: 26,
      annualReviewDays: 360,
    },
    {
      id: '3',
      orgId: 'DS-00003',
      orgName: '武汉凌禹信息科技有限公司',
      creditCode: '91420100MA4K4D2TXM',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 2,
      resourceCount: 20,
      annualReviewDays: 58,
    },
    {
      id: '4',
      orgId: 'DS-00004',
      orgName: '中胜信用管理有限公司',
      creditCode: '91110000318309737D',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 1,
      resourceCount: 18,
      annualReviewDays: 42,
    },
    {
      id: '5',
      orgId: 'DS-00005',
      orgName: '杭州微风企科技有限公司',
      creditCode: '91330106MA2CD59L5E',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 1,
      resourceCount: 26,
      annualReviewDays: 300,
    },
    {
      id: '6',
      orgId: 'DS-00006',
      orgName: '企查查科技股份有限公司',
      creditCode: '91320594088140947F',
      orgType: '商业数据',
      cooperationStatus: '意向合作',
      contractCount: 0,
      resourceCount: 0,
      annualReviewDays: 0,
    },
    {
      id: '7',
      orgId: 'DS-00007',
      orgName: '盟浪可持续数字科技（深圳）有限公司',
      creditCode: '91440300MA5GQ5C022',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 1,
      resourceCount: 26,
      annualReviewDays: 42,
    },
    {
      id: '8',
      orgId: 'DS-00008',
      orgName: '上海烯牛信息技术有限公司',
      creditCode: '91310112MA1GB7MH1K',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 1,
      resourceCount: 28,
      annualReviewDays: 240,
    },
    {
      id: '9',
      orgId: 'DS-00009',
      orgName: '北京视野智慧数字科技有限公司',
      creditCode: '91110108318179792X',
      orgType: '商业数据',
      cooperationStatus: '合作中',
      contractCount: 1,
      resourceCount: 28,
      annualReviewDays: 300,
    },
    {
      id: '10',
      orgId: 'DS-00010',
      orgName: '北京法海风控科技有限公司',
      creditCode: '91110108MA006EU5X6',
      orgType: '商业数据',
      cooperationStatus: '结束合作',
      contractCount: 0,
      resourceCount: 0,
      annualReviewDays: 0,
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
      title: '数源机构ID',
      dataIndex: 'orgId',
      key: 'orgId',
      width: 120,
    },
    {
      title: '数源机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 250,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'creditCode',
      key: 'creditCode',
      width: 180,
    },
    {
      title: '数源机构类型',
      dataIndex: 'orgType',
      key: 'orgType',
      width: 120,
    },
    {
      title: '合作状态',
      dataIndex: 'cooperationStatus',
      key: 'cooperationStatus',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '合作中': 'success',
          '意向合作': 'processing',
          '结束合作': 'default',
          '终止合作': 'error',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '生效中合同数量',
      dataIndex: 'contractCount',
      key: 'contractCount',
      width: 130,
      align: 'center' as const,
      render: (count: number, record: Organization) => (
        <a onClick={() => handleContract(record)} style={{ color: '#0066ff', cursor: 'pointer' }}>
          {count}
        </a>
      ),
    },
    {
      title: '接入数据资源数量',
      dataIndex: 'resourceCount',
      key: 'resourceCount',
      width: 140,
      align: 'center' as const,
    },
    {
      title: '年审剩余期限',
      dataIndex: 'annualReviewDays',
      key: 'annualReviewDays',
      width: 120,
      align: 'center' as const,
      render: (days: number) => (
        <span style={{ color: days < 60 ? '#ff4d4f' : 'inherit' }}>
          {days}天
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right' as const,
      render: (_: any, record: Organization) => (
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
    navigate('/main/data-access/organization/add', { replace: true })
  }

  const handleView = (record: Organization) => {
    navigate(`/main/data-access/organization/detail/${record.id}`, { replace: true })
  }

  const handleEdit = (record: Organization) => {
    navigate(`/main/data-access/organization/edit/${record.id}`, { replace: true })
  }



  const handleContract = (_record: Organization) => {
    setContractModalVisible(true)
  }

  const handleExport = () => {
    // 模拟导出功能
    const csvContent = [
      ['数源机构ID', '数源机构名称', '统一社会信用代码', '数源机构类型', '合作状态', '生效中合同数量', '接入数据资源数量', '年审剩余期限'].join(','),
      ...data.map(item => [
        item.orgId,
        item.orgName,
        item.creditCode,
        item.orgType,
        item.cooperationStatus,
        item.contractCount,
        item.resourceCount,
        item.annualReviewDays + '天'
      ].join(','))
    ].join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `数据接入机构管理_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    message.success('导出成功')
  }

  const contractColumns = [
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
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '依附的主合同',
      dataIndex: 'parentContract',
      key: 'parentContract',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val || '-'}</span>,
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同到期日期',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '生效中' ? 'success' : 'default'} style={{ whiteSpace: 'nowrap' }}>{status}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val || '-'}</span>,
    },
  ]

  const contractData = [
    {
      contractId: 'CON_2025_00001',
      contractName: '2025年度启信宝数据采购合同',
      contractNo: 'CON_2025_00001',
      contractType: '主合同',
      parentContract: '',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      contractId: 'CON_2025_00002',
      contractName: '2024年度启信宝数据采购合同',
      contractNo: 'CON_2025_00002',
      contractType: '主合同',
      parentContract: '',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      contractId: 'CON_2025_00003',
      contractName: '2023年度启信宝数据采购合同补充协议',
      contractNo: 'CON_2025_00003',
      contractType: '补充协议',
      parentContract: '2025年度启信宝数据采购合同',
      startDate: '2025-06-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      contractId: 'CON_2025_00004',
      contractName: '2022年度启信宝数据采购合同补充协议',
      contractNo: 'CON_2025_00004',
      contractType: '补充协议',
      parentContract: '2025年度启信宝数据采购合同',
      startDate: '2025-05-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
  ]

  return (
    <div className="organization-list">
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
            <Col span={8}>
              <Form.Item
                name="orgId"
                label="数源机构ID"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入数源机构ID" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="cooperationStatus"
                label="合作状态"
                style={{ marginBottom: 0 }}
              >
                <Select placeholder="请选择合作状态" allowClear>
                  <Option value="全部">全部</Option>
                  <Option value="合作中">合作中</Option>
                  <Option value="意向合作">意向合作</Option>
                  <Option value="结束合作">结束合作</Option>
                  <Option value="终止合作">终止合作</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {expandSearch && (
            <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
              <Col span={8}>
                <Form.Item
                  name="orgType"
                  label="数源机构类型"
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder="请选择数源机构类型" allowClear>
                    <Option value="商业数据">商业数据</Option>
                    <Option value="政务数据">政务数据</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="creditCode"
                  label="统一社会信用代码"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="请输入统一社会信用代码" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="annualReviewDays"
                  label="年审剩余期限"
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder="请选择年审剩余期限" allowClear>
                    <Option value="0-30">30天内</Option>
                    <Option value="30-60">30-60天</Option>
                    <Option value="60-90">60-90天</Option>
                    <Option value="90+">90天以上</Option>
                  </Select>
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
        title="数据接入机构管理"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
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
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
          }}
        />
      </Card>

      <Modal
        title="合同信息"
        open={contractModalVisible}
        onCancel={() => setContractModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Table
          columns={contractColumns}
          dataSource={contractData}
          rowKey="contractId"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Modal>
    </div>
  )
}

export default OrganizationList
