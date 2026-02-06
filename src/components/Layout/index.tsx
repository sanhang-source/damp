import { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu, Dropdown, Avatar } from 'antd'
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  SearchOutlined,
  TableOutlined,
  ApiOutlined,
  SafetyOutlined,
  TeamOutlined,
  KeyOutlined,
  BookOutlined,
  CloseOutlined,
  GoldOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  DashboardOutlined,
  BellOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './style.css'

const { Header, Sider, Content } = AntLayout

// 页面标题映射
const pageTitleMap: Record<string, string> = {
  '/main/data-access/organization': '数据接入机构管理',
  '/main/data-access/organization/add': '新增机构',
  '/main/data-access/organization/edit': '编辑机构',
  '/main/data-access/organization/detail': '机构详情',
  '/main/data-access/contract': '数源机构合同管理',
  '/main/data-access/contract/add': '新增合同',
  '/main/data-access/contract/edit': '编辑合同',
  '/main/data-access/contract/detail': '合同详情',
  '/main/data-access/billing': '数据接入计费管理',
  '/main/data-access/settlement': '结算管理',
  '/main/data-access/settlement-stats': '结算统计',
  '/main/data-access/bill': '数据接入账单管理',
  '/main/data-access/bill/detail': '账单详情',
  '/main/data-resource/query': '数据资源查询',
  '/main/data-resource/database': '数据库表管理',
  '/main/data-resource/database/add': '新增数据库表',
  '/main/data-resource/database/edit': '编辑数据库表',
  '/main/data-resource/database/fields': '字段管理',
  '/main/data-resource/interface': '数据接口管理',
  '/main/data-resource/interface/add': '新增接口',
  '/main/data-resource/interface/edit': '编辑接口',
  '/main/data-resource/interface/detail': '接口详情',
  '/main/data-classification/classification': '数据分级分类管理',
  '/main/data-classification/classification/add': '新增分类',
  '/main/data-classification/classification/edit': '编辑分类',
  '/main/data-asset/catalog': '数据资产目录',
  '/main/data-asset/lineage-map': '数据血缘关系',
  '/main/data-asset/add': '数据资产目录',
  '/main/data-asset/edit': '数据资产目录',
  '/main/data-asset/fields': '数据资产目录',
  '/main/data-quality/interface': '接口质量监控',
  '/main/data-quality/table': '库表更新监控',
  '/main/data-quality/indicator': '数据指标质量监控',
  '/main/data-quality/alerts': '告警消息中心',
  '/main/system/user': '用户管理',
  '/main/system/role': '角色管理',
  '/main/system/dict': '字典管理',
  '/main/system/dict/items': '字典项管理',
}

interface TabItem {
  key: string
  title: string
  closable: boolean
}

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: '/main/data-access/organization', title: '数据接入机构管理', closable: false }
  ])

  // 认证检查 - 如果未登录则重定向到登录页
  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Layout认证检查 - token:', token)
    if (!token) {
      console.log('未找到token，重定向到登录页')
      navigate('/login')
    }
  }, [navigate])

  // 顶部导航菜单
  const topMenuItems = [
    { key: 'access', label: '数据接入' },
    { key: 'governance', label: '数据治理' },
    { key: 'resource', label: '数据资源' },
    { key: 'asset', label: '数据资产' },
    { key: 'quality', label: '数据质量' },
    { key: 'system', label: '系统管理' },
  ]

  // 根据当前路径确定选中的顶部菜单
  const getSelectedTopKey = () => {
    const path = location.pathname
    if (path.includes('data-resource')) return 'resource'
    if (path.includes('data-classification')) return 'resource'
    if (path.includes('data-asset')) return 'asset'
    if (path.includes('data-quality')) return 'quality'
    if (path.includes('system')) return 'system'
    if (path.includes('data-access')) return 'access'
    return 'access'
  }

  // 侧边栏菜单
  const getSideMenuItems = () => {
    const path = location.pathname

    if (path.includes('data-resource') || path.includes('data-classification')) {
      return [
        {
          key: '/main/data-resource/query',
          icon: <SearchOutlined />,
          label: '数据资源查询',
        },
        {
          key: '/main/data-resource/database',
          icon: <TableOutlined />,
          label: '数据库表管理',
        },
        {
          key: '/main/data-resource/interface',
          icon: <ApiOutlined />,
          label: '数据接口管理',
        },
        {
          key: '/main/data-classification/classification',
          icon: <SafetyOutlined />,
          label: '数据分级分类管理',
        },
      ]
    }

    if (path.includes('data-asset')) {
      return [
        {
          key: '/main/data-asset/catalog',
          icon: <GoldOutlined />,
          label: '数据资产目录',
        },
        {
          key: '/main/data-asset/lineage-map',
          icon: <ApartmentOutlined />,
          label: '数据血缘关系',
        },
      ]
    }

    if (path.includes('data-quality')) {
      return [
        {
          key: '/main/data-quality/alerts',
          icon: <BellOutlined />,
          label: '告警消息中心',
        },
        {
          key: '/main/data-quality/interface',
          icon: <MonitorOutlined />,
          label: '接口质量监控',
        },
        {
          key: '/main/data-quality/table',
          icon: <DatabaseOutlined />,
          label: '库表更新监控',
        },
        {
          key: '/main/data-quality/indicator',
          icon: <DashboardOutlined />,
          label: '指标质量监控',
        },
      ]
    }

    if (path.includes('system')) {
      return [
        {
          key: '/main/system/user',
          icon: <TeamOutlined />,
          label: '用户管理',
        },
        {
          key: '/main/system/role',
          icon: <KeyOutlined />,
          label: '角色管理',
        },
        {
          key: '/main/system/dict',
          icon: <BookOutlined />,
          label: '字典管理',
        },
      ]
    }

    // 默认数据接入菜单
    return [
      {
        key: '/main/data-access/organization',
        icon: <ApartmentOutlined />,
        label: '数据接入机构管理',
      },
      {
        key: '/main/data-access/contract',
        icon: <FileTextOutlined />,
        label: '数源机构合同管理',
      },
      {
        key: '/main/data-access/billing',
        icon: <CalculatorOutlined />,
        label: '数据接入计费管理',
      },
      {
        key: '/main/data-access/bill',
        icon: <FileTextOutlined />,
        label: '数据接入账单管理',
      },
    ]
  }

  // 用户信息
  const userInfo = {
    name: '郑炳奕',
    company: '深圳征信服务有限公司',
    roles: ['系统管理员', '数据接入管理员']
  }

  // 获取用户姓名第一个字作为头像
  const getAvatarText = (name: string) => {
    return name ? name.charAt(0) : 'U'
  }

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div className="user-profile-menu">
          <div className="user-name">{userInfo.name}</div>
          <div className="user-org">{userInfo.company}</div>
        </div>
      ),
    },
    {
      key: 'role1',
      label: <span className="role-tag">{userInfo.roles[0]}</span>,
    },
    {
      key: 'role2',
      label: <span className="role-tag">{userInfo.roles[1]}</span>,
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleTopMenuClick = (key: string) => {
    switch (key) {
      case 'access':
        navigate('/main/data-access/organization')
        break
      case 'resource':
        navigate('/main/data-resource/query')
        break
      case 'classification':
        navigate('/main/data-classification/classification')
        break
      case 'asset':
        navigate('/main/data-asset/catalog')
        break
      case 'quality':
        navigate('/main/data-quality/interface')
        break
      case 'system':
        navigate('/main/system/user')
        break
      default:
        navigate('/main/data-access/organization')
    }
  }

  const handleSideMenuClick = (key: string) => {
    navigate(key)
  }

  // 获取页面标题
  const getPageTitle = (path: string): string => {
    // 处理动态路由
    for (const [key, title] of Object.entries(pageTitleMap)) {
      if (path === key || path.startsWith(key + '/')) {
        return title
      }
    }
    return '未知页面'
  }

  // 获取当前选中的侧边栏菜单项
  // 详情页、编辑页、新增页都应该选中对应的列表页菜单
  const getSelectedSideKey = (): string => {
    const path = location.pathname
    
    // 数据接入模块
    if (path.includes('/data-access/organization')) {
      return '/main/data-access/organization'
    }
    if (path.includes('/data-access/contract')) {
      return '/main/data-access/contract'
    }
    if (path.includes('/data-access/billing') || path.includes('/data-access/settlement')) {
      return '/main/data-access/billing'
    }
    if (path.includes('/data-access/bill')) {
      return '/main/data-access/bill'
    }
    
    // 数据资源模块
    if (path.includes('/data-resource/query')) {
      return '/main/data-resource/query'
    }
    if (path.includes('/data-resource/database') || path.includes('/data-resource/fields')) {
      return '/main/data-resource/database'
    }
    if (path.includes('/data-resource/interface')) {
      return '/main/data-resource/interface'
    }
    
    // 数据分级分类模块
    if (path.includes('/data-classification/classification')) {
      return '/main/data-classification/classification'
    }

    // 数据资产模块
    if (path.includes('/data-asset/catalog') || path.includes('/data-asset/add') || path.includes('/data-asset/edit') || path.includes('/data-asset/fields')) {
      return '/main/data-asset/catalog'
    }
    if (path.includes('/data-asset/lineage-map')) {
      return '/main/data-asset/lineage-map'
    }

    // 数据质量模块
    if (path.includes('/data-quality/interface')) {
      return '/main/data-quality/interface'
    }
    if (path.includes('/data-quality/table')) {
      return '/main/data-quality/table'
    }
    if (path.includes('/data-quality/indicator')) {
      return '/main/data-quality/indicator'
    }
    if (path.includes('/data-quality/alerts')) {
      return '/main/data-quality/alerts'
    }

    // 系统管理模块
    if (path.includes('/system/user')) {
      return '/main/system/user'
    }
    if (path.includes('/system/role')) {
      return '/main/system/role'
    }
    if (path.includes('/system/dict') || path.includes('/system/dict/items')) {
      return '/main/system/dict'
    }

    return path
  }

  // 监听路由变化，自动添加标签
  useEffect(() => {
    const currentPath = location.pathname

    // 跳过 /main 路径，因为它会重定向到子页面
    if (currentPath === '/main') {
      return
    }

    const title = getPageTitle(currentPath)

    setTabs(prevTabs => {
      const exists = prevTabs.some(tab => tab.key === currentPath)
      if (!exists) {
        return [...prevTabs, { key: currentPath, title, closable: true }]
      }
      return prevTabs
    })
  }, [location.pathname])

  // 关闭标签
  const handleCloseTab = (e: React.MouseEvent, tabKey: string) => {
    e.stopPropagation()
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.key !== tabKey)
      // 如果关闭的是当前页面，跳转到前一个标签
      if (location.pathname === tabKey && newTabs.length > 0) {
        navigate(newTabs[newTabs.length - 1].key)
      }
      return newTabs
    })
  }

  // 点击标签切换页面
  const handleTabClick = (tabKey: string) => {
    navigate(tabKey)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      navigate('/login')
    }
  }

  return (
    <AntLayout className="layout">
      <Header className="layout-header">
        <div className="header-left">
          <div className="logo">
            <img src={`${import.meta.env?.BASE_URL || ''}images/logo.png`} alt="logo" />
            <span className="title">数据资产管理平台</span>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedTopKey()]}
            items={topMenuItems.map(item => ({
              key: item.key,
              label: item.label,
            }))}
            onClick={({ key }) => handleTopMenuClick(key)}
            className="top-menu"
          />
        </div>
        <div className="header-right">
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div className="user-info">
              <Avatar className="user-avatar">{getAvatarText(userInfo.name)}</Avatar>
              <div className="user-meta">
                <div className="user-company-name">{userInfo.company}</div>
                <div className="user-role-line">
                  <span className="role-tag-small">{userInfo.roles[0]}</span>
                  {userInfo.roles.length > 1 && (
                    <span className="role-count-small">+{userInfo.roles.length - 1}</span>
                  )}
                </div>
              </div>
              <DownOutlined className="dropdown-icon" />
            </div>
          </Dropdown>
        </div>
      </Header>
      <AntLayout className="main-layout">
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="layout-sider"
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedSideKey()]}
            items={getSideMenuItems()}
            onClick={({ key }) => handleSideMenuClick(key)}
            className="side-menu"
          />
        </Sider>
        <AntLayout className={`content-layout ${collapsed ? 'sider-collapsed' : ''}`}>
          {/* 页面标签栏 */}
          <div className={`tabs-bar ${collapsed ? 'sider-collapsed' : ''}`}>
            {tabs.map(tab => (
              <div
                key={tab.key}
                className={`tab-item ${location.pathname === tab.key ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
              >
                <span className="tab-title">{tab.title}</span>
                {tab.closable && (
                  <CloseOutlined
                    className="tab-close"
                    onClick={(e) => handleCloseTab(e, tab.key)}
                  />
                )}
              </div>
            ))}
          </div>
          <Content className="layout-content">
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
