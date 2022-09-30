// JavaScript Document
const tls = require('tls');
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
const express = require('express');
const { PassThrough } = require('stream');
const e = require('express');
var username;
var fs = require('fs');
const { time } = require('console');
const { response } = require('express');
var app = express();
const http = require('http').Server(app);
//var https = require('https');
var privateKey  = fs.readFileSync('sslcert/domain.key', 'utf8');
var certificate = fs.readFileSync('sslcert/domain.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.Server(credentials, app);
const io = require('socket.io')(http);

app.use(express.static('static'));
app.use(express.json());
const router = express.Router();
app.use('/', router);
var savedResponse;
router.get('/', (req, res) => {
	res.sendFile(__dirname + '/templates/board.html'); //Serves the file
});
/*
app.post('/', (req, res)=>{

	let token = req.body.token;
	async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  //console.log(payload)
	}
	verify().catch(console.error);
})
*/

cl = require("./myMods/cardList");

class user{
	constructor(sock){
		this.sock =sock; //Players socket id
		this.health = 50;
		this.timeCheck = new Date()
		this.deck = [new cl.quick_death(1,this,false),new cl.quick_death(1,this,false),new cl.quick_death(1,this,false),new cl.prawling_cat(1,this,false),new cl.charging_bull(1,this,false),new cl.pack_raccoon(1,this,false),new cl.pack_raccoon(1,this,false),new cl.pack_raccoon(1,this,false),new cl.cowardly_rat(1,this,false),new cl.cowardly_rat(1,this,false),new cl.trash_raccoon(1,this,false),new cl.trash_raccoon(1,this,false)]
		this.deck = shuffle(this.deck);
		this.hand = []
		this.trigger = [null,null,null,null,null]
		this.creature = [null,null,null]
		this.field = undefined;
		this.discard = []
		this.placedCreature = false;
		this.textState = 0;
	}
	async draw(num){
		for (let i=0;i<num;i++){
			if (this.hand.length < 6 && this.deck.length != 0){
				let temp = this.deck.pop()
				//io.to(this.sock.id).emit("adHand",temp);
				this.hand.push(temp)
				temp.pos = 0;
			}
		}
		chain.push(["DRAW",users.indexOf(this)]);
		await handleChain(users.indexOf(this));
		updateBoard();
	}
	async place(card,handpos,pos){
		this.hand.splice(handpos,1);
		if (card.type=="CREATURE"){
			card.pos = 7+pos;
		}else if (card.type=="TRIGGER"){
			card.pos = 2+pos;
		}else if (card.type=="FIELD"){
			card.pos = 10;
		}
		chain.push(["PLACE",users.indexOf(this),card]);
		await handleChain(users.indexOf(this));
		//console.log(card.pos);
		card.flip = false;
		updateBoard();
		//io.to(this.sock.id).emit("updateBoard",hideData(this.sock.id));

	}
	async add(pile,json){
		if (this.hand.length < 6){
			let indexs = this.filterCards(pile,json);
			if (indexs.length > 0){
				let sjson  = {};
				for (let i = 0; i< indexs.length;i++){
					sjson[pile[indexs[i]].id] = {
										"name":pile[indexs[i]].name,
										"type":pile[indexs[i]].type,
										"colour":pile[indexs[i]].colour,
										"effect":pile[indexs[i]].effect,
										"player":this.sock.id,
										"flip":true
										}
					if (pile[indexs[i]].type=="CREATURE"){
						sjson[pile[indexs[i]].id]["power"] = pile[indexs[i]].power;
						sjson[pile[indexs[i]].id]["trib"] = pile[indexs[i]].trib;
					}
				}
				let cid = await SyncEmit(this.sock,"cardView",sjson);
				console.log(cid);
				var p = pile.filter(obj => {
					return obj.id === cid;
				});
				this.hand.push(p[0]);
				p[0].flip = true;
				chain.push(["ADD",users.indexOf(this),p[0]]);
				await handleChain(users.indexOf(this));
				p[0].pos = 0;
				pile.splice(pile.indexOf(p[0]),1);
				pile = shuffle(pile);
				updateBoard();
				p[0].flip = false;
			}
		}
		
	}
	filterCards(pile,json){
		let indexs = [...Array(pile.length).keys()];
		if (json["colour"]){
			for (let i = 0;i<pile.length;i++){
				if (pile[i].colour !=json["colour"]){
					indexs.splice(indexs.indexOf(i),1)
				}
			}
		}
		if (json["type"]){
			for (let i = 0;i<pile.length;i++){
				if (pile[i].type !=json["type"]){
					indexs.splice(indexs.indexOf(i),1)
				}
			}
		}
		if (json["fname"]){
			for (let i = 0;i<pile.length;i++){
				if (pile[i].name[0] !=json["fname"]){
					indexs.splice(indexs.indexOf(i),1)
				}
			}
		}
		if (json["sname"]){
			for (let i = 0;i<pile.length;i++){
				if (pile[i].name[1] !=json["sname"]){
					indexs.splice(indexs.indexOf(i),1)
				}
			}
		}
		return indexs;
	}
	getHand(){
		let handIDs = [];
		for (let i =0;i<this.hand.length;i++){
			if (this.hand[i].type!="CREATURE" || this.placedCreature==false){
				let good = true;
				if (this.hand[i].type=="CREATURE"){
					if (this.hand[i].trib>this.getCreatures().length){
						good = false;
					}
				}
				if (good){
					handIDs.push(this.hand[i].id);
				}
			}
		}
		return handIDs;
	}
	getCreaturesPlaces(filled){
		let poss = [];
		for (let i =0;i<3;i++){
			if ((this.creature[i] == null && !filled) || (this.creature[i] != null && filled)){
				poss.push([this.sock.id,i+7]);
			}
		}
		return poss;
	}
	getCreatures(){
		let poss = [];
		for (let i =0;i<3;i++){
			if (this.creature[i] != null){
				poss.push(this.creature[i].id);
			}
		}
		return poss;
	}
	getTriggersPlaces(filled){
		let poss = [];
		for (let i =0;i<5;i++){
			if ((this.trigger[i] == null && !filled) || (this.trigger[i] != null && filled)){
				poss.push([this.sock.id,i+2]);
			}
		}
		return poss;
	}
	getTriggers(){
		let poss = [];
		for (let i =0;i<3;i++){
			if (this.trigger[i] != null){
				poss.push(this.trigger[i].id);
			}
		}
		return poss;
	}
	getPlayerNum(){
		if (users[0].sock.id == this.sock.id){
			return 0;
		}
		return 1;
	}
	async getInput(me,event,data){
		let input;
		if (me){
			input = await SyncEmit(this.sock,event,data);
		}else{
			input = await SyncEmit(users[1-this.getPlayerNum()].sock,event,data);
		}
		return input;
	}
}

var users = [];
//var gameState = [-1,-1];
var worldState = 0;
var chain = [];
var tempChain = [];
/*
GAMESTATE
1 = PLACE
*/
async function gameStart(){
	worldState=0;
	io.emit("phaseChange",worldState);
	if (Math.floor(Math.random()*2)==1){
		temp = users[0];
		users[0]=users[1];
		users[1]=temp;
	}
	console.log("STARTING")
	await users[0].draw(4);
	await users[1].draw(4);
	while (true){
		io.to(users[0].sock.id).emit("startTurn",true);
		io.to(users[1].sock.id).emit("startTurn",false);
		chain.push(["START_S",0]);
		await handleChain(0);
		worldState=1;
		io.emit("phaseChange",worldState);
		chain.push(["PLACE_S",0]);
		await handleChain(0);
		await placing()
		worldState=2;
		io.emit("phaseChange",worldState);
		chain.push(["MOVE_S",0]);
		await handleChain(0);
		await sleep(500);
		await moveStage()
		console.log("Easy");
		worldState=3;
		io.emit("phaseChange",worldState);
		chain.push(["REVEAL_S",0]);
		await handleChain(0);
		await sleep(500);
		await revealStage()
		console.log("BATTLE");
		worldState=4;
		io.emit("phaseChange",worldState);
		chain.push(["BATTLE_S",0]);
		await handleChain(0);
		await sleep(500);
		await battleStage()
		worldState=5;
		io.emit("phaseChange",worldState);
		chain.push(["END_S",0]);
		await handleChain(0);
		unActCrea();
		console.log("END PHASE");
		worldState=0;
		io.emit("phaseChange",worldState);
		await users[1].draw(1);
		let temp = users[0];
		users[0] = users[1];
		users[1] = temp;
	}
}
async function placing(){
	let tnum = 0;
	let tStates = [1,0];
	updateStatus(0,1);
	while (true){
		//let response = await SyncEmit(users[tnum].sock,"pickPlace","");
		let cardID = await SyncEmit(users[tnum].sock,"pickCard",{"ids":users[tnum].getHand(),"optional":true});
		console.log(cardID);
		if (cardID == "skip"){
			if (tStates[tnum] == 1){
				console.log(tStates[1-tnum]);
				if (tStates[1-tnum]==2){
					console.log("breakLegs")
					updateStatus(0,3);
					updateStatus(1,3);
					tStates = [2,2];
					break;
					//revealStage();
				}else{
					updateStatus(tnum,2);
					updateStatus(1-tnum,1);
					tStates[tnum] = 2;
					tStates[1-tnum] = 1;
					tnum = 1-tnum;
					//io.to(users[1-tnum].sock.id).emit("pickPlace","")
				}
			}
		}else{
			var p = users[tnum].hand.filter(obj => {
				return obj.id === cardID;
			});

			let poss = [];
			if (p[0].type == "TRIGGER"){
				poss = users[tnum].getTriggersPlaces(false);
			}else if (p[0].type == "CREATURE"){
				poss = users[tnum].getCreaturesPlaces(false);
			}
			let tributed = true;
			if (p[0].type == "CREATURE" && !users[tnum].placedCreature){
				if (p[0].trib <= users[tnum].getCreatures().length){
					for (let i=0;i<p[0].trib;i++){
						let movedCreature = 255;
						let loop = true;
						while (loop){
							let cardID = await SyncEmit(users[tnum].sock,"pickCard",{"ids":users[tnum].getCreatures(),"optional":false});
							for (let ci=0;ci<users[tnum].creature.length;ci++){
								if (users[tnum].creature[ci] != null){
									if (cardID==users[tnum].creature[ci].id){
										//console.log("good boy")
										movedCreature = ci;
										loop = false;
										break;
									}else{
										console.log("BITCH HACKING")
									}
								}
							}
						}
						users[tnum].creature[movedCreature].destroyCard();
					}
					poss = users[tnum].getCreaturesPlaces(false);
				}else{
					console.log(p[0]);
					tributed = false;
				}
			}

			if (poss.length>0 && (p[0].type != "CREATURE" || !users[tnum].placedCreature) && tributed){

				//console.log(poss);
				let pos = await SyncEmit(users[tnum].sock,"pickPos",{"poss":poss,"optional":false});
				//console.log(cardID+", "+pos);
				succ = await placeLog(tnum,cardID,pos[1],tStates)
				if (succ){
					//chain.push(["PLACE",tnum,p[0]]);
					//await handleChain(tnum);

					if (tStates[1-tnum] == 0){
						updateStatus(tnum,0);
						updateStatus(1-tnum,1);
						tStates[tnum] = 0;
						tStates[1-tnum] = 1;
						tnum = 1-tnum;
						//io.to(users[1-users.indexOf(users[num])].sock.id).emit("pickPlace","")
					}
				}else{
					console.log("OMG, THIS IS THE BAD PLACE");
					//io.to(users[tnum].sock.id).emit("badPlace","");
				}
			}else{
				console.log("")
			}
		}
	}
	users[0].placedCreature = false;
	users[1].placedCreature = false;
}
async function placeLog(num,cardID, position,states){
	let successful = false;
	if (states[num] == 1){
		for (i=0;i<users[num].hand.length;i++){
			if (users[num].hand[i].id  == cardID){
				//console.log(users[num].hand[i].name);
				//let temp = parseInt(position.replace("click",""));
				if (users[num].hand[i].type == "CREATURE"){
					if (users[num].creature[position-7] ==null){
						if (!users[num].placedCreature){
							users[num].placedCreature=true;
							users[num].creature[position-7] = users[num].hand[i];
							await users[num].place(users[num].hand[i],i,position-7);
							successful = true;
						}

					}
				}else if (users[num].hand[i].type == "TRIGGER"){
					if (users[num].trigger[position-2] == null){
						users[num].trigger[position-2] = users[num].hand[i];
						await users[num].place(users[num].hand[i],i,position-2);
						successful = true;
					}else{
						console.log("filled")
					}
				}else{
					console.log("You what?")
				}
				
				//p[0].hand.splice(i,1);
			}
		}
		//console.log(position);
		return successful
	}
	return false;
}
async function moveStage(){
	//let pos = await SyncEmit(users[tnum].sock,"pickPos",{"position":"CREATURE","optional":true});
	for (let pnum = 0;pnum<2;pnum++){
		if (users[pnum].getCreatures().length>0){
			let loop = true;
			let movedCreature = 255;
			while (loop){
				let cardID = await SyncEmit(users[pnum].sock,"pickCard",{"ids":users[pnum].getCreatures(),"optional":false});
				//console.log(users[pnum].creature.length);
				for (let ci=0;ci<users[pnum].creature.length;ci++){
					if (users[pnum].creature[ci] != null){
						if (cardID==users[pnum].creature[ci].id){
							//console.log("good boy")
							movedCreature = ci;
							loop = false;
							break;
						}else{
							console.log("BITCH HACKING")
						}
					}
				}
			}
			loop = true;
			let pos = 255;
			while (loop){
				pos = await SyncEmit(users[pnum].sock,"pickPos",{"poss":[[users[pnum].sock.id,7],[users[pnum].sock.id,8],[users[pnum].sock.id,9]],"optional":false});
				console.log(pos);
				if (pos[1] >= 7 && pos[1] <= 9){
					loop = false;
				}else{
					console.log("BITCH HACKING")
				}
			}
			let temp = users[pnum].creature[pos[1]-7];
			if (temp != null){
				temp.moveCard(movedCreature+7);
			}
			users[pnum].creature[movedCreature].moveCard(pos[1]);
			users[pnum].creature[pos[1]-7] = users[pnum].creature[movedCreature];
			users[pnum].creature[movedCreature]= temp;
			updateBoard();
		}
	}
	
}
async function revealStage(){
	worldState=2;
	updateStatus(0,3);
	updateStatus(1,3);
	while (true){
		let flipping = [-1,undefined];
		for (let i =0;i<3;i++){
			if (users[0].creature[i]){
				if (users[0].creature[i].flip == false){
					if (flipping[0] == -1){
						flipping = [0,users[0].creature[i]];
					}else{
						break;
					}
				}
			}
		}
		for (let i =0;i<3;i++){
			if (users[1].creature[i]){
				if (users[1].creature[i].flip == false){
					if (flipping[0] == -1){
						flipping = [1,users[1].creature[i]];
					}else{
						break;
					}
				}
			}
		}
		if (flipping[0] != -1){
			//console.log(flipping[1].name)
			flipping[1].revealCard();
			updateBoard();
			chain.push(["REVEAL",flipping[0],flipping[1]]);
			revealed = true;
			await handleChain(flipping[0]);
		}else{
			break;
		}
	}

	
}
async function battleStage(){
	updateStatus(0,6);
	updateStatus(1,6);
	let avgPower = 0;

	for (let i = 0;i<3;i++){
		if (users[0].creature[i]){
			avgPower += users[0].creature[i].orgiPower+users[0].creature[i].chgPower;
		}
		if (users[1].creature[i]){
			avgPower -= users[1].creature[i].orgiPower+users[1].creature[i].chgPower;
		}
		if (users[0].creature[i] && users[1].creature[i]){
			users[0].creature[i].onBattle(users[1].creature[i]);
			users[1].creature[i].onBattle(users[0].creature[i]);

		}
	}
	updateBoard();
	//console.log(avgPower);
	if (avgPower < 0){
		users[0].health += avgPower;
	}else{
		users[1].health -= avgPower;
	}
	//(users[0].creature[0].power + users[0].creature[1].power + users[0].creature[2].power) - (users[1].creature[0].power + users[1].creature[1].power + users[1].creature[2].power);
	//console.log("LITERALLY SENDING")
	io.to(users[0].sock.id).emit("battle",users[0].sock.id,avgPower);
	io.to(users[1].sock.id).emit("battle",users[0].sock.id,avgPower);
	io.to(users[0].sock.id).emit("updateHealth",users[0].health,users[1].health);
	io.to(users[1].sock.id).emit("updateHealth",users[1].health,users[0].health);
}
async function handleChain(play){
	while (chain.length != 0){
		await buildChain(play);
		await resolveChain();
	}
}
async function buildChain(play){
	let tnum = play;
	let tStates = [0,0];
	while (true){
		await mustActivate(play);
		tStates[tnum] = 1;
		let card = await askTriggers(tnum);
		if (card != "skip"){
			console.log("given card");
			let tcard = undefined;
			for (let i=0;i<users[tnum].trigger.length;i++){
				if (users[tnum].trigger[i] != null){
					if (users[tnum].trigger[i].id == card){
						tcard= users[tnum].trigger[i]
					}
				}
			}
			if (tcard.canReveal(chain)){
				console.log("can be revealed");
				tcard.revealCard(chain);
				updateBoard();
				chain.push(["REVEAL",tnum,tcard]);
				await sleep(200);
				updateStatus(0,3);
				updateStatus(1,3);
				tStates = [0,0];
				tnum =  1- tnum;
				//checkTriggers(1-users.indexOf(users[play]));
			}
		}else{
			//console.log("no card here");
			updateStatus(tnum,5);
			tStates[tnum] = 2;
			if (tStates[1-tnum] != 2){
				tnum = 1-tnum;
				//checkTriggers(1-tnum);
			}else{
				break;
			}
		}
	}

}
async function mustActivate(play){
	let order = [play,1-play]
	for (let cplay = 0;cplay<2;cplay++){
		for (let i =0;i<3;i++){
			if (users[order[cplay]].creature[i]){
				if (users[order[cplay]].creature[i].mustAct(chain) && !users[order[cplay]].creature[i].activated){
					//users[play].creature[i].revealCard(chain);
					users[order[cplay]].creature[i].activated = true;
					let effect = await users[order[cplay]].creature[i].onActivate(chain);
					updateBoard();
					if (effect != null){
						chain.push(effect);
					}
				}

			}
		}
	}	
}
async function askTriggers(play){
	let trigIds = [];
	for (let i =0;i<5;i++){
		if (users[play].trigger[i]){
			if (users[play].trigger[i].canReveal(chain) && users[play].trigger[i].flip==false){
				trigIds.push(users[play].trigger[i].id);
			}

		}
	}
	if (trigIds.length != 0){
		updateStatus(play,4);
		updateStatus(1-play,5);
		let userInputs = await SyncEmit(users[play].sock,"pickCard",{"ids":trigIds,"optional":true});
		//console.log(userInputs);
		return userInputs;
	}
	return "skip";

}
async function resolveChain(){
	tempChain =[];
	for (let i = chain.length-1;i>=0;i--){
		tempChain.push(chain[i]);
	}
	chain = [];
	//console.log(tempChain);
	for (let i = 0;i<tempChain.length;i++){
		//console.log(tempChain[i]);
		if (tempChain[i][0]=="REVEAL"){
			let tc = await tempChain[i][2].onReveal();
			updateBoard();
			await sleep(400);
			if (tc != null){
				chain.push(tc);
			}
		}
	}
}

function updateBoard(){
	let temp = hideData(users[0].sock.id);
	//console.log(temp)
	io.to(users[0].sock.id).emit("updateBoard",temp);
	io.to(users[1].sock.id).emit("updateBoard",hideData(users[1].sock.id));
}
function updateStatus(num,val){
	users[num].textState =val;
	io.to(users[num].sock.id).emit("updateStatus",users[num].textState);
	//io.to(users[1].sock.id).emit("updateStatus",gameState[1]);
}

function unActCrea(){
	for (let cplay = 0;cplay<2;cplay++){
		for (let i =0;i<3;i++){
			if (users[cplay].creature[i]){
				users[cplay].creature[i].activated = false;
			}
		}
	}
}	

function hideData(userid){
	let user = 0;
	if (users[0].sock.id == userid){
		user = 0;
	}else{
		user = 1;
	}
	cards = {};
	for (let i =0;i<users[0].deck.length;i++){
		let temp = users[0].deck[i];
		cards[temp.id] = 	{
								"position":1,
								"player":temp.player.sock.id,
								"flip":false
							}
	}
	for (let i =0;i<users[1].deck.length;i++){
		let temp = users[1].deck[i];
		cards[temp.id] = 	{
								"position":1,
								"player":temp.player.sock.id,
								"flip":false
							}
	}

	for (let i =0;i<users[user].hand.length;i++){
		let temp = users[user].hand[i];
		cards[temp.id] = 	{
								"name":temp.name,
								"type":temp.type,
								"colour":temp.colour,
								"effect":temp.effect,
								"position":0,
								"player":temp.player.sock.id,
								"flip":true
								}
		if (temp.type=="CREATURE"){
			cards[temp.id]["power"] = temp.orgiPower;
			cards[temp.id]["change"] = temp.chgPower;
			cards[temp.id]["trib"] = temp.trib;
		}
		cards[temp.id]["handPos"] = i;
	}
	for (let i =0;i<users[1-user].hand.length;i++){
		let temp = users[1-user].hand[i];
		cards[temp.id] = 	{
								"position":0,
								"player":temp.player.sock.id,
								"flip":temp.flip
							}
		cards[temp.id]["handPos"] = i;
	}

	for (let i =0;i<users[user].trigger.length;i++){
		let temp = users[user].trigger[i];
		if (temp){
			cards[temp.id] = 	{
									"name":temp.name,
									"type":temp.type,
									"colour":temp.colour,
									"effect":temp.effect,
									"position":temp.pos,
									"player":temp.player.sock.id,
									"flip":temp.flip
								}
			if (temp.type=="CREATURE"){
				cards[temp.id]["power"] = temp.orgiPower;
				cards[temp.id]["change"] = temp.chgPower;
				cards[temp.id]["trib"] = temp.trib;
			}
		}
	}
	for (let i =0;i<users[1-user].trigger.length;i++){
		let temp = users[1-user].trigger[i];
		if (temp){
			if (temp.flip){
				cards[temp.id] = 	{
										"name":temp.name,
										"type":temp.type,
										"colour":temp.colour,
										"effect":temp.effect,
										"position":temp.pos,
										"player":temp.player.sock.id,
										"flip":temp.flip
										}
				if (temp.type=="CREATURE"){
					cards[temp.id]["power"] = temp.orgiPower;
					cards[temp.id]["change"] = temp.chgPower;
					cards[temp.id]["trib"] = temp.trib;
				}
			}else{
				cards[temp.id] = 	{
										"position":temp.pos,
										"player":temp.player.sock.id,
										"flip":false
									}
			}
		}
	}

	for (let i =0;i<users[user].creature.length;i++){
		let temp = users[user].creature[i];
		if (temp){
			cards[temp.id] = 	{
									"name":temp.name,
									"type":temp.type,
									"colour":temp.colour,
									"effect":temp.effect,
									"position":temp.pos,
									"player":temp.player.sock.id,
									"flip":temp.flip
								}
			if (temp.type=="CREATURE"){
				cards[temp.id]["power"] = temp.orgiPower;
				cards[temp.id]["change"] = temp.chgPower;
				cards[temp.id]["trib"] = temp.trib;
			}
		}
	}
	for (let i =0;i<users[1-user].creature.length;i++){
		let temp = users[1-user].creature[i];
		if (temp){
			if (temp.flip){
				cards[temp.id] = 	{
										"name":temp.name,
										"type":temp.type,
										"colour":temp.colour,
										"effect":temp.effect,
										"position":temp.pos,
										"player":temp.player.sock.id,
										"flip":temp.flip
										}
				if (temp.type=="CREATURE"){
					cards[temp.id]["power"] = temp.orgiPower;
					cards[temp.id]["change"] = temp.chgPower;
					cards[temp.id]["trib"] = temp.trib;
				}
			}else{
				cards[temp.id] = 	{
										"position":temp.pos,
										"player":temp.player.sock.id,
										"flip":false
									}
			}
		}
	}

	let temp = users[user].field;
	if (temp){
		cards[temp.id] = 	{
			"name":temp.name,
			"type":temp.type,
			"colour":temp.colour,
			"effect":temp.effect,
			"position":temp.pos,
			"player":temp.player.sock.id,
			"flip":temp.flip
			}
	}
	temp = users[1-user].field;
	if (temp){
		if (temp.flip){
			cards[temp.id] = 	{
								"name":temp.name,
								"type":temp.type,
								"colour":temp.colour,
								"effect":temp.effect,
								"position":temp.pos,
								"player":temp.player.sock.id,
								"flip":temp.flip
								}
		}else{
			cards[temp.id] = 	{
								"position":10,
								"player":temp.player.sock.id,
								"flip":false
								}
		}
	}

	for (let i =0;i<users[0].discard.length;i++){
		let temp = users[0].discard[i];
		cards[temp.id] = 	{
								"name":temp.name,
								"type":temp.type,
								"colour":temp.colour,
								"effect":temp.effect,
								"position":temp.pos,
								"player":temp.player.sock.id,
								"flip":temp.flip
								}
		if (temp.type=="CREATURE"){
			cards[temp.id]["power"] = temp.orgiPower;
			cards[temp.id]["change"] = temp.chgPower;
			cards[temp.id]["trib"] = temp.trib;
		}
	}
	for (let i =0;i<users[1].discard.length;i++){
		let temp = users[1].discard[i];
		cards[temp.id] = 	{
			"name":temp.name,
			"type":temp.type,
			"colour":temp.colour,
			"effect":temp.effect,
			"position":temp.pos,
			"player":temp.player.sock.id,
			"flip":temp.flip
			}
		if (temp.type=="CREATURE"){
			cards[temp.id]["power"] = temp.orgiPower;
			cards[temp.id]["change"] = temp.chgPower;
			cards[temp.id]["trib"] = temp.trib;
		}
	}
	//console.log(cards);
	return cards;
}


io.on('connection', (socket) => { //WHEN PLAYER JOINS
	users.push(new user(socket))
	if (users.length == 2){
		gameStart()
	}
	socket.on('disconnect', function() { //WHEN PLAYER DISCONNECTS
		var p = users.filter(obj => {
			return obj.sock.id === socket.id
	  	});
		users.splice(users.indexOf(p[0]),1);
	});
});

var token = function() {
	return (Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2));
};

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
  
	  // Pick a remaining element.
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
  }
function SyncEmit(sock,event, data) {
	io.to(sock.id).emit(event,data)
	return new Promise((resolve, reject) => {
		sock.once(event+"R", (values) => {
			//console.log(values);
			resolve(values);
		});
	});
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//setInterval(update,100);
//Just network code. You can ignore.
http.listen(80, () => {
	console.log('listening on *:80');
  });