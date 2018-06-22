import mosca from "mosca";
import Auth0Mosca from "./auth0mqtt";

const settings = {
    port: 1883,
    stats: true, // publish stats in the $SYS/<id> topicspace
    logger: {
        level: 'info'
    },
    backend: {
        type: 'redis',
        port: 6379,
        host: 'redis'
    },
    persistence: {
        factory: mosca.persistence.Redis,
        port: 6379,
        host: 'redis'
    }
}

//'Devices' is a Database connection where all devices are registered.
var auth0 = new Auth0Mosca(
    process.env.AUTH0_URI,
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_CLIENT_SECRET,
    'Devices',
    process.env.AUTH0_AUDIENCE,
    process.env.AUTH0_ISSUER
)

//Setup the Mosca server
var server = new mosca.Server(settings)

//Wire up authentication & authorization to mosca
server.authenticate = auth0.authenticateWithJWT()
server.authorizePublish = auth0.authorizePublish()
server.authorizeSubscribe = auth0.authorizeSubscribe()

server.on('ready', setup)

// Fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}

server.on('clientConnected', function (client) {
    console.log('New connection: ', client.id)
})

// fired when a client disconnects
server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id)
})