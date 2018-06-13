# Hermes - Fully Scalable MQTT Broker

An easy to user Docker container that starts several MQTT Mosca brokers, handling massive connections simultaneously.

## Getting Started

These instructions will get you a copy of the project up and running.

### Prerequisites and Installation

1. You must have an active account on [Auth0](http://www.auth0.com)
2. Once you account is activated, you must create a Machine-to-Machine (M2M) API in Auth0. See this very useful [tutorial](https://auth0.com/docs/integrations/authenticating-devices-using-mqtt) for more details.
4. Copy the env.example file and change its contents to match both Auth0 API configuration and deployment mode
5. Build and run the Docker compose command

```
cd <your_project_folder>
docker-compose build
docker-compose up
```
The server should be available for connection at port 1883

Happy messaging! =)

## Notes and Tips

* By default, the [docker compose](docker-compose.yml) file is set to create 5 Mosca replicas. If you are handling a huge number of connections simultaneously, you might wanna increase this number.
* In order to authenticate any potential listeners/subscriber, the server uses JWT authentication.
* By default, subscribers after authentication can only send/listen messages to topics which contains the client_id in their name. So in order to publish messages, you need to keep tabs on the subscription client_id.

## Built With

* [NodeJS](https://nodejs.org/en/) - Javascript runtime used for the code
* [HAProxy](http://www.haproxy.org/) - Lightweight TCP Load balancer
* [Redis](https://redis.io/) - Default message persistence layer/in-memory database
* [Mosca](https://github.com/mcollina/mosca) - Incredible MQTT Node.js broker
* [Auth0](http://www.auth0.com) - JWT Device authentication service

## Contributing

For instructions on how to contribute, please contact the the author directly.


## Authors

* **Gabriel Natucci** - *Initial work* - [Digseed](http://www.digseed.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Based on the library to connect Auth0 and the Mosca Server, provided by [@eugenioip]( https://github.com/eugeniop/auth0mosca)
