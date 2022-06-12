const subscriptionsWSDAL = require('../DAL/subscriptionsWSDAL');
const { find } = require('./userModel');

const getSubscriptions = async()=>
{
    //get subscription data
    let subscriptionsDB = await subscriptionsWSDAL.getSubscriptions();
    if(subscriptionsDB){
        let subscriptions = subscriptionsDB.data;
        let subscriptionsArr = subscriptions.map(x=>{return{subscriptionId:x._id,memberId:x.memberId,movies:x.movies}})
        //add movies name to subscription movies
        let moviesDB = await subscriptionsWSDAL.getMovies();
        if(moviesDB){
            let moviesData = moviesDB.data;
            let movies = moviesData.map(x=>{return {id:x._id,name:x.name}})
            subscriptionsArr.forEach(x=>{
                x.movies.forEach(y=>{
                    y.date = new Date(y.date).toLocaleDateString('en-US')
                    let movieArr = movies.find(movie=>movie.id == y.movieId)
                    if(movieArr){
                        y.movieName = movieArr.name;
                    }
                })
            })
            return subscriptionsArr;  
        }

    }
     
}
const createSubscription = async(obj)=>
{
    //check if member watced movies
    if(obj.subscriptionId){
        //update subscription
        let subscriptionDB = await subscriptionsWSDAL.getSubscriptionsById(obj.subscriptionId);
        if(subscriptionDB){
            let subscription = subscriptionDB.data;
            obj.movies = [...obj.movies, ...subscription.movies]
            let resultDB = await subscriptionsWSDAL.updateSubscription(obj.subscriptionId,obj);
            return resultDB;
        }
    }else{
        //create subscription
        let resultDB = await subscriptionsWSDAL.createSubscription(obj);
        return resultDB;
    }
  
}
const getMovies = async()=>
{
    let moviesDB = await subscriptionsWSDAL.getMovies();
    return moviesDB.data;
}
const getMembers = async()=>
{
    //get members data
    let membersDB = await subscriptionsWSDAL.getMembers();
    if(membersDB){
        let members = membersDB.data;
        let data;
        //get subscriptions data 
        let subscriptions = await getSubscriptions();
        if(subscriptions.length >0){
            data = members.map(x => ({...x, ...subscriptions.find(y => y.memberId === x._id)}))
        }else{
            data = members;
        }
        return data;   
    }
     
}
const getMemberById = async(id)=>
{
    let memberDB = await subscriptionsWSDAL.getMemberById(id);
    return memberDB;
}
const createMember = async(obj)=>
{
    let resultDB = await subscriptionsWSDAL.createMember(obj);
    return resultDB;
    
}
const deleteMember = async(id)=>
{
    //delete memer from DB
    let resDB = await subscriptionsWSDAL.deleteMember(id);
    if(resDB){
        //check if meber has subscriptions
        let subscriptionsDB = await subscriptionsWSDAL.getSubscriptions();
        if(subscriptionsDB){
            //remove subscription
            let subscriptions =  subscriptionsDB.data;
            let subscription = subscriptions.find(x=>x.memberId == id);
            if(subscription){
                let subscriptionID = subscription._id;
                let resDBDelete = await subscriptionsWSDAL.deleteSubscription(subscriptionID);
                return resDBDelete;
            }
        }else{
            return resDB;
        }
    }
}
const updateMember = async(obj)=>
{
    let id = obj.id;
    let memberDB = await subscriptionsWSDAL.updateMember(id,obj);
   return memberDB;
}


module.exports = {createSubscription,getMovies,getMembers,getMemberById,createMember,deleteMember,updateMember}