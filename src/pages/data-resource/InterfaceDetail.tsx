import { useState, useEffect } from 'react'
import { Card, Descriptions, Button, Tag, Skeleton, Space, Typography, ConfigProvider } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import '../data-access/style.css'

const { Title } = Typography

const InterfaceDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData({
        dataSourceOrg: '上海生腾数据科技有限公司',
        contractName: '2025年度启信宝数据采购合同',
        apiId: 'API-000001',
        apiCategory: '工商信息',
        apiNameCn: '企业工商详情',
        apiNameEn: '-',
        apiAlias: '企业工商详情',
        recordCount: '-',
        serviceStatus: '已上线',
        firstAccessTime: '2025-11-17',
        productStatus: '已使用',
        accessType: '接口',
        updateFrequency: '实时',
        updateStatus: '正常',
        dataCategory: '商业数据',
        storageEnv: '国资云',
        billingMode: '查得计费',
        billingPrice: '-',
        packageStartDate: '-',
        packageEndDate: '-',
        description: '-',
        billingRemark: '-'
      })
      setLoading(false)
    }, 500)
  }, [id])

  return (
    <ConfigProvider locale={zhCN}>
      <div className="interface-detail">
        <Card
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/main/data-resource/interface', { replace: true })}>
                返回
              </Button>
              <span>数据接口详情</span>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/main/data-resource/interface/edit/${id}`, { replace: true })}
            >
              编辑
            </Button>
          }
          className="form-card"
        >
          {loading ? (
            <Skeleton active />
          ) : data ? (
            <>
              <Title level={5} className="form-section-title">基本信息</Title>
              <Descriptions bordered column={2} className="info-descriptions">
                {/* 第一行：数源机构名称 + 合同名称 */}
                <Descriptions.Item label="数源机构名称" className="col-1">{data.dataSourceOrg}</Descriptions.Item>
                <Descriptions.Item label="合同名称" className="col-2">{data.contractName}</Descriptions.Item>
                
                {/* 第二行：接口ID + 接口分类 */}
                <Descriptions.Item label="接口ID" className="col-1">{data.apiId}</Descriptions.Item>
                <Descriptions.Item label="接口分类" className="col-2">{data.apiCategory}</Descriptions.Item>
                
                {/* 第三行：接口中文名 + 接口英文名 */}
                <Descriptions.Item label="接口中文名" className="col-1">{data.apiNameCn}</Descriptions.Item>
                <Descriptions.Item label="接口英文名" className="col-2">{data.apiNameEn}</Descriptions.Item>
                
                {/* 第四行：接口中文别名 + 记录数 */}
                <Descriptions.Item label="接口中文别名" className="col-1">{data.apiAlias}</Descriptions.Item>
                <Descriptions.Item label="记录数" className="col-2">{data.recordCount}</Descriptions.Item>
                
                {/* 第五行：接口服务状态 + 首次接入时间 */}
                <Descriptions.Item label="接口服务状态" className="col-1">
                  <Tag color={data.serviceStatus === '已上线' ? 'success' : 'default'}>{data.serviceStatus}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="首次接入时间" className="col-2">{data.firstAccessTime}</Descriptions.Item>
                
                {/* 第六行：产品服务状态 + 对接形式 */}
                <Descriptions.Item label="产品服务状态" className="col-1">
                  <Tag color={data.productStatus === '已使用' ? 'processing' : 'default'}>{data.productStatus}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="对接形式" className="col-2">{data.accessType}</Descriptions.Item>
                
                {/* 第七行：数据更新频率 + 数据更新状态 */}
                <Descriptions.Item label="数据更新频率" className="col-1">{data.updateFrequency}</Descriptions.Item>
                <Descriptions.Item label="数据更新状态" className="col-2">
                  <Tag color={data.updateStatus === '正常' ? 'success' : 'error'}>{data.updateStatus}</Tag>
                </Descriptions.Item>
                
                {/* 第八行：数据类别 + 数据存储环境 */}
                <Descriptions.Item label="数据类别" className="col-1">{data.dataCategory}</Descriptions.Item>
                <Descriptions.Item label="数据存储环境" className="col-2">{data.storageEnv}</Descriptions.Item>
                
                {/* 第九行：计费模式 + 计费价格 */}
                <Descriptions.Item label="计费模式" className="col-1">{data.billingMode}</Descriptions.Item>
                <Descriptions.Item label="计费价格" className="col-2">{data.billingPrice}</Descriptions.Item>
                
                {/* 第十行：包时开始日期 + 包时结束日期 */}
                <Descriptions.Item label="包时开始日期" className="col-1">{data.packageStartDate}</Descriptions.Item>
                <Descriptions.Item label="包时结束日期" className="col-2">{data.packageEndDate}</Descriptions.Item>
                
                {/* 第十一行：接口说明（跨两列） */}
                <Descriptions.Item label="接口说明" className="col-full">{data.description}</Descriptions.Item>
                
                {/* 第十二行：计费规则备注（跨两列） */}
                <Descriptions.Item label="计费规则备注" className="col-full">{data.billingRemark}</Descriptions.Item>
              </Descriptions>
            </>
          ) : null}
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default InterfaceDetail
