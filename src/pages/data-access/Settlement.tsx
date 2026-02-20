import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  DatePicker,
  Row,
  Col,
  message,
  Popconfirm,
  Typography,
  Modal,
  Tag,
  Descriptions
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Text } = Typography

// 数源机构信息接口
interface OrgInfo {
  orgName: string
  contactEmail: string
  contactPerson: string
  contactPhone: string
  pendingQueryCount: number
  pendingHitCount: number
}

// 合同信息接口
interface ContractInfo {
  id: string
  contractId: string
  contractName: string
  contractType: string
  parentContract: string
  startDate: string
  endDate: string
  status: string
  remark: string
}

// 接口调用信息接口
interface ApiCallInfo {
  id: string
  apiId: string
  apiName: string
  billingMode: string
  pendingQueryCount: number
  pendingHitCount: number
  statDate: string
}

// 对账明细接口
interface SettlementItem {
  id: string
  apiId: string
  apiName: string
  billingMode: string
  pendingQueryCount: number
  pendingHitCount: number
  billingQueryCount: number
  billingHitCount: number
  freeTestQueryCount: number
  freeTestHitCount: number
  unitPrice: number
  totalPrice: number
}

const Settlement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading] = useState(false)
  const [editingKey, setEditingKey] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [_currentRecord, setCurrentRecord] = useState<ApiCallInfo | null>(null)
  const [selectedApiRows, setSelectedApiRows] = useState<ApiCallInfo[]>([])

  // 数源机构信息
  const orgInfo: OrgInfo = {
    orgName: location.state?.orgName || '上海生腾数据科技有限公司',
    contactEmail: '15158133333@189.com',
    contactPerson: '张三',
    contactPhone: '13800138000',
    pendingQueryCount: 20000,
    pendingHitCount: 20000,
  }

  // 合同信息 - 与结算.html原型完全一致
  const [contractData] = useState<ContractInfo[]>([
    {
      id: '1',
      contractId: 'CON-2025-00001',
      contractName: '2025年度启信宝数据采购合同',
      contractType: '主合同',
      parentContract: '-',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      id: '2',
      contractId: 'CON-2025-00002',
      contractName: '2024年度启信宝数据采购合同',
      contractType: '主合同',
      parentContract: '-',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      id: '3',
      contractId: 'CON-2025-00003',
      contractName: '2023年度启信宝数据采购合同补充协议',
      contractType: '补充协议',
      parentContract: '2025年度启信宝数据采购合同',
      startDate: '2025-06-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
    {
      id: '4',
      contractId: 'CON-2025-00004',
      contractName: '2022年度启信宝数据采购合同补充协议',
      contractType: '补充协议',
      parentContract: '2025年度启信宝数据采购合同',
      startDate: '2025-05-01',
      endDate: '2027-12-31',
      status: '生效中',
      remark: '-',
    },
  ])

  // 接口调用信息
  const [apiCallData] = useState<ApiCallInfo[]>([
    {
      id: '1',
      apiId: 'API-000001',
      apiName: '企业工商详情',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '2',
      apiId: 'API-000002',
      apiName: '企业年报信息',
      billingMode: '查得计费',
      pendingQueryCount: 95000,
      pendingHitCount: 93500,
      statDate: '2025-05-31'
    },
    {
      id: '3',
      apiId: 'API-000003',
      apiName: '股东信息（工商登记）',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '4',
      apiId: 'API-000004',
      apiName: '企业人员董监高信息',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '5',
      apiId: 'API-000005',
      apiName: '股权穿透(四层)',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '6',
      apiId: 'API-000006',
      apiName: '开庭公告核查',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '7',
      apiId: 'API-000007',
      apiName: '立案信息核查',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '8',
      apiId: 'API-000008',
      apiName: '法院公告核查',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '9',
      apiId: 'API-000009',
      apiName: '限制高消费核查【董监高】',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
    {
      id: '10',
      apiId: 'API-000010',
      apiName: '被执行人核查【董监高】',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      statDate: '2025-05-31'
    },
  ])

  // 对账明细数据
  const [settlementData, setSettlementData] = useState<SettlementItem[]>([
    {
      id: '1',
      apiId: 'API-000001',
      apiName: '企业工商详情',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      billingQueryCount: 4900,
      billingHitCount: 4500,
      freeTestQueryCount: 1000,
      freeTestHitCount: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
    {
      id: '2',
      apiId: 'API-000002',
      apiName: '企业年报信息',
      billingMode: '查得计费',
      pendingQueryCount: 95000,
      pendingHitCount: 93500,
      billingQueryCount: 95000,
      billingHitCount: 93500,
      freeTestQueryCount: 0,
      freeTestHitCount: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
    {
      id: '3',
      apiId: 'API-000003',
      apiName: '股东信息（工商登记）',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      billingQueryCount: 4900,
      billingHitCount: 4500,
      freeTestQueryCount: 0,
      freeTestHitCount: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
    {
      id: '4',
      apiId: 'API-000004',
      apiName: '企业人员董监高信息',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      billingQueryCount: 4900,
      billingHitCount: 4500,
      freeTestQueryCount: 0,
      freeTestHitCount: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
    {
      id: '5',
      apiId: 'API-000005',
      apiName: '股权穿透(四层)',
      billingMode: '查得计费',
      pendingQueryCount: 4900,
      pendingHitCount: 4500,
      billingQueryCount: 4900,
      billingHitCount: 4500,
      freeTestQueryCount: 0,
      freeTestHitCount: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ])

  const isEditing = (record: SettlementItem) => record.id === editingKey

  const edit = (record: SettlementItem) => {
    form.setFieldsValue({
      billingHitCount: record.billingHitCount,
      unitPrice: record.unitPrice,
      freeTestQueryCount: record.freeTestQueryCount,
      freeTestHitCount: record.freeTestHitCount,
    })
    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id: string) => {
    try {
      const row = await form.validateFields()
      const newData = [...settlementData]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        const item = newData[index]
        const billingHitCount = row.billingHitCount ?? item.billingHitCount
        const unitPrice = row.unitPrice ?? item.unitPrice
        const freeTestQueryCount = row.freeTestQueryCount ?? item.freeTestQueryCount
        const freeTestHitCount = row.freeTestHitCount ?? item.freeTestHitCount
        newData.splice(index, 1, {
          ...item,
          ...row,
          billingHitCount,
          unitPrice,
          freeTestQueryCount,
          freeTestHitCount,
          totalPrice: billingHitCount * unitPrice,
        })
        setSettlementData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
    }
  }

  const handleDelete = (id: string) => {
    setSettlementData(settlementData.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  const handleCopy = (record: SettlementItem) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      apiId: record.apiId + '_COPY',
    }
    setSettlementData([...settlementData, newRecord])
    message.success('复制成功')
  }

  const handleSettlement = (record: ApiCallInfo) => {
    setCurrentRecord(record)
    setIsModalOpen(true)
  }

  const handleBatchSettlement = () => {
    if (selectedApiRows.length === 0) {
      message.warning('请选择需要对账的接口')
      return
    }
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    setIsModalOpen(false)
    message.success('对账成功')
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
  }: any) => {
    const inputNode = inputType === 'number' ? <InputNumber style={{ width: '100%' }} /> : <Input />
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入${title}`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  // 合同信息表格列
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
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 250,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '依附的主合同',
      dataIndex: 'parentContract',
      width: 200,
    },
    {
      title: '合同生效日期',
      dataIndex: 'startDate',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '合同到期日期',
      dataIndex: 'endDate',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color="success">{status}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
    {
      title: '合同附件',
      key: 'attachment',
      width: 100,
      align: 'center' as const,
      render: () => (
        <Button type="link" size="small" icon={<FileTextOutlined />}>
          查看
        </Button>
      ),
    },
  ]

  // 接口调用信息表格列
  const apiCallColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '接口ID',
      dataIndex: 'apiId',
      width: 120,
    },
    {
      title: '接口名称',
      dataIndex: 'apiName',
      width: 200,
    },
    {
      title: '计费模式',
      dataIndex: 'billingMode',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '待结算查询量',
      dataIndex: 'pendingQueryCount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '待结算查得量',
      dataIndex: 'pendingHitCount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '调用量统计日期',
      dataIndex: 'statDate',
      width: 130,
      align: 'center' as const,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: ApiCallInfo) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSettlement(record)}
        >
          对账
        </Button>
      ),
    },
  ]

  // 对账明细表格列
  const settlementColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '接口ID',
      dataIndex: 'apiId',
      width: 120,
    },
    {
      title: '接口名称',
      dataIndex: 'apiName',
      width: 200,
    },
    {
      title: '计费模式',
      dataIndex: 'billingMode',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '待结算查询量',
      dataIndex: 'pendingQueryCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '待结算查得量',
      dataIndex: 'pendingHitCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '计费查询量',
      dataIndex: 'billingQueryCount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '计费查得量',
      dataIndex: 'billingHitCount',
      width: 110,
      align: 'right' as const,
      editable: true,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '免费测试查询量',
      dataIndex: 'freeTestQueryCount',
      width: 130,
      align: 'right' as const,
      editable: true,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '免费测试查得量',
      dataIndex: 'freeTestHitCount',
      width: 130,
      align: 'right' as const,
      editable: true,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '单价（元）',
      dataIndex: 'unitPrice',
      width: 100,
      align: 'right' as const,
      editable: true,
      render: (val: number) => val.toFixed(2),
    },
    {
      title: '总价（元）',
      dataIndex: 'totalPrice',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toFixed(2),
    },
    {
      title: '操作',
      key: 'action',
      width: 230,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: SettlementItem) => {
        const editable = isEditing(record)
        return editable ? (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => save(record.id)}
            >
              保存
            </Button>
            <Button type="link" size="small" icon={<CloseOutlined />} onClick={cancel}>
              取消
            </Button>
          </Space>
        ) : (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            >
              复制
            </Button>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = settlementColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: SettlementItem) => ({
        record,
        inputType: col.dataIndex === 'unitPrice' || 
                   col.dataIndex === 'billingHitCount' || 
                   col.dataIndex === 'freeTestQueryCount' || 
                   col.dataIndex === 'freeTestHitCount' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const totalAmount = settlementData.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="settlement-page">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/main/data-access/billing', { replace: true })}>
              返回
            </Button>
            <span>结算</span>
          </Space>
        }
      >
        {/* 数源机构信息 */}
        <div style={{ marginBottom: 24 }}>
          <Descriptions title="数源机构信息" bordered column={2} className="info-descriptions">
            <Descriptions.Item label="数源机构名称" className="col-1">{orgInfo.orgName}</Descriptions.Item>
            <Descriptions.Item label="联系邮箱" className="col-2">{orgInfo.contactEmail}</Descriptions.Item>
            <Descriptions.Item label="联系人" className="col-1">{orgInfo.contactPerson}</Descriptions.Item>
            <Descriptions.Item label="联系电话" className="col-2">{orgInfo.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="待结算查询量" className="col-1">
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{orgInfo.pendingQueryCount.toLocaleString()}</span>
            </Descriptions.Item>
            <Descriptions.Item label="待结算查得量" className="col-2">
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{orgInfo.pendingHitCount.toLocaleString()}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 合同信息 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
            合同信息
          </Text>
          <Table
            columns={contractColumns}
            dataSource={contractData}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1300 }}
            size="small"
            bordered
          />
        </div>

        {/* 接口调用信息 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong style={{ fontSize: 16 }}>
              接口调用信息
            </Text>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleBatchSettlement}
              disabled={selectedApiRows.length === 0}
            >
              批量对账
            </Button>
          </div>
          <Table
            columns={apiCallColumns}
            dataSource={apiCallData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            size="small"
            bordered
            rowSelection={{
              type: 'checkbox',
              onChange: (_: any, rows: ApiCallInfo[]) => setSelectedApiRows(rows),
            }}
          />
        </div>

      </Card>

      {/* 对账弹窗 */}
      <Modal
        title="对账单制作"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1600}
        okText="发送对账单"
        cancelText="取消"
      >
        <Form form={form} component={false}>
          <Row gutter={24} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Form.Item
                label="对账周期"
                required
                style={{ marginBottom: 0 }}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  defaultValue={[dayjs('2025-01-01'), dayjs('2025-01-31')]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="对账单接收邮箱"
                required
                style={{ marginBottom: 0 }}
              >
                <Input defaultValue="15158133333@189.com" />
              </Form.Item>
            </Col>
          </Row>

          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={settlementData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            size="small"
            bordered
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={11} align="right">
                  <Text strong>合计金额（元）：</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                    {totalAmount.toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            )}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default Settlement
