import { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Row,
  Col,
  Space,
  Skeleton,
  Typography,
  ConfigProvider
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'
import '../data-access/style.css'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

const { Title } = Typography

const { Option } = Select
const { TextArea } = Input

const DatabaseTableEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // 模拟加载数据
      form.setFieldsValue({
        tableId: '001091',
        tableCategory: '工商信息',
        tableNameCn: '工商照面',
        tableNameEn: 'sz_business_license',
        tableAlias: '工商照面',
        serviceStatus: '已上线',
        updateFrequency: '每日',
        productStatus: '已使用',
        dataCategory: '政务数据',
        storageEnv: '国资云',
        updateStatus: '正常',
        firstAccessTime: dayjs('2022-11-05'),
        dataSourceOrg: '',
        contractName: '',
        recordCount: 1683626,
        accessType: '库表',
        description: ''
      })
      setLoading(false)
    }, 500)
  }, [id, form])

  const onFinish = (_values: any) => {
    setSaving(true)
    setTimeout(() => {
      message.success('保存成功')
      setSaving(false)
      navigate('/main/data-resource/database', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-resource/database', { replace: true })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="database-table-edit">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>编辑数据库表</span>
            </Space>
          }
          className="form-card"
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 15 }} />
          ) : (
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Title level={5} className="form-section-title">基本信息</Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="tableId"
                    label="库表ID"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tableCategory"
                    label="库表分类"
                    rules={[{ required: true, message: '请选择库表分类' }]}
                  >
                    <Select placeholder="请选择库表分类">
                      <Option value="工商信息">工商信息</Option>
                      <Option value="司法信息">司法信息</Option>
                      <Option value="经营风险">经营风险</Option>
                      <Option value="经营信息">经营信息</Option>
                      <Option value="知识产权">知识产权</Option>
                      <Option value="关联关系">关联关系</Option>
                      <Option value="新闻舆情">新闻舆情</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="tableNameCn"
                    label="库表中文名"
                    rules={[{ required: true, message: '请输入库表中文名' }]}
                  >
                    <Input placeholder="请输入库表中文名" maxLength={100} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tableNameEn"
                    label="库表英文名"
                    rules={[{ required: true, message: '请输入库表英文名' }]}
                  >
                    <Input placeholder="请输入库表英文名" maxLength={100} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="tableAlias"
                    label="库表中文别名"
                    rules={[{ required: true, message: '请输入库表中文别名' }]}
                  >
                    <Input placeholder="请输入库表中文别名" maxLength={100} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="firstAccessTime"
                    label="首次接入时间"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="请选择首次接入时间"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="serviceStatus"
                    label="库表服务状态"
                    rules={[{ required: true, message: '请选择库表服务状态' }]}
                  >
                    <Select placeholder="请选择库表服务状态">
                      <Option value="已上线">已上线</Option>
                      <Option value="未上线">未上线</Option>
                      <Option value="已弃用">已弃用</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="productStatus"
                    label="产品服务状态"
                    rules={[{ required: true, message: '请选择产品服务状态' }]}
                  >
                    <Select placeholder="请选择产品服务状态">
                      <Option value="已使用">已使用</Option>
                      <Option value="未使用">未使用</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="updateFrequency"
                    label="数据更新频率"
                    rules={[{ required: true, message: '请选择数据更新频率' }]}
                  >
                    <Select placeholder="请选择数据更新频率">
                      <Option value="实时">实时</Option>
                      <Option value="每小时">每小时</Option>
                      <Option value="每日">每日</Option>
                      <Option value="每周">每周</Option>
                      <Option value="每季度">每季度</Option>
                      <Option value="每年">每年</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="updateStatus"
                    label="数据更新状态"
                    rules={[{ required: true, message: '请选择数据更新状态' }]}
                  >
                    <Select placeholder="请选择数据更新状态">
                      <Option value="正常">正常</Option>
                      <Option value="异常">异常</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="dataCategory"
                    label="数据类别"
                    rules={[{ required: true, message: '请选择数据类别' }]}
                  >
                    <Select placeholder="请选择数据类别">
                      <Option value="商业数据">商业数据</Option>
                      <Option value="政务数据">政务数据</Option>
                      <Option value="运营数据">运营数据</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="storageEnv"
                    label="数据存储环境"
                    rules={[{ required: true, message: '请选择数据存储环境' }]}
                  >
                    <Select placeholder="请选择数据存储环境">
                      <Option value="政务云">政务云</Option>
                      <Option value="国资云">国资云</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="dataSourceOrg"
                    label="数源机构名称"
                    rules={[{ required: true, message: '请选择数源机构名称' }]}
                  >
                    <Select placeholder="请选择数源机构名称" allowClear>
                      <Option value="机构1">机构1</Option>
                      <Option value="机构2">机构2</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="accessType"
                    label="对接形式"
                    rules={[{ required: true, message: '请选择对接形式' }]}
                  >
                    <Select placeholder="请选择对接形式">
                      <Option value="库表">库表</Option>
                      <Option value="离线">离线</Option>
                      <Option value="接口">接口</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contractName"
                    label="合同名称"
                  >
                    <Select placeholder="请选择合同名称" allowClear>
                      <Option value="合同1">合同1</Option>
                      <Option value="合同2">合同2</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="recordCount"
                    label="记录数"
                  >
                    <Input type="number" placeholder="请输入记录数" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="description"
                    label="库表说明"
                  >
                    <TextArea rows={1} placeholder="请输入库表说明" maxLength={500} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item wrapperCol={{ offset: 2, span: 22 }} style={{ marginTop: 24 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                    保存
                  </Button>
                  <Button onClick={onCancel}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default DatabaseTableEdit
