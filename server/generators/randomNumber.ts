export default function randomNumber(min: number, max: number) {

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // I'm lazy ok

    // Inclusive Min, Inclusive Max
    return Math.floor(Math.random() * (max - min + 1) + min);

}
