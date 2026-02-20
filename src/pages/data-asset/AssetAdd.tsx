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

const AssetAdd = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (_values: any) => {
    setLoading(true)
    setTimeout(() => {
      message.success('新增成功')
      setLoading(false)
      navigate('/main/data-asset/catalog', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-asset/catalog', { replace: true })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="asset-add">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>新增数据资产</span>
            </Space>
          }
          className="form-card"
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Title level={5} className="form-section-title">基本信息</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="数据资产ID"
                >
                  <Input disabled placeholder="系统自动生成" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="assetName"
                  label="数据资产中文名"
                  rules={[{ required: true, message: '请输入数据资产中文名' }]}
                >
                  <Input placeholder="请输入数据资产中文名" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="assetNameEn"
                  label="数据资产英文名"
                  rules={[{ required: true, message: '请输入数据资产英文名' }]}
                >
                  <Input placeholder="请输入数据资产英文名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="assetCategory"
                  label="数据资产分类"
                  rules={[{ required: true, message: '请选择数据资产分类' }]}
                >
                  <Select placeholder="请选择数据资产分类">
                    <Option value="信用评价">信用评价</Option>
                    <Option value="合规风控">合规风控</Option>
                    <Option value="企业信息">企业信息</Option>
                    <Option value="风险预警">风险预警</Option>
                    <Option value="财务分析">财务分析</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="assetForm"
                  label="数据资产形态"
                  rules={[{ required: true, message: '请选择数据资产形态' }]}
                >
                  <Select placeholder="请选择数据资产形态">
                    <Option value="产品表">产品表</Option>
                    <Option value="接口">接口</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="数据资产说明"
                >
                  <Input placeholder="请输入数据资产说明" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item wrapperCol={{ offset: 3, span: 21 }} style={{ marginTop: 24 }}>
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

export default AssetAdd
