class card{
    constructor(iname,itype,icolour,ieffect,ipos,iplayer,iflip){
        this.id = token();
        this.name=iname;
        this.type=itype;
        this.effect = ieffect;
        this.colour = icolour;
        this.pos = ipos;
        //this.board = iboard;
        this.player = iplayer;
        this.flip = iflip;
    }
    revealCard(){
        this.flip=true;
        //this.onReveal();
        return true;
    }
    hideCard(){
        this.flip=false;
        return true;
    }
    moveCard(pos){
        this.pos = pos;
        this.onMove();
        return true;
    }
    destroyCard(){
        this.pos = 11;
        this.player.discard.push(this);
        this.flip = true;
        this.onDestroy();
        return true;
    }

    onStart(){
        return null;
    }
    onPlace(){
        return null;
    }
    onReveal(){
        return null;
    }
    onMove(){
        return null;
    }
    onDestroy(){
        return null;
    }
    onEnd(){
        return null;
    }
}
var token = function() {
	return (Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2));
};
module.exports = card // 👈 Export class
