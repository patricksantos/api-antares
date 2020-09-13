'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolsistas
 */

const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')
const User = use('App/Models/User')
const Endereco = use('App/Models/Endereco')
const Bolsista = use('App/Models/Bolsista')
const Permissao = use('App/Models/Permissao')
const { validateAll } = use('Validator')

class BolsistaController {

  async index ({ request, response, view }) {
  }

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try{
      const erroMessage = {
        'username.required': 'Esse campo é obrigatório',
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.required': 'Esse campo é obrigatório',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'estado.required': 'Esse campo é obrigatório',
        'cidade.required': 'Esse campo é obrigatório',
        'bairro.required': 'Esse campo é obrigatório',
        'rua.required': 'Esse campo é obrigatório',
        'numero.required': 'Esse campo é obrigatório',
        'nome.required': 'Esse campo é obrigatório',
        'telefone.required': 'Esse campo é obrigatório',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        bairro: 'required',
        rua: 'required',
        numero: 'required',
        nome: 'required',
        telefone: 'required',
        email: 'required|email',
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const {
        username,
        password,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        nome,
        cpf,
        email,
        telefone,
        matricula,
        ativo,
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
      } = request.all()
      const user = await User.create({
        username,
        password
      }, trx)
      console.log("Passou 1")
      const endereco = await Endereco.create({
        estado,
        cidade,
        bairro,
        rua,
        numero
      }, trx)
      console.log("Passou 2")
      const pessoa = await Pessoa.create({
        nome,
        cpf,
        email,
        telefone,
        endereco_id: endereco.id
      }, trx)
      console.log("Passou 3")
      const permissao = await Permissao.create({
        user_id:user.id,
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
      })
      console.log("Passou 4")
      const bolsista = await Bolsista.create({
        pessoa_id: pessoa.id,
        user_id: user.id,
        permissao_id:permissao.id,
        matricula,
        ativo
      })
      console.log("Passou 5")
      
      await trx.commit()

      return response.status(201).send({message: 'Bolsista criado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(500).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = BolsistaController
