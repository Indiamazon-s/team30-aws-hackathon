/** @type {import('next').NextConfig} */
const nextConfig = {
  // 배포 환경 최적화
  output: 'standalone',
  
  // 개발 모드에서 API 로깅 비활성화
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // 개발 서버 로깅 최소화
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // 이미지 최적화 설정
  images: {
    domains: ['d373rc6tgrdqq1.cloudfront.net'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 압축 활성화
  compress: true,
  
  // 환경변수 검증
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // S3에서 환경변수 로드
  webpack: (config, { isServer }) => {
    if (isServer) {
      const { loadEnvFromS3 } = require('./lib/env-loader')
      loadEnvFromS3().catch(console.error)
    }
    return config
  }
}

module.exports = nextConfig