let dateInfos = {
  years: [],
  months: [],
  days: [],
}
let date = new Date()
let newYear = date.getFullYear()
//基金成立日范围,最长不能超出5年
for (let i = newYear - 5; i <= newYear; i++) {
  dateInfos.years.push(i.toString())
}

for (let k = 0; k < dateInfos.years.length; k++) {
  let monthArr = [],
    acceptArr = []
  for (let i = 1; i <= 12; i++) {
    monthArr.push(i < 10 ? '0' + i : i.toString())
    //能整除4的2月份29天
    let dayArr = []
    if (dateInfos.years[k] % 4 === 0 && i === 2) {
      for (let o = 1; o <= 29; o++) {
        dayArr.push(o < 10 ? '0' + o : o.toString())
      }
      acceptArr.push(dayArr)
    } else if (i === 2) {
      for (let o = 1; o <= 28; o++) {
        dayArr.push(o < 10 ? '0' + o : o.toString())
      }
      acceptArr.push(dayArr)
    } else if (i === 4 || i === 6 || i === 9 || i === 11) {
      //4,6,9,11月份30天
      for (let o = 1; o <= 30; o++) {
        dayArr.push(o < 10 ? '0' + o : o.toString())
      }
      acceptArr.push(dayArr)
    } else {
      //1,3,5,7,8,10,12月份31天
      for (let o = 1; o <= 31; o++) {
        dayArr.push(o < 10 ? '0' + o : o.toString())
      }
      acceptArr.push(dayArr)
    }
  }
  dateInfos.days.push(acceptArr)
  dateInfos.months.push(monthArr)
}

export default dateInfos
