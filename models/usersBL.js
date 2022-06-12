const usersFileDal = require('../DAL/usersFileDAL');
const permissionsFileDal = require('../DAL/permissionsFileDAL');
const usersDBDal = require('../DAL/usersDBDAL');

const cheackLoginData = async(username,password) =>{
    let user =  await usersDBDal.getUserByUsername(username);
    if(user && user[0].password == password){
        return user;
    }

}
const getAllUsers = async()=>
{
    //get users from DB
    let usersDB = await usersDBDal.getAllUsers();
    if(usersDB){
        let usersDBDal = usersDB.filter(x=>x.username !== 'admin').map(x=>{return {id:x._id.toString(),username:x.username}});
        //get user from users.json
        let usersFile = await usersFileDal.readFile();
        let usersFileArr = usersFile.users;
        let usersFileData = usersFileArr.map(x=>{return{id:x.id,name:x.firstName+" "+x.lastName,created:x.created,sessionTimeOut:x.sessionTimeOut}})
        let users = usersDBDal.map(x => ({...x, ...usersFileData.find(y => y.id === x.id)}))
        //get users permissions from permissions.json
        let permissionsFile = await permissionsFileDal.readFile();
        let permissionsFileData = permissionsFile.permissions;
        let usersArr = users.map(x => ({...x, ...permissionsFileData.find(y => y.id === x.id)}))
        return usersArr;
    }
    
}
const getUserById = async(id)=>
{
    //get users from DB
    let resultDB = await usersDBDal.getUserById(id);
    if(resultDB){
        let userDB = {id:resultDB._id.toString(),username:resultDB.username};
        //get user from users.json
        let usersFile = await usersFileDal.readFile();
        let userFile = usersFile.users.find(x=>x.id == id);
        let usersFileData = {firstName:userFile.firstName,lastName:userFile.lastName,created:userFile.created,sessionTimeOut:userFile.sessionTimeOut}
        let users = {...userDB, ...usersFileData};
        //get users permissions from permissions.json
        let permissionsFile = await permissionsFileDal.readFile();
        let permissionFile = permissionsFile.permissions.find(x=>x.id == id);
        let permissionFileData = {permissions:permissionFile.permissions}
        let usersArr = {...users, ...permissionFileData};
        return usersArr;
    }
    
}
const getUserPermissions = async(id)=>
{
    let permissionsFile = await permissionsFileDal.readFile();
    let permissions = permissionsFile.permissions.find(x=>x.id == id);
    return permissions;
}
const createUser = async(obj)=>
{
    //check if username exist in DB
    let userDB = await usersDBDal.getUserByUsername(obj.username);
    if(userDB && userDB.length > 0){
        return false;
    }else{
        //save user in DB
        let user = {username:obj.username,password:""};
        let resultSaveDB = await usersDBDal.createUser(user);
        let userId = resultSaveDB.toString();
    
        //save user in users.json
        let usersDataFile = await usersFileDal.readFile();
        let usersData = usersDataFile.users;
        let userArr = {"users":[]};
        let date = new Date().toLocaleDateString();
        let userObj = {id:userId, firstName: obj.firstName,lastName:obj.lastName,created:date,sessionTimeOut:obj.sessionTimeOut};
        usersData.push(userObj);
        userArr.users = usersData
        let resultUses = await usersFileDal.writeToFile(userArr);
        if(resultUses){
            //save user in permissions.json
            let permisstionsDataFile = await permissionsFileDal.readFile();
            let permisstionsData = permisstionsDataFile.permissions;
            let permisstionsArr = {"permissions":[]};
            let permissionsObj = {id:userId, permissions: obj.permissions};
            permisstionsData.push(permissionsObj);
            permisstionsArr.permissions = permisstionsData
            let result = await permissionsFileDal.writeToFile(permisstionsArr);
            return result;
        }
        
    }


    
}
const deleteUser = async(id)=>
{
    //delete user from DB
    let resDB = await usersDBDal.deleteUser(id);
    if(resDB){
        //remove user fron users.json
        let usersArr = {"users":[]};
        let usersFile = await usersFileDal.readFile();
        let users = usersFile.users;  
        let userIndex = users.findIndex(x=>x.id == id);
        if(userIndex >=0){users.splice(userIndex,1)}
        usersArr.users = users;
        let resultFileUser = await usersFileDal.writeToFile(usersArr);
        if(resultFileUser){
            //remove user permissions from permissions.json
            let permissionsArr = {"permissions":[]};
            let permissionsFile = await permissionsFileDal.readFile();
            let permissions = permissionsFile.permissions; 
            let permissionIndex = permissions.findIndex(x=>x.id == id);
            if(permissionIndex >=0){permissions.splice(permissionIndex,1)}
            permissionsArr.permissions = permissions;
            let resultFilePermissions = await permissionsFileDal.writeToFile(permissionsArr);
            return resultFilePermissions;
        }
    }
}
const updateUser = async(obj)=>
{
    let id = obj.id;
    //check if username exist in DB and update user from DB 
    let userDB = await usersDBDal.getUserByUsername(obj.username);
    if(userDB && userDB.length > 0 && id !== userDB[0].id){
        return false;
    }else{
        let resDB = await usersDBDal.updateUser(id,obj);
        if(resDB){
            //update user in users.json
            let usersArr = {"users":[]};
            let usersFile = await usersFileDal.readFile();
            let users = usersFile.users;  
            let userIndex = users.findIndex(x=>x.id == id);
            let userObj = {id:id,firstName:obj.firstName,lastName:obj.lastName,created:obj.created,sessionTimeOut:obj.sessionTimeOut}
            users[userIndex]=userObj;
            usersArr.users = users;
            let resultFileUser = await usersFileDal.writeToFile(usersArr);
            if(resultFileUser){
               //update user permissions in permissions.json
                let permissionsArr = {"permissions":[]};
                let permissionsFile = await permissionsFileDal.readFile();
                let permissions = permissionsFile.permissions; 
                let permissionIndex = permissions.findIndex(x=>x.id == id);
                let permissionrObj = {id:id,permissions:obj.permissions}
                permissions[permissionIndex] = permissionrObj;
                permissionsArr.permissions = permissions;
                let resultFilePermissions = await permissionsFileDal.writeToFile(permissionsArr);
                return resultFilePermissions
            }
        }
    }
}
const createAccount = async(username,password)=>
{
    //check if username exist in DB
    let userDB = await usersDBDal.getUserByUsername(username);
    if(userDB && userDB.length > 0){
        //get the user id and update the DB
        let id = userDB[0].id;
        let user = {username:username,password:password};
        let resultSaveDB = await usersDBDal.updateUser(id,user);
        let userId = resultSaveDB.toString();
        return userId;
    }

    
}

module.exports = {cheackLoginData,createUser,getAllUsers,getUserById,getUserPermissions,deleteUser,updateUser,createAccount}