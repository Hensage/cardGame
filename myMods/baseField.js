card = require("./baseCard.js")
class field extends card{
    constructor(iname,icolour,ieffect,ipos,iplayer,iflip){
        super(iname,"FIELD",icolour,ieffect,ipos,iplayer,iflip);
    }
    destroyCard(){
        super.destroyCard();
        if (this.pos == 10){
            this.player.field = undefined;
        }
    }
}
module.exports = field // 👈 Export class