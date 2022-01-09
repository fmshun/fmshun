//银行代码池里
var bankCode = [
  '0001',
  '0002',
  '0003',
  '0004',
  '0005',
  '0006',
  '0007',
  '0008',
  '0009',
  '0010',
  '0011',
  '0012',
  '0013',
  '0014',
  '0015',
  '0016',
  '0017',
  '0018',
  '0019',
  '0020',
]
//银行名索引信息
var bankJsonByCode = {
  '0001': {
    name: '工商银行',
    logo: 'logo_icbc',
    exName: '.png',
  },
  '0002': {
    name: '农业银行',
    logo: 'logo_abc',
    exName: '.png',
  },
  '0003': {
    name: '中国建设银行',
    logo: 'logo_ccb',
    exName: '.png',
  },
  '0004': {
    name: '交通银行',
    logo: 'logo_bocm',
    exName: '.png',
  },
  '0005': {
    name: '招商银行',
    logo: 'logo_cmb',
    exName: '.png',
  },
  '0006': {
    name: '中国银行',
    logo: 'logo_boc',
    exName: '.png',
  },
  '0007': {
    name: '兴业银行',
    logo: 'logo_cib',
    exName: '.png',
  },
  '0008': {
    name: '浦发银行',
    logo: 'logo_spdb',
    exName: '.png',
  },
  '0009': {
    name: '中国民生银行',
    logo: 'logo_cmbc',
    exName: '.png',
  },
  '0010': {
    name: '平安银行',
    logo: 'logo_pab',
    exName: '.png',
  },
  '0011': {
    name: '南京银行',
    logo: 'logo_bon',
    exName: '.png',
  },
  '0012': {
    name: '中信银行',
    logo: 'logo_citic',
    exName: '.png',
  },
  '0013': {
    name: '中国光大银行',
    logo: 'logo_ceb',
    exName: '.png',
  },
  '0014': {
    name: '华夏银行',
    logo: 'logo_hxb',
    exName: '.png',
  },
  '0015': {
    name: '广发银行',
    logo: 'logo_cgb',
    exName: '.png',
  },
  '0016': {
    name: '上海银行',
    logo: 'logo_bos',
    exName: '.png',
  },
  '0017': {
    name: '北京银行',
    logo: 'logo_bob',
    exName: '.png',
  },
  '0018': {
    name: '江苏银行',
    logo: 'logo_jsyh',
    exName: '.png',
  },
  '0019': {
    name: '宁波银行',
    logo: 'logo_nbyh',
    exName: '.png',
  },
  '0020': {
    name: '邮储银行',
    logo: 'logo_psbc',
    exName: '.png',
  },
}

//判断返回的银行代码是否在银行代码池里
var judgeCode = function(code) {
  if (bankCode.indexOf(code) < 0) {
    return false
  } else {
    return true
  }
}

//imgType 有三种：org（彩色），white（白色），cg（存管）；bankName，银行名称（汉字）
//以银行code及图片type获取银行（彩色、白色）LOGO
var getBankLogoByCode = function(imgType, code) {
  if (judgeCode(code)) {
    return (
      'images/bank_' +
      imgType +
      '/' +
      bankJsonByCode[code].logo +
      (imgType == 'org' ? '' : '_' + imgType) +
      bankJsonByCode[code].exName
    )
  } else {
    console.log('文档不存在-银行Code！' + code)
    return
  }
}
var bankdata = {
  isInDatabase: function(code) {
    judgeCode(code)
  },
  getBankLogoByCode: function(imgType, code) {
    return getBankLogoByCode(imgType, code)
  },
  getDataByCode: function(code) {
    if (judgeCode(code)) {
      var temp = bankJsonByCode[code]
      var result = {
        name: temp.name,
        logo: getBankLogoByCode('cg', code),
        time: temp.time,
      }
      return result
    } else {
      console.log('该银行Code不存在！')
    }
  },
}

export default bankdata
