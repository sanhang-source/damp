import { useState } from 'react'
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
  Cascader,
  Typography,
  ConfigProvider
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './style.css'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

const { Title } = Typography

const { Option } = Select
const { TextArea } = Input

const OrganizationAdd = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (_values: any) => {
    setLoading(true)
    setTimeout(() => {
      message.success('新增成功')
      setLoading(false)
      navigate('/main/data-access/organization', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-access/organization', { replace: true })
  }

  const addressOptions = [
    {
      value: '广东省',
      label: '广东省',
      children: [
        {
          value: '深圳市',
          label: '深圳市',
          children: [
            { value: '南山区', label: '南山区' },
            { value: '福田区', label: '福田区' },
            { value: '罗湖区', label: '罗湖区' },
          ],
        },
        {
          value: '广州市',
          label: '广州市',
          children: [
            { value: '天河区', label: '天河区' },
            { value: '越秀区', label: '越秀区' },
          ],
        },
      ],
    },
    {
      value: '上海市',
      label: '上海市',
      children: [
        {
          value: '上海市',
          label: '上海市',
          children: [
            { value: '浦东新区', label: '浦东新区' },
            { value: '黄浦区', label: '黄浦区' },
          ],
        },
      ],
    },
  ]

  return (
    <ConfigProvider locale={zhCN}>
      <div className="organization-add">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>新增数源机构</span>
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
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="orgId"
                label="数源机构ID"
                rules={[{ required: true, message: '请输入数源机构ID' }]}
              >
                <Input placeholder="请输入数源机构ID" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgName"
                label="数源机构名称"
                rules={[{ required: true, message: '请输入数源机构名称' }]}
              >
                <Input placeholder="请输入数源机构名称" maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
                rules={[
                  { required: true, message: '请输入统一社会信用代码' },
                  { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' }
                ]}
              >
                <Input placeholder="请输入18位统一社会信用代码" maxLength={18} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgShortName"
                label="数源机构简称"
                rules={[{ required: true, message: '请输入数源机构简称' }]}
              >
                <Input placeholder="请输入数源机构简称" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="contactName"
                label="联系人"
              >
                <Input placeholder="请输入联系人姓名" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" maxLength={11} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
                rules={[
                  { type: 'email', message: '请输入正确的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" maxLength={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="联系地址"
              >
                <Input.Group compact>
                  <Form.Item name="region" noStyle>
                    <Cascader
                      options={addressOptions}
                      placeholder="请选择省市区"
                      style={{ width: '40%' }}
                    />
                  </Form.Item>
                  <Form.Item name="detailAddress" noStyle>
                    <Input style={{ width: '60%' }} placeholder="请输入详细地址" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="orgType"
                label="数源机构类型"
                rules={[{ required: true, message: '请选择数源机构类型' }]}
              >
                <Select placeholder="请选择数源机构类型">
                  <Option value="商业数据">商业数据</Option>
                  <Option value="政务数据">政务数据</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accessDate"
                label="数源准入日期"
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择数源准入日期" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="annualReviewDate"
                label="年审到期日期"
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择年审到期日期" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="备注"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
              >
                <TextArea
                  placeholder="请输入备注信息"
                  rows={3}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="form-section-title">合作信息</Title>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="cooperationStatus"
                label="合作状态"
                rules={[{ required: true, message: '请选择合作状态' }]}
                initialValue="合作中"
              >
                <Select placeholder="请选择合作状态">
                  <Option value="合作中">合作中</Option>
                  <Option value="意向合作">意向合作</Option>
                  <Option value="结束合作">结束合作</Option>
                  <Option value="终止合作">终止合作</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="form-section-title">征信客户经理信息</Title>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="managerName"
                label="客户经理姓名"
                rules={[{ required: true, message: '请输入客户经理姓名' }]}
              >
                <Input placeholder="请输入客户经理姓名" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="managerPhone"
                label="客户经理电话"
                rules={[
                  { required: true, message: '请输入客户经理电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" maxLength={11} />
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

export default OrganizationAdd
