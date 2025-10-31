export function checkBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')

  // 環境変数から認証情報を取得（Cloudflare Dashboard設定）
  const validUsername = process.env.BASIC_AUTH_USER || 'mn'
  const validPassword = process.env.BASIC_AUTH_PASS || '39'

  return username === validUsername && password === validPassword
}

export function createAuthResponse(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}

