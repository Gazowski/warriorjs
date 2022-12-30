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
    this.healthStatus = null;
    this.stepStatus = null;
    this.attackStatus = null;
    this.longAttackStatus = null;
    this.minimumHealth = {
      'S_FORWARD': 20,
      'S_LONGATTACK': 5 * 3, //3 * 3 cout en déplacement - 3 * 2 cout en combat
      'S_ATTACK': 5 * 3, 
    }
    //this.longAttackRest = 5 * 3 // 3 * 3 cout en déplacement - 3 * 2 cout en combat
  }

  playTurn(warrior) {
    this.warrior = warrior;
    this.healthEvolution.push(this.warrior.health());

    this.checkHealth();
    this.checkEnvironnement();

    switch(this.stage) {
      case 'S_FORWARD':
        this.stageForward();
        break;
      case 'S_ATTACK':
        this.stageAttack();
        break;
      case 'S_LONGATTACK':
        this.warrior.think('ici')
        this.stageLongAttack();
        break;
    }

  //   this.warrior.think(`
  //   this.stage = ${this.stage}
  //   this.healthEvolution = ${this.healthEvolution}
  //   this.healthStatus = ${this.healthStatus}
  //   this.stepStatus = ${this.stepStatus}
  //   this.attackStatus = ${this.attackStatus}
  //   this.longAttackStatus = ${this.longAttackStatus}
  //   this.healthStatus = ${this.healthStatus}
  //   this.stepStatus = ${this.stepStatus}
  //   this.attackStatus = ${this.attackStatus}
  //   this.longAttackStatus = ${this.longAttackStatus}
  // `)
    this.warrior.think(`
    this.stage = ${this.stage}

  `)
  }

  checkHealth() {
    const lastIndex = this.healthEvolution.length - 1,
          previousHealth = this.healthEvolution[lastIndex - 1],
          roundHealth = this.healthEvolution[lastIndex];
    
    if(lastIndex == 0 || previousHealth == roundHealth) { 
      this.healthStatus = 'stable'; 
    } else if(previousHealth > roundHealth)  { 
      this.healthStatus = 'decrease';
    } else {
      this.healthStatus = 'increase'
    } 
  }

  checkEnvironnement() {
    if(this.warrior.feel().getUnit()) {
      if(this.warrior.feel().getUnit().isEnemy()) {
        this.stepStatus = 'enemy';
      }
    } else if (this.healthStatus == 'decrease') {
      this.stepStatus = 'longAttack';
    } else {
      this.stepStatus = 'clear';
    }
  }

  needRest() {
    return this.warrior.health() < this.minimumHealth[this.stage];
  }

  isMaxHealth() {
    return this.warrior.health() == this.warrior.maxHealth();
  }

  stageForward() {
    switch(this.healthStatus) {
      case 'stable':
        if(this.needRest()) {
          this.warrior.rest();
        } else if (this.stepStatus == 'enemy') {
          this.stage = 'S_ATTACK';
          this.attackStatus = 'strike';
          this.warrior.attack();
        } else {
          this.warrior.walk();
        }
        break;
      case 'decrease':
        if(this.stepStatus == 'longAttack') {
          this.stage = 'S_LONGATTACK';
          if(this.needRest()) {
            this.longAttackStatus = 'rest';
            this.warrior.walk('backward');
          } else {
            this.longAttackStatus = 'go';
            this.warrior.walk();
          }
        } else if(this.stepStatus == 'enemy') {
          this.stage = 'S_LONGATTACK';
          this.longAttackStatus = 'strike';
          this.warrior.attack();
        }
        break;
      case 'increase':
        if(this.warrior.health() < this.warrior.maxHealth()) {
          this.warrior.rest();
        } else {
          this.warrior.walk();
        }
        break;
    }
  }

  stageAttack() {
    switch (this.attackStatus) {
      case 'strike':
        if(this.warrior.feel().isEmpty()) {
          this.stage = 'S_FORWARD';
          this.stageForward();
        } else if(this.needRest()) {
          this.attackStatus = 'rest'
          this.warrior.walk('backward');
        } else {
          this.warrior.attack();
        }
        break;
      case 'rest':
        if(!this.isMaxHealth()) {
          this.attackStatus = 'rest';
          this.warrior.rest();
        } else {
          this.attackStatus = 'strike';
          this.warrior.walk();
        }
        break;
    }
  }

  stageLongAttack() {
    this.warrior.think(`
    this.longAttackStatus = ${this.longAttackStatus};
    `)
    switch (this.longAttackStatus) {
      case 'rest':
        if(this.healthStatus == 'decrease') {
          this.warrior.walk('backward');
        } else if(!this.isMaxHealth()) {
          this.warrior.rest()
        } else {
          this.longAttackStatus = 'go';
          this.warrior.walk();
        }
        break;
      case 'go':
        if(this.stepStatus == 'clear') {
          this.warrior.walk();
        } else {
          this.longAttackStatus = 'strike';
          this.warrior.attack();
        }
        break;
      case 'strike':
        if(this.stepStatus == 'enemy') {
          this.warrior.attack();
        } else {
          this.stage = 'S_FORWARD';
          this.stageForward();
        }
        break;
    }
  }

}
