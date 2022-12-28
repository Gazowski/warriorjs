/**
 * PHASES DE JEU (STAGE)
 *  - S_FORWARD --> phase avancer : la voie est libre, le personnage peut avancer
 *  - S_ATTACK  -->phase d'attaque : une attaque est en cours (sludge)
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
  }

  analyse() {
    this.warrior.think('stage = ' + this.stage);
    this.healthEvolution.push(this.warrior.health());
    //this.warrior.think('healthEvoluiton = ' + this.healthEvolution)
    switch(this.stage) {
      case 'S_FORWARD':
        this.isUnitNext();
        this.needRest();
        break;
      case 'S_ATTACK':
        this.isStrikerAlive();
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
    let lastIndex = this.healthEvolution.length - 1;
    if(this.healthEvolution[lastIndex] < this.healthEvolution[lastIndex - 1]) {
      this.stage = 'S_ATTACK';
      this.action = 'A_ATTACK';
    } else {
      this.stage = 'S_FORWARD';
      this.action = 'A_WALK';
    }
  }

  needRest() {
    if(this.warrior.health() < this.warrior.maxHealth()) {
      this.action = 'A_REST';
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
      case 'A_REST' : 
        this.warrior.rest();
    }
  }

 
  
  playTurn(warrior) {
    this.warrior = warrior;
    this.analyse();
    this.chooseAction();
  }         
}
