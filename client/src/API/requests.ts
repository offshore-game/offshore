import { io, Socket } from "socket.io-client";

export default class Requests {

    socket: Socket
    token: string

    constructor() {

        this.socket = io("http://localhost:8080"); // Establish a connection
        this.token = localStorage.getItem("token")!

    }

    
     // Check if the token is valid
    async validateToken() {
        return new Promise((res, rej) => {

            this.socket.emit("validateToken", this.token, async (valid: boolean) => {

                if (valid) {

                    // Token is stil valid
                    return res(true);

                } else {

                    localStorage.setItem("token", "") // Wipe the old invalid token

                    // Request a new token
                    const token = await this.requestToken()
                    localStorage.setItem("token", token ? token : "")

                }
            
            })

        })
    }


    // Ask for a new token
    async requestToken(): Promise<string | void> {
        return new Promise((res, rej) => {

            this.socket.emit("requestToken", (token: string) => {

                if (token) {

                    localStorage.setItem("token", token)
                    console.log("Token recieved: ", token)
                    return res(token);

                }

            })

        })
    }

}