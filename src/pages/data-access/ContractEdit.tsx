import { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Upload,
  message,
  Row,
  Col,
  Space,
  Skeleton,
  Typography,
  ConfigProvider,
  Radio
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './style.css'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

const { Title } = Typography

const { Option } = Select
const { TextArea } = Input

const ContractEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contractType, setContractType] = useState<string>('主合同')

  const orgOptions = [
    { value: '上海生腾数据科技有限公司', label: '上海生腾数据科技有限公司' },
    { value: '上海凭安征信服务有限公司', label: '上海凭安征信服务有限公司' },
    { value: '武汉凌禹信息科技有限公司', label: '武汉凌禹信息科技有限公司' },
    { value: '中胜信用管理有限公司', label: '中胜信用管理有限公司' },
    { value: '杭州微风企科技有限公司', label: '杭州微风企科技有限公司' },
    { value: '企查查科技股份有限公司', label: '企查查科技股份有限公司' },
    { value: '盟浪可持续数字科技（深圳）有限责任公司', label: '盟浪可持续数字科技（深圳）有限责任公司' },
    { value: '上海烯牛信息技术有限公司', label: '上海烯牛信息技术有限公司' },
    { value: '北京视野智慧数字科技有限公司', label: '北京视野智慧数字科技有限公司' },
    { value: '北京法海风控科技有限公司', label: '北京法海风控科技有限公司' },
  ]

  const parentContractOptions = [
    { value: 'CON-2025-00001', label: 'CON-2025-00001 - 2025年度启信宝数据采购合同' },
    { value: 'CON-2025-00002', label: 'CON-2025-00002 - 2024年度启信宝数据采购合同' },
    { value: 'CON-2025-00005', label: 'CON-2025-00005 - 2025年度凭安征信数据采购合同' },
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockData = {
        contractName: '2025年度启信宝数据采购合同',
        contractNo: 'DP-CT-20250101001',
        startDate: dayjs('2025-01-01'),
        endDate: dayjs('2025-12-31'),
        orgName: '上海生腾数据科技有限公司',
        contractType: '主合同',
        involveBilling: '是',
        parentContract: '-',
        remark: '-',
      }
      form.setFieldsValue(mockData)
      setContractType(mockData.contractType)
      setLoading(false)
    }, 500)
  }, [id, form])

  const onFinish = (_values: any) => {
    setSaving(true)
    setTimeout(() => {
      message.success('保存成功')
      setSaving(false)
      navigate('/main/data-access/contract', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-access/contract', { replace: true })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="contract-edit">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>编辑数源机构合同</span>
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
                    name="contractName"
                    label="合同名称"
                    rules={[{ required: true, message: '请输入合同名称' }]}
                  >
                    <Input placeholder="请输入合同名称" maxLength={200} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contractNo"
                    label="合同编号"
                    rules={[{ required: true, message: '请输入合同编号' }]}
                  >
                    <Input placeholder="请输入合同编号" maxLength={50} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="startDate"
                    label="合同生效日期"
                    rules={[{ required: true, message: '请选择合同生效日期' }]}
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="请选择合同生效日期" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endDate"
                    label="合同到期日期"
                    rules={[{ required: true, message: '请选择合同到期日期' }]}
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="请选择合同到期日期" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="orgName"
                    label="数据机构名称"
                    rules={[{ required: true, message: '请选择数据机构名称' }]}
                  >
                    <Select placeholder="请选择数据机构名称" showSearch optionFilterProp="label">
                      {orgOptions.map(org => (
                        <Option key={org.value} value={org.value}>{org.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contractType"
                    label="合同类型"
                    rules={[{ required: true, message: '请选择合同类型' }]}
                  >
                    <Select placeholder="请选择合同类型" onChange={setContractType}>
                      <Option value="主合同">主合同</Option>
                      <Option value="补充协议">补充协议</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="involveBilling"
                    label="是否涉及计费"
                    rules={[{ required: true, message: '请选择是否涉及计费' }]}
                  >
                    <Radio.Group>
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {contractType === '补充协议' && (
                    <Form.Item
                      name="parentContract"
                      label="依附的主合同"
                      rules={[{ required: true, message: '请选择主合同' }]}
                    >
                      <Select placeholder="请选择主合同">
                        {parentContractOptions.map(item => (
                          <Option key={item.value} value={item.value}>{item.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  {contractType === '主合同' && (
                    <Form.Item
                      name="parentContract"
                      label="依附的主合同"
                    >
                      <Input placeholder="-" disabled />
                    </Form.Item>
                  )}
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

              <div className="attachment-section">
              <div className="attachment-section-title">
                <span className="title-text">合同附件</span>
                <span className="title-tip">单个文件大小不超过100M，支持文件格式：pdf</span>
              </div>
              <Form.Item
                name="attachment"
                style={{ marginBottom: 0 }}
              >
                <Upload.Dragger
                  multiple
                  beforeUpload={() => false}
                  className="attachment-uploader"
                >
                  <div className="upload-icon">+</div>
                  <div className="upload-text">合同附件</div>
                </Upload.Dragger>
              </Form.Item>
            </div>

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

export default ContractEdit
