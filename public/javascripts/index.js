const randomUrl = 'http://api.urbandictionary.com/v0/random';
const wordUrl = 'http://api.urbandictionary.com/v0/define?term={word}';


let wordList = [];
let defList = [];
let wordButtons=[];
let defButtons=[];
let selectedWords=[];
let selectedDefs=[];
var wordMap;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


//Fetch random words from Urban Dictionary API
let randomButton = document.getElementById("newwords");


randomButton.onclick = function generateWords(){
    wordList = [];
    defList = [];
    wordButtons=[];
    defButtons=[];
    wordMap = new Map();
    selectedWords=[];
    selectedDefs=[];
    fetch(randomUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {            
            console.log(data);
            for (var i = 0; i < data.list.length; i++) {
                var word = data.list[i]['word'];
                var def = data.list[i]['definition'].replace(/\r?\n/g, "").trim();
                //wordMap[word]=def;
                wordMap.set(word, def);
                wordList.push(word);
                defList.push(def);
            }
            wordList = shuffle(wordList);
            defList = shuffle(defList);
            for (var i = 0; i < wordList.length; i++) {
                var word = wordList[i]; 
                var def = defList[i];
                document.getElementById('word'+i).innerHTML = word;
                //console.log("times: " +i);
                //document.getElementById('wordcard'+i).type = word;
                document.getElementById('definition'+i).innerHTML = def;
                //document.getElementById('definition'+i).type = word;
            }
            var words = document.getElementsByClassName('card word');
            wordButtons = [...words];
            var defs = document.getElementsByClassName('card definition');
            defButtons = [...defs];
            for (var i = 0; i < wordButtons.length; i++) {
            // wordButtons[i].reset();
            // defButtons[i].reset();
            wordButtons[i].addEventListener("click", selectWord);
            defButtons[i].addEventListener("click", selectDef);
            wordButtons[i].classList.remove("selected", "matched", "disabled");
            defButtons[i].classList.remove("selected", "matched", "disabled");
            };
        })
        .catch(err => {
            console.log(err);
        });
}

var selectWord = function(){
   //this.style.backgroundColor="#86A899";
   this.classList.toggle('selected');
   this.classList.toggle('disabled');
       
   selectedWords.push(this);
   if (selectedWords.length===2) {
       var i = selectedWords.shift();
       i.classList.remove('selected', 'disabled');
       //i.style.backgroundColor="#FFFFFF";
       //console.log("curr word length: " + selectedWords.length);
       //console.log("current word:" + selectedWords[0].innerHTML.toString());
       //console.log(i);
       
   }
   matchWords();
}

var selectDef = function() {
   //this.style.backgroundColor="#86A899";
   this.classList.toggle('selected');
   this.classList.toggle('disabled');
   selectedDefs.push(this);
   if (selectedDefs.length===2) {
       var i = selectedDefs.shift();
       i.classList.remove('selected', 'disabled');
       //console.log("curr def length: " + selectedDefs.length);
       //console.log("current def: " + selectedDefs[0].innerHTML.toString());
       //console.log(i);
       
   }
   matchWords();
}

let matchedWords =[];
let matchedDefs = [];
let unmatchedWords = [];
let unmatchedDefs = [];
let matchedButtons=[]; 
function matchWords() {
    if(wordMap.size===0) console.log("game over");
    if (selectedDefs.length===1 && selectedWords.length===1) {

        currentWord = selectedWords[0].getElementsByClassName('card-body')[0].getElementsByTagName('H5')[0].innerHTML;
        currentDef = selectedDefs[0].getElementsByClassName('card-body')[0].getElementsByClassName('card-text')[0].innerHTML.replace(/\r?\n/g, "").trim();
        console.log("map get result: " + wordMap.get(currentWord));
        console.log(currentDef.length);
        if (wordMap.get(currentWord) == currentDef) {
            console.log("matched!");
            wordMap.delete(currentWord);
            // selectedWords[0].style.backgroundColor="#96BE8C";
            // selectedDefs[0].style.backgroundColor="#96BE8C";
            //background-color: #96BE8C;
            console.log("wordMap length: " + wordMap.size);
            matched();
        } else {
            console.log("unmatched!");
            // selectedDefs[0].style.backgroundColor="#FFFFFF";
            // selectedWords[0].style.backgroundColor="#FFFFFF";
            // selectedDefs[0].classList.add("unmatch");
            // selectedWords[0].classList.add("unmatch");
            unmatched();
        }
    // selectedDefs[0].classList.remove("apply-shake");
    // selectedWords[0].classList.remove("apply-shake");
    // selectedDefs[0].classList.add("unmatch");
    // selectedWords[0].classList.add("unmatch");
    
    }
}

function matched(){
    selectedWords[0].classList.add("matched");
    selectedDefs[0].classList.add("matched");
    selectedWords[0].classList.remove('selected');
    selectedDefs[0].classList.remove('selected');
    matchedWords.push(selectedWords[0]);
    matchedDefs.push(selectedDefs[0]);
    selectedWords=[];
    selectedDefs=[];
}

function unmatched(){
    // selectedDefs[0].style.backgroundColor="#FFFFFF";
    // selectedWords[0].style.backgroundColor="#FFFFFF";
    selectedWords[0].classList.add("unmatched");
    selectedDefs[0].classList.add("unmatched");
    disable();
    setTimeout(function() {
        selectedWords[0].classList.remove("selected", "unmatched");
        selectedDefs[0].classList.remove("selected", "unmatched");
        enable();
        selectedWords=[];
        selectedDefs=[];
    }, 820);
}

function disable(){
    Array.prototype.filter.call(wordButtons, function(button){
        button.classList.add('disabled');
    });
    Array.prototype.filter.call(defButtons, function(button){
        button.classList.add('disabled');
    });
}

function enable(){
    Array.prototype.filter.call(wordButtons, function(button){
        button.classList.remove('disabled');
        for(var i = 0; i < matchedWords.length; i++){
            matchedWords[i].classList.add("disabled");
        }
    });
    Array.prototype.filter.call(defButtons, function(button){
        button.classList.remove('disabled');
        for(var i = 0; i < matchedDefs.length; i++){
            matchedDefs[i].classList.add("disabled");
        }
    });
}


