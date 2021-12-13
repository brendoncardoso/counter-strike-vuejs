var vw = new Vue({
    el: '#app',
    data: {
        startGame: false,
        lose: false,
        win: false,
        draw: false,
        verifyRoundDraw: false,
        lifeTerrorist: 100,
        lifeFakeTerrorist: "100%",
        colorLifeTerrorist: "green",
        lifePlayer: 100,
        lifeFakePlayer: "100%",
        colorLifePlayer: "green",
        randomNumberPlayer: 0,
        randonNumberTerrorist: 0,
        pathSounds: '/counter-strike-vuejs/assets/sounds/',
        enableHealing: false,
        countDown: 2,
        log: {
            description: []
        },
        damage: 0,
        randomNumberPlayerHeadShot: 0,
        randomNumberTerroristHeadShot: 0,
        randomSound: 0,
    },
    watch: {
        verifyRoundDraw(){
            if(this.lifePlayer <= 0 && this.lifeTerrorist <= 0){
                this.lifePlayer      = 0;
                this.lifeTerrorist     = 0;
                this.lifeFakePlayer  = "0%"
                this.lifeFakeTerrorist = "0%"
                this.draw            = true;
                this.startGame       = false;
                vw.audioRoundDraw();
                this.insertDescription(null, 'Round Empatado');
            }
        },
        lose(){
            if(this.lose == true){
                this.lifeFakePlayer = "0%";
                vw.audiotWin()
                this.insertDescription('red', 'Os Terroristas Venceram');
            } 
        },
        win() {
            if(this.win == true){
                this.lifeFakeTerrorist = "0%";
                vw.audioCtWin();
                this.insertDescription('blue', 'Os Contra-Terroristas Venceram');
            } 
        },
        lifePlayer(){
            if(this.lifePlayer <= 0 && this.lifeTerrorist > 0){
                vw.configResult(false, true, false);
            }

            this.colorLifePlayer = this.lifePlayer <= 20 ? 'red' : 'green';
            this.enableHealing   = this.lifePlayer <= 20 ?  true :  false;
            this.verifyRoundDraw = this.lifePlayer <= 0  ?  true :  false;
        },
        lifeTerrorist(){
            if(this.lifeTerrorist <= 0 && this.lifePlayer > 0){
                vw.configResult(true, false, false);
            }

            this.colorLifeTerrorist = this.lifeTerrorist <= 20 ? 'red' : 'green';
            this.verifyRoundDraw  = this.lifeTerrorist <= 0  ?  true :  false;
        }
    },
    methods: {
         /* ****************** Áudio do Game **********************/
        executarSom(arquivoSom) {
            var audio = new Audio(this.pathSounds+arquivoSom);
            audio.play();
        },
        audioCtWin(){
            this.executarSom('ct_win.mp3');
        },
        audiotWin(){
            this.executarSom('t_win.mp3');
        },
        audioRoundDraw(){
            this.executarSom('round_draw.mp3');
        },
        audioPlayGame(){
            this.executarSom('pick_up.mp3');
        },
        audioRadioGame(){
            this.randomSound = Math.floor(Math.random() * 11)
            if(this.randomSound == 0){
                this.executarSom('ok_lets_go.mp3');
            }else if(this.randomSound == 1){
                this.executarSom('go_go_go.mp3');
            }else if(this.randomSound == 2){
                this.executarSom('lets_move_out.mp3');
            }else if(this.randomSound == 3){
                this.executarSom('cover_me.mp3');
            }else if(this.randomSound == 4){
                this.executarSom('follow_me.mp3');
            }else if(this.randomSound == 5){
                this.executarSom('team_fall_back.mp3');
            }else if(this.randomSound == 6){
                this.executarSom('sector_clear.mp3');
            }else if(this.randomSound == 7){
                this.executarSom('enemy_spotted.mp3');
            }else if(this.randomSound == 8){
                this.executarSom('need_assistent.mp3');
            }else if(this.randomSound == 9){
                this.executarSom('get_out_of_there.mp3');
            }else if(this.randomSound == 10){
                this.executarSom('get_in_position.mp3');
            }
        },
        audioHeadShot(){
            /*this.randomSound = Math.floor(Math.random() * 4);
            if(this.randomSound == 0){
                this.executarSom('hs_healm_one.mp3');
            }else if(this.randomSound == 1){
                this.executarSom('hs_healm_two.mp3');
            }else if(this.randomSound == 2){
                this.executarSom('hs_healm_three.mp3');
            }else if(this.randomSound == 3){
                this.executarSom('hs_healm_four.mp3');
            }*/

            this.executarSom('hs_healm_four.mp3');
            var soundHeadShot = setInterval(() => {
                this.executarSom('headshot.mp3');
                clearInterval(soundHeadShot);
            }, 300);

        },
        audioAttack(){
            this.executarSom('usp.mp3');
        },
        audioSpecialAttack(){
            this.executarSom('m4a1.mp3');
        },
        audioTeamDeath(){
            this.randomSound = Math.floor(Math.random() * 4);
            if(this.randomSound == 0){
                this.executarSom('death_one.mp3');
            }else if(this.randomSound == 1){
                this.executarSom('death_two.mp3');
            }else if(this.randomSound == 2){
                this.executarSom('death_three.mp3');
            }else if(this.randomSound == 3){
                this.executarSom('death_four.mp3');
            }
        },
        audioPlayHeal(){
            this.executarSom('heal.mp3');
            this.audioAttack();
        },

        /* ****************** Configuração/Ação do Game **********************/
        configResult(win, lose, startGame){
            this.win            = win;
            this.lose           = lose;
            this.startGame      = startGame;

            this.audioTeamDeath();
        },
        countDownTimer() {
            if(this.countDown > 0) {
                setTimeout(() => {
                    this.countDown -= 1
                    this.countDownTimer()
                }, 1000)
            }else if(this.countDown == 0){
                this.audioRadioGame();
            }
        },
        insertDescription(color, description){
            
            if(color == null){
                color = 'black';
            }

            this.log.description.push([color, description]);
        },
        playGame(){
            this.countDown       = 2;
            this.countDownTimer();

            this.log.description = [];
            this.insertDescription(null, 'A Partida Começou!');
            this.startGame       = this.startGame == false ? true : false;

            this.lifePlayer      =  100
            this.lifeTerrorist     =  100
            this.lifeFakePlayer  =  "100%"
            this.lifeFakeTerrorist =  "100%"

            this.lose            = false;
            this.win             = false;
            this.draw            = false;

            this.audioPlayGame();
        },
        actionHeadShot(){
            this.damage = 100;
            this.audioHeadShot();
        },
        attackThePlayer(){
            this.randomNumberPlayerHeadShot = Math.floor(Math.random() * 501);

            if(this.randomNumberPlayerHeadShot == 499){
                this.actionHeadShot();
            }else{
                this.damage = Math.floor(Math.random() * 10);
            }

            this.randomNumberPlayer = this.damage;
            this.randomNumberPlayer = this.randomNumberPlayer == 0 ? 1 : this.randomNumberPlayer;

            this.lifePlayer         = this.lifePlayer - this.randomNumberPlayer
            this.lifeFakePlayer     = this.lifePlayer+"%";

            this.insertDescription('red', 'Terrorista Atingiu o Player com '+this.randomNumberPlayer+' de Dano.');
        },
        attackTheTerrorist(e){
            this.randomNumberTerroristHeadShot = Math.floor(Math.random() * 501);

            let specialAttackBasic;

            if(typeof e === "undefined"){
                specialAttackBasic = 10;
            }else{
                specialAttackBasic = 20;
            }

            if(this.randomNumberTerroristHeadShot == 499){
                this.actionHeadShot();
            }else{
                this.damage = Math.floor(Math.random() * specialAttackBasic)
            }

            this.randonNumberTerrorist = this.damage;
            this.randonNumberTerrorist = this.randonNumberTerrorist == 0 ? 1 : this.randonNumberTerrorist;

            this.lifeTerrorist        = this.lifeTerrorist - this.randonNumberTerrorist
            this.lifeFakeTerrorist    = this.lifeTerrorist+"%"

            this.insertDescription('blue', 'Player Atingiu o Terrorista com '+this.randonNumberTerrorist+' de Dano.');
        },
        atack(){
            this.attackTheTerrorist();
            this.attackThePlayer();
            this.audioAttack();
        },
        specialAtack(e){
            this.attackTheTerrorist(e)
            this.attackThePlayer()
            this.audioSpecialAttack();
        },
        healLife(){
            var strength = Math.floor(Math.random() * 10);
            strength = strength == 0 ? 1 : strength;
            this.lifePlayer += strength;
            this.insertDescription('green', 'Player Ganhou Força de '+strength+'.');
            this.attackTheTerrorist();
            this.attackThePlayer()
            this.audioPlayHeal();
        },
        quit(){
            this.win             = false;
            this.lose            = true;
            this.draw            = false;
            this.startGame       = false;
        }
    }
})