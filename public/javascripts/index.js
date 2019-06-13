const randomUrl = 'http://api.urbandictionary.com/v0/random';
const wordUrl = 'http://api.urbandictionary.com/v0/define?term={word}';


let wordList = [];
let defList = [];
let wordButtons=[];
let defButtons=[];
let clickedWords=[];
let clickedDefs=[];
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
    clickedWords=[];
    clickedDefs=[];
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
            wordButtons[i].addEventListener("click", highlightWord);
            defButtons[i].addEventListener("click", highlightDef);
            };
        })
        .catch(err => {
            console.log(err);
        });
}

var highlightWord = function(){
this.style.backgroundColor="#86A899";
   clickedWords.push(this);
   if (clickedWords.length===2) {
       var i = clickedWords.shift();
       i.style.backgroundColor="#FFFFFF";
       //console.log("curr word length: " + clickedWords.length);
       //console.log("current word:" + clickedWords[0].innerHTML.toString());
       //console.log(i);
       
   }
   matchWords();
}

var highlightDef = function() {
this.style.backgroundColor="#86A899";
   clickedDefs.push(this);
   if (clickedDefs.length===2) {
       var i = clickedDefs.shift();
       i.style.backgroundColor="#FFFFFF";
       //console.log("curr def length: " + clickedDefs.length);
       //console.log("current def: " + clickedDefs[0].innerHTML.toString());
       //console.log(i);
       
   }
   matchWords();
}

// let matchedWords =[];
// let matchedDefs = [];
// let unmatchedWords = [];
// let unmatchedDefs = [];

function matchWords() {
    if(wordMap.size===0) console.log("game over");
    if (clickedDefs.length===1 && clickedWords.length===1) {
        currentWord = clickedWords[0].getElementsByClassName('card-body')[0].getElementsByTagName('H5')[0].innerHTML;
        currentDef = clickedDefs[0].getElementsByClassName('card-body')[0].getElementsByClassName('card-text')[0].innerHTML.replace(/\r?\n/g, "").trim();
        console.log("map get result: " + wordMap.get(currentWord));
        console.log(currentDef.length);
        if (wordMap.get(currentWord) == currentDef) {
            console.log("matched!");
            wordMap.delete(currentWord);
            clickedWords[0].style.backgroundColor="#96BE8C";
            clickedDefs[0].style.backgroundColor="#96BE8C";
            //background-color: #96BE8C;
            console.log("wordMap length: " + wordMap.size);
        } else {
            console.log("unmatched!");
            clickedDefs[0].style.backgroundColor="#FFFFFF";
            clickedWords[0].style.backgroundColor="#FFFFFF";
            clickedDefs[0].classList.add("apply-shake");
            clickedWords[0].classList.add("apply-shake");
        }
    // clickedDefs[0].classList.remove("apply-shake");
    // clickedWords[0].classList.remove("apply-shake");
    // clickedDefs[0].classList.add("unmatch");
    // clickedWords[0].classList.add("unmatch");
    clickedWords=[];
    clickedDefs=[];
    }
}

