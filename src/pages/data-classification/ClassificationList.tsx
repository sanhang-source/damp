import { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, ExportOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface ClassificationItem {
  id: string
  dataCode: string
  dataNameCn: string
  dataNameEn: string
  dataLevel: string
  dataCategoryLarge: string
  dataCategorySmall: string
  dataType: string
  dataLength: string
  dataFormat: string
  dataFormatDesc: string
  allowNull: string
  valueDomainType: string
  valueDomain: string
  businessDefinition: string
  businessRule: string
  referenceStandard: string
  createTime: string
}

const ClassificationList = () => {
  const navigate = useNavigate()
  const [searchForm] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [expandSearch, setExpandSearch] = useState(false)

  const data: ClassificationItem[] = [
    {
      id: '1',
      dataCode: 'ZX000000016',
      dataNameCn: 'econKind',
      dataNameEn: '企业类型',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '2',
      dataCode: 'ZX000000016',
      dataNameCn: 'registCapi',
      dataNameEn: '注册资本',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '3',
      dataCode: 'ZX000000016',
      dataNameCn: 'tags',
      dataNameEn: '企业标签',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '4',
      dataCode: 'ZX000000016',
      dataNameCn: 'scope',
      dataNameEn: '经营范围',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '5',
      dataCode: 'ZX000000016',
      dataNameCn: 'termStart',
      dataNameEn: '营业期限始',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '6',
      dataCode: 'ZX000000016',
      dataNameCn: 'termEnd',
      dataNameEn: '营业期限至',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '7',
      dataCode: 'ZX000000016',
      dataNameCn: 'checkDate',
      dataNameEn: '核准日期',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '8',
      dataCode: 'ZX000000016',
      dataNameCn: 'format_name',
      dataNameEn: '企业名称',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '9',
      dataCode: 'ZX000000016',
      dataNameCn: 'creditNo',
      dataNameEn: '统一社会信用代码',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    },
    {
      id: '10',
      dataCode: 'ZX000000016',
      dataNameCn: 'operName',
      dataNameEn: '企业法定代表人',
      dataLevel: '1级—无损害',
      dataCategoryLarge: '工商信息',
      dataCategorySmall: '工商照面',
      dataType: 'String',
      dataLength: '',
      dataFormat: '',
      dataFormatDesc: '',
      allowNull: '否',
      valueDomainType: '',
      valueDomain: '',
      businessDefinition: '',
      businessRule: '',
      referenceStandard: '',
      createTime: '2024-09-17 21:20:40'
    }
  ]

  const columns = [
    { title: '序号', key: 'index', width: 70, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: '数据编码', dataIndex: 'dataCode', width: 140 },
    { title: '数据中文名', dataIndex: 'dataNameCn', width: 150 },
    { title: '数据英文名', dataIndex: 'dataNameEn', width: 150 },
    { title: '数据分级', dataIndex: 'dataLevel', width: 130 },
    { title: '数据分类大类', dataIndex: 'dataCategoryLarge', width: 120 },
    { title: '数据分类小类', dataIndex: 'dataCategorySmall', width: 120 },
    { title: '数据类型', dataIndex: 'dataType', width: 100 },
    { title: '数据长度', dataIndex: 'dataLength', width: 100 },
    { title: '数据格式', dataIndex: 'dataFormat', width: 100 },
    { title: '数据格式描述', dataIndex: 'dataFormatDesc', width: 150 },
    { title: '是否允许为空', dataIndex: 'allowNull', width: 120 },
    { title: '值域类型', dataIndex: 'valueDomainType', width: 100 },
    { title: '值域', dataIndex: 'valueDomain', width: 100 },
    { title: '业务定义', dataIndex: 'businessDefinition', width: 150 },
    { title: '业务规则', dataIndex: 'businessRule', width: 150 },
    { title: '参考标准', dataIndex: 'referenceStandard', width: 150 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    { 
      title: '操作', 
      key: 'action', 
      width: 150, 
      fixed: 'right' as const, 
      render: (_: any, record: ClassificationItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  const handleAdd = () => {
    navigate('/main/data-classification/classification/add', { replace: true })
  }

  const handleEdit = (record: ClassificationItem) => {
    navigate(`/main/data-classification/classification/edit/${record.id}`, { replace: true })
  }

  const handleDelete = (_record: ClassificationItem) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除该数据吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功')
      },
    })
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div className="classification-list">
      <Card className="search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Form.Item name="dataCategoryLarge" label="数据分类大类" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择数据分类大类" allowClear>
                  <Option value="工商信息">工商信息</Option>
                  <Option value="司法信息">司法信息</Option>
                  <Option value="知识产权">知识产权</Option>
                  <Option value="经营状况">经营状况</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dataNameCn" label="数据中文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数据中文名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dataNameEn" label="数据英文名" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入数据英文名" allowClear />
              </Form.Item>
            </Col>
          </Row>
          {expandSearch && (
            <Row gutter={24} align="middle" style={{ marginTop: 16 }}>
              <Col span={8}>
                <Form.Item name="dataLevel" label="数据分级" style={{ marginBottom: 0 }}>
                  <Select placeholder="请选择数据分级" allowClear>
                    <Option value="1级—无损害">1级—无损害</Option>
                    <Option value="2级—轻微损害">2级—轻微损害</Option>
                    <Option value="3级—一般损害">3级—一般损害</Option>
                    <Option value="4级—严重损害">4级—严重损害</Option>
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
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                <Button icon={<ReloadOutlined />}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title="数据分级分类管理"
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
    </div>
  )
}

export default ClassificationList
