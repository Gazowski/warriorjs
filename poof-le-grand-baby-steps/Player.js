class Player {
  constructor(warrior) {
    this.warrior = null;
    this.healthEvolution = [];
    this.nextUnit = null;
    this.stepStatus = 'analyse';
    this.ennemyMaxDamage = null;
    this.backwardMove = 0;
    this.restPlace = 1;
    this.restedLevel = null;
  }

  /**
   * analyse: give the case to proceed
   */
  analyse() {
    this.healthEvolution.push(this.warrior.health());
    this.warrior.think('analyse, étape:' + this.stepStatus);
  
    switch(this.stepStatus) {
      case 'retreat':
        this.canIRest();
        break;
      case 'rest':
        this.isRested();
        break;
      default: 
        this.isUnitNext();
        this.canGoForward();
        this.checkIfAttack();
        this.needRetreat();
    }
  }
  
  canGoForward() {
    if(this.warrior.feel().isEmpty()) {
      this.stepStatus = 'go';
    }
  }

  isUnitNext() {
    if(this.warrior.feel().isUnit()) {
      this.nextUnit = this.warrior.feel().getUnit();
      //this.warrior.think(this.nextUnit.health());
      if(this.nextUnit.isEnemy) {
        this.stepStatus = 'attack';
      }
    }
  }

  checkIfAttack() {
    if(this.healthEvolution.length < 2) {
      return;
    }
    let lastIndex = this.healthEvolution.length - 1;
    if(this.healthEvolution[lastIndex] < this.healthEvolution[lastIndex - 1]) {
      this.stepStatus = 'attack';
      this.lastDamage = this.healthEvolution[lastIndex - 1] - this.healthEvolution[lastIndex];
      this.ennemyMaxDamage = this.lastDamage > this.ennemyMaxDamage ? this.lastDamage : this.ennemyMaxDamage;
    }
  }

  needRetreat() {
    this.warrior.think('ennemyMaxDamage: ' + this.ennemyMaxDamage)
    if(this.warrior.health() <= this.ennemyMaxDamage + 1) {
      this.stepStatus = 'retreat';
      this.backwardMove++;
    }
  }

  canIRest() {
    if(this.backwardMove == this.restPlace) {
      this.stepStatus = 'rest';
      this.backwardMove = 0;
    } else {
      this.stepStatus = 'retreat';
      this.backwardMove++;
    }
  }

  isRested() {
    this.restedLevel = this.ennemyMaxDamage + 1;
    this.warrior.think('ma santé: ' + this.warrior.health());
    this.warrior.think('niveau de repos: ' + this.restedLevel);
    if(this.warrior.health() < this.restedLevel) {
      this.stepStatus = 'rest';
    } else {
      this.stepStatus = 'rested';
    }
  }
  
  chooseAction() {
    switch(this.stepStatus) {
      case 'go':
        this.warrior.walk();
        break;
      case 'attack':
        this.warrior.attack();
        break;
      case 'retreat':
        this.warrior.walk('backward');
        break;
      case 'rest': 
        this.warrior.rest();
        break;
      case 'rested':
        this.analyse();
        this.chooseAction();
        break;
      default:
        console.log(this.warrior.think(this.warrior));
    }
  }
  
  playTurn(warrior) {
    this.warrior = warrior;
    this.analyse();
    this.chooseAction();
    
    this.warrior.think(this.stepStatus);
  }         
}
