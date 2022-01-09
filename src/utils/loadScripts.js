const createScriptLoaded = (url) => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = function() {
      resolve()
    }
    document.body.appendChild(script)
  })
}

const loadedScripts = []

/**
 * @description: 动态引入js，按urls数组顺序依次引入
 * @param [string]  js路径 相对或绝对路径，例如：['/common/scripts/base.js','/common/scripts/ajax.js']
 * @return: Promise
 * */
const loadScripts = (urls) => {
  const diffUrls = urls.filter((item) => loadedScripts.indexOf(item) < 0)
  loadedScripts.push(...diffUrls)
  return new Promise((resolve) => {
    function doLoad(url) {
      createScriptLoaded(url).then(() => {
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
export default loadScripts
