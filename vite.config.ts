import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      react(),
      // 分析包大小（仅在 analyze 模式下启用）
      isAnalyze &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ],
    server: {
      port: 3000,
      open: true,
      // 热更新配置
      hmr: {
        overlay: true,
      },
    },
    // 动态base路径配置，支持GitHub Pages子路径部署
    base: process.env.VITE_BASE_URL || './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // 代码分割配置
      rollupOptions: {
        output: {
          // 手动分包策略
          manualChunks: {
            // React 核心库
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Ant Design
            'antd-vendor': ['antd', '@ant-design/icons'],
            // 图表库
            'g6-vendor': ['@antv/g6'],
            // 工具库
            'utils-vendor': ['dayjs'],
          },
          // 静态资源分类存放
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || ''
            if (info.endsWith('.css')) {
              return 'assets/css/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      // 报告压缩后的大小
      reportCompressedSize: true,
      // 触发警告的 chunk 大小（KB）
      chunkSizeWarningLimit: 500,
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons', 'dayjs'],
    },
    // 解析配置
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // CSS 配置
    css: {
      devSourcemap: true,
      // CSS 模块化配置
      modules: {
        localsConvention: 'camelCase',
      },
    },
  }
})
