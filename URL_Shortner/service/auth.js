const sessionIdToUserMap = new Map();


function setUser(id,user){
    sessionIdToUserMap.set(id,user)
}
function getUser(id){
   return sessionIdToUserMap.get(id)
}
export {setUser,getUser}



// this Map approach is an example of stateful authentication.