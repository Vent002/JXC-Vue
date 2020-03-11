// function searchInfo(listsInfo,search){
//   if(search){
//     return listsInfo.filter( data => {
//       return Object.keys( data ).some( key => {
//         return String(data[key]).toLowerCase().indexOf(search) > -1
//       })
//     })
//   }
//   return listsInfo
// }

export function searchInfo(listsInfo,searchInfo) {
  return new Promise((resolve,reject) => {
    if (searchInfo){
      return listsInfo.filter( data => {
        return Object.keys( data ).some( key => {
          return String(data[key]).toLowerCase().indexOf(searchInfo) > -1
        })
      })
    }
    return listsInfo
  })

}