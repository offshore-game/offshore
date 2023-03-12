__**OFFSHORE API**__

`Game Events:`

Server => Client
```
socket.emit("gameStart", () => {

})

// Fires when the game starts, with the payload of the starting puzzles.
```

```
socket.emit("gameOver", () => {

})

// Fires when the game ends
```

```
socket.emit("healthChange", ({ health: number }) => {

})

// Fires when the boat's health changes
```

<br/>
<br/>
<br/>

Client => Server

```
socket.on("answerPuzzle", (zoneName: zoneNames, puzzleType: puzzleTypes, answer: dependent on puzzle) => {

})
```

