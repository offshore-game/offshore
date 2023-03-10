export default function makeLobbyId(length: number, lobbyIDs: string[]) {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


    let result = ""
    for (let i = 0; i < length; i++ ) {

        result += characters.charAt(Math.floor(Math.random() * characters.length))

    }
    if (lobbyIDs.includes(result)) {
        return makeLobbyId(length, lobbyIDs)
    }
    lobbyIDs.push(result)
    return result;

}
