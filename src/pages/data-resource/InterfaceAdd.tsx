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
  Typography,
  ConfigProvider
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import '../data-access/style.css'

// 设置 dayjs 为中文
dayjs.locale('zh-cn')

const { Title } = Typography

const { Option } = Select
const { TextArea } = Input

const InterfaceAdd = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (_values: any) => {
    setLoading(true)
    setTimeout(() => {
      message.success('新增成功')
      setLoading(false)
      navigate('/main/data-resource/interface', { replace: true })
    }, 1000)
  }

  const onCancel = () => {
    navigate('/main/data-resource/interface', { replace: true })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="interface-add">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
                返回
              </Button>
              <span>新增数据接口</span>
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
            
            {/* 第一行：数源机构名称 + 合同名称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataSourceOrg"
                  label="数源机构名称"
                  rules={[{ required: true, message: '请选择数源机构名称' }]}
                >
                  <Select placeholder="请选择数源机构名称" allowClear>
                    <Option value="上海生腾数据科技有限公司">上海生腾数据科技有限公司</Option>
                    <Option value="北京数据科技有限公司">北京数据科技有限公司</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contractName" label="合同名称">
                  <Select placeholder="请选择合同名称" allowClear>
                    <Option value="2025年度启信宝数据采购合同">2025年度启信宝数据采购合同</Option>
                    <Option value="合同-2025-00002">合同-2025-00002</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 第二行：接口ID + 接口分类 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="接口ID">
                  <Input disabled placeholder="系统自动生成" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="apiCategory"
                  label="接口分类"
                  rules={[{ required: true, message: '请选择接口分类' }]}
                >
                  <Select placeholder="请选择接口分类">
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

            {/* 第三行：接口中文别名 + 记录数 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="apiAlias"
                  label="接口中文别名"
                  rules={[{ required: true, message: '请输入接口中文别名' }]}
                >
                  <Input placeholder="请输入接口中文别名" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="recordCount" label="记录数">
                  <Input type="number" placeholder="请输入记录数" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第四行：接口服务状态 + 首次接入时间 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="serviceStatus"
                  label="接口服务状态"
                  rules={[{ required: true, message: '请选择接口服务状态' }]}
                >
                  <Select placeholder="请选择接口服务状态">
                    <Option value="已上线">已上线</Option>
                    <Option value="未上线">未上线</Option>
                    <Option value="已下线">已下线</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="firstAccessTime" label="首次接入时间">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择首次接入时间"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 第五行：产品服务状态 + 对接形式 */}
            <Row gutter={24}>
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
              <Col span={12}>
                <Form.Item
                  name="accessType"
                  label="对接形式"
                  rules={[{ required: true, message: '请选择对接形式' }]}
                >
                  <Select placeholder="请选择对接形式">
                    <Option value="接口">接口</Option>
                    <Option value="库表">库表</Option>
                    <Option value="离线">离线</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 第六行：数据更新频率 + 数据更新状态 */}
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

            {/* 第七行：数据类别 + 数据存储环境 */}
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

            {/* 第八行：计费模式 + 计费价格 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="billingMode"
                  label="计费模式"
                  rules={[{ required: true, message: '请选择计费模式' }]}
                >
                  <Select placeholder="请选择计费模式">
                    <Option value="无计费">无计费</Option>
                    <Option value="查询计费">查询计费</Option>
                    <Option value="查得计费">查得计费</Option>
                    <Option value="包时计费">包时计费</Option>
                    <Option value="包量计费">包量计费</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="billingPrice" label="计费价格">
                  <Input type="number" placeholder="请输入计费价格" />
                </Form.Item>
              </Col>
            </Row>

            {/* 第九行：包时开始日期 + 包时结束日期 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="packageStartDate" label="包时开始日期">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择包时开始日期"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="packageEndDate" label="包时结束日期">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择包时结束日期"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 第十行：接口说明 + 计费规则备注 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="description" label="接口说明">
                  <TextArea rows={1} placeholder="请输入接口说明" maxLength={500} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="billingRemark" label="计费规则备注">
                  <TextArea rows={1} placeholder="请输入计费规则备注" maxLength={500} />
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

export default InterfaceAdd
