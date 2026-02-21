import { useState } from 'react'
import { Card, Form, Input, Select, Button, Table, Space, Tag, Modal, message, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'

const { Option } = Select

interface UserItem {
  id: string
  userName: string
  phone: string
  status: string
  role: string
}

const UserList = () => {
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false)
  const [isEnableModalVisible, setIsEnableModalVisible] = useState(false)
  const [_currentRecord, setCurrentRecord] = useState<UserItem | null>(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [authForm] = Form.useForm()

  // 与原型一致的数据
  const data: UserItem[] = [
    { id: '1', userName: '张三', phone: '15158134321', status: '正常', role: '系统管理员' },
    { id: '2', userName: '李四', phone: '15158134321', status: '正常', role: '系统管理员' },
    { id: '3', userName: '王五', phone: '15158134321', status: '正常', role: '数据接入管理员' },
    { id: '4', userName: '赵六', phone: '15158134321', status: '正常', role: '数据接入管理员' },
    { id: '5', userName: '张三', phone: '15158134321', status: '正常', role: '数据治理管理员' },
    { id: '6', userName: '李四', phone: '15158134321', status: '正常', role: '数据治理管理员' },
    { id: '7', userName: '王五', phone: '15158134321', status: '正常', role: '数据接入管理员' },
    { id: '8', userName: '赵六', phone: '15158134321', status: '禁用', role: '数据接入管理员' },
    { id: '9', userName: '张三', phone: '15158134321', status: '禁用', role: '数据治理管理员' },
    { id: '10', userName: '李四', phone: '15158134321', status: '禁用', role: '数据治理管理员' },
  ]

  const columns = [
    { title: '序号', key: 'index', width: 80, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '用户姓名', dataIndex: 'userName', width: 120 },
    { title: '用户手机号', dataIndex: 'phone', width: 140 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : 'default'}>{status}</Tag>
      )
    },
    { title: '拥有角色', dataIndex: 'role', width: 150 },
    { 
      title: '操作', 
      key: 'action', 
      width: 200, 
      fixed: 'right' as const, 
      render: (_: any, record: UserItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleAuth(record)}>授权</Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>修改</Button>
          {record.status === '正常' ? (
            <Button type="link" size="small" danger onClick={() => handleDisable(record)}>禁用</Button>
          ) : (
            <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => handleEnable(record)}>启用</Button>
          )}
        </Space>
      )
    },
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

  const handleAdd = () => {
    addForm.resetFields()
    setIsAddModalVisible(true)
  }

  const handleAddSubmit = () => {
    addForm.validateFields().then(() => {
      message.success('新增成功')
      setIsAddModalVisible(false)
    })
  }

  const handleEdit = (record: UserItem) => {
    setCurrentRecord(record)
    editForm.setFieldsValue({
      userName: record.userName,
      phone: record.phone
    })
    setIsEditModalVisible(true)
  }

  const handleEditSubmit = () => {
    editForm.validateFields().then(() => {
      message.success('修改成功')
      setIsEditModalVisible(false)
    })
  }

  const handleAuth = (record: UserItem) => {
    setCurrentRecord(record)
    authForm.setFieldsValue({
      role: record.role
    })
    setIsAuthModalVisible(true)
  }

  const handleAuthSubmit = () => {
    authForm.validateFields().then(() => {
      message.success('授权成功')
      setIsAuthModalVisible(false)
    })
  }

  const handleDisable = (record: UserItem) => {
    setCurrentRecord(record)
    setIsDisableModalVisible(true)
  }

  const handleDisableConfirm = () => {
    message.success('禁用成功')
    setIsDisableModalVisible(false)
  }

  const handleEnable = (record: UserItem) => {
    setCurrentRecord(record)
    setIsEnableModalVisible(true)
  }

  const handleEnableConfirm = () => {
    message.success('启用成功')
    setIsEnableModalVisible(false)
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="user-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={form}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="userName" label="用户姓名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入用户姓名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="用户手机号" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入用户手机号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear>
                  <Option value="正常">正常</Option>
                  <Option value="禁用">禁用</Option>
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
        className="table-card"
        title="用户管理"
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
          loading={loading} 
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: 25,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '50', '100', '500', '1000', '5000', '8000'],
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
        okText="提交"
        cancelText="取消"
        width={480}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="userName"
            label="用户姓名"
            rules={[{ required: true, message: '请输入用户姓名' }]}
          >
            <Input placeholder="请输入用户姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="用户手机号"
            rules={[{ required: true, message: '请输入用户手机号' }]}
          >
            <Input placeholder="请输入用户手机号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改弹窗 */}
      <Modal
        title="修改"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="提交"
        cancelText="取消"
        width={480}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="userName"
            label="用户姓名"
            rules={[{ required: true, message: '请输入用户姓名' }]}
          >
            <Input placeholder="请输入用户姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="用户手机号"
            rules={[{ required: true, message: '请输入用户手机号' }]}
          >
            <Input placeholder="请输入用户手机号" disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* 授权弹窗 */}
      <Modal
        title="授权"
        open={isAuthModalVisible}
        onOk={handleAuthSubmit}
        onCancel={() => setIsAuthModalVisible(false)}
        okText="提交"
        cancelText="取消"
        width={480}
        destroyOnClose
      >
        <Form form={authForm} layout="vertical">
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色" getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}>
              <Option value="系统管理员">系统管理员</Option>
              <Option value="数据接入管理员">数据接入管理员</Option>
              <Option value="数据治理管理员">数据治理管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 禁用确认弹窗 */}
      <Modal
        title="提示"
        open={isDisableModalVisible}
        onOk={handleDisableConfirm}
        onCancel={() => setIsDisableModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>确定要禁用该用户吗？</p>
      </Modal>

      {/* 启用确认弹窗 */}
      <Modal
        title="提示"
        open={isEnableModalVisible}
        onOk={handleEnableConfirm}
        onCancel={() => setIsEnableModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>确定要启用该用户吗？</p>
      </Modal>
    </div>
  )
}

export default UserList
