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
  Row,
  Col,
  Modal,
  message,
  Upload
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  ExportOutlined,
  DownOutlined,
  UpOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface InterfaceItem {
  id: string
  apiId: string
  apiNameCn: string
  fieldCount: number
  orgId: string
  contractId: string
  serviceStatus: string
  productStatus: string
  billingMode: string
  callCount: number
  queryCount: number
  hitCount: number
  queryRate: string
  hitRate: string
}

const InterfaceList = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fieldModalVisible, setFieldModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<InterfaceItem | null>(null)
  const [expandSearch, setExpandSearch] = useState(false)

  // 与原型数据完全一致
  const data: InterfaceItem[] = [
    {
      id: '1',
      apiId: 'API-000001',
      apiNameCn: '企业工商详情',
      fieldCount: 4,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 5000,
      queryCount: 4900,
      hitCount: 4500,
      queryRate: '98.00%',
      hitRate: '91.84%'
    },
    {
      id: '2',
      apiId: 'API-000002',
      apiNameCn: '企业年报信息',
      fieldCount: 5,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 100000,
      queryCount: 95000,
      hitCount: 93500,
      queryRate: '95.00%',
      hitRate: '98.42%'
    },
    {
      id: '3',
      apiId: 'API-000003',
      apiNameCn: '企业股东信息',
      fieldCount: 3,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 80000,
      queryCount: 78000,
      hitCount: 76000,
      queryRate: '97.50%',
      hitRate: '97.44%'
    },
    {
      id: '4',
      apiId: 'API-000004',
      apiNameCn: '企业变更记录',
      fieldCount: 4,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 6000,
      queryCount: 5800,
      hitCount: 5500,
      queryRate: '96.67%',
      hitRate: '94.83%'
    },
    {
      id: '5',
      apiId: 'API-000005',
      apiNameCn: '股权穿透(四层)',
      fieldCount: 1,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 5000,
      queryCount: 4800,
      hitCount: 4500,
      queryRate: '96.00%',
      hitRate: '93.75%'
    },
    {
      id: '6',
      apiId: 'API-000006',
      apiNameCn: '企业对外投资',
      fieldCount: 2,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 4500,
      queryCount: 4300,
      hitCount: 4000,
      queryRate: '95.56%',
      hitRate: '93.02%'
    },
    {
      id: '7',
      apiId: 'API-000007',
      apiNameCn: '企业主要人员',
      fieldCount: 3,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 7000,
      queryCount: 6800,
      hitCount: 6500,
      queryRate: '97.14%',
      hitRate: '95.59%'
    },
    {
      id: '8',
      apiId: 'API-000008',
      apiNameCn: '企业分支机构',
      fieldCount: 2,
      orgId: 'ORG-001',
      contractId: 'CONTRACT-2025-001',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 5500,
      queryCount: 5300,
      hitCount: 5000,
      queryRate: '96.36%',
      hitRate: '94.34%'
    },
    {
      id: '9',
      apiId: 'API-000009',
      apiNameCn: '裁判文书查询',
      fieldCount: 6,
      orgId: 'ORG-002',
      contractId: 'CONTRACT-2025-002',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 12000,
      queryCount: 11500,
      hitCount: 11000,
      queryRate: '95.83%',
      hitRate: '95.65%'
    },
    {
      id: '10',
      apiId: 'API-000010',
      apiNameCn: '被执行人查询',
      fieldCount: 3,
      orgId: 'ORG-002',
      contractId: 'CONTRACT-2025-002',
      serviceStatus: '已上线',
      productStatus: '已使用',
      billingMode: '查得计费',
      callCount: 9000,
      queryCount: 8700,
      hitCount: 8200,
      queryRate: '96.67%',
      hitRate: '94.25%'
    }
  ]

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '接口ID',
      dataIndex: 'apiId',
      width: 140
    },
    {
      title: '接口中文名',
      dataIndex: 'apiNameCn',
      width: 180
    },
    {
      title: '字段数',
      dataIndex: 'fieldCount',
      width: 90,
      align: 'center' as const,
      render: (val: number, record: InterfaceItem) => (
        <Button type="link" size="small" onClick={() => handleViewFields(record)}>
          {val}
        </Button>
      )
    },
    {
      title: '数源机构ID',
      dataIndex: 'orgId',
      width: 120
    },
    {
      title: '合同ID',
      dataIndex: 'contractId',
      width: 200
    },
    {
      title: '接口服务状态',
      dataIndex: 'serviceStatus',
      width: 140,
      align: 'center' as const,
      render: (val: string) => <Tag color="success">{val}</Tag>
    },
    {
      title: '产品服务状态',
      dataIndex: 'productStatus',
      width: 140,
      align: 'center' as const,
      render: (val: string) => <Tag color="processing">{val}</Tag>
    },
    {
      title: '计费模式',
      dataIndex: 'billingMode',
      width: 120,
      align: 'center' as const
    },
    {
      title: '调用量',
      dataIndex: 'callCount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '查询量',
      dataIndex: 'queryCount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '查得量',
      dataIndex: 'hitCount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '查询率',
      dataIndex: 'queryRate',
      width: 100,
      align: 'center' as const
    },
    {
      title: '查得率',
      dataIndex: 'hitRate',
      width: 100,
      align: 'center' as const
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: InterfaceItem) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/main/data-resource/interface/detail/${record.id}`, { replace: true })}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/main/data-resource/interface/edit/${record.id}`, { replace: true })}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DatabaseOutlined />} onClick={() => navigate(`/main/data-resource/interface/fields/${record.id}`, { replace: true })}>
            字段管理
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  const fieldColumns = [
    { title: '序号', key: 'index', width: 80, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '字段中文名', dataIndex: 'fieldCn', width: 150 },
    { title: '字段英文名', dataIndex: 'fieldEn', width: 150 },
    { title: '字段类型', dataIndex: 'fieldType', width: 100, align: 'center' as const },
    { title: '数据分级', dataIndex: 'dataLevel', width: 120, align: 'center' as const }
  ]

  const fieldData = [
    { id: '1', fieldCn: '企业类型', fieldEn: 'econKind', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '2', fieldCn: '注册资本', fieldEn: 'registCapi', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '3', fieldCn: '企业标签', fieldEn: 'tags', fieldType: 'Array', dataLevel: '1级—无损害' },
    { id: '4', fieldCn: '所属工商局', fieldEn: 'belongOrg', fieldType: 'String', dataLevel: '1级—无损害' }
  ]

  const handleViewFields = (record: InterfaceItem) => {
    setSelectedRecord(record)
    setFieldModalVisible(true)
  }

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
    message.success('导出成功')
  }

  const handleAdd = () => {
    navigate('/main/data-resource/interface/add', { replace: true })
  }

  const handleImport = () => {
    setImportModalVisible(true)
  }

  const handleDelete = (record: InterfaceItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除接口 "${record.apiNameCn}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功')
      }
    })
  }

  return (
    <div className="interface-list">
      {/* 查询栏 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="apiNameCn" label="接口中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入接口中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="apiId" label="接口ID" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入接口ID" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgId" label="数源机构ID" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数源机构ID" allowClear />
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
                <Form.Item name="serviceStatus" label="接口服务状态" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择接口服务状态" allowClear>
                    <Option value="已上线">已上线</Option>
                    <Option value="未上线">未上线</Option>
                    <Option value="已下线">已下线</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="productStatus" label="产品服务状态" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择产品服务状态" allowClear>
                    <Option value="未使用">未使用</Option>
                    <Option value="已使用">已使用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="link" onClick={() => setExpandSearch(!expandSearch)}>
                  {expandSearch ? '收起' : '展开'}
                  {expandSearch ? <UpOutlined /> : <DownOutlined />}
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

      {/* 列表 */}
      <Card
        className="table-card"
        title="数据接口管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              导入
            </Button>
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
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </Card>

      {/* 字段信息弹窗 */}
      <Modal
        title="字段信息"
        open={fieldModalVisible}
        onCancel={() => setFieldModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setFieldModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>接口中文名：</strong>{selectedRecord.apiNameCn}</p>
            <p><strong>接口ID：</strong>{selectedRecord.apiId}</p>
          </div>
        )}
        <Table
          columns={fieldColumns}
          dataSource={fieldData}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 导入弹窗 */}
      <Modal
        title="导入"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => { message.success('导入成功'); setImportModalVisible(false); }}>
            提交
          </Button>,
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            取消
          </Button>
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
          <p>1. <a href="#">下载模板</a>，请根据模板的格式填写信息；</p>
          <p>2. 上传文件不超过5M，仅支持上传xls、xlsx格式的文件。</p>
        </div>
        <Upload.Dragger
          name="file"
          multiple={false}
          beforeUpload={() => false}
          accept=".xls,.xlsx"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此处上传</p>
        </Upload.Dragger>
      </Modal>
    </div>
  )
}

export default InterfaceList
