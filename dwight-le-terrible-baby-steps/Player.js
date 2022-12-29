/**
 * PHASES DE JEU (STAGE)
 *  - S_FORWARD --> phase avancer : la voie est libre, le personnage peut avancer
 *  - S_ATTACK  -->phase d'attaque : une attaque corps a corps
 *  - S_LONG_ATTACK -->phase attaque longue : le personnage subit une attaque a distance (archer)
 * 
 * ACTIONS : différentes actions du personnages
 *  - A_WALK --> avancer
 *  - A_ATTACK --> attaquer
 *  - A_RETREAT --> se mettre à l'abri (reculer)
 *  - A_REST --> se reposer
 */

class Player {
  constructor(warrior) {
    this.stage = 'S_FORWARD';
    this.action = null;
    this.healthEvolution = [];
    //this.longAttackRest = 5 * 3 // 3 * 3 cout en déplacement - 3 * 2 cout en combat
  }

  analyse() {
    this.warrior.think('stage = ' + this.stage);
    this.healthEvolution.push(this.warrior.health());
    const lastIndex = this.healthEvolution.length - 1;
    this.healthNow = this.healthEvolution[lastIndex];
    this.healthPrevious = this.healthEvolution[lastIndex - 1];
    //this.warrior.think('healthEvoluiton = ' + this.healthEvolution)
    switch(this.stage) {
      case 'S_FORWARD':
        this.isUnitNext();
        this.needRest();
        this.isLongAttack();
        break;
      case 'S_ATTACK':
        this.isStrikerAlive();
        this.needRest();
        break;
      case 'S_lONG_ATTACK':
        this.needRest();
        break;
    }
  }

  isUnitNext() {
    if(this.warrior.feel().isUnit()) {
      this.nextUnit = this.warrior.feel().getUnit();
      if(this.nextUnit.isEnemy) {
        this.stage = 'S_ATTACK';
        this.action = 'A_ATTACK';
      } else {
        this.warrior.think('next unit = ' + this.nextUnit)
      }
    } else {
      this.stage = 'S_FORWARD';
      this.action = 'A_WALK';
    }

    return this.warrior.feel().isUnit();
  }

  isStrikerAlive() {
    if(this.healthNow < this.healthPrevious) {
      this.action = 'A_ATTACK';
    } else if(this.action == 'S_LONG_ATTACK') {
      this.action = 'S_FORWARD';
      this.analyse();
    } else {
      this.stage = 'S_FORWARD';
      this.action = 'A_WALK';
    }
  }

  needRest() {
    this.warrior.think(`
    rest needed = ${this.rest[this.stage]}
    stage = ${this.stage}`)
    if(this.warrior.health() < this.rest[this.stage]) {
      this.action = 'A_REST';
      this.canRest();
    }
  }

  canRest() {
    if(this.healthNow < this.healthPrevious) {
      this.action = 'A_RETREAT';
    }
  }

  isLongAttack() {
    const isUnit = this.warrior.feel().getUnit();
    if(this.healthNow < this.healthPrevious) {
      this.stage = isUnit ? 'S_ATTACK' : 'S_LONG_ATTACK';
      this.action = isUnit ? 'A_ATTACK' : 'A_WALK';
      this.analyse();
    } 
  }

  chooseAction() {
    this.warrior.think(`action = ${this.action}`)
    switch(this.action) {
      case 'A_WALK':
        this.warrior.walk();
        break;
      case 'A_ATTACK':
        this.warrior.attack();
        break;
      case 'A_REST': 
        this.warrior.rest();
        break;
      case 'A_RETREAT':
        this.warrior.walk('backward');
        break;
    }
  }

 
  
  playTurn(warrior) {
    this.warrior = warrior;
    this.rest = {
      'S_FORWARD' : this.warrior.maxHealth(),
      'S_ATTACK': 2 * 3,
      'S_LONG_ATTACK' : 5 * 3 // 3 * 3 cout en déplacement - 3 * 2 cout en combat
    }
    this.analyse();
    this.chooseAction();
  }         
}
