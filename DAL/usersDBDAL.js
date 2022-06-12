const userModel = require('../models/userModel');

const getAllUsers = ()=>
{
    return new Promise((resolve,reject)=>
    {
        userModel.find({},function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        })
    })
}
const getUserById = (id)=>
{
    return new Promise((resolve,reject)=>
    {
        userModel.findById(id,function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        })
    })
}
const getUserByUsername = (username)=>
{
    return new Promise((resolve,reject)=>
    {
        userModel.find({username:username},function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        })
    })
}
const createUser = (obj)=>
{
    let user = userModel({
        username : obj.username,
        password: obj.password
    })
    return new Promise((resolve,reject)=>
    {
        user.save(function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                
                resolve(user._id);
            }
        })
    })
}
const deleteUser = (id)=>
{
    return new Promise((resolve,reject)=>
    {
        userModel.findByIdAndDelete(id,function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve('Deleted !!')
            }
        })
    });
}
const updateUser = (id,obj)=>
{
    return new Promise((resolve, reject) =>
    {

        userModel.findByIdAndUpdate(id,
            {
                username : obj.username,
                password : obj.password
            }, function(err)
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve('Updated !!')
                }
            })



    })
}



module.exports = {getAllUsers,getUserById,getUserByUsername,createUser,deleteUser,updateUser};