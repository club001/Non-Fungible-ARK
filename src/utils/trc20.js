
var contractMap = new Map();


export const trongetContract = async (address) => {
  try {
    if(contractMap.get(address) != undefined){
      return contractMap.get(address);
    }else{
      // @ts-ignore
      const contract = await window.tronWeb.contract().at(address);
      contractMap.set(address,contract);
      return contract
    }

  }catch (e) {
    console.log(e)
    console.log('没加载到')
  }
  return null;
}
