import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Row, Col, Select } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface DictItem {
  id: string
  dictNo: string
  dictNameCn: string
  dictNameEn: string
  status: string
  remark: string
}

const DictList = () => {
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editingDict, setEditingDict] = useState<DictItem | null>(null)
  const [currentDict, setCurrentDict] = useState<DictItem | null>(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  const [data, setData] = useState<DictItem[]>([
    { id: '1', dictNo: 'BM00020', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '2', dictNo: 'BM00019', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '3', dictNo: 'BM00018', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '4', dictNo: 'BM00017', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '5', dictNo: 'BM00016', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '6', dictNo: 'BM00015', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '7', dictNo: 'BM00014', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '8', dictNo: 'BM00013', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '9', dictNo: 'BM00012', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
    { id: '10', dictNo: 'BM00011', dictNameCn: '处罚种类编码', dictNameEn: 'CFZLBM', status: '正常', remark: '' },
  ])

  const columns = [
    { title: '序号', key: 'index', width: 80, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '字典ID', dataIndex: 'dictNo', width: 120 },
    { title: '字典中文名', dataIndex: 'dictNameCn', width: 150 },
    { title: '字典英文名', dataIndex: 'dictNameEn', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : 'default'}>{status}</Tag>
      )
    },
    { title: '备注', dataIndex: 'remark', width: 200 },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: DictItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>修改</Button>
          <Button type="link" size="small" onClick={() => navigate(`/main/system/dict/items/${record.id}`)}>字典项管理</Button>
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
    setIsAddModalVisible(true)
  }

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      const newDict: DictItem = {
        id: Date.now().toString(),
        dictNo: `BM${String(data.length + 1).padStart(5, '0')}`,
        dictNameCn: values.dictNameCn,
        dictNameEn: values.dictNameEn,
        status: values.status,
        remark: values.remark || ''
      }
      setData([...data, newDict])
      message.success('新增成功')
      setIsAddModalVisible(false)
    })
  }

  const handleEdit = (record: DictItem) => {
    setEditingDict(record)
    editForm.setFieldsValue({
      dictNameCn: record.dictNameCn,
      dictNameEn: record.dictNameEn,
      status: record.status,
      remark: record.remark
    })
    setIsEditModalVisible(true)
  }

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      if (editingDict) {
        setData(data.map(item =>
          item.id === editingDict.id
            ? { ...item, dictNameCn: values.dictNameCn, dictNameEn: values.dictNameEn, status: values.status, remark: values.remark || '' }
            : item
        ))
        message.success('修改成功')
        setIsEditModalVisible(false)
      }
    })
  }

  const handleDelete = (record: DictItem) => {
    setCurrentDict(record)
    setIsDeleteModalVisible(true)
  }

  const handleDeleteConfirm = () => {
    if (currentDict) {
      setData(data.filter(item => item.id !== currentDict.id))
      message.success('删除成功')
      setIsDeleteModalVisible(false)
    }
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="dict-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="dictNameCn" label="字典中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入字典中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dictNameEn" label="字典英文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入字典英文名" allowClear />
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
        title="字典管理"
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
              <Form.Item
                name="dictNameCn"
                label="字典中文名"
                rules={[{ required: true, message: '请输入字典中文名' }]}
              >
                <Input placeholder="请输入字典中文名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dictNameEn"
                label="字典英文名"
                rules={[{ required: true, message: '请输入字典英文名' }]}
              >
                <Input placeholder="请输入字典英文名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
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
              <Form.Item
                name="dictNameCn"
                label="字典中文名"
                rules={[{ required: true, message: '请输入字典中文名' }]}
              >
                <Input placeholder="请输入字典中文名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dictNameEn"
                label="字典英文名"
              >
                <Input placeholder="请输入字典英文名" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
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
        <p>是否确认删除字典编号为"{currentDict?.dictNo}"的数据项？</p>
      </Modal>
    </div>
  )
}

export default DictList
