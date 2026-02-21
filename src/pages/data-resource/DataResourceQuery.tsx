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
  DatabaseOutlined,
  ApiOutlined,
  FileTextOutlined
} from '@ant-design/icons'

const { Option } = Select

interface DataResource {
  id: string
  resourceId: string
  resourceCategory: string
  resourceNameCn: string
  resourceNameEn: string
  fieldCount: number
  recordCount: number
  serviceStatus: string
  updateFrequency: string
  updateStatus: string
  lastUpdateTime: string
  productStatus: string
  resourceType: string
  dataSourceType: string
  dataSourceId: string
  dataSourceName: string
  createDate: string
  description: string
}

const DataResourceQuery = () => {
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [expandSearch, setExpandSearch] = useState(false)
  const [fieldModalVisible, setFieldModalVisible] = useState(false)
  const [sourceModalVisible, setSourceModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DataResource | null>(null)

  // 与原型数据完全一致
  const data: DataResource[] = [
    {
      id: '1',
      resourceId: '001091',
      resourceCategory: '工商信息',
      resourceNameCn: '工商照面',
      resourceNameEn: 'sz_business_license',
      fieldCount: 4,
      recordCount: 1068720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '2',
      resourceId: '001090',
      resourceCategory: '工商信息',
      resourceNameCn: '工商股东',
      resourceNameEn: 'sz_shareholders',
      fieldCount: 3,
      recordCount: 68720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '3',
      resourceId: '001089',
      resourceCategory: '工商信息',
      resourceNameCn: '对外投资',
      resourceNameEn: 'sz_outbound_investment',
      fieldCount: 2,
      recordCount: 8720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '4',
      resourceId: '001088',
      resourceCategory: '工商信息',
      resourceNameCn: '主要人员',
      resourceNameEn: 'sz_key_personnel',
      fieldCount: 3,
      recordCount: 128720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '5',
      resourceId: '001087',
      resourceCategory: '工商信息',
      resourceNameCn: '变更记录',
      resourceNameEn: 'sz_change_records',
      fieldCount: 4,
      recordCount: 568720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '6',
      resourceId: '001086',
      resourceCategory: '工商信息',
      resourceNameCn: '分支机构',
      resourceNameEn: 'sz_branches',
      fieldCount: 2,
      recordCount: 28720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '7',
      resourceId: '001085',
      resourceCategory: '工商信息',
      resourceNameCn: '企业年报',
      resourceNameEn: 'sz_annual_report',
      fieldCount: 5,
      recordCount: 98720,
      serviceStatus: '已上线',
      updateFrequency: '每年',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '8',
      resourceId: '001084',
      resourceCategory: '司法信息',
      resourceNameCn: '裁判文书',
      resourceNameEn: 'sz_court_judgments',
      fieldCount: 6,
      recordCount: 456720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '9',
      resourceId: '001083',
      resourceCategory: '司法信息',
      resourceNameCn: '被执行人',
      resourceNameEn: 'sz_executed_person',
      fieldCount: 3,
      recordCount: 156720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
      createDate: '2022-11-05',
      description: '-'
    },
    {
      id: '10',
      resourceId: '001082',
      resourceCategory: '司法信息',
      resourceNameCn: '失信被执行',
      resourceNameEn: 'sz_dishonest_executed',
      fieldCount: 4,
      recordCount: 86720,
      serviceStatus: '已上线',
      updateFrequency: '每日',
      updateStatus: '正常',
      lastUpdateTime: '2025-11-05 09:12:08',
      productStatus: '已使用',
      resourceType: '库表',
      dataSourceType: '政务数据',
      dataSourceId: 'BM00001-068',
      dataSourceName: '国资云',
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
      title: '数据资源ID',
      dataIndex: 'resourceId',
      width: 130
    },
    {
      title: '数据资源分类',
      dataIndex: 'resourceCategory',
      width: 130,
      render: (val: string) => <Tag color="blue">{val}</Tag>
    },
    {
      title: '数据资源中文名',
      dataIndex: 'resourceNameCn',
      width: 220
    },
    {
      title: '数据资源英文名',
      dataIndex: 'resourceNameEn',
      width: 240
    },
    {
      title: '字段数',
      dataIndex: 'fieldCount',
      width: 90,
      align: 'center' as const,
      render: (val: number, record: DataResource) => (
        <Button type="link" size="small" onClick={() => handleViewFields(record)}>
          {val}
        </Button>
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
      title: '资源服务状态',
      dataIndex: 'serviceStatus',
      width: 180,
      align: 'center' as const,
      render: (val: string) => <Tag color="success">{val}</Tag>
    },
    {
      title: '数据更新频率',
      dataIndex: 'updateFrequency',
      width: 180,
      align: 'center' as const
    },
    {
      title: '数据更新状态',
      dataIndex: 'updateStatus',
      width: 180,
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
      width: 180,
      align: 'center' as const,
      render: (val: string) => <Tag color="processing">{val}</Tag>
    },
    {
      title: '对接形式',
      dataIndex: 'resourceType',
      width: 140,
      align: 'center' as const,
      render: (val: string) => {
        const icon = val === '库表' ? <DatabaseOutlined /> : <ApiOutlined />
        return <Tag icon={icon}>{val}</Tag>
      }
    },
    {
      title: '数据类别',
      dataIndex: 'dataSourceType',
      width: 130,
      align: 'center' as const
    },
    {
      title: '数据来源',
      dataIndex: 'dataSourceId',
      width: 150,
      render: (val: string, record: DataResource) => (
        <Button type="link" size="small" onClick={() => handleViewSource(record)}>
          {val}
        </Button>
      )
    },
    {
      title: '存储环境',
      dataIndex: 'dataSourceName',
      width: 120
    },
    {
      title: '首次接入时间',
      dataIndex: 'createDate',
      width: 180,
      align: 'center' as const
    },
    {
      title: '数据资源说明',
      dataIndex: 'description',
      width: 220
    }
  ]

  const fieldColumns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '字段中文名', dataIndex: 'fieldCn', width: 150 },
    { title: '字段英文名', dataIndex: 'fieldEn', width: 150 },
    { title: '字段类型', dataIndex: 'fieldType', width: 100, align: 'center' as const },
    { title: '数据分级', dataIndex: 'dataLevel', width: 120, align: 'center' as const }
  ]

  const fieldData = [
    { id: '1', fieldCn: '企业类型', fieldEn: 'econKind', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '2', fieldCn: '注册资本', fieldEn: 'registCapi', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '3', fieldCn: '企业标签', fieldEn: 'tags', fieldType: 'Array', dataLevel: '1级—无损害' },
    { id: '4', fieldCn: '所属工商局', fieldEn: 'belongOrg', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '5', fieldCn: '经营状态', fieldEn: 'status', fieldType: 'String', dataLevel: '1级—无损害' }
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

  const handleViewFields = (record: DataResource) => {
    setSelectedRecord(record)
    setFieldModalVisible(true)
  }

  const handleViewSource = (record: DataResource) => {
    setSelectedRecord(record)
    setSourceModalVisible(true)
  }

  return (
    <div className="data-resource-query">
      {/* 数据概览统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据来源（家）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>50</div>
              </div>
              <DatabaseOutlined style={{ fontSize: 48, color: '#e6f7ff' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据资源（项）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>1,091</div>
              </div>
              <FileTextOutlined style={{ fontSize: 48, color: '#f6ffed' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据字段（个）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fa8c16' }}>19,584</div>
              </div>
              <ApiOutlined style={{ fontSize: 48, color: '#fff7e6' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据总量（条）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#722ed1' }}>2,372,859,059</div>
              </div>
              <DatabaseOutlined style={{ fontSize: 48, color: '#f9f0ff' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 查询栏 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="resourceCategory" label="数据资源分类" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择数据资源分类" allowClear>
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
              <Form.Item name="resourceNameCn" label="资源中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入资源中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="resourceNameEn" label="资源英文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入资源英文名" allowClear />
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
                  <Form.Item name="serviceStatus" label="资源服务状态" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择资源服务状态" allowClear>
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
                  <Form.Item name="dockingForm" label="对接形式" style={{ marginBottom: 0 }}>
                    <Select placeholder="请选择对接形式" allowClear>
                      <Option value="库表">库表</Option>
                      <Option value="接口">接口</Option>
                    </Select>
                  </Form.Item>
                </Col>
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
        title="数据资源查询"
        extra={
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
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
            <p><strong>数据资源中文名：</strong>{selectedRecord.resourceNameCn}</p>
            <p><strong>数据资源英文名：</strong>{selectedRecord.resourceNameEn}</p>
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

      {/* 数据来源弹窗 */}
      <Modal
        title="数据来源"
        open={sourceModalVisible}
        onCancel={() => setSourceModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSourceModalVisible(false)}>
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

export default DataResourceQuery
