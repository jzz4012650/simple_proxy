export const PROXY_TYPES = ['PROXY', 'HTTP', 'HTTPS', 'SOCKS', 'SOCKS4', 'SOCKS5'];
export const PROXY_SERVER_TPL = JSON.stringify({ type: PROXY_TYPES[0], host: 'example.proxy.com', port: '8080' });