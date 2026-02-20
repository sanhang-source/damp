import { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Result } from 'antd'
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/main'
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认错误界面
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '24px',
          }}
        >
          <Result
            status="500"
            title="页面出错了"
            subTitle={
              <div>
                <p>抱歉，页面发生了意外错误。</p>
                {this.state.error && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#fff1f0',
                      border: '1px solid #ffa39e',
                      borderRadius: '4px',
                      color: '#cf1322',
                      fontSize: '12px',
                      maxWidth: '600px',
                      wordBreak: 'break-all',
                    }}
                  >
                    <strong>错误信息：</strong>
                    <div>{this.state.error.message}</div>
                  </div>
                )}
              </div>
            }
            extra={[
              <Button
                key="reload"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
              >
                刷新页面
              </Button>,
              <Button key="home" icon={<HomeOutlined />} onClick={this.handleGoHome}>
                返回首页
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                尝试恢复
              </Button>,
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
