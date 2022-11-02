const sup_group = [1,2]

function isAdmin(gid: number){
  return gid === 1
}

function isSupervisor(gid: number){
  return sup_group.includes(gid)
}

function isWorker(gid: number){
  return gid === 3 
}

export {isAdmin, isSupervisor}
