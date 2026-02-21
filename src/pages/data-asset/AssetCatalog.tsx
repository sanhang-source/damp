import { useState, useRef, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Row, Col, Upload, Dropdown } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined, DatabaseOutlined, UploadOutlined, ApartmentOutlined, ApiOutlined, FileTextOutlined, AppstoreOutlined, MoreOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Graph } from '@antv/g6'

const { Option } = Select

interface AssetItem {
  id: string
  assetId: string
  assetName: string
  assetNameEn: string
  assetCategory: string
  assetForm: string
  fieldCount: number
  dataVolume: number
  serviceStatus: '未服务' | '已服务'
  serviceCount: number
  customerCount: number
  description?: string
}

const AssetCatalog = () => {
  const navigate = useNavigate()
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isFieldModalVisible, setIsFieldModalVisible] = useState(false)
  const [isImportModalVisible, setIsImportModalVisible] = useState(false)
  const [isLineageModalVisible, setIsLineageModalVisible] = useState(false)
  const [isLineageFullscreen, setIsLineageFullscreen] = useState(false)
  const [lineageLayerFilter, setLineageLayerFilter] = useState<'all' | 'upstream' | 'downstream'>('all')
  const [lineageTypeFilter, setLineageTypeFilter] = useState<'all' | 'source' | 'service' | 'customer'>('all')
  const [lineageSearchKeyword, setLineageSearchKeyword] = useState('')
  const [, setLineageStats] = useState({ upstream: 0, service: 0, customer: 0 })
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [currentAsset, setCurrentAsset] = useState<AssetItem | null>(null)
  const [searchForm] = Form.useForm()
  const [searchExpanded, setSearchExpanded] = useState(false)

  const [data] = useState<AssetItem[]>([
    { id: '1', assetId: 'AST001', assetName: '企业信用评分数据集', assetNameEn: 'Enterprise Credit Score Dataset', assetCategory: '信用评价', assetForm: '产品表', fieldCount: 15, dataVolume: 1234567, serviceStatus: '已服务', serviceCount: 3, customerCount: 3, description: '' },
    { id: '2', assetId: 'AST002', assetName: '行政处罚记录', assetNameEn: 'Administrative Penalty Record', assetCategory: '行政处罚', assetForm: '接口', fieldCount: 12, dataVolume: 856432, serviceStatus: '已服务', serviceCount: 2, customerCount: 2, description: '' },
    { id: '3', assetId: 'AST003', assetName: '社保缴纳信息', assetNameEn: 'Social Security Payment Info', assetCategory: '社保信息', assetForm: '产品表', fieldCount: 20, dataVolume: 2567891, serviceStatus: '未服务', serviceCount: 0, customerCount: 0, description: '' },
    { id: '4', assetId: 'AST004', assetName: '工商注册信息', assetNameEn: 'Business Registration Info', assetCategory: '工商信息', assetForm: '接口', fieldCount: 25, dataVolume: 3124567, serviceStatus: '已服务', serviceCount: 4, customerCount: 4, description: '' },
    { id: '5', assetId: 'AST005', assetName: '企业纳税信用等级', assetNameEn: 'Enterprise Tax Credit Rating', assetCategory: '信用评价', assetForm: '产品表', fieldCount: 8, dataVolume: 534678, serviceStatus: '未服务', serviceCount: 0, customerCount: 0, description: '' },
    { id: '6', assetId: 'AST006', assetName: '法律诉讼信息', assetNameEn: 'Legal Litigation Info', assetCategory: '风险预警', assetForm: '接口', fieldCount: 18, dataVolume: 987654, serviceStatus: '已服务', serviceCount: 2, customerCount: 2, description: '' },
    { id: '7', assetId: 'AST007', assetName: '知识产权信息', assetNameEn: 'Intellectual Property Info', assetCategory: '企业信息', assetForm: '产品表', fieldCount: 22, dataVolume: 1834567, serviceStatus: '已服务', serviceCount: 3, customerCount: 3, description: '' },
    { id: '8', assetId: 'AST008', assetName: '企业经营异常', assetNameEn: 'Enterprise Abnormal Operation', assetCategory: '风险预警', assetForm: '接口', fieldCount: 10, dataVolume: 456789, serviceStatus: '未服务', serviceCount: 0, customerCount: 0, description: '' },
    { id: '9', assetId: 'AST009', assetName: '股东出资信息', assetNameEn: 'Shareholder Investment Info', assetCategory: '企业信息', assetForm: '产品表', fieldCount: 14, dataVolume: 712345, serviceStatus: '已服务', serviceCount: 2, customerCount: 2, description: '' },
    { id: '10', assetId: 'AST010', assetName: '企业年报信息', assetNameEn: 'Enterprise Annual Report', assetCategory: '企业信息', assetForm: '接口', fieldCount: 30, dataVolume: 2234567, serviceStatus: '已服务', serviceCount: 5, customerCount: 5, description: '' },
  ])

  const fieldData = [
    { id: '1', fieldCn: '企业类型', fieldEn: 'econKind', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '2', fieldCn: '注册资本', fieldEn: 'registCapi', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '3', fieldCn: '企业标签', fieldEn: 'tags', fieldType: 'Array', dataLevel: '1级—无损害' },
    { id: '4', fieldCn: '所属工商局', fieldEn: 'belongOrg', fieldType: 'String', dataLevel: '1级—无损害' },
    { id: '5', fieldCn: '经营状态', fieldEn: 'status', fieldType: 'String', dataLevel: '1级—无损害' },
  ]

  const fieldColumns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '字段中文名', dataIndex: 'fieldCn', width: 150 },
    { title: '字段英文名', dataIndex: 'fieldEn', width: 150 },
    { title: '字段类型', dataIndex: 'fieldType', width: 100, align: 'center' as const },
    { title: '数据分级', dataIndex: 'dataLevel', width: 120, align: 'center' as const }
  ]

  const columns = [
    { title: '序号', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '数据资产ID', dataIndex: 'assetId', width: 120, render: (text: string) => text || '-' },
    { title: '数据资产分类', dataIndex: 'assetCategory', width: 120, render: (text: string) => text ? <Tag>{text}</Tag> : '-' },
    { title: '数据资产中文名', dataIndex: 'assetName', width: 180, ellipsis: true, render: (text: string) => text || '-' },
    { title: '数据资产英文名', dataIndex: 'assetNameEn', width: 200, ellipsis: true, render: (text: string) => text || '-' },
    { title: '数据资产形态', dataIndex: 'assetForm', width: 120, render: (text: string) => text ? <Tag color="processing">{text}</Tag> : '-' },
    { 
      title: '字段数', 
      dataIndex: 'fieldCount', 
      width: 80, 
      align: 'center' as const,
      render: (count: number, record: AssetItem) => (
        <Button type="link" size="small" onClick={() => handleFieldClick(record)}>
          {count || 0}
        </Button>
      )
    },
    { 
      title: '数据总量', 
      dataIndex: 'dataVolume', 
      width: 120, 
      align: 'right' as const,
      render: (volume: number) => volume ? volume.toLocaleString() : '-'
    },
    { 
      title: '服务产品状态', 
      dataIndex: 'serviceStatus', 
      width: 130, 
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={status === '已服务' ? 'success' : 'default'}>{status}</Tag>
      )
    },
    { title: '服务产品数量', dataIndex: 'serviceCount', width: 130, align: 'center' as const },
    { title: '服务客户数量', dataIndex: 'customerCount', width: 130, align: 'center' as const },
    { title: '数据资产说明', dataIndex: 'description', width: 150, render: () => '-' },
    { 
      title: '操作', 
      key: 'action', 
      width: 220,
      fixed: 'right' as const,
      render: (_: any, record: AssetItem) => (
        <Space size="small">
          <Button type="link" size="small" icon={<ApartmentOutlined />} onClick={() => handleViewLineage(record)}>查看血缘</Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: '编辑',
                  onClick: () => handleEdit(record),
                },
                {
                  key: 'fields',
                  icon: <DatabaseOutlined />,
                  label: '字段管理',
                  onClick: () => navigate(`/main/data-asset/fields/${record.id}`, { replace: true }),
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: '删除',
                  danger: true,
                  onClick: () => handleDelete(record),
                },
              ],
            }}
          >
            <Button type="link" size="small">
              <MoreOutlined /> 更多
            </Button>
          </Dropdown>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    message.info('搜索功能')
  }

  const handleReset = () => {
    searchForm.resetFields()
    message.info('重置搜索')
  }

  const handleAdd = () => {
    navigate('/main/data-asset/add', { replace: true })
  }

  const handleEdit = (record: AssetItem) => {
    navigate(`/main/data-asset/edit/${record.id}`, { replace: true })
  }

  const handleViewLineage = (record: AssetItem) => {
    setCurrentAsset(record)
    setIsLineageModalVisible(true)
  }

  const handleFieldClick = (record: AssetItem) => {
    setCurrentAsset(record)
    setIsFieldModalVisible(true)
  }

  const handleDelete = (record: AssetItem) => {
    setCurrentAsset(record)
    setIsDeleteModalVisible(true)
  }

  const handleDeleteConfirm = () => {
    message.success(`已删除资产"${currentAsset?.assetName}"`)
    setIsDeleteModalVisible(false)
  }

  const handleExport = () => {
    message.info('导出功能')
  }

  // 计算统计数据
  const totalAssets = data.length
  const totalFields = data.reduce((sum, item) => sum + (item.fieldCount || 0), 0)
  const totalDataVolume = data.reduce((sum, item) => sum + (item.dataVolume || 0), 0)
  const totalServices = data.filter(item => item.serviceStatus === '已服务').length

  return (
    <div className="asset-catalog">
      {/* 数据概览统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据资产（项）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>{totalAssets}</div>
              </div>
              <AppstoreOutlined style={{ fontSize: 48, color: '#e6f7ff' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据字段（个）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>{totalFields.toLocaleString()}</div>
              </div>
              <FileTextOutlined style={{ fontSize: 48, color: '#f6ffed' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>数据总量（条）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fa8c16' }}>{totalDataVolume.toLocaleString()}</div>
              </div>
              <DatabaseOutlined style={{ fontSize: 48, color: '#fff7e6' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>服务产品（个）</div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#722ed1' }}>{totalServices}</div>
              </div>
              <ApiOutlined style={{ fontSize: 48, color: '#f9f0ff' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 查询栏 */}
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="assetName" label="数据资产中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数据资产中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assetNameEn" label="数据资产英文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数据资产英文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assetCategory" label="数据资产分类" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择数据资产分类" allowClear>
                  <Option value="enterprise">企业信息</Option>
                  <Option value="credit">信用评价</Option>
                  <Option value="risk">风险预警</Option>
                  <Option value="social">社保信息</Option>
                  <Option value="business">工商信息</Option>
                  <Option value="penalty">行政处罚</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {searchExpanded && (
            <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
              <Col span={8}>
                <Form.Item name="assetForm" label="数据资产形态" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择数据资产形态" allowClear>
                    <Option value="product">产品表</Option>
                    <Option value="api">接口</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="serviceStatus" label="服务产品状态" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择服务产品状态" allowClear>
                    <Option value="served">已服务</Option>
                    <Option value="unserved">未服务</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="link" onClick={() => setSearchExpanded(!searchExpanded)}>
                  {searchExpanded ? <><UpOutlined /> 收起</> : <><DownOutlined /> 展开</>}
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

      {/* 表格 */}
      <Card
        title="数据资产目录"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
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
        open={isFieldModalVisible}
        onCancel={() => setIsFieldModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsFieldModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentAsset && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>数据资产中文名：</strong>{currentAsset.assetName}</p>
            <p><strong>数据资产英文名：</strong>{currentAsset.assetNameEn}</p>
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
        title="批量导入"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsImportModalVisible(false)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={() => setIsImportModalVisible(false)}>
            确定
          </Button>
        ]}
        width={500}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此处上传</p>
        </Upload.Dragger>
      </Modal>

      {/* 血缘关系弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{currentAsset ? `血缘关系 - ${currentAsset.assetName}` : '血缘关系'}</span>
            <Button 
              type="link" 
              size="small"
              icon={isLineageFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={() => setIsLineageFullscreen(!isLineageFullscreen)}
            />
          </div>
        }
        open={isLineageModalVisible}
        onCancel={() => {
          setIsLineageModalVisible(false)
          setIsLineageFullscreen(false)
          setLineageLayerFilter('all')
          setLineageTypeFilter('all')
          setLineageSearchKeyword('')
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setIsLineageModalVisible(false)
            setIsLineageFullscreen(false)
            setLineageLayerFilter('all')
            setLineageTypeFilter('all')
            setLineageSearchKeyword('')
          }}>
            关闭
          </Button>
        ]}
        width={isLineageFullscreen ? '100vw' : 1200}
        style={isLineageFullscreen ? { top: 0, maxWidth: '100vw', paddingBottom: 0 } : { top: 20 }}
        styles={{ body: { height: isLineageFullscreen ? 'calc(100vh - 110px)' : 520, overflow: 'hidden', padding: '16px 24px' } }}
      >
        {currentAsset && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 图例 */}
            <div style={{ marginBottom: 12 }}>
              <Space size={16} style={{ fontSize: 12 }}>
                <span style={{ color: '#666' }}>图例：</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, background: '#f0f5ff', border: '1px solid #2f54eb', borderRadius: 2 }}></span>
                  <span>数据源机构</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, background: '#e6f7ff', border: '1px solid #1890ff', borderRadius: 2 }}></span>
                  <span>数据源表</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, background: '#fff7e6', border: '2px solid #fa8c16', borderRadius: 2 }}></span>
                  <span>数据资产</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, background: '#f6ffed', border: '1px solid #52c41a', borderRadius: 2 }}></span>
                  <span>服务产品</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, background: '#f9f0ff', border: '1px solid #722ed1', borderRadius: 2 }}></span>
                  <span>服务客户</span>
                </span>
              </Space>
            </div>

            {/* 图表区域 */}
            <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden', position: 'relative', background: '#fafafa' }}>
              <SimpleLineageGraph 
                asset={currentAsset} 
                layerFilter={lineageLayerFilter}
                typeFilter={lineageTypeFilter}
                searchKeyword={lineageSearchKeyword}
                onStatsChange={setLineageStats}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="提示"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={400}
      >
        <p>是否确认删除资产"{currentAsset?.assetName}"？</p>
      </Modal>
    </div>
  )
}

