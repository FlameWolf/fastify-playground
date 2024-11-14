import fastify, { FastifyInstance } from "fastify";
import formDataParser from "formzilla";
import fastifyMultipart from "@fastify/multipart"; /* 14 Nov 2024: @fasttify/multipart still doesn't work with this schema */
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const postCreateSchema = {
	consumes: ["multipart/form-data"],
	body: {
		type: "object",
		properties: {
			content: {
				type: "string"
			},
			media: {
				type: "string",
				format: "binary"
			},
			poll: {
				type: "object",
				properties: {
					first: { type: "string" },
					second: { type: "string" }
				},
				required: ["first", "second"]
			}
		}
	}
};
const server: FastifyInstance = fastify({ logger: true });
server.register(formDataParser);
server.register(fastifySwagger, {
	mode: "dynamic",
	openapi: {
		info: {
			title: "Formzilla Demo",
			version: "1.0.0"
		}
	}
});
server.register(fastifySwaggerUi, {
	routePrefix: "/swagger"
});
server.register(async (instance, options) => {
	instance.post("/create-post", {
		schema: postCreateSchema,
		handler: (request, reply) => {
			console.log(request.body);
			/*
			request.body will look like this:
			{
				content: "Test.",
				poll: { first: "Option 1", second: "Option 2" },
				media: {
					originalName: "flame-wolf.png",
					encoding: "7bit",
					mimeType: "image/png",
					path?: <string>,		// Only when using DiscStorage
					stream?: <Readable>		// Only when using StreamStorage
					data?: <Buffer>			// Only when using BufferStorage
					error?: <Error>			// Only if any errors occur during processing
				}
			}
			*/
			reply.status(200).send();
		}
	});
});
server.listen(
	{
		port: +(process.env.PORT as string) || 1024,
		host: process.env.HOST || "::"
	},
	(err, address) => {
		if (err) {
			console.log(err.message);
			process.exit(1);
		}
		console.log(`Listening on ${address}`);
	}
);