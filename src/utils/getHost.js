export default (str) => {
  const url = new URL(str)
  return url.hostname
}
