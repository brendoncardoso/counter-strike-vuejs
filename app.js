var vw = new Vue({
    el: '#app',
    data: {
        startGame: false,
        lose: false,
        win: false,
        draw: false,
        verifyRoundDraw: false,
        lifeMonster: 100,
        lifeFakeMonster: 100+"%",
        colorLifeMonster: "green",
        lifePlayer: 100,
        lifeFakePlayer: 100+"%",
        colorLifePlayer: "green",
        randomNumberPlayer: 0,
        randonNumberMoster: 0,
        pathSounds: '/VUEJS2/projeto-01-cs/assets/sounds/',
        enableHealing: false,
        countDown: 2,
        log: {
            description: []
        }
    },
    watch: {
        verifyRoundDraw(){
            if(this.lifePlayer <= 0 && this.lifeMonster <= 0){
                this.lifePlayer      = 0;
                this.lifeMonster     = 0;
                this.lifeFakePlayer  = "0%"
                this.lifeFakeMonster = "0%"
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
                this.lifeFakeMonster = "0%";
                vw.audioCtWin();
                this.insertDescription('blue', 'Os Contra-Terroristas Venceram');
            } 
        },
        lifePlayer(){
            if(this.lifePlayer <= 0 && this.lifeMonster > 0){
                vw.configResult(false, true, false);
            }

            this.colorLifePlayer = this.lifePlayer <= 20 ? 'red' : 'green';
            this.enableHealing   = this.lifePlayer <= 20 ?  true :  false;
            this.verifyRoundDraw = this.lifePlayer <= 0  ?  true :  false;
        },
        lifeMonster(){
            if(this.lifeMonster <= 0 && this.lifePlayer > 0){
                vw.configResult(true, false, false);
            }

            this.colorLifeMonster = this.lifeMonster <= 20 ? 'red' : 'green';
            this.verifyRoundDraw  = this.lifeMonster <= 0  ?  true :  false;
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
            var randomSound = Math.floor(Math.random() * 10)
            console.log(randomSound);
            if(randomSound == 0){
                this.executarSom('ok_lets_go.mp3');
            }else if(randomSound == 1){
                this.executarSom('go_go_go.mp3');
            }else if(randomSound == 2){
                this.executarSom('cover_me.mp3');
            }else if(randomSound == 3){
                this.executarSom('follow_me.mp3');
            }else if(randomSound == 4){
                this.executarSom('team_fall_back.mp3');
            }else if(randomSound == 5){
                this.executarSom('sector_clear.mp3');
            }else if(randomSound == 6){
                this.executarSom('enemy_spotted.mp3');
            }else if(randomSound == 7){
                this.executarSom('need_assistent.mp3');
            }else if(randomSound == 8){
                this.executarSom('get_out_of_there.mp3');
            }else if(randomSound == 9){
                this.executarSom('get_in_position.mp3');
            }
        },
        audioAttack(){
            this.executarSom('usp.mp3');
        },
        audioSpecialAttack(){
            this.executarSom('m4a1.mp3');
        },
        audioTeamDeath(){
            var randomSound = Math.floor(Math.random() * 4);
            if(randomSound == 0){
                this.executarSom('death_1.mp3');
            }else if(randomSound == 1){
                this.executarSom('death_2.mp3');
            }else if(randomSound == 2){
                this.executarSom('death_3.mp3');
            }else if(randomSound == 3){
                this.executarSom('death_4.mp3');
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
            this.lifeMonster     =  100
            this.lifeFakePlayer  =  "100%"
            this.lifeFakeMonster =  "100%"

            this.lose            = false;
            this.win             = false;
            this.draw            = false;

            this.audioPlayGame();
        },
        attackThePlayer(){
            this.randomNumberPlayer = Math.floor(Math.random() * 10);
            this.randomNumberPlayer = this.randomNumberPlayer == 0 ? 1 : this.randomNumberPlayer;

            this.lifePlayer         = this.lifePlayer - this.randomNumberPlayer
            this.lifeFakePlayer     = this.lifePlayer+"%";

            this.insertDescription('red', 'Terrorista Atingiu o Player com '+this.randomNumberPlayer+'.');
        },
        attackTheMonster(e){
            let specialAttackBasic;

            if(typeof e === "undefined"){
                specialAttackBasic = 10;
            }else{
                specialAttackBasic = 20;
            }

            this.randonNumberMoster = Math.floor(Math.random() * specialAttackBasic)
            this.randonNumberMoster = this.randonNumberMoster == 0 ? 1 : this.randonNumberMoster;

            this.lifeMonster        = this.lifeMonster - this.randonNumberMoster
            this.lifeFakeMonster    = this.lifeMonster+"%"

            this.insertDescription('blue', 'O Player Atingiu o Terrorista com '+this.randonNumberMoster+'.');
        },
        atack(){
            this.attackTheMonster();
            this.attackThePlayer();
            this.audioAttack();
        },
        specialAtack(e){
            this.attackTheMonster(e)
            this.attackThePlayer()
            this.audioSpecialAttack();
        },
        healLife(){
            var strength = Math.floor(Math.random() * 10);
            strength = strength == 0 ? 1 : strength;
            this.lifePlayer += strength;
            this.insertDescription('green', 'O Player Ganhou Força de '+strength+'.');
            this.attackTheMonster();
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