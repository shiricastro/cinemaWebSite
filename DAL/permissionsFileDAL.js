const jFile = require('jsonfile');

const readFile = () =>
{
    return new Promise((resolve, reject) =>
    {
        jFile.readFile(__dirname + "/../Data/permissions.json", function(err,data)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(data);
            }
        })
    })
}



const writeToFile = (obj) =>
{
    return new Promise((resolve, reject) =>
    {
        jFile.writeFile(__dirname + "/../Data/permissions.json",obj, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve('OK');
            }
        })
    })
}


module.exports = {readFile,writeToFile};