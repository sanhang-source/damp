import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Row, Col, Tree, Select } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'

const { Option } = Select

interface RoleItem {
  id: string
  roleName: string
  roleCode: string
  status: string
  creator: string
  createTime: string
  updateTime: string
}

const RoleList = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false)
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false)
  const [isEnableModalVisible, setIsEnableModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)
  const [currentRole, setCurrentRole] = useState<RoleItem | null>(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  const [data, setData] = useState<RoleItem[]>([
    { id: '1', roleName: '系统管理员', roleCode: 'XTGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '2', roleName: '数据接入管理员', roleCode: 'SJJRGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '3', roleName: '数据治理管理员', roleCode: 'SJZLGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '4', roleName: '数据资源管理员', roleCode: 'SJZYGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '5', roleName: '数据资产管理员', roleCode: 'SJZCGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '6', roleName: '数据质量管理员', roleCode: 'SJZLGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '7', roleName: '数据接入管理员', roleCode: 'SJJRGL', status: '正常', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '8', roleName: '数据治理管理员', roleCode: 'SJZLGL', status: '禁用', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '9', roleName: '数据资源管理员', roleCode: 'SJZYGL', status: '禁用', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
    { id: '10', roleName: '数据资产管理员', roleCode: 'SJZCGL', status: '禁用', creator: '张三', createTime: '2024-07-16 17:41:09', updateTime: '-' },
  ])

  const permissionTreeData = [
    {
      title: '数据接入',
      key: 'data-access',
      children: [
        { title: '机构管理', key: 'org' },
        { title: '合同管理', key: 'contract' },
        { title: '计费管理', key: 'billing' },
      ]
    },
    {
      title: '数据资源',
      key: 'data-resource',
      children: [
        { title: '资源查询', key: 'query' },
        { title: '表管理', key: 'table' },
        { title: '接口管理', key: 'api' },
      ]
    },
    {
      title: '系统管理',
      key: 'system',
      children: [
        { title: '用户管理', key: 'user' },
        { title: '角色管理', key: 'role' },
      ]
    },
  ]

  const columns = [
    { title: '序号', key: 'index', width: 80, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '角色名称', dataIndex: 'roleName', width: 150 },
    { title: '角色代码', dataIndex: 'roleCode', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : 'default'}>{status}</Tag>
      )
    },
    { title: '创建人', dataIndex: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    { title: '更新时间', dataIndex: 'updateTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: RoleItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handlePermission(record)}>分配资源</Button>
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
      const newRole: RoleItem = {
        id: Date.now().toString(),
        roleName: values.roleName,
        roleCode: values.roleCode,
        status: '正常',
        creator: '张三',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        updateTime: '-'
      }
      setData([...data, newRole])
      message.success('新增成功')
      setIsAddModalVisible(false)
    })
  }

  const handleEdit = (record: RoleItem) => {
    setEditingRole(record)
    editForm.setFieldsValue({
      roleName: record.roleName,
      roleCode: record.roleCode
    })
    setIsEditModalVisible(true)
  }

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      if (editingRole) {
        setData(data.map(item =>
          item.id === editingRole.id
            ? { ...item, roleName: values.roleName, updateTime: new Date().toLocaleString('zh-CN', { hour12: false }) }
            : item
        ))
        message.success('修改成功')
        setIsEditModalVisible(false)
      }
    })
  }

  const handlePermission = (record: RoleItem) => {
    setCurrentRole(record)
    setIsPermissionModalVisible(true)
  }

  const handlePermissionSubmit = () => {
    message.success('分配资源成功')
    setIsPermissionModalVisible(false)
  }

  const handleDisable = (record: RoleItem) => {
    setCurrentRole(record)
    setIsDisableModalVisible(true)
  }

  const handleDisableConfirm = () => {
    if (currentRole) {
      setData(data.map(item =>
        item.id === currentRole.id
          ? { ...item, status: '禁用', updateTime: new Date().toLocaleString('zh-CN', { hour12: false }) }
          : item
      ))
      message.success('禁用成功')
      setIsDisableModalVisible(false)
    }
  }

  const handleEnable = (record: RoleItem) => {
    setCurrentRole(record)
    setIsEnableModalVisible(true)
  }

  const handleEnableConfirm = () => {
    if (currentRole) {
      setData(data.map(item =>
        item.id === currentRole.id
          ? { ...item, status: '正常', updateTime: new Date().toLocaleString('zh-CN', { hour12: false }) }
          : item
      ))
      message.success('启用成功')
      setIsEnableModalVisible(false)
    }
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="role-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="roleName" label="角色名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入角色名称" allowClear />
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
            <Col span={8} style={{ textAlign: 'right', paddingRight: 8 }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title="角色管理"
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
        okText="提交"
        cancelText="取消"
        width={480}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="roleCode"
            label="角色代码"
            rules={[{ required: true, message: '请输入角色代码' }]}
          >
            <Input placeholder="请输入角色代码" />
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
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="roleCode"
            label="角色代码"
          >
            <Input placeholder="请输入角色代码" disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分配资源弹窗 */}
      <Modal
        title="分配资源"
        open={isPermissionModalVisible}
        onOk={handlePermissionSubmit}
        onCancel={() => setIsPermissionModalVisible(false)}
        okText="提交"
        cancelText="取消"
        width={600}
      >
        <Tree checkable treeData={permissionTreeData} defaultExpandAll />
      </Modal>

      {/* 禁用确认弹窗 */}
      <Modal
        title="提示"
        open={isDisableModalVisible}
        onOk={handleDisableConfirm}
        onCancel={() => setIsDisableModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={400}
      >
        <p>确定要禁用该角色吗？</p>
      </Modal>

      {/* 启用确认弹窗 */}
      <Modal
        title="提示"
        open={isEnableModalVisible}
        onOk={handleEnableConfirm}
        onCancel={() => setIsEnableModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={400}
      >
        <p>确定要启用该角色吗？</p>
      </Modal>
    </div>
  )
}

export default RoleList
