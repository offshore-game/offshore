__**OFFSHORE API**__

`Game Events:`

```
socket.on("gameOver", () => {

})

// Fires when the game ends
```

```
socket.on("healthChange", ({ health: number }) => {

})

// Fires when the boat's health changes
```

```
socket.on("answerPuzzle", (zoneName: zoneNames, puzzleType: puzzleTypes, answer: dependent on puzzle) => {

})
```
