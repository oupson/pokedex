async function routes(fastify, options) {
    // Return a random Pokémon, can be used with ?start=&end= parameters or set using environment variables
    fastify.get('/pokemon', async (request, reply) => {
        try {
            const min_range = parseInt(request.query.start) || parseInt(process.env.POKEDEX_START_NUMBER) || 1;
            const max_range = parseInt(request.query.end) || parseInt(process.env.POKEDEX_END_NUMBER) || 1;

            if (max_range < min_range) {
                return fastify.httpErrors.badRequest("Parameter 'end' must be greater than 'start'");
            }

            const randomId = Math.floor(Math.random() * (max_range - min_range + 1)) + min_range;

            console.log(randomId);

            const apiResponse = (await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`));
            if (apiResponse.ok) {
                return await apiResponse.json();
            }

            return fastify.httpErrors.badRequest();
        }
        catch (e) {
            console.error(e)
            throw fastify.httpErrors.serviceUnavailable();
        }
    });

    // get a specific Pokémon
    fastify.get('/pokemon/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            if (isNaN(id)) {
                return fastify.httpErrors.badRequest("id must be a number");
            }

            if (max_range < min_range) {
                return fastify.httpErrors.badRequest("Parameter 'end' must be greater than 'start'");
            }

            const apiResponse = (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`));
            if (apiResponse.ok) {
                return await apiResponse.json();
            }
            else if (apiResponse.status == 404) {
                return fastify.httpErrors.notFound("Pokémon not found, check your id");
            }

            return fastify.httpErrors.badRequest();
        }
        catch (e) {
            console.error(e)
            throw fastify.httpErrors.serviceUnavailable();
        }
    });
}

export default routes;