// 简化的血缘图组件
interface LineageNode {
  id: string
  label: string
  type: 'org' | 'source' | 'asset' | 'service' | 'customer'
}

interface SimpleLineageGraphProps {
  asset: AssetItem
  layerFilter?: 'all' | 'upstream' | 'downstream'
  typeFilter?: 'all' | 'source' | 'service' | 'customer'
  searchKeyword?: string
  onStatsChange?: (stats: { upstream: number; service: number; customer: number }) => void
}

const SimpleLineageGraph = ({ 
  asset, 
  layerFilter = 'all',
  typeFilter = 'all',
  searchKeyword = '',
  onStatsChange,
}: SimpleLineageGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  // 与 lineageService.ts 保持一致的 mock 数据
  // 数据源机构
  const mockSourceOrgs = [
    { id: 'org-1', orgId: 'BM00001-068', orgName: '市市场监督管理局' },
  ]

  const mockSourceTables = [
    { id: 'src-1', tableName: 'T_ENTERPRISE_BASE', tableComment: '企业基础信息表', sourceSystem: '工商系统', updateFrequency: '每日更新', orgId: 'org-1' },
    { id: 'src-2', tableName: 'T_TAX_RECORD', tableComment: '企业纳税记录表', sourceSystem: '税务系统', updateFrequency: '每月更新', orgId: 'org-1' },
    { id: 'src-3', tableName: 'T_PENALTY_INFO', tableComment: '行政处罚信息表', sourceSystem: '处罚系统', updateFrequency: '实时更新', orgId: 'org-1' },
    { id: 'src-4', tableName: 'T_CREDIT_RECORD', tableComment: '企业信用记录表', sourceSystem: '征信系统', updateFrequency: '每日更新', orgId: 'org-1' },
    { id: 'src-5', tableName: 'T_LEGAL_CASE', tableComment: '法律诉讼信息表', sourceSystem: '法院系统', updateFrequency: '每周更新', orgId: 'org-1' },
    { id: 'src-6', tableName: 'T_FINANCIAL_DATA', tableComment: '企业财务数据表', sourceSystem: '财务系统', updateFrequency: '每月更新', orgId: 'org-1' },
  ]

  const mockAssets = [
    { id: 'asset-1', assetId: 'AST001', assetName: '企业信用评分数据集' },
    { id: 'asset-2', assetId: 'AST002', assetName: '行政处罚记录API' },
    { id: 'asset-3', assetId: 'AST003', assetName: '工商注册信息报表' },
    { id: 'asset-4', assetId: 'AST004', assetName: '法律诉讼风险数据集' },
    { id: 'asset-5', assetId: 'AST005', assetName: '财务健康度接口' },
  ]

  const mockServices = [
    { id: 'service-1', serviceId: 'SVC001', serviceName: '企业风控查询服务', serviceType: '风控服务' },
    { id: 'service-2', serviceId: 'SVC002', serviceName: '普惠金融信用核验', serviceType: '信用服务' },
    { id: 'service-3', serviceId: 'SVC003', serviceName: '政务数据开放接口', serviceType: '数据开放' },
    { id: 'service-4', serviceId: 'SVC004', serviceName: '企业背景调查API', serviceType: '背景调查' },
    { id: 'service-5', serviceId: 'SVC005', serviceName: '供应链金融风控', serviceType: '风控服务' },
    { id: 'service-6', serviceId: 'SVC006', serviceName: '企业信用报告服务', serviceType: '报告服务' },
  ]

  const mockCustomers = [
    { id: 'cust-1', customerName: '工商银行', customerFullName: '中国工商银行股份有限公司深圳分行', customerType: '金融机构' },
    { id: 'cust-2', customerName: '建设银行', customerFullName: '中国建设银行股份有限公司深圳分行', customerType: '金融机构' },
    { id: 'cust-3', customerName: '某市大数据局', customerFullName: '深圳市政务服务数据管理局', customerType: '政府机构' },
    { id: 'cust-4', customerName: '招商银行', customerFullName: '招商银行股份有限公司深圳分行', customerType: '金融机构' },
    { id: 'cust-5', customerName: '某省金融办', customerFullName: '广东省人民政府金融工作办公室', customerType: '政府机构' },
    { id: 'cust-6', customerName: '平安银行', customerFullName: '平安银行股份有限公司深圳分行', customerType: '金融机构' },
  ]

  // 关联关系（与 lineageService.ts 保持一致）
  const mockSourceAssetRelations = [
    { sourceId: 'src-1', assetId: 'asset-1' },
    { sourceId: 'src-2', assetId: 'asset-1' },
    { sourceId: 'src-3', assetId: 'asset-2' },
    { sourceId: 'src-1', assetId: 'asset-3' },
    { sourceId: 'src-5', assetId: 'asset-4' },
    { sourceId: 'src-4', assetId: 'asset-1' },
    { sourceId: 'src-6', assetId: 'asset-5' },
  ]

  const mockAssetServiceRelations = [
    { assetId: 'asset-1', serviceId: 'service-1' },
    { assetId: 'asset-1', serviceId: 'service-2' },
    { assetId: 'asset-1', serviceId: 'service-6' },
    { assetId: 'asset-2', serviceId: 'service-1' },
    { assetId: 'asset-2', serviceId: 'service-4' },
    { assetId: 'asset-3', serviceId: 'service-3' },
    { assetId: 'asset-3', serviceId: 'service-4' },
    { assetId: 'asset-4', serviceId: 'service-4' },
    { assetId: 'asset-4', serviceId: 'service-6' },
    { assetId: 'asset-5', serviceId: 'service-5' },
  ]

  const mockServiceCustomerRelations = [
    { serviceId: 'service-1', customerId: 'cust-1' },
    { serviceId: 'service-1', customerId: 'cust-2' },
    { serviceId: 'service-1', customerId: 'cust-4' },
    { serviceId: 'service-2', customerId: 'cust-2' },
    { serviceId: 'service-2', customerId: 'cust-6' },
    { serviceId: 'service-3', customerId: 'cust-3' },
    { serviceId: 'service-3', customerId: 'cust-5' },
    { serviceId: 'service-4', customerId: 'cust-1' },
    { serviceId: 'service-4', customerId: 'cust-4' },
    { serviceId: 'service-5', customerId: 'cust-2' },
    { serviceId: 'service-5', customerId: 'cust-6' },
    { serviceId: 'service-6', customerId: 'cust-1' },
    { serviceId: 'service-6', customerId: 'cust-4' },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    // 清除之前的图表
    if (graphRef.current) {
      graphRef.current.destroy()
      graphRef.current = null
    }

    // 根据 assetId 找到对应的 mock 资产
    const currentMockAsset = mockAssets.find(a => a.assetId === asset.assetId) || mockAssets[0]

    // 构建节点
    const nodes: LineageNode[] = [
      { id: currentMockAsset.id, label: `${currentMockAsset.assetName}\n${currentMockAsset.assetId}`, type: 'asset' }
    ]

    // 添加上游源数据表节点
    const sourceRelations = mockSourceAssetRelations.filter(r => r.assetId === currentMockAsset.id)
    const orgIds = new Set<string>()
    sourceRelations.forEach(relation => {
      const source = mockSourceTables.find(t => t.id === relation.sourceId)
      if (source && !nodes.find(n => n.id === source.id)) {
        // 生成数据源表ID格式（6位数字）
        const tableIdNum = (92 - parseInt(source.id.replace(/\D/g, '') || '0')).toString().padStart(6, '0')
        nodes.push({
          id: source.id,
          label: `${source.tableComment}\n${tableIdNum}`,
          type: 'source',
        })
        // 收集数据源机构ID
        if (source.orgId) orgIds.add(source.orgId)
      }
    })

    // 添加数据源机构节点
    orgIds.forEach(orgId => {
      const org = mockSourceOrgs.find(o => o.id === orgId)
      if (org && !nodes.find(n => n.id === org.id)) {
        nodes.push({
          id: org.id,
          label: org.orgId,
          type: 'org',
        })
      }
    })

    // 添加下游服务节点
    const serviceRelations = mockAssetServiceRelations.filter(r => r.assetId === currentMockAsset.id)
    serviceRelations.forEach(relation => {
      const service = mockServices.find(s => s.id === relation.serviceId)
      if (service && !nodes.find(n => n.id === service.id)) {
        // 生成产品ID格式（CRxxxx）
        const num = service.serviceId.replace(/\D/g, '')
        const crId = `CR${num.padStart(4, '0')}`
        nodes.push({
          id: service.id,
          label: `${service.serviceName}\n${crId}`,
          type: 'service',
        })

        // 添加客户节点
        const customerRelations = mockServiceCustomerRelations.filter(r => r.serviceId === service.id)
        customerRelations.forEach(custRelation => {
          const customer = mockCustomers.find(c => c.id === custRelation.customerId)
          if (customer && !nodes.find(n => n.id === customer.id)) {
            nodes.push({
              id: customer.id,
              label: customer.customerFullName,
              type: 'customer',
            })
          }
        })
      }
    })

    // 通知统计
    const upstreamCount = nodes.filter(n => n.type === 'source').length
    const serviceCount = nodes.filter(n => n.type === 'service').length
    const customerCount = nodes.filter(n => n.type === 'customer').length
    onStatsChange?.({ 
      upstream: upstreamCount, 
      service: serviceCount, 
      customer: customerCount 
    })

    // 构建边
    const edges: { source: string; target: string }[] = []
    
    // 机构 -> 源
    nodes.filter(n => n.type === 'source').forEach(sourceNode => {
      const sourceTable = mockSourceTables.find(t => t.id === sourceNode.id)
      if (sourceTable?.orgId) {
        edges.push({ source: sourceTable.orgId, target: sourceNode.id })
      }
    })
    
    // 源 -> 资产
    sourceRelations.forEach(relation => {
      edges.push({ source: relation.sourceId, target: currentMockAsset.id })
    })
    
    // 资产 -> 服务
    serviceRelations.forEach(relation => {
      edges.push({ source: currentMockAsset.id, target: relation.serviceId })
      
      // 服务 -> 客户
      const customerRelations = mockServiceCustomerRelations.filter(r => r.serviceId === relation.serviceId)
      customerRelations.forEach(custRelation => {
        edges.push({ source: relation.serviceId, target: custRelation.customerId })
      })
    })

    // 过滤节点和边
    let filteredNodes = [...nodes]
    let filteredEdges = [...edges]

    const assetNode = nodes.find(n => n.type === 'asset')

    if (layerFilter === 'upstream') {
      filteredNodes = nodes.filter(n => n.type === 'org' || n.type === 'source' || n.type === 'asset')
      filteredEdges = edges.filter(e => {
        const targetNode = nodes.find(n => n.id === e.target)
        return targetNode?.type === 'asset' || targetNode?.type === 'source' || targetNode?.type === 'org'
      })
    } else if (layerFilter === 'downstream') {
      filteredNodes = nodes.filter(n => n.type !== 'source' && n.type !== 'org')
      filteredEdges = edges.filter(e => {
        const sourceNode = nodes.find(n => n.id === e.source)
        return sourceNode?.type !== 'source' && sourceNode?.type !== 'org'
      })
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'source') {
        filteredNodes = nodes.filter(n => n.type === 'org' || n.type === 'source' || n.type === 'asset')
        filteredEdges = edges.filter(e => {
          const targetNode = nodes.find(n => n.id === e.target)
          return targetNode?.type === 'asset' || targetNode?.type === 'source'
        })
      } else if (typeFilter === 'service') {
        filteredNodes = nodes.filter(n => n.type === 'asset' || n.type === 'service')
        filteredEdges = edges.filter(e => {
          const sourceNode = nodes.find(n => n.id === e.source)
          const targetNode = nodes.find(n => n.id === e.target)
          return (sourceNode?.type === 'asset' && targetNode?.type === 'service')
        })
      } else if (typeFilter === 'customer') {
        filteredNodes = nodes.filter(n => n.type === 'asset' || n.type === 'service' || n.type === 'customer')
        filteredEdges = edges.filter(e => {
          const sourceNode = nodes.find(n => n.id === e.source)
          return sourceNode?.type !== 'source'
        })
      }
      if (assetNode && !filteredNodes.find(n => n.id === assetNode.id)) {
        filteredNodes.unshift(assetNode)
      }
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      const matchedNodes = filteredNodes.filter(n => n.label.toLowerCase().includes(keyword))
      if (matchedNodes.length > 0) {
        filteredNodes = matchedNodes
      }
    }

    // 转换为 G6 格式 - 确保有ID字段
    const g6Nodes = filteredNodes.map(n => ({
      id: n.id,
      data: { label: n.label, type: n.type },
      style: {
        fill: n.type === 'org' ? '#f0f5ff' : n.type === 'source' ? '#e6f7ff' : n.type === 'asset' ? '#fff7e6' : n.type === 'service' ? '#f6ffed' : '#f9f0ff',
        stroke: n.type === 'org' ? '#2f54eb' : n.type === 'source' ? '#1890ff' : n.type === 'asset' ? '#fa8c16' : n.type === 'service' ? '#52c41a' : '#722ed1',
        lineWidth: n.type === 'asset' ? 2 : 1,
      }
    }))

    const g6Edges = filteredEdges
      .filter(e => filteredNodes.find(n => n.id === e.source) && filteredNodes.find(n => n.id === e.target))
      .map((e, index) => ({
        id: `edge-${index}`,
        source: e.source,
        target: e.target,
      }))

    // 创建图表
    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth || 800,
      height: containerRef.current.clientHeight || 400,
      data: { nodes: g6Nodes, edges: g6Edges },
      node: {
        type: 'rect',
        style: {
          size: [140, 50],
          radius: 6,
          labelText: (d: any) => d.data?.label || d.id,
          labelFill: '#333',
          labelFontSize: 11,
          labelLineHeight: 16,
        },
      },
      edge: {
        type: 'cubic-horizontal',
        style: { 
          stroke: '#bfbfbf', 
          lineWidth: 1.5, 
          endArrow: true 
        }
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        nodesep: 50,
        ranksep: 100,
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
    })

    graphRef.current = graph
    graph.render()
    
    // 渲染完成后适配视图并居中
    graph.once('afterlayout', () => {
      setTimeout(() => {
        graph.fitCenter()
        graph.zoomTo(0.85)
      }, 100)
    })

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy()
        graphRef.current = null
      }
    }
  }, [asset, layerFilter, typeFilter, searchKeyword, onStatsChange])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default AssetCatalog
