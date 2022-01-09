const createStyleLoaded = (url) => {
  return new Promise((resolve) => {
    const fileref = document.createElement('link')
    fileref.setAttribute('rel', 'stylesheet')
    fileref.setAttribute('type', 'text/css')
    fileref.setAttribute('href', url)

    // const script = document.createElement('link')
    // script.src = url
    fileref.onload = function() {
      resolve()
    }
    // document.body.appendChild(script)
    document.getElementsByTagName('head')[0].appendChild(fileref)
  })
}

const loadedStyles = []

/**
 * @description: 动态引入css，按urls数组顺序依次引入
 * @param [string]  css路径 相对或绝对路径，例如：['/common/styles/base.css']
 * @return: Promise
 * */
const loadStyles = (urls) => {
  const diffUrls = urls.filter((item) => loadedStyles.indexOf(item) < 0)
  loadedStyles.push(...diffUrls)
  return new Promise((resolve) => {
    function doLoad(url) {
      createStyleLoaded(url).then(() => {
        if (diffUrls.length > 0) {
          doLoad(diffUrls.shift())
        } else {
          resolve()
        }
      })
    }
    if (diffUrls.length > 0) {
      doLoad(diffUrls.shift())
    } else {
      resolve()
    }
  })
}
export default loadStyles
