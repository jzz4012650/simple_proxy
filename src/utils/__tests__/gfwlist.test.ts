import { describe, it, expect } from 'vitest'
import { getDomainsFromGfwList, gfwListToPacFragment } from '../gfwlist'

describe('getDomainsFromGfwList', () => {
  it('应该解析 ||domain 格式的规则', () => {
    const gfwListText = `
||google.com
||youtube.com
||facebook.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.has('facebook.com')).toBe(true)
    expect(domains.size).toBe(3)
  })

  it('应该解析 |http:// 格式的规则', () => {
    const gfwListText = `
|http://google.com
|https://youtube.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('http:')).toBe(true)
    expect(domains.has('https:')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该解析 .domain 格式的规则', () => {
    const gfwListText = `
.google.com
.youtube.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该解析包含路径的规则', () => {
    const gfwListText = `
||google.com/search
||youtube.com/watch
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该忽略注释行', () => {
    const gfwListText = `
! 这是注释
||google.com
! 另一个注释
||youtube.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该忽略白名单规则（以@@开头）', () => {
    const gfwListText = `
||google.com
@@||youtube.com
||facebook.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(false)
    expect(domains.has('facebook.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该忽略正则表达式规则（以/开头）', () => {
    const gfwListText = `
||google.com
/example.com/
||facebook.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('facebook.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该忽略 [AutoProxy] 等标记行', () => {
    const gfwListText = `
[AutoProxy 0.2.9]
||google.com
[Adblock Plus 2.0]
||youtube.com
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该处理空行和空白字符', () => {
    const gfwListText = `

||google.com

  ||youtube.com

    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该处理复杂的 URL 格式', () => {
    const gfwListText = `
http://example.com/path
https://another.com/path/to/resource
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('example.com')).toBe(true)
    expect(domains.has('another.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该处理 fallback 情况下的简单域名', () => {
    const gfwListText = `
google.com
youtube.com/path
    `
    const domains = getDomainsFromGfwList(gfwListText)

    expect(domains.has('google.com')).toBe(true)
    expect(domains.has('youtube.com')).toBe(true)
    expect(domains.size).toBe(2)
  })

  it('应该返回空集合当输入为空时', () => {
    const domains = getDomainsFromGfwList('')
    expect(domains.size).toBe(0)
  })

  it('应该返回空集合当只有注释和空行时', () => {
    const gfwListText = `
! 只有注释
! 和空行

    `
    const domains = getDomainsFromGfwList(gfwListText)
    expect(domains.size).toBe(0)
  })
})

describe('gfwListToPacFragment', () => {
  it('应该生成基本的 PAC 代码片段', () => {
    const gfwListText = `
||google.com
||youtube.com
    `
    const result = gfwListToPacFragment(gfwListText)

    expect(result).toContain('shExpMatch(host, "*.google.com") || host === "google.com"')
    expect(result).toContain('shExpMatch(host, "*.youtube.com") || host === "youtube.com"')
    expect(result).toContain('return "PROXY 127.0.0.1:1080"')
    expect(result).toContain('return "DIRECT"')
    expect(result).toMatch(/if\s*\(/m)
  })

  it('应该使用自定义代理设置', () => {
    const gfwListText = `||google.com`
    const customProxy = 'PROXY 192.168.1.100:8080'
    const result = gfwListToPacFragment(gfwListText, customProxy)

    expect(result).toContain(`return "${customProxy}"`)
    expect(result).not.toContain('PROXY 127.0.0.1:1080')
  })

  it('应该处理空的 GFWList', () => {
    const result = gfwListToPacFragment('')

    expect(result).toContain('false')
    expect(result).toContain('return "PROXY 127.0.0.1:1080"')
    expect(result).toContain('return "DIRECT"')
  })

  it('应该处理单个域名', () => {
    const gfwListText = '||example.com'
    const result = gfwListToPacFragment(gfwListText)

    expect(result).toContain('shExpMatch(host, "*.example.com") || host === "example.com"')
    // 确保生成的代码包含域名检查
    expect(result).toContain('example.com')
    expect(result).toContain('return "PROXY 127.0.0.1:1080"')
  })

  it('应该生成有效的 JavaScript 结构', () => {
    const gfwListText = `
||google.com
||facebook.com
||twitter.com
    `
    const result = gfwListToPacFragment(gfwListText)

    // 检查基本的 JavaScript 结构
    expect(result).toMatch(/^\s*if\s*\(/m)
    expect(result).toMatch(/\)\s*{\s*return\s*"[^"]+"\s*;\s*}\s*return\s*"DIRECT"\s*;\s*$/m)

    // 检查所有域名都被包含
    expect(result).toContain('google.com')
    expect(result).toContain('facebook.com')
    expect(result).toContain('twitter.com')
  })

  it('应该处理复杂的 GFWList 规则', () => {
    const gfwListText = `
! 注释行
||google.com/search
.facebook.com
|http://twitter.com
@@||whitelist.com
/regex.com/
[AutoProxy]
    `
    const result = gfwListToPacFragment(gfwListText)

    expect(result).toContain('google.com')
    expect(result).toContain('facebook.com')
    expect(result).toContain('http:')
    expect(result).not.toContain('whitelist.com')
    expect(result).not.toContain('regex.com')
    expect(result).not.toContain('AutoProxy')
  })

  it('应该正确格式化多行条件', () => {
    const gfwListText = `
||google.com
||youtube.com
||facebook.com
    `
    const result = gfwListToPacFragment(gfwListText)

    // 检查条件之间用 || 连接，并且有正确的换行和缩进
    const lines = result.split('\n')
    const conditionLines = lines.filter(line => line.includes('shExpMatch') || line.includes('host ==='))

    expect(conditionLines.length).toBeGreaterThan(1)
    // 检查除了最后一行，其他行都以 || 结尾
    for (let i = 0; i < conditionLines.length - 1; i++) {
      expect(conditionLines[i].trim()).toMatch(/\|\|\s*$/)
    }
  })

  it('应该处理包含特殊字符的域名', () => {
    const gfwListText = '||sub-domain.example-site.com'
    const result = gfwListToPacFragment(gfwListText)

    expect(result).toContain('sub-domain.example-site.com')
    expect(result).toContain('shExpMatch(host, "*.sub-domain.example-site.com")')
    expect(result).toContain('host === "sub-domain.example-site.com"')
  })
})
