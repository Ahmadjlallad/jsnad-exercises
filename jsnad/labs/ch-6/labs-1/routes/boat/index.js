'use strict'
const {boat} = require('../../model');
const {promisify} = require('node:util');

module.exports = async function (fastify, opts) {
    const {notFound} = fastify.httpErrors
    const del = promisify(boat.del)


    fastify.post('/', async (request, reply) => {
        const {brand, color} = request.body.data;
        reply.code(201);
        return {id: (await promisify(boat.create)(boat.uid(), {brand, color}))}
    })

    fastify.get('/:id', async (request, reply) => {
        try {
            const data = await promisify(boat.read)(request.params.id);
            return {...data}
        } catch (e) {
            if (e.code === 'E_NOT_FOUND') {
                throw notFound(e);
            }
            throw e;
        }
    })

    fastify.delete('/:id', async (request, reply) => {
        const {id} = request.params
        try {
            await del(id)
            reply.code(204)
        } catch (err) {
            if (err.message === 'not found') throw notFound()
            throw err
        }
    })
}
