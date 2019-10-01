const levelService = {
    getUserLvlByUserId(knex, user_id){
        return knex.from('wellread_lvl')
        .select('*')
        .where('user_id', user_id)
    },
    updateUserLvl(knex, newUserLvl, id){
        return knex('wellread_lvl')
          .where({ id })
          .update(newUserLvl)
    },
    deleteUserLvl(knex, id){
        return knex('wellread_lvl')
          .where({ id })
          .delete()
    },
    insertUserLvl(knex, newUserLvl){
        return knex
            .insert(newUserLvl)
            .into('wellread_lvl')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = levelService;