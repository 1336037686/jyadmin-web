
/**
 * 解析响应文件名
 * @param contentDisposition 响应头Content-Disposition中的文件名
 * @param fileNameReg 文件名解析正则表达式
 * @returns {string} 文件名
 */
export default function parseResponseContentDisposition(contentDisposition, fileNameReg) {
  if (!fileNameReg) fileNameReg = /filename=(.+)/
  let fileName = ''
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(fileNameReg)
    if (fileNameMatch && fileNameMatch[1]) {
      fileName = decodeURIComponent(fileNameMatch[1])
    }
  }
  return fileName
}
