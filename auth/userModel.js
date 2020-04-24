const db = require('../database/dbConfig');

module.exports = {
    addUser,
    getByUsername
}

function addUser(user){
    return db('users')
        .insert(user, 'id')
        .then(id => {
            return getById(id[0]);
        })
}

function getByUsername(username){
    return db('users')
        .where({ username })
        .first();
}

function getById(id){
    return db('users')
        .where({ id })
        .first();
}