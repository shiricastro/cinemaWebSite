const axios = require('axios');

const getMovies = () =>
{
    return axios.get("http://localhost:8000/api/movies")
}
const getMovieById = (id) =>
{
    return axios.get("http://localhost:8000/api/movies/"+id)
}
const createMovie = (obj) =>
{
    return axios.post("http://localhost:8000/api/movies",obj)
}
const updateMovie = (id,obj) =>
{
    return axios.put("http://localhost:8000/api/movies/"+id,obj)
}
const deleteMovie = (id) =>
{
    return axios.delete("http://localhost:8000/api/movies/"+id)
}
const getMembers = () =>
{
    return axios.get("http://localhost:8000/api/members")
}
const getMemberById = (id) =>
{
    return axios.get("http://localhost:8000/api/members/"+id)
}
const createMember = (obj) =>
{
    return axios.post("http://localhost:8000/api/members",obj)
}
const deleteMember = (id) =>
{
    return axios.delete("http://localhost:8000/api/members/"+id)
}
const updateMember = (id,obj) =>
{
    return axios.put("http://localhost:8000/api/members/"+id,obj)
}
const getSubscriptions = () =>
{
    return axios.get("http://localhost:8000/api/subscriptions")
}
const getSubscriptionsById = (id) =>
{
    return axios.get("http://localhost:8000/api/subscriptions/"+id)
}
const createSubscription = (obj) =>
{
    return axios.post("http://localhost:8000/api/subscriptions",obj)
}
const updateSubscription = (id,obj) =>
{
    return axios.put("http://localhost:8000/api/subscriptions/"+id,obj)
}
const deleteSubscription = (id) =>
{
    return axios.delete("http://localhost:8000/api/subscriptions/"+id)
}



module.exports = {getMovies,getMovieById,createMovie,updateMovie,deleteMovie,getMembers,getMemberById,createMember,deleteMember,updateMember,getSubscriptions,getSubscriptionsById,createSubscription,updateSubscription,deleteSubscription}