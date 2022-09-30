card = require("./baseCard.js")
class trigger extends card{
    constructor(iname,icolour,ieffect,ipos,iplayer,iflip){
        super(iname,"TRIGGER",icolour,ieffect,ipos,iplayer,iflip);
        this.eventTrig= undefined;
    }
    revealCard(event){
        super.revealCard();
        this.eventTrig = event;
        
    }
    canReveal(event){
        return false;
    }
    onReveal(){
        this.destroyCard();
        return null;
    }
    destroyCard(){
        if (this.pos >= 2 && this.pos <= 6){
            this.player.trigger[this.pos-2] = null;
        }
        super.destroyCard();
    }
}
module.exports = trigger // 👈 Export class