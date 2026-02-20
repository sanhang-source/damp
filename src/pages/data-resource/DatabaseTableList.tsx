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
  message
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  ImportOutlined,
  EditOutlined,
  DeleteOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface DatabaseTable {
  id: string
  tableId: string
  tableCategory: string
  tableNameCn: string
  tableNameEn: string
  fieldCount: number
  recordCount: number
  serviceStatus: string
  updateFrequency: string
  updateStatus: string
  lastUpdateTime: string
  productStatus: string
  dataCategory: string
  dataSourceId: string
  dataSourceName: string
  storageEnv: string
  createDate: string
  description: string
}

const DatabaseTableList = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [expandSearch, setExpandSearch] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [fieldModalVisible, setFieldModalVisible] = useState(false)
  const [dataSourceModalVisible, setDataSourceModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DatabaseTable | null>(null)

  // 与原型数据完全一致
  const data: DatabaseTable[] = [
    {
      id: '1',
      tableId: '001091',
      tableCategory: '工商信息',
      tableNameCn: '工商照面',
      tableNameEn: 'sz_business_license',
      fieldCount: 4,
      recordCount: 1068720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '2',
      tableId: '001090',
      tableCategory: '工商信息',
      tableNameCn: '工商股东',
      tableNameEn: 'sz_shareholders',
      fieldCount: 3,
      recordCount: 68720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '3',
      tableId: '001089',
      tableCategory: '工商信息',
      tableNameCn: '对外投资',
      tableNameEn: 'sz_outbound_investment',
      fieldCount: 2,
      recordCount: 8720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '4',
      tableId: '001088',
      tableCategory: '工商信息',
      tableNameCn: '主要人员',
      tableNameEn: 'sz_key_personnel',
      fieldCount: 3,
      recordCount: 128720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '5',
      tableId: '001087',
      tableCategory: '工商信息',
      tableNameCn: '变更记录',
      tableNameEn: 'sz_change_records',
      fieldCount: 4,
      recordCount: 568720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '6',
      tableId: '001086',
      tableCategory: '工商信息',
      tableNameCn: '分支机构',
      tableNameEn: 'sz_branches',
      fieldCount: 2,
      recordCount: 28720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '7',
      tableId: '001085',
      tableCategory: '工商信息',
      tableNameCn: '企业年报',
      tableNameEn: 'sz_annual_report',
      fieldCount: 5,
      recordCount: 98720,
      serviceStatus: '已上线',
      updateFrequency: '每年',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '8',
      tableId: '001084',
      tableCategory: '司法信息',
      tableNameCn: '裁判文书',
      tableNameEn: 'sz_court_judgments',
      fieldCount: 6,
      recordCount: 456720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '9',
      tableId: '001083',
      tableCategory: '司法信息',
      tableNameCn: '被执行人',
      tableNameEn: 'sz_executed_person',
      fieldCount: 3,
      recordCount: 156720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '10',
      tableId: '001082',
      tableCategory: '司法信息',
      tableNameCn: '失信被执行',
      tableNameEn: 'sz_dishonest_executed',
      fieldCount: 4,
      recordCount: 86720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      dataCategory: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      storageEnv: '国资云',
      createDate: '2022-11-05',
      description: '-'
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
      title: '库表ID',
      dataIndex: 'tableId',
      width: 120
    },
    {
      title: '库表分类',
      dataIndex: 'tableCategory',
      width: 130,
      render: (val: string) => <Tag color="blue">{val}</Tag>
    },
    {
      title: '库表中文名',
      dataIndex: 'tableNameCn',
      width: 120
    },
    {
      title: '库表英文名',
      dataIndex: 'tableNameEn',
      width: 200
    },
    {
      title: '字段数',
      dataIndex: 'fieldCount',
      width: 90,
      align: 'center' as const,
      render: (val: number, record: DatabaseTable) => (
        <a onClick={() => handleFieldCountClick(record)}>{val}</a>
      )
    },
    {
      title: '记录数',
      dataIndex: 'recordCount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString()
    },
    {
      title: '库表服务状态',
      dataIndex: 'serviceStatus',
      width: 140,
      align: 'center' as const,
      render: (val: string) => <Tag color="success">{val}</Tag>
    },
    {
      title: '数据更新频率',
      dataIndex: 'updateFrequency',
      width: 140,
      align: 'center' as const
    },
    {
      title: '数据更新状态',
      dataIndex: 'updateStatus',
      width: 140,
      align: 'center' as const,
      render: (val: string) => <Tag color="success">{val}</Tag>
    },
    {
      title: '数据最新更新时间',
      dataIndex: 'lastUpdateTime',
      width: 180,
      align: 'center' as const
    },
    {
      title: '产品服务状态',
      dataIndex: 'productStatus',
      width: 140,
      align: 'center' as const,
      render: (val: string) => <Tag color="processing">{val}</Tag>
    },
    {
      title: '数据类别',
      dataIndex: 'dataCategory',
      width: 120,
      align: 'center' as const
    },
    {
      title: '数据来源',
      dataIndex: 'dataSourceId',
      width: 140,
      render: (val: string, record: DatabaseTable) => (
        <a onClick={() => handleDataSourceClick(record)}>{val}</a>
      )
    },
    {
      title: '存储环境',
      dataIndex: 'storageEnv',
      width: 120
    },
    {
      title: '首次接入时间',
      dataIndex: 'createDate',
      width: 140,
      align: 'center' as const
    },
    {
      title: '库表说明',
      dataIndex: 'description',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: DatabaseTable) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<UnorderedListOutlined />} onClick={() => handleFieldManage(record)}>
            字段管理
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
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
    message.success('导出成功')
  }

  const handleAdd = () => {
    navigate('/main/data-resource/database/add', { replace: true })
  }

  const handleEdit = (record: DatabaseTable) => {
    navigate(`/main/data-resource/database/edit/${record.id}`, { replace: true })
  }

  const handleFieldManage = (record: DatabaseTable) => {
    navigate(`/main/data-resource/database/fields/${record.id}`, { replace: true })
  }

  const handleDelete = (_record: DatabaseTable) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该库表吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功')
      }
    })
  }

  const handleImport = () => {
    setImportModalVisible(true)
  }

  const handleImportSubmit = () => {
    message.success('导入成功')
    setImportModalVisible(false)
  }

  const handleFieldCountClick = (record: DatabaseTable) => {
    setSelectedRecord(record)
    setFieldModalVisible(true)
  }

  const handleDataSourceClick = (record: DatabaseTable) => {
    setSelectedRecord(record)
    setDataSourceModalVisible(true)
  }

  return (
    <div className="database-table-list">
      {/* 查询栏 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="tableCategory" label="库表分类" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择库表分类" allowClear>
                  <Option value="工商信息">工商信息</Option>
                  <Option value="司法信息">司法信息</Option>
                  <Option value="经营信息">经营信息</Option>
                  <Option value="风险信息">风险信息</Option>
                  <Option value="知识产权">知识产权</Option>
                  <Option value="关联关系">关联关系</Option>
                  <Option value="新闻舆情">新闻舆情</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableNameCn" label="库表中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入库表中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableNameEn" label="库表英文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入库表英文名" allowClear />
              </Form.Item>
            </Col>
          </Row>
          {expandSearch && (
            <>
              <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Form.Item name="dataSource" label="数据来源" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择数据来源" allowClear>
                      <Option value="BM00001-068">BM00001-068</Option>
                      <Option value="BM00002-001">BM00002-001</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="serviceStatus" label="库表服务状态" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择库表服务状态" allowClear>
                      <Option value="已上线">已上线</Option>
                      <Option value="未上线">未上线</Option>
                      <Option value="已下线">已下线</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="dataCategory" label="数据类别" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择数据类别" allowClear>
                      <Option value="政务数据">政务数据</Option>
                      <Option value="商业数据">商业数据</Option>
                      <Option value="运营数据">运营数据</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Form.Item name="updateStatus" label="数据更新状态" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择数据更新状态" allowClear>
                      <Option value="正常">正常</Option>
                      <Option value="异常">异常</Option>
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
                <Col span={8}>
                  <Form.Item name="storageEnv" label="存储环境" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择存储环境" allowClear>
                      <Option value="政务云">政务云</Option>
                      <Option value="国资云">国资云</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
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

      {/* 列表 */}
      <Card
        className="table-card"
        title="数据库表管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
            <Button icon={<ImportOutlined />} onClick={handleImport}>
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

      {/* 导入弹窗 */}
      <Modal
        title="导入"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleImportSubmit}>
            提交
          </Button>
        ]}
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: 13, color: '#7F7F7F', marginBottom: 8 }}>
            1. <a style={{ color: '#0066FF' }}>下载模板</a>，请根据模板的格式填写信息；
          </p>
          <p style={{ fontSize: 12, color: '#7F7F7F' }}>
            2. 上传文件不超过5M，仅支持上传xls、xlsx格式的文件。
          </p>
          <div
            style={{
              border: '1px dashed #d9d9d9',
              borderRadius: 4,
              padding: 40,
              textAlign: 'center',
              marginTop: 20,
              background: '#fafafa'
            }}
          >
            <p style={{ color: '#999' }}>点击或将文件拖拽到此处上传</p>
            <Button style={{ marginTop: 10 }}>上传</Button>
          </div>
        </div>
      </Modal>

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
            <p><strong>库表中文名：</strong>{selectedRecord.tableNameCn}</p>
            <p><strong>库表英文名：</strong>{selectedRecord.tableNameEn}</p>
          </div>
        )}
        <Table
          columns={[
            { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
            { title: '字段中文名', dataIndex: 'fieldCn', width: 150 },
            { title: '字段英文名', dataIndex: 'fieldEn', width: 150 },
            { title: '字段类型', dataIndex: 'fieldType', width: 100, align: 'center' as const },
            { title: '数据分级', dataIndex: 'dataLevel', width: 120, align: 'center' as const }
          ]}
          dataSource={[
            { id: '1', fieldCn: '企业类型', fieldEn: 'econKind', fieldType: 'String', dataLevel: '1级—无损害' },
            { id: '2', fieldCn: '注册资本', fieldEn: 'registCapi', fieldType: 'String', dataLevel: '1级—无损害' },
            { id: '3', fieldCn: '企业标签', fieldEn: 'tags', fieldType: 'Array', dataLevel: '1级—无损害' },
            { id: '4', fieldCn: '所属工商局', fieldEn: 'belongOrg', fieldType: 'String', dataLevel: '1级—无损害' },
            { id: '5', fieldCn: '经营状态', fieldEn: 'status', fieldType: 'String', dataLevel: '1级—无损害' }
          ]}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 数据来源弹窗 */}
      <Modal
        title="数据来源"
        open={dataSourceModalVisible}
        onCancel={() => setDataSourceModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDataSourceModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {selectedRecord && (
          <div>
            <p><strong>数据来源ID：</strong>{selectedRecord.dataSourceId}</p>
            <p><strong>数据来源名称：</strong></p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DatabaseTableList
