import { useState, useEffect } from 'react'
import { Card, Descriptions, Button, Tag, Skeleton, Space, Table } from 'antd'
import { ArrowLeftOutlined, EditOutlined, ExportOutlined, FileOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'

interface DataResource {
  id: string
  apiId: string
  apiName: string
  accessStatus: string
  onlineTime: string
  applyStatus: string
  serviceStatus: string
  billingMode: string
  billingPrice: string
  packageStartDate: string
  packageEndDate: string
  apiDesc: string
  billingRemark: string
}

interface SupplementaryAgreement {
  id: string
  contractId: string
  contractName: string
  contractNo: string
  startDate: string
  endDate: string
  remark: string
}

interface ContractAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: string
}

const ContractDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [dataResources, setDataResources] = useState<DataResource[]>([])
  const [agreements, setAgreements] = useState<SupplementaryAgreement[]>([])
  const [attachments, setAttachments] = useState<ContractAttachment[]>([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData({
        contractName: '2025年度启信宝数据采购合同',
        contractNo: 'DP-CT-20250101001',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        orgName: '上海生腾数据科技有限公司',
        contractType: '主合同',
        involveBilling: '是',
        parentContract: '-',
        remark: '-',
      })

      setDataResources([
        {
          id: '1',
          apiId: 'API-000001',
          apiName: '企业工商详情',
          accessStatus: '已上线',
          onlineTime: '2025-10-10',
          applyStatus: '已应用',
          serviceStatus: '已开发服务',
          billingMode: '查得计费',
          billingPrice: '',
          packageStartDate: '2025-10-10',
          packageEndDate: '2026-10-10',
          apiDesc: '',
          billingRemark: '',
        },
        {
          id: '2',
          apiId: 'API-000002',
          apiName: '企业年报信息',
          accessStatus: '已上线',
          onlineTime: '2025-10-10',
          applyStatus: '已应用',
          serviceStatus: '已开发服务',
          billingMode: '查得计费',
          billingPrice: '',
          packageStartDate: '2025-10-10',
          packageEndDate: '2026-10-10',
          apiDesc: '',
          billingRemark: '',
        },
      ])

      setAgreements([
        {
          id: '1',
          contractId: 'CON-2025-00001',
          contractName: '2025年度启信宝数据采购合同补充协议',
          contractNo: 'DP-CT-20250501001',
          startDate: '2025-05-01',
          endDate: '2025-12-31',
          remark: '-',
        },
        {
          id: '2',
          contractId: 'CON-2025-00002',
          contractName: '2025年度启信宝数据采购合同补充协议',
          contractNo: 'DP-CT-20250601001',
          startDate: '2025-06-01',
          endDate: '2025-12-31',
          remark: '-',
        },
      ])

      setAttachments([
        {
          id: '1',
          fileName: '合同正文.pdf',
          fileType: 'pdf',
          fileSize: '2.5MB',
        },
      ])

      setLoading(false)
    }, 500)
  }, [id])

  const handleBack = () => navigate('/main/data-access/contract', { replace: true })
  const handleEdit = () => navigate(`/main/data-access/contract/edit/${id}`, { replace: true })

  const handleExportDataResources = () => {
  }

  const handleViewAttachment = (_record: ContractAttachment) => {
  }

  const dataResourceColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center' as const,
    },
    {
      title: '接口ID',
      dataIndex: 'apiId',
      key: 'apiId',
      width: 120,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '接口名称',
      dataIndex: 'apiName',
      key: 'apiName',
      width: 150,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '接入状态',
      dataIndex: 'accessStatus',
      key: 'accessStatus',
      width: 100,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '上线时间',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '应用状态',
      dataIndex: 'applyStatus',
      key: 'applyStatus',
      width: 100,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '服务状态',
      dataIndex: 'serviceStatus',
      key: 'serviceStatus',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '计费模式',
      dataIndex: 'billingMode',
      key: 'billingMode',
      width: 100,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '计费价格',
      dataIndex: 'billingPrice',
      key: 'billingPrice',
      width: 100,
      align: 'center' as const,
      render: (value: string) => <span style={{ whiteSpace: 'nowrap' }}>{value || '-'}</span>,
    },
    {
      title: '包时开始日期',
      dataIndex: 'packageStartDate',
      key: 'packageStartDate',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '包时结束日期',
      dataIndex: 'packageEndDate',
      key: 'packageEndDate',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '接口说明',
      dataIndex: 'apiDesc',
      key: 'apiDesc',
      width: 120,
      render: (value: string) => <span style={{ whiteSpace: 'nowrap' }}>{value || '-'}</span>,
    },
    {
      title: '计费规则备注',
      dataIndex: 'billingRemark',
      key: 'billingRemark',
      width: 120,
      render: (value: string) => <span style={{ whiteSpace: 'nowrap' }}>{value || '-'}</span>,
    },
  ]

  const agreementColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center' as const,
    },
    {
      title: '合同ID',
      dataIndex: 'contractId',
      key: 'contractId',
      width: 140,
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
      width: 160,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '合同结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <span style={{ whiteSpace: 'nowrap' }}>{val}</span>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 100,
      render: (value: string) => <span style={{ whiteSpace: 'nowrap' }}>{value || '-'}</span>,
    },
    {
      title: '合同附件',
      key: 'attachment',
      width: 100,
      align: 'center' as const,
      render: () => (
        <Button type="link" size="small" icon={<EyeOutlined />}>
          查看
        </Button>
      ),
    },
  ]

  return (
    <div className="contract-detail">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <span>数源机构合同详情</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
        }
        className="detail-card"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : data ? (
          <>
            <Descriptions title="基本信息" bordered column={2} className="info-descriptions">
              <Descriptions.Item label="合同名称" className="col-1">{data.contractName}</Descriptions.Item>
              <Descriptions.Item label="合同编号" className="col-2">{data.contractNo}</Descriptions.Item>
              <Descriptions.Item label="合同生效日期" className="col-1">{data.startDate}</Descriptions.Item>
              <Descriptions.Item label="合同到期日期" className="col-2">{data.endDate}</Descriptions.Item>
              <Descriptions.Item label="数据机构名称" className="col-1">{data.orgName}</Descriptions.Item>
              <Descriptions.Item label="合同类型" className="col-2">
                <Tag color={data.contractType === '主合同' ? 'blue' : 'orange'}>{data.contractType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="是否涉及计费" className="col-1">{data.involveBilling}</Descriptions.Item>
              <Descriptions.Item label="依附的主合同" className="col-2">{data.parentContract}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2} className="col-full">{data.remark}</Descriptions.Item>
            </Descriptions>

            <div className="module-section">
              <div className="module-header">
                <span className="module-title">数据资源信息</span>
                <Button icon={<ExportOutlined />} onClick={handleExportDataResources} size="small">
                  导出
                </Button>
              </div>
              <Table
                columns={dataResourceColumns}
                dataSource={dataResources}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1500 }}
                size="small"
                bordered
                className="contract-table"
              />
            </div>

            <div className="module-section">
              <div className="module-header">
                <span className="module-title">补充协议信息</span>
              </div>
              <Table
                columns={agreementColumns}
                dataSource={agreements}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
                className="contract-table"
              />
            </div>

            <div className="module-section">
              <div className="module-header">
                <span className="module-title">合同附件</span>
              </div>
              <div className="attachment-list">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="attachment-item"
                    onClick={() => handleViewAttachment(file)}
                  >
                    <FileOutlined className="attachment-icon" />
                    <div className="attachment-name">{file.fileName}</div>
                    <div className="attachment-size">{file.fileSize}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default ContractDetail
