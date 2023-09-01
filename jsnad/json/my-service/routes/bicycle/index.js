'use strict'

const { bicycle } = require('../../model');
const { promisify } = require('node:util')

const { uid } = bicycle;

function promisifyAll(object, fields = []) {
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    if (fields.length === 0 || fields.includes(key)) {
      result[key] = promisify(value)
    }
  });

  return result;
}

const {
  create,
  update,
  read,
  del
} = promisifyAll(bicycle, ['del', 'create', 'read', 'update']);

module.exports = async (fastify, opts) => {
  const { notFound } = fastify.httpErrors

  fastify.post('/', async (request, reply) => {
    const { data } = request.body
    const id = uid()
    await create(id, data)
    reply.code(201)
    return { id }
  })

  fastify.post('/:id/update', async (request, reply) => {
    const { id } = request.params
    const { data } = request.body
    try {
      await update(id, data)
      reply.code(204)
    } catch (err) {
      if (err.message === 'not found') throw notFound()
      throw err
    }
  })

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params
    try {
      return await read(id)
    } catch (err) {
      if (err.message === 'not found') throw notFound()
      throw err
    }
  })

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params
    const { data } = request.body
    try {
      await create(id, data)
      reply.code(201)
      return {}
    } catch (err) {
      if (err.message === 'resource exists') {
        await update(id, data)
        reply.code(204)
      } else {
        throw err
      }
    }
  })

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params
    try {
      await del(id)
      reply.code(204)
    } catch (err) {
      if (err.message === 'not found') throw notFound()
      throw err
    }
  })
}
