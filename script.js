let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHeath;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    heath: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    heath: 60,
  },
  {
    name: "dragon",
    level: 20,
    heath: 300,
  },
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town sqare. You see a sign that says 'Store'.",
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health(10 gold)",
      "Buy weapon(30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "The mosters screams 'Arg!' as it dies.You gane experience points and find gold",
  },
  {
    name: "lose",
    "button text": ["REPLAY", "REPLAY", "REPLAY"],
    "button functions": [restart, restart, restart],
    text: "You die ☠",
  },
  {
    name: " win",
    "button text": ["REPLAY", "REPLAY", "REPLAY"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME!🏆🏆🏆",
  },
  {
    name: " easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You found a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

//create functions

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
  console.log("in the goTown function");
}

function goStore() {
  update(locations[1]);
  console.log("in the goStore function");
}

function goCave() {
  update(locations[2]);
  console.log("in the goCave function");
}

function buyHealth() {
  console.log("in the buyHealth function");
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}
function buyWeapon() {
  console.log("in the buyWeapon function");
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "in your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
  }
  button2.innerText = "Sell weapon for 15 gold";
  button2.onclick = sellWeapon;
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    gold.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText = "In the inventory  you have:" + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  console.log("in the fightSlime function");
  fighting = 0;
  goFight();
}
function fightBeast() {
  console.log("in the fightBeast function");
  fighting = 1;
  goFight();
}

function fightDragon() {
  console.log("Fighting dragon.");
  fighting = 2;
  goFight();
}
function goFight() {
  console.log("Go Fight.");
  update(locations[3]);
  monsterHeath = monsters[fighting].heath;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHeath;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks";
  text.innerText +=
    "You attack it with your " + weapons[currentWeapon].name + ".";

  if (isMonsterHit()) {
    health -= getMosterAttackValue(monsters[fighting].level);
  } else {
    text.innerText += "You miss.";
  }

  monsterHeath -= weapons[currentWeapon].power;
  monsterHeath -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  health.innerText = health;
  monsterHeath.innerText = monsterHeath;
  if (health <= 0) {
    lose();
  } else if (monsterHeath <= 0) {
    fighting === 2 ? winGame() : defeatMoster();
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += "Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMosterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText =
    "You dodge the attack from the" + monsters[fighting].name + ".";
}
function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function defeatMoster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}
function restart() {
  let xp = 0;
  let health = 100;
  let gold = 50;
  let currentWeapon = 0;
  let inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}
function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers : \n";

  for (let i = 0; i < 10; i++) {
    text.innerText = numbers[i] + " \n";
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText = "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText = "Wrong! You loose 10 health";
    health -= 10;
    healthText.innerText = health;
  }
  if (health <= 0) {
    lose();
  }
}
