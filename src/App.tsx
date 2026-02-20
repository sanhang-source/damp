import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Spin } from 'antd'

import ErrorBoundary from './components/ErrorBoundary'
import { AppRoutes } from './router'

// GitHub Pages 重定向处理组件
function RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // 检查sessionStorage中是否有重定向信息
    const redirectData = sessionStorage.getItem('spa-redirect')
    
    if (redirectData) {
      setIsRedirecting(true)
      
      try {
        const { path, query, hash } = JSON.parse(redirectData)
        sessionStorage.removeItem('spa-redirect')
        
        // 构建完整路径（不含basename，因为BrowserRouter会自动添加）
        let fullPath = path || '/'
        if (query) fullPath += query
        if (hash) fullPath += hash
        
        // 确保路径以/开头
        if (!fullPath.startsWith('/')) {
          fullPath = '/' + fullPath
        }
        
        // 延迟导航，确保应用完全初始化
        setTimeout(() => {
          const currentFullPath = location.pathname + location.search + location.hash
          if (fullPath !== currentFullPath) {
            navigate(fullPath, { replace: true })
          }
          setIsRedirecting(false)
        }, 100)
      } catch (e) {
        console.error('RedirectHandler error:', e)
        setIsRedirecting(false)
      }
    }
  }, [navigate, location])

  // 如果正在重定向，显示加载状态
  if (isRedirecting) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        zIndex: 9999
      }}>
        <Spin size="large" tip="页面加载中...">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    )
  }

  return null
}

function App() {
  // 获取基础路径（GitHub Pages子路径部署）
  const basename = import.meta.env.BASE_URL || '/'

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <RedirectHandler />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
