export const shExpMatch = (str: string, pattern: string) => {
  const regex = new RegExp(
    `^${pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')}$`
  )
  return regex.test(str)
}

export const getHost = (str: string) => {
  const url = new URL(str)
  return url.hostname
}
