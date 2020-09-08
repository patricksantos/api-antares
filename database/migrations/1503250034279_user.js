'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments('id')
      table.string('username', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.boolean('ativo').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
