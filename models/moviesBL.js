const subscriptionsWSDAL = require('../DAL/subscriptionsWSDAL');

const getSubscriptions = async()=>
{
    //get subscription data
    let subscriptionsDB = await subscriptionsWSDAL.getSubscriptions();
    if(subscriptionsDB){
        let subscriptions = subscriptionsDB.data;
        //add member name to subscription
        let membersDB = await subscriptionsWSDAL.getMembers();
        if(membersDB){
            let membersData = membersDB.data;
            let members = membersData.map(x=>{return {id:x._id,name:x.name}})
            subscriptions.forEach(x=>{
                let memberArr = members.find(member=>member.id == x.memberId);
                x.memberName = memberArr.name;
            })
            return subscriptions;  
             
        }

    }
     
}
const getMovies = async()=>
{
    //get all movies from DB
    let moviesDB = await subscriptionsWSDAL.getMovies();
    if(moviesDB){
        let movies = moviesDB.data;
        movies.forEach(x => {
            let date = new Date(x.premiered).getFullYear();
            x.year = date;
            x.subscriptions = [];
        });
        //get subscription full data
        let subscriptions = await getSubscriptions();
        if(subscriptions || subscriptions.length >0){        
            // add subscription array to movies
            movies.forEach(movie=>{
                let movieId = movie._id;
                subscriptions.forEach(x=>{
                     x.movies.forEach(y=>{
                         if(y.movieId == movieId){
                             let date = new Date(y.date).toLocaleDateString('en-US');
                             let sub = {subscriptionId:x._id,memberId:x.memberId,memberName:x.memberName,date:date}
                            movie.subscriptions.push(sub);
                         }
                    })
                })
               
            })
        }
        
        return movies;  
    }  
}
const getMovieById = async(id)=>
{
    let movieDB = await subscriptionsWSDAL.getMovieById(id);
    if(movieDB){
        let movie = movieDB.data;
        let date = new Date(movie.premiered).toISOString().split('T')[0];
        movie.premiered = date;
        return movie;
    }

}

const createMovie = async(obj)=>
{
    let resultDB = await subscriptionsWSDAL.createMovie(obj);
    return resultDB;
    
}
const updateMovie = async(id,obj)=>
{
    let resultDB = await subscriptionsWSDAL.updateMovie(id,obj);
    return resultDB;
    
}
const deleteMovie = async(id)=>
{
    //remove movie from DB
    let resultDB = await subscriptionsWSDAL.deleteMovie(id);
    if(resultDB){
        //remove movie from subscriptions
        let subscriptionsDB = await subscriptionsWSDAL.getSubscriptions();
        let subscriptions = subscriptionsDB.data;
        subscriptions.forEach(async x=>{
            let changed = false;
            x.movies = x.movies.filter(y=>{
                y.movieId == id ? changed = true : false;
                return y.movieId !== id
            });
            if(changed){
                if(x.movies.length>0){
                    await subscriptionsWSDAL.updateSubscription(x._id,x);
                }else{
                    await subscriptionsWSDAL.deleteSubscription(x._id);
                }
            } 
        })

    }
    return resultDB;
    
    
}


module.exports = {createMovie,getMovies,getMovieById,updateMovie,deleteMovie}