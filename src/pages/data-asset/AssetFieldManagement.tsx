import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  message,
  ConfigProvider,
  Descriptions
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import '../data-access/style.css'

const { Option } = Select

interface FieldItem {
  id: string
  seq: number
  fieldNameCn: string
  fieldNameEn: string
  fieldType: string
  dataCategory: string
  dataLevel: string
}

const AssetFieldManagement = () => {
  const navigate = useNavigate()
  const { id: _id } = useParams<{ id: string }>()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isImportModalVisible, setIsImportModalVisible] = useState(false)
  const [editingField, setEditingField] = useState<FieldItem | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  // 模拟资产信息
  const assetInfo = {
    assetId: 'AST001',
    assetName: '企业信用评分数据集',
    assetNameEn: 'Enterprise Credit Score Dataset',
    assetCategory: '信用评价',
    assetForm: '产品表',
    department: '数据治理部'
  }

  // 模拟字段数据
  const [fields, setFields] = useState<FieldItem[]>([
    { id: '1', seq: 1, fieldNameCn: '企业类型', fieldNameEn: 'econKind', fieldType: 'String', dataCategory: '政务数据', dataLevel: '1级—无损害' },
    { id: '2', seq: 2, fieldNameCn: '注册资本', fieldNameEn: 'registCapi', fieldType: 'String', dataCategory: '政务数据', dataLevel: '1级—无损害' },
    { id: '3', seq: 3, fieldNameCn: '企业标签', fieldNameEn: 'tags', fieldType: 'Array', dataCategory: '政务数据', dataLevel: '1级—无损害' },
    { id: '4', seq: 4, fieldNameCn: '所属工商局', fieldNameEn: 'belongOrg', fieldType: 'String', dataCategory: '政务数据', dataLevel: '1级—无损害' },
    { id: '5', seq: 5, fieldNameCn: '经营状态', fieldNameEn: 'status', fieldType: 'String', dataCategory: '政务数据', dataLevel: '1级—无损害' },
    { id: '6', seq: 6, fieldNameCn: '营业开始日期', fieldNameEn: 'termStart', fieldType: 'String', dataCategory: '政务数据', dataLevel: '1级—无损害' },
  ])

  const columns = [
    { title: '序号', dataIndex: 'seq', width: 80, align: 'center' as const },
    { title: '字段中文名', dataIndex: 'fieldNameCn', width: 150 },
    { title: '字段英文名', dataIndex: 'fieldNameEn', width: 150 },
    { title: '字段类型', dataIndex: 'fieldType', width: 120 },
    { title: '数据分类', dataIndex: 'dataCategory', width: 120 },
    { title: '数据分级', dataIndex: 'dataLevel', width: 150, render: (level: string) => <Tag color="blue">{level}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: FieldItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  const handleAdd = () => {
    setEditingField(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: FieldItem) => {
    setEditingField(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (record: FieldItem) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该字段吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setFields(fields.filter(f => f.id !== record.id))
        message.success('删除成功')
      },
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingField) {
        setFields(fields.map(f => f.id === editingField.id ? { ...f, ...values } : f))
        message.success('编辑成功')
      } else {
        const newField: FieldItem = {
          id: Date.now().toString(),
          seq: fields.length + 1,
          ...values
        }
        setFields([...fields, newField])
        message.success('新增成功')
      }
      setIsModalVisible(false)
    })
  }

  const handleImport = () => {
    setIsImportModalVisible(true)
  }

  const handleImportOk = () => {
    message.success('导入成功')
    setIsImportModalVisible(false)
  }

  const onCancel = () => {
    navigate('/main/data-asset/catalog', { replace: true })
  }

  const filteredFields = fields.filter(field =>
    field.fieldNameCn.includes(searchText) ||
    field.fieldNameEn.includes(searchText)
  )

  return (
    <ConfigProvider locale={zhCN}>
      <div className="asset-field-management">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>字段管理</span>
            </Space>
          }
          className="form-card"
        >
          {/* 资产信息 */}
          <Descriptions title="资产信息" bordered column={2} className="info-descriptions" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="数据资产中文名">{assetInfo.assetName}</Descriptions.Item>
            <Descriptions.Item label="数据资产英文名">{assetInfo.assetNameEn}</Descriptions.Item>
            <Descriptions.Item label="数据资产分类">{assetInfo.assetCategory}</Descriptions.Item>
            <Descriptions.Item label="数据资产形态">{assetInfo.assetForm}</Descriptions.Item>
          </Descriptions>

          {/* 字段信息 */}
          <div className="form-section-title" style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>字段信息</div>
          <Row gutter={24} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Space>
                <Input
                  placeholder="请输入字段中文名/英文名"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
                <Button icon={<UploadOutlined />} onClick={handleImport}>导入</Button>
              </Space>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredFields}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
        }}
          />
        </Card>

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingField ? '编辑字段' : '新增字段'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="seq"
                  label="序号"
                  rules={[{ required: true, message: '请输入序号' }]}
                >
                  <Input type="number" placeholder="请输入序号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fieldType"
                  label="字段类型"
                  rules={[{ required: true, message: '请输入字段类型' }]}
                >
                  <Input placeholder="请输入字段类型" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="fieldNameCn"
                  label="字段中文名"
                  rules={[{ required: true, message: '请输入字段中文名' }]}
                >
                  <Input placeholder="请输入字段中文名" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fieldNameEn"
                  label="字段英文名"
                  rules={[{ required: true, message: '请输入字段英文名' }]}
                >
                  <Input placeholder="请输入字段英文名" maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataCategory"
                  label="数据分类"
                  rules={[{ required: true, message: '请选择数据分类' }]}
                >
                  <Select placeholder="请选择数据分类">
                    <Option value="政务数据">政务数据</Option>
                    <Option value="商业数据">商业数据</Option>
                    <Option value="自营数据">自营数据</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataLevel"
                  label="数据分级"
                  rules={[{ required: true, message: '请选择数据分级' }]}
                >
                  <Select placeholder="请选择数据分级">
                    <Option value="1级-无损害">1级-无损害</Option>
                    <Option value="2级-轻微损害">2级-轻微损害</Option>
                    <Option value="3级-一般损害">3级-一般损害</Option>
                    <Option value="4级-严重损害">4级-严重损害</Option>
                    <Option value="5级-特别严重损害">5级-特别严重损害</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* 导入弹窗 */}
        <Modal
          title="导入字段"
          open={isImportModalVisible}
          onOk={handleImportOk}
          onCancel={() => setIsImportModalVisible(false)}
          width={500}
          okText="提交"
          cancelText="取消"
        >
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '13px', color: '#666' }}>
              1. <a href="#" onClick={(e) => { e.preventDefault(); message.success('模板下载成功') }}>下载模板</a>，请根据模板的格式填写信息；
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>
              2. 上传文件不超过5M，仅支持上传xls、xlsx格式的文件。
            </p>
          </div>
          <Upload.Dragger
            name="file"
            multiple={false}
            accept=".xls,.xlsx"
            beforeUpload={() => false}
            style={{ padding: 20 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此处上传</p>
          </Upload.Dragger>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default AssetFieldManagement
