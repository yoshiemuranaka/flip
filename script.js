$(document).ready(function(){

	var deck = []
	var counter = 0
	var card = {
				config: {
					id: 0,
					front: $("#front-content"),
					back: $("#back-content"),
					moveLength: 0,
					startPoint: 0,
					endPoint: 0,
					container: $(".container")[0]
				},

				init: function(data){
					card.config.id = data.id
					card.config.front.text(data.front)
					card.config.back.text(data.back)
					card.addEventListeners()
				},

				addEventListeners: function(){
					card.config.container.addEventListener("touchstart", card.handleStart, false);
					card.config.container.addEventListener("touchend", card.handleEnd, false);
					card.config.container.addEventListener("touchmove", card.handleMove, false);
				},

				//RECORD TOUCHSTART CONFIG
				handleStart: function(event){
					card.config.startPoint = event.touches[0].clientX
				},

				//RECORD TOUCHMOVE CONFIG
				handleMove: function(event){
					card.config.moveLength += 1
				},

				//ON TOUCHEND RECORD TOUCH END, THEN CHECKFACE()
				handleEnd: function(event){
					card.config.endPoint = event.changedTouches[0].clientX
					card.checkFace()
				},

				//IF BACK OF CARD IS FACING, FLIP CARD. ELSE CHECKMOVELENGTH() AND RESET CONFIG TOUCH START, TOUCH END, MOVELENGTH
				checkFace: function(){
					var container = $(".container")
					if(container.hasClass("active")){
						card.flipCard()
					}else{
						card.checkMoveLength(card.config.moveLength, card.config.startPoint, card.config.endPoint);
						card.config.moveLength = 0;
						card.config.endPoint = 0;
						card.config.startPoint = 0; 
					}
				},
				
				//CHECKING THE MOVE LENGTH LOGIC TO FLIP OR SWIPE CARD
				checkMoveLength: function(moveLength, startPoint, endPoint){
					if(moveLength > 4 && (startPoint - endPoint) > 0){
						card.swipeLeft()
					}else if(moveLength > 4 && (startPoint - endPoint) < 0){
						card.swipeRight()
					}else if(moveLength < 4){
						card.flipCard()
					}
				}, 

				//TOGGLE CLASS TO ANIMATE CARD FLIP WITH CSS
				flipCard: function(){
					$('.container').toggleClass('active')
				},

				//COUNTER INCREASES IF IT IS ON LAST CARD IN DECK, COUNTER RESETS TO 0/FIRST CARD IN DECK 
				swipeLeft: function(){
					var container = $(".container")
					if(card.config.id == deck.length -1){
						counter = 0
						card.init(deck[counter])
					}else{
						counter = card.config.id + 1
						card.init(deck[counter])
					}
				},

				//COUNTER DECREASES, IF IT IS THE FIRST CARD IN DECK, COUNTER RESETS TO ID OF LAST CARD IN DECK
				swipeRight: function(){
					var container = $(".container")
					if(card.config.id == 0){
						counter = deck.length - 1
						card.init(deck[counter])
					}else{
						counter = card.config.id - 1
						card.init(deck[counter])
					}
				}
			}
	
	$.ajax({ 
		url: 'http://spreadsheets.google.com/feeds/list/1LwDXCgq8PCbuSp4wfe-gaMxR4oRk5resFyRUkWajXGE/1/public/basic?alt=json',
		type: 'get',
		dataType: "json",
		success: function(json){ 
		   for ( var i = 0; i < json.feed.entry.length; i++){
		   	var back = json.feed.entry[i].content.$t.split("spanish: ")[1]
		   	var front = json.feed.entry[i].content.$t.split(",")[0].split(": ")[1]
			   	deck.push({
			   		id: i,
			   		front: front,
			   		back: back
			   	})
			}

			card.init(deck[counter])
		}
	})


})


