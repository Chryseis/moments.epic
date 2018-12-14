import LionCharacter from '../characters/LionCharacter';
import CatCharacter from '../characters/CatCharacter';
import DragonCharacter from '../characters/DragonCharacter';
import BirdCharacter from '../characters/BirdCharacter';
import RabbitCharacter from '../characters/RabbitCharacter';
import FishCharacter from '../characters/FishCharacter';


const CHARACTERS = [{
    n: "lion",
    title: "Chill the lion",
    description: "Refresh the lion from the blistering heat",
    instruction: "Click and drag the fan around the lion",
    bc: 0xebe5e7,
    tc: 0xb297a2,
    c: LionCharacter,
    posy: 100,
    scale: 1,
    rotationY: 0
}, {
    n: "cat",
    title: "The cat and the yarn",
    description: "Happiness is a moving ball of wool",
    instruction: "Move the ball around the cat.",
    bc: 0x6ecccc,
    tc: 0xffd6c2, //0xfc7160, //0x93131F,
    c: CatCharacter,
    posy: 0,
    scale: 2.3,
    rotationY: 0
}, {
    n: "dragon",
    title: "Sneeze the dragon",
    description: "Awake the sleeping beast",
    instruction: "Keep clicking as fast as possible.",
    bc: 0x652e37,
    tc: 0xfdde8c,
    c: DragonCharacter,
    posy: 70,
    scale: 2,
    rotationY: 0
}, {
    n: "bird",
    title: "Paranoid Bird",
    description: "A hate / love story",
    instruction: "move your mouse around the big bird",
    bc: 0xe0dacd,
    tc: 0xFF8754,
    c: BirdCharacter,
    posy: 30,
    scale: 1,
    rotationY: 0
}, {
    n: "rabbit",
    title: "The frantic run of the valorous rabbit",
    description: "A serious misunderstanding",
    instruction: "Click to jump, avoid the hedgehogs, grap the carrots.",
    bc: 0xdbe6e6,
    tc: 0xF8A375,
    c: RabbitCharacter,
    posy: 0,
    scale: 8,
    rotationY: 0
}, {
    n: "fish",
    title: "Mighty fish",
    description: "Don't stop me now",
    instruction: "Move your mouse around the screen.",
    bc: 0x8ee4ae,
    tc: 0x71b583,
    c: FishCharacter,
    posy: 100,
    scale: 1,
    rotationY: -Math.PI * .5
}
];

export default CHARACTERS;


// WEBPACK FOOTER //
// ./src/assets/scripts/defs/charactersDef.js