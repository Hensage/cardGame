card = require("./baseCard.js")
class creature extends card{
    constructor(iname,icolour,ieffect,ipow,itrib,ipos,iplayer,iflip){
        super(iname,"CREATURE",icolour,ieffect,ipos,iplayer,iflip);
        //this.power = ipow;
        this.orgiPower = ipow;
        this.chgPower = 0;
        this.trib = itrib;
        this.activated = false;
    }
    changePower(inc){
        this.chgPower += inc;
        return true;
    }
    onBattle(enemy){
        console.log(enemy);
        if (enemy.orgiPower+enemy.chgPower>=this.orgiPower+this.chgPower){
            //this.destroyCard();
            return true;
        }
        return false;
    }
    destroyCard(){
        this.chgPower = 0;
        if (this.pos >= 7 && this.pos <= 9){
            this.player.creature[this.pos-7] = null;
        }else{
            console.log(this.pos);
        }
        super.destroyCard();
    }
    onActivate(){
        return null;
    }
    mustAct(chain){
        return false;
    }
}
module.exports = creature // 👈 Export class