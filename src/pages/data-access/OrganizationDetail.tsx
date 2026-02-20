import { useState, useEffect } from 'react'
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Skeleton,
  Space,
  Table,
  message,
} from 'antd'
import { ArrowLeftOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'

interface Organization {
  id: string
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

const OrganizationDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Organization | null>(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockData: Organization = {
        id: id || '1',
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
      }
      setData(mockData)
      setLoading(false)
    }, 500)
  }, [id])

  const handleBack = () => {
    navigate('/main/data-access/organization', { replace: true })
  }

  const handleEdit = () => {
    navigate(`/main/data-access/organization/edit/${id}`, { replace: true })
  }

  // 导出合同信息
  const handleExportContracts = () => {
    const csvContent = [
      ['序号', '合同ID', '合同名称', '合同编号', '合同类型', '依附的主合同', '合同生效日期', '合同到期日期', '合同状态', '备注'].join(','),
      ...contractData.map((item, index) => [
        index + 1,
        item.contractId,
        item.contractName,
        item.contractNo,
        item.contractType,
        item.parentContract || '-',
        item.startDate,
        item.endDate,
        item.status,
        item.remark || '-'
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `合同信息_${data?.orgName || '数源机构'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    message.success('合同信息导出成功')
  }

  const getCooperationStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '合作中': 'success',
      '意向合作': 'processing',
      '结束合作': 'default',
      '终止合作': 'error',
    }
    return colorMap[status] || 'default'
  }

  // 合同列表数据
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
      width: 150,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 250,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 150,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 100,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '依附的主合同',
      dataIndex: 'parentContract',
      key: 'parentContract',
      width: 200,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val || '-'}</span>,
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同到期日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
    <div className="organization-detail">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <span>数源机构详情</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            编辑
          </Button>
        }
        className="detail-card"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 15 }} />
        ) : data ? (
          <>
            <Descriptions title="基本信息" bordered column={2} className="info-descriptions">
              <Descriptions.Item label="数源机构ID" className="col-1">{data.orgId}</Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码" className="col-2">{data.creditCode}</Descriptions.Item>
              <Descriptions.Item label="数源机构名称" className="col-1">{data.orgName}</Descriptions.Item>
              <Descriptions.Item label="数源机构简称" className="col-2">{data.orgShortName}</Descriptions.Item>
              <Descriptions.Item label="联系人" className="col-1">{data.contactName || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系电话" className="col-2">{data.contactPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系邮箱" className="col-1">{data.contactEmail || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系地址" className="col-2">
                {data.region} {data.detailAddress}
              </Descriptions.Item>
              <Descriptions.Item label="数源机构类型" className="col-1">
                <Tag>{data.orgType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="数源准入日期" className="col-2">{data.accessDate}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2} className="col-full">{data.remark || '-'}</Descriptions.Item>
            </Descriptions>

            <div className="cooperation-section">
              <Descriptions title="合作信息" bordered column={2} className="info-descriptions cooperation-descriptions">
                <Descriptions.Item label="合作状态" className="col-1">
                  <Tag color={getCooperationStatusColor(data.cooperationStatus)}>
                    {data.cooperationStatus}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="生效中合同数量" className="col-2">{contractData.length}</Descriptions.Item>
              </Descriptions>

              <div className="contract-subsection">
                <div className="contract-header">
                  <div className="subsection-title">合同信息</div>
                  <Button icon={<ExportOutlined />} onClick={handleExportContracts} size="small">
                    导出
                  </Button>
                </div>
                <Table
                  columns={contractColumns}
                  dataSource={contractData}
                  rowKey="contractId"
                  scroll={{ x: 1400 }}
                  pagination={false}
                  size="small"
                  bordered
                  className="contract-table"
                />
              </div>
            </div>

            <div className="manager-section">
              <Descriptions title="征信客户经理信息" bordered column={2} className="info-descriptions manager-descriptions">
                <Descriptions.Item label="客户经理姓名" className="col-1">{data.managerName || '-'}</Descriptions.Item>
                <Descriptions.Item label="客户经理电话" className="col-2">{data.managerPhone || '-'}</Descriptions.Item>
              </Descriptions>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default OrganizationDetail
