/**
 * Based on the Auth0 post: https://auth0.com/docs/integrations/authenticating-devices-using-mqtt
 * Based on code deloped by @eugenioip in Github: https://github.com/eugeniop/auth0mosca
 */
import { post } from "request";
import { verify } from "jsonwebtoken";
import rp from "request-promise";


class Auth0Mosca {
    constructor(auth0Namespace, clientId, clientSecret, connection, clientAudience, clientIssuer) {
        this.auth0Namespace = auth0Namespace
        this.connection = connection
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.clientAudience = clientAudience
        this.clientIssuer = clientIssuer
    }

    authenticateWithJWT() {

        return function (client, username, password, callback) {

            if (username !== 'JWT') {
                return callback("Invalid Credentials", false)
            }

            verify(
                password.toString(),
                this.clientSecret, {
                    audience: this.clientAudience,
                    issuer: this.clientIssuer,
                    algorithms: ['HS256']
                },
                function (err, profile) {
                    if (err) {
                        console.log(err)
                        return callback("Error getting UserInfo", false)
                    }
                    console.log("Authenticated client " + profile.user_id)
                    console.log(profile.topics)
                    client.deviceProfile = profile
                    return callback(null, true)
                })
        }
    }

    authenticateWithCredentials() {

        return function (client, username, password, callback) {

            var data = {
                client_id: this.clientId, // {client-name}
                username: username.toString(),
                password: password.toString(),
                connection: this.connection,
                grant_type: "password",
                scope: 'openid name email' //Details: https:///scopes
            }

            post({
                headers: {
                    "Content-type": "application/json"
                },
                url: this.auth0Namespace + '/oauth/ro',
                body: JSON.stringify(data)
            }, function (e, r, b) {
                if (e) {
                    console.log('Error in Authentication')
                    return callback(e, false)
                }
                var r = JSON.parse(b)

                if (r.error) {
                    return callback(r, false)
                }

                verify(r.id_token, this.clientSecret, function (err, profile) {
                    if (err) {
                        return callback("Error getting UserInfo", false)
                    }
                    client.deviceProfile = profile
                    return callback(null, true)
                })
            })
        }
    }
    authorizePublish() {
        return function (client, topic, payload, callback) {
            // Checks if client has a deviceProfile property
            if (client.deviceProfile.topics !== undefined) {
                callback(null, client.deviceProfile && client.deviceProfile.topics && client.deviceProfile.topics.indexOf(topic) > -1)
            } else {
                // Check to see if client id is in the topic name
                callback(null, topic.toString().indexOf(client.id.toString()) > -1)
            }
        }
    }

    authorizeSubscribe() {
        // Checks if client has a deviceProfile property
        if (client.deviceProfile.topics !== undefined) {
            callback(null, client.deviceProfile && client.deviceProfile.topics && client.deviceProfile.topics.indexOf(topic) > -1)
        } else {
            // Check to see if client id is in the topic name
            callback(null, topic.toString().indexOf(client.id.toString()) > -1)
        }
    }
}

export default Auth0Mosca;