creature = require('./baseCrea.js')
trigger = require('./baseTrig.js')
field = require('./baseField.js')
class prawling_cat extends creature{
    constructor(ipos,iplayer,iboard){
        super(['PRAWLING', 'CAT'],"GREEN","IF REVEALED AT START PHASE, +1 POWER",2,0,ipos,iplayer,iboard)
    }
    mustAct(chain){
        super.mustAct(chain);
        if (this.flip == true && chain[0][0] == "START_S"){
            return true;
        }
        return false;
    }
    onActivate(){
        super.onActivate();
        this.chgPower += 1;
        return ["POWER",this.player.getPlayerNum(),this,1]
    }
}
class cowardly_rat extends creature{
    constructor(ipos,iplayer,iboard){
        super(['COWARDLY', 'RAT'],"GREEN","WHEN REVEALED, CAN MOVE TO EMPTY COLUMN",2,0,ipos,iplayer,iboard)
    }
    async onReveal(){
        super.onReveal();
        let options = this.player.getCreaturesPlaces(false);
        options.push([this.player.sock.id,this.pos])
        let input = await this.player.getInput(true,"pickPos",{"poss":options,"optional":false});
        console.log(input);
        if (input[1] >= 7 && input[1] <= 9 && input[0] == this.player.sock.id){
            this.player.creature[this.pos-7] = null;
            this.moveCard(input[1]);
            if (this.player.creature[input[1]-7] == null){
                this.player.creature[input[1]-7] = this;
            }
        }
        return null;
    }

}
class pack_raccoon extends creature{
    constructor(ipos,iplayer,iboard){
        super(['PACK', 'RACCOON'],"BLUE","WHEN REVEALED, SEARCH 1 RACCOON",3,0,ipos,iplayer,iboard)
    }
    async onReveal(){
        super.onReveal();
        await this.player.add(this.player.deck,{"sname":"RACCOON"});
        return null;
    }
}
class tiny_insect extends creature{
    constructor(ipos,iplayer,iboard){
        super(['TINY', 'INSECT'],"GREEN","CANNOT BE DESTROYED BY POWER LEVEL ABOVE 9",1,0,ipos,iplayer,iboard)
    }
    onBattle(){
        if (enemy.power>=this.power && enemy.power <= 9){
            super.destroyCard();
        }
    }
}
class trash_raccoon extends creature{
    constructor(ipos,iplayer,iboard){
        super(['TRASH', 'RACCOON'],"BROWN","WHEN REVEALED, ADD 1 CARD FROM GRAVE",4,0,ipos,iplayer,iboard)
    }
    async onReveal(){
        super.onReveal();
        await this.player.add(this.player.discard,{});
        return null;
    }
}
class swarm_insect extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SWARM', 'INSECT'],"BROWN","WHEN REVEALED, SUMMON AS MANY SWARM INSECTS FROM YOUR DECK TO ANY EMPTY CREATURE ZONE AS POSSIBLE",1,0,ipos,iplayer,iboard)
    }
}
class prawling_tiger extends creature{
    constructor(ipos,iplayer,iboard){
        super(['PRAWLING', 'TIGER'],"GREEN","WHEN REVEALED, ADD ANY BONUS POWER FROM TRIBUTE CREATURE. IF REVEALED AT START PHASE, +1 POWER",6,1,ipos,iplayer,iboard)
    }
}
class scouting_meerkat extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SCOUTING', 'MEERKAT'],"GREEN","WEHN REVEALED, PEEK AT ONE SET CARD IN A OPPONENT TRIGGER ZONE",3,0,ipos,iplayer,iboard)
    }
}
class mother_bear extends creature{
    constructor(ipos,iplayer,iboard){
        super(['MOTHER', 'BEAR'],"RED","WEHN REVEALED, SUMMON A BABY BEAR FROM DECK. IF NO BABY BEAR IN ONE OF YOUR ADJACENT CREATURE ZONE, DESTROY THIS CARD",12,1,ipos,iplayer,iboard)
    }
}
class baby_bear extends creature{
    constructor(ipos,iplayer,iboard){
        super(['BABY', 'BEAR'],"RED","",1,0,ipos,iplayer,iboard)
    }
}
class eggeater_snake extends creature{
    constructor(ipos,iplayer,iboard){
        super(['EGGEATER', 'SNAKE'],"RED","WHEN REVEALED, DESTROY ONE CREATURES WITH LESS THAN 4 POWER LEVEL",7,1,ipos,iplayer,iboard)
    }
}
class eggeater_dinosaur extends creature{
    constructor(ipos,iplayer,iboard){
        super(['EGGEATER', 'DINOSAUR'],"RED","WHEN REVEALED, DESTROY ALL CREATURES WITH LESS THAN 5 POWER LEVEL",10,2,ipos,iplayer,iboard)
    }
}
class lone_wolf extends creature{
    constructor(ipos,iplayer,iboard){
        super(['LONE', 'WOLF'],"RED","IF NOT ONLY CREATURE YOU CONTROL, DESTROY THIS CARD",10,1,ipos,iplayer,iboard)
    }
}
class sticky_spider extends creature{
    constructor(ipos,iplayer,iboard){
        super(['STICKY', 'SPIDER'],"YELLOW","WHEN REVEALED, TARGET 1 CREATURE. THAT CREATURE CANNOT CHANGE ZONE",2,0,ipos,iplayer,iboard)
    }
}
class angered_mongoose extends creature{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'MONGOOSE'],"RED","",4,0,ipos,iplayer,iboard)
    }
}
class angered_jackal extends creature{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'JACKAL'],"RED","",8,1,ipos,iplayer,iboard)
    }
}
class angered_rhino extends creature{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'RHINO'],"RED","",12,2,ipos,iplayer,iboard)
    }
}
class angered_lion extends creature{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'LION'],"RED","",16,3,ipos,iplayer,iboard)
    }
}
class scary_lion extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SCARY', 'LION'],"RED","WHEN REVEALED, RETURN ALL OTHER CREATURES TO OWNERS HANDS",11,3,ipos,iplayer,iboard)
    }
}
class baby_lion extends creature{
    constructor(ipos,iplayer,iboard){
        super(['BABY', 'LION'],"RED","TREATED AS 2 TRIBUTE FOR LION",3,0,ipos,iplayer,iboard)
    }
}
class sapping_snake extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SAPPING', 'SNAKE'],"YELLOW","WHEN REVEALED, SWAP POWER WITH A FACEUP CREATURE",4,1,ipos,iplayer,iboard)
    }
}
class poisonous_snake extends creature{
    constructor(ipos,iplayer,iboard){
        super(['POSIONOUS', 'SNAKE'],"YELLOW","WHEN REVEALED, TARGET 1 FACEUP CREATURE. THAT CREATURE LOSES 1 POWER EVERY START PHASE",2,0,ipos,iplayer,iboard)
    }
}
class mystery_egg extends creature{
    constructor(ipos,iplayer,iboard){
        super(['MYSTERY', 'EGG'],"GREEN","IF DESTROYED THIS TURN, AT END PHASE, SUMMON ANY 0 TRIBUTE MONSTER FROM YOUR DECK",0,1,ipos,iplayer,iboard)
    }
}
class hatching_egg extends creature{
    constructor(ipos,iplayer,iboard){
        super(['HATCHING', 'EGG'],"GREEN","IF DESTROYED THIS TURN, AT END PHASE, FREE SUMMON ANY 0/1 TRIBUTE MONSTER FROM YOUR HAND",0,0,ipos,iplayer,iboard)
    }
}
class clapping_sealion extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CLAPPING', 'SEALION'],"YELLOW","ALL CREATURES YOU CONTROL GET +3 POWER",1,0,ipos,iplayer,iboard)
    }
}
class rabid_fox extends creature{
    constructor(ipos,iplayer,iboard){
        super(['RABID', 'FOX'],"RED","DESTROY THIS CARD AT THE END PHASE",7,0,ipos,iplayer,iboard)
    }
}
class shy_mole extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SHY', 'MOLE'],"GREEN","DURING THE END PHASE, HIDE THIS CARD",4,0,ipos,iplayer,iboard)
    }
}
class controlling_parasite extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CONTROLLING', 'PARASITE'],"YELLOW","WHEN REVEALED, DESTROY THIS CARD, TAKE CONTROL OF 1 CREATURE YOUR OPPONENT CONTROLS. RETURN CONTROL AT END PHASE",0,0,ipos,iplayer,iboard)
    }
}
class charging_insect extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CHARGING', 'DUNGBETTLE'],"RED","WHEN REVEALED, +3 POWER UNTIL END PHASE",2,0,ipos,iplayer,iboard)
    }
}
class charging_bull extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CHARGING', 'BULL'],"RED","WHEN REVEALED, +5 POWER UNTIL END PHASE",5,1,ipos,iplayer,iboard)
    }
}
class charging_rhino extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CHARGING', 'RHINO'],"RED","WHEN REVEALED, +7 POWER UNTIL END PHASE",8,2,ipos,iplayer,iboard)
    }
}
class crying_lamb extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CRYING', 'LAMB'],"BLUE","WHEN REVEALED, DRAW 1 CARD",1,0,ipos,iplayer,iboard)
    }
}
class laughing_hyena extends creature{
    constructor(ipos,iplayer,iboard){
        super(['LAUGHING', 'HYENA'],"YELLOW","WHEN REVEALED, CAN MOVE 1 OPPONENT CREATURE INTO THIS COLUMN",7,1,ipos,iplayer,iboard)
    }
}
class cheeky_hyena extends creature{
    constructor(ipos,iplayer,iboard){
        super(['CHEEKY', 'HYENA'],"YELLOW","WHEN REVEALED, ADD 1 CHEEKY CARD TO HAND",3,0,ipos,iplayer,iboard)
    }
}
class digging_dog extends creature{
    constructor(ipos,iplayer,iboard){
        super(['DIGGING', 'DOG'],"BROWN","WHEN REVEALED, ADD 1 DINOSAUR OR UNDEAD CREATURE FROM GRAVE TO HAND",1,0,ipos,iplayer,iboard)
    }
}
class undead_pig extends creature{
    constructor(ipos,iplayer,iboard){
        super(['UNDEAD', 'PIG'],"BROWN","WHEN REVEALED, CAN SUMMON 1 UNDEAD FROM GRAVE. DESTROY THIS CARD AT THE END PHASE",5,1,ipos,iplayer,iboard)
    }
}
class undead_crow extends creature{
    constructor(ipos,iplayer,iboard){
        super(['UNDEAD', 'CROW'],"BROWN","WHEN REVEALED, CAN SUMMON 1 UNDEAD FROM GRAVE. DESTROY THIS CARD AT THE END PHASE",1,0,ipos,iplayer,iboard)
    }
}
class undead_eagle extends creature{
    constructor(ipos,iplayer,iboard){
        super(['UNDEAD', 'EAGLE'],"BROWN","WHEN REVEALED, CAN PLACE 1 TRIGGER CARD FROM GRAVE IN YOUR TRIGGER ZONE. DESTROY THIS CARD AT THE END PHASE",7,2,ipos,iplayer,iboard)
    }
}
class rabid_bear extends creature{
    constructor(ipos,iplayer,iboard){
        super(['RABID', 'BEAR'],"RED","DESTROY THIS CARD AT THE END PHASE",11,1,ipos,iplayer,iboard)
    }
}
class recycling_pig extends creature{
    constructor(ipos,iplayer,iboard){
        super(['RECYCLING', 'PIG'],"BLUE","WHEN REVEALED, DRAW 1 CARD, DISCARD 1 CARD",2,0,ipos,iplayer,iboard)
    }
}
class sucking_anteater extends creature{
    constructor(ipos,iplayer,iboard){
        super(['SUCKING', 'ANTEATER'],"BLUE","WHEN REVEALED, DISCARD 1 RANDOM OPPONENTS CARD",6,1,ipos,iplayer,iboard)
    }
}
class rightous_eagle extends creature{
    constructor(ipos,iplayer,iboard){
        super(['RIGHTOUS', 'EAGLE'],"YELLOW","WHEN REVEALED, SHUFFLE 1 CARD FROM GRAVE INTO DECK",8,1,ipos,iplayer,iboard)
    }
}
class egglaying_spider extends creature{
    constructor(ipos,iplayer,iboard){
        super(['EGGLAYING', 'SPIDER'],"BLUE","WHEN THIS CARD DESTROYS CREATURE, DRAW 1 CARD",7,1,ipos,iplayer,iboard)
    }
}
class long_swordfish extends creature{
    constructor(ipos,iplayer,iboard){
        super(['LONG', 'SWORDFISH'],"RED","CAN BATTLE ANY MONSTER",6,1,ipos,iplayer,iboard)
    }
}
class chunky_food extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['CHUNKY', 'FOOD'],"RED","WHEN CREATURE ATTACKED, +4 POWER TO YOUR CREATURE UNTIL END PHASE",ipos,iplayer,iboard)
    }
}
class fast_food extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['FAST', 'FOOD'],"GREEN","WHEN CREATURE PLACED, MOVE TO DIFFERENT COLUMN",ipos,iplayer,iboard)
    }
}
class rightous_rebirth extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['RIGHTOUS', 'REBIRTH'],"YELLOW","WHEN CARD MOVED FROM GRAVE, SHUFFLE ALL GRAVES INTO DECKS",ipos,iplayer,iboard)
    }
}
class angered_stampede extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'STAMPEDE'],"RED","WHEN YOUR RED CREATURE REVEALED, SUMMON 1 ANGERED CREATURE FROM DECK",ipos,iplayer,iboard)
    }
}
class quick_death extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['QUICK', 'DEATH'],"BROWN","WHEN YOUR CREATURE REVEALED, DESTROY IT",ipos,iplayer,iboard)
    }
    onReveal(){
        super.onReveal();
        for (let i = this.eventTrig.length-1;i>=0;i--){
            if (this.eventTrig[i][0]=="REVEAL" && this.eventTrig[i][2].player.sock.id == this.player.sock.id && this.eventTrig[i][2].type == "CREATURE"){
                this.eventTrig[i][2].destroyCard();
                return ["DESTROY",this.eventTrig[i][1],this.eventTrig[i][2]];
            }
        }
        return null        
    }
    canReveal(events){
        //console.log(events);
        for (let e = events.length-1;e>=0;e--){
            console.log(events[e]);
            if (events[e][0]=="REVEAL" && events[e][2].player.sock.id == this.player.sock.id){
                return true;
            }
        }
        return false;
    }
}
class undead_rebirth extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['UNDEAD', 'REBIRTH'],"BROWN","DISCARD 1 BROWN CARD",ipos,iplayer,iboard)
    }
}
class cheeky_foresight extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['CHEEKY', 'FORESIGHT'],"GREEN","WHEN CARD PLACED, PEEK AT CARD",ipos,iplayer,iboard)
    }
}
class triggering_trade extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['TRIGGERING', 'TRADE'],"GREEN","WHEN TRIGGER CARD PLACED, SWAP CARD WITH ONE OF YOUR PLACED TRIGGER CARDS",ipos,iplayer,iboard)
    }
}
class sobering_food extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['SOBERING', 'TRADE'],"YELLOW","WHEN CREATURES POWER CHANGES, RESET TO ORGINAL",ipos,iplayer,iboard)
    }
}
class friendly_species extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['FRIENDLY', 'SPECIES'],"GREEN","WHEN CREATURE REVEALED, SUMMON CREATURE WITH SAME SECOND NAME, RETURN ORGINAL CREATURE TO DECK IF STILL FACEUP",ipos,iplayer,iboard)
    }
}
class clashing_adjectives extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['CLASHING', 'ADJECTIVES'],"GREEN","WHEN CARD REVEALED, ADD TO HAND 1 CARD WITH SAME FIRST NAME",ipos,iplayer,iboard)
    }
}
class shy_animal extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['SHY', 'ANIMAL'],"GREEN","AT THE START PHASE, FLIP 1 CREATURE FACEDOWN",ipos,iplayer,iboard)
    }
}
class freezing_food extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['FREEZING', 'FOOD'],"GREEN","WHEN FOOD CARD SENT TO GRAVE, ADD CARD TO HAND",ipos,iplayer,iboard)
    }
}
class tall_grass extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['TALL', 'GRASS'],"GREEN","WHEN A GREEN CREATURE IS SENT TO THE GRAVE, ADD CARD TO HAND",ipos,iplayer,iboard)
    }
}
class poisonous_fangs extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['POISONOUS', 'FANGS'],"YELLOW","WHEN POISONOUS CREATURE IS REVEALED, APPLY ITS EFFECT TO ALL OPPONENTS CREATURES",ipos,iplayer,iboard)
    }
}
class cheeky_mixup extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['CHEEKY', 'MIXUP'],"GREEN","WHEN A CREATURE IS PLACED, PICK UP ALL FACEDOWN CREATURES. PLACE THEM BACK DOWN IN ANY COLUMN",ipos,iplayer,iboard)
    }
}
class stop_sign extends trigger{
    constructor(ipos,iplayer,iboard){
        super(['STOP', 'SIGN'],"RED","WHEN A CREATURE IS MOVED, MOVE THAT CREATURE TO ANY COLUMN",ipos,iplayer,iboard)
    }
}
class fenced_field extends field{
    constructor(ipos,iplayer,iboard){
        super(['FENCED', 'FIELD'],"YELLOW","WHEN REVEALED, TARGET 1 EMPTY COLUMN, NO CREATURES CAN BE MOVED OR PLACED THERE",ipos,iplayer,iboard)
    }
}
class angered_chaos extends field{
    constructor(ipos,iplayer,iboard){
        super(['ANGERED', 'CHAOS'],"RED","ALL ANGERED CREATURS GAIN THIS EFFECT: 'WHEN THIS CARD DESTROYS A CREATURE, SUMMON 1 ANGERED CREATURE FROM DECK'",ipos,iplayer,iboard)
    }
}
class anicent_foresight extends field{
    constructor(ipos,iplayer,iboard){
        super(['ANICENT', 'FORESIGHT'],"BLUE","WHEN YOU DRAW CARD FOR START PHASE, DRAW 2, RETURN 1",ipos,iplayer,iboard)
    }
}
class undead_gamble extends field{
    constructor(ipos,iplayer,iboard){
        super(['UNDEAD', 'GAMBLE'],"BROWN","AT THE START PHASE, MILL THE TOP CARD OF YOUR DECK",ipos,iplayer,iboard)
    }
}
class green_flame extends field{
    constructor(ipos,iplayer,iboard){
        super(['GREEN', 'FLAME'],"GREEN","IF 3 GREEN CREATURES YOU CONTROL ARE FLIPPED UP AT BATTLE PHASE, DEAL 2 DAMAGE TO YOUR OPPONENT",ipos,iplayer,iboard)
    }
}
module.exports = {
prawling_cat,cowardly_rat,pack_raccoon,tiny_insect,trash_raccoon,swarm_insect,prawling_tiger,scouting_meerkat,mother_bear,baby_bear,eggeater_snake,eggeater_dinosaur,lone_wolf,sticky_spider,angered_mongoose,angered_jackal,angered_rhino,angered_lion,scary_lion,baby_lion,sapping_snake,poisonous_snake,mystery_egg,hatching_egg,clapping_sealion,rabid_fox,shy_mole,controlling_parasite,charging_insect,charging_bull,charging_rhino,crying_lamb,laughing_hyena,cheeky_hyena,digging_dog,undead_pig,undead_crow,undead_eagle,rabid_bear,recycling_pig,sucking_anteater,rightous_eagle,egglaying_spider,long_swordfish,chunky_food,fast_food,rightous_rebirth,angered_stampede,quick_death,undead_rebirth,cheeky_foresight,triggering_trade,sobering_food,friendly_species,clashing_adjectives,shy_animal,freezing_food,tall_grass,poisonous_fangs,cheeky_mixup,stop_sign,fenced_field,angered_chaos,anicent_foresight,undead_gamble,green_flame}