let amount = document.querySelector("#amount");
let buttonPrev = document.querySelector("#Prev");
let buttonNext = document.querySelector("#Next");
let selected = "";
let difficulty = "";
let start = 0;
let questionData = [];
document.querySelector("#difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
});

document.querySelector("#selected").addEventListener("change", (e) => {
  selected = e.target.value;
});

document.querySelector("#btn").addEventListener("click", (e) => {
  if (amount.value < 50) {
    getData(
      `https://opentdb.com/api.php?amount=${amount.value}&category=${selected}&difficulty=${difficulty}&type=multiple`
    );
  }
});

function assign(questionDataP) {
  questionData = questionDataP;
}
async function getData(url) {
  const resData = await fetch(`${url}`);
  const { results } = await resData.json();
  assign(results);
  display(questionData[0]);
  console.log(questionData);
}

function display(questionObj) {
  let ans = [...questionObj.incorrect_answers, questionObj.correct_answer].sort();
  console.log(ans);
  console.log(questionObj);
  let blackBox = `<p class="num-qu w-50">Number Questions : <span>5</span></p>
              <p class="num-qu">Current Questions : <span>5</span></p>
              <h2 id="question" class="mt-3 text-start">${questionObj?.question}</h2>
              <ul class="my-3 py-3">
                <li class='text-nowrap'>${ans[0]}</li>
                <li class='text-nowrap'>${ans[1]}</li>
                <li class='text-nowrap'>${ans[2]}</li>
                <li class='text-nowrap'>${ans[3]}</li>
              </ul>`;
  document.querySelector(".showQ").innerHTML = blackBox;
}

buttonNext.addEventListener("click", (e) => {
  start++;
  display(questionData[start]);
});
buttonNext.addEventListener("click", (e) => {
  start--;
  display(questionData[start]);
});

/*
category
: 
"Science &amp; Nature"
correct_answer
: 
"False"
difficulty
: 
"medium"
incorrect_answers
: 
['True']
question
: 
"Sugar contains fat."
type
: 
"boolean"



category
: 
"Geography"
correct_answer
: 
"Lake Superior "
difficulty
: 
"hard"
incorrect_answers
: 
(3) ['Caspian Sea', 'Lake Michigan', 'Lake Huron']
question
: 
"Which is the largest freshwater lake in the world?"
type
: 
"multiple"
*/
