import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Row, Col, Select, InputNumber } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

const { Option } = Select

interface DictItemData {
  id: string
  itemId: string
  itemLabel: string
  itemKey: string
  itemSort: number
  status: string
  remark: string
  createTime: string
}

const DictItemList = () => {
  const navigate = useNavigate()
  const { id: _id } = useParams<{ id: string }>()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<DictItemData | null>(null)
  const [currentItem, setCurrentItem] = useState<DictItemData | null>(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  const [data, setData] = useState<DictItemData[]>([
    { id: '1', itemId: 'BM00020-001', itemLabel: '警告', itemKey: '01', itemSort: 1, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '2', itemId: 'BM00020-002', itemLabel: '通报批评', itemKey: '02', itemSort: 2, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '3', itemId: 'BM00020-003', itemLabel: '罚款', itemKey: '03', itemSort: 3, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '4', itemId: 'BM00020-004', itemLabel: '没收违法所得', itemKey: '04', itemSort: 4, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '5', itemId: 'BM00020-005', itemLabel: '没收非法财物', itemKey: '05', itemSort: 5, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '6', itemId: 'BM00020-006', itemLabel: '责令停产停业', itemKey: '06', itemSort: 6, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '7', itemId: 'BM00020-007', itemLabel: '暂扣许可证', itemKey: '07', itemSort: 7, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '8', itemId: 'BM00020-008', itemLabel: '吊销许可证', itemKey: '08', itemSort: 8, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '9', itemId: 'BM00020-009', itemLabel: '行政拘留', itemKey: '09', itemSort: 9, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
    { id: '10', itemId: 'BM00020-010', itemLabel: '其他行政处罚', itemKey: '10', itemSort: 10, status: '正常', remark: '', createTime: '2024-09-17 21:20:40' },
  ])

  const columns = [
    { title: '序号', key: 'index', width: 80, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '字典项ID', dataIndex: 'itemId', width: 150 },
    { title: '字典项标签', dataIndex: 'itemLabel', width: 150 },
    { title: '字典项键值', dataIndex: 'itemKey', width: 120 },
    { title: '字典项排序', dataIndex: 'itemSort', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : 'default'}>{status}</Tag>
      )
    },
    { title: '备注', dataIndex: 'remark', width: 200 },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: DictItemData) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>修改</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    message.success('查询成功')
  }

  const handleReset = () => {
    searchForm.resetFields()
    message.success('重置成功')
  }

  const handleAdd = () => {
    addForm.resetFields()
    addForm.setFieldsValue({
      dictNameEn: 'CFZLBM',
      itemSort: 0,
      status: '正常'
    })
    setIsAddModalVisible(true)
  }

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      const newItem: DictItemData = {
        id: Date.now().toString(),
        itemId: `BM00020-${String(data.length + 1).padStart(3, '0')}`,
        itemLabel: values.itemLabel,
        itemKey: values.itemKey,
        itemSort: values.itemSort,
        status: values.status,
        remark: values.remark || '',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false })
      }
      setData([...data, newItem])
      message.success('新增成功')
      setIsAddModalVisible(false)
    })
  }

  const handleEdit = (record: DictItemData) => {
    setEditingItem(record)
    editForm.setFieldsValue({
      itemLabel: record.itemLabel,
      itemKey: record.itemKey,
      itemSort: record.itemSort,
      status: record.status,
      remark: record.remark,
      dictNameEn: 'CFZLBM'
    })
    setIsEditModalVisible(true)
  }

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      if (editingItem) {
        setData(data.map(item =>
          item.id === editingItem.id
            ? { ...item, itemLabel: values.itemLabel, itemKey: values.itemKey, itemSort: values.itemSort, status: values.status, remark: values.remark || '' }
            : item
        ))
        message.success('修改成功')
        setIsEditModalVisible(false)
      }
    })
  }

  const handleDelete = (record: DictItemData) => {
    setCurrentItem(record)
    setIsDeleteModalVisible(true)
  }

  const handleDeleteConfirm = () => {
    if (currentItem) {
      setData(data.filter(item => item.id !== currentItem.id))
      message.success('删除成功')
      setIsDeleteModalVisible(false)
    }
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="dict-item-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="itemLabel" label="字典项标签" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入字典项标签" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="itemKey" label="字典项键值" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入字典项键值" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear>
                  <Option value="正常">正常</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/main/system/dict', { replace: true })}>返回</Button>
            <span>字典项管理 - 处罚种类编码</span>
          </Space>
        }
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
          }}
        />
      </Card>

      {/* 新增弹窗 */}
      <Modal
        title="新增"
        open={isAddModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => setIsAddModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={addForm} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="dictNameEn" label="字典英文名">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
                initialValue="正常"
              >
                <Select placeholder="请选择状态">
                  <Option value="正常">正常</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="itemLabel"
                label="字典项标签"
                rules={[{ required: true, message: '请输入字典项标签' }]}
              >
                <Input placeholder="请输入字典项标签" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="itemKey"
                label="字典项键值"
                rules={[{ required: true, message: '请输入字典项键值' }]}
              >
                <Input placeholder="请输入字典项键值" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="itemSort"
                label="显示排序"
                rules={[{ required: true, message: '请输入显示排序' }]}
                initialValue={0}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入显示排序" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="styleAttr" label="样式属性">
                <Input placeholder="请输入样式属性" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="echoStyle" label="回显样式">
                <Select placeholder="请选择回显样式" allowClear>
                  <Option value="default">默认（default）</Option>
                  <Option value="primary">主要（primary）</Option>
                  <Option value="success">成功（success）</Option>
                  <Option value="info">信息（info）</Option>
                  <Option value="warning">警告（warning）</Option>
                  <Option value="danger">危险（danger）</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remark" label="备注">
                <Input placeholder="请输入备注" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 修改弹窗 */}
      <Modal
        title="修改"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="dictNameEn" label="字典英文名">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="正常">正常</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="itemLabel"
                label="字典项标签"
                rules={[{ required: true, message: '请输入字典项标签' }]}
              >
                <Input placeholder="请输入字典项标签" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="itemKey"
                label="字典项键值"
                rules={[{ required: true, message: '请输入字典项键值' }]}
              >
                <Input placeholder="请输入字典项键值" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="itemSort"
                label="显示排序"
                rules={[{ required: true, message: '请输入显示排序' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入显示排序" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="styleAttr" label="样式属性">
                <Input placeholder="请输入样式属性" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="echoStyle" label="回显样式">
                <Select placeholder="请选择回显样式" allowClear>
                  <Option value="default">默认（default）</Option>
                  <Option value="primary">主要（primary）</Option>
                  <Option value="success">成功（success）</Option>
                  <Option value="info">信息（info）</Option>
                  <Option value="warning">警告（warning）</Option>
                  <Option value="danger">危险（danger）</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remark" label="备注">
                <Input placeholder="请输入备注" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
        <p>是否确认删除字典项ID为"{currentItem?.itemId}"的数据项？</p>
      </Modal>
    </div>
  )
}

export default DictItemList
