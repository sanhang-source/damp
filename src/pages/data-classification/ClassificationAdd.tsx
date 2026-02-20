import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Space,
  Typography,
  ConfigProvider
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import '../data-access/style.css'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const ClassificationAdd = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (_values: any) => {
    setLoading(true)
    setTimeout(() => {
      message.success('新增成功')
      setLoading(false)
      navigate('/main/data-classification/classification', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-classification/classification', { replace: true })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="classification-add">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>新增数据分级分类</span>
            </Space>
          }
          className="form-card"
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Title level={5} className="form-section-title">基本信息</Title>

            {/* 第一行：数据英文名 + 数据中文名 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataNameEn"
                  label="数据英文名"
                  rules={[{ required: true, message: '请输入数据英文名' }]}
                >
                  <Input placeholder="请输入数据英文名" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataNameCn"
                  label="数据中文名"
                  rules={[{ required: true, message: '请输入数据中文名' }]}
                >
                  <Input placeholder="请输入数据中文名" maxLength={100} />
                </Form.Item>
              </Col>
            </Row>

            {/* 第二行：数据编码 + 数据分级 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataCode"
                  label="数据编码"
                  rules={[{ required: true, message: '请输入数据编码' }]}
                >
                  <Input placeholder="请输入数据编码" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataLevel"
                  label="数据分级"
                  rules={[{ required: true, message: '请选择数据分级' }]}
                >
                  <Select placeholder="请选择数据分级">
                    <Option value="1级—无损害">1级—无损害</Option>
                    <Option value="2级—轻微损害">2级—轻微损害</Option>
                    <Option value="3级—一般损害">3级—一般损害</Option>
                    <Option value="4级—严重损害">4级—严重损害</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 第三行：数据分类大类 + 数据分类小类 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="dataCategoryLarge" label="数据分类大类">
                  <Select placeholder="请选择数据分类大类" allowClear>
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
              <Col span={12}>
                <Form.Item name="dataCategorySmall" label="数据分类小类">
                  <Select placeholder="请选择数据分类小类" allowClear>
                    <Option value="工商照面">工商照面</Option>
                    <Option value="股东信息">股东信息</Option>
                    <Option value="变更记录">变更记录</Option>
                    <Option value="分支机构">分支机构</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 第四行：数据类型 + 数据长度 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataType"
                  label="数据类型"
                  rules={[{ required: true, message: '请选择数据类型' }]}
                >
                  <Select placeholder="请选择数据类型">
                    <Option value="String">String</Option>
                    <Option value="Integer">Integer</Option>
                    <Option value="Long">Long</Option>
                    <Option value="Double">Double</Option>
                    <Option value="Boolean">Boolean</Option>
                    <Option value="Date">Date</Option>
                    <Option value="DateTime">DateTime</Option>
                    <Option value="Decimal">Decimal</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dataLength" label="数据长度">
                  <Input placeholder="请输入数据长度" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第五行：数据格式 + 数据格式描述 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="dataFormat" label="数据格式">
                  <Input placeholder="请输入数据格式" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dataFormatDesc" label="数据格式描述">
                  <Input placeholder="请输入数据格式描述" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第六行：数据是否允许为空 + 参考标准 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="allowNull"
                  label="数据是否允许为空"
                  rules={[{ required: true, message: '请选择是否允许为空' }]}
                >
                  <Select placeholder="请选择">
                    <Option value="是">是</Option>
                    <Option value="否">否</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="referenceStandard" label="参考标准">
                  <Input placeholder="请输入参考标准" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第七行：值域类型 + 值域 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="valueDomainType" label="值域类型">
                  <Select placeholder="请选择值域类型" allowClear>
                    <Option value="枚举">枚举</Option>
                    <Option value="范围">范围</Option>
                    <Option value="正则">正则</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="valueDomain" label="值域">
                  <Input placeholder="请输入值域" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第八行：业务定义 + 业务规则 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="businessDefinition" label="业务定义">
                  <TextArea rows={1} placeholder="请输入业务定义" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="businessRule" label="业务规则">
                  <TextArea rows={1} placeholder="请输入业务规则" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item wrapperCol={{ offset: 2, span: 22 }} style={{ marginTop: 24 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                  保存
                </Button>
                <Button onClick={onCancel}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default ClassificationAdd
