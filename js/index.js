let amount = document.querySelector("#amount");
let timeIn = document.querySelector("[name='time']");
let buttonPrev = document.querySelector("#Prev");
let buttonNext = document.querySelector("#Next");
let quizSection = document.querySelector(".quiz");
let home = document.querySelector(".home");
let questionEl = document.querySelector(".num-qu");
let showScore = document.querySelector(".result");
let btnRes = document.querySelector(".btn-Res");
let btnBack = document.querySelector(".btn-back");
const boxMove = document.querySelector(".box-move");
const innerTime = document.querySelector(".inner-time");
const finishBtn = document.querySelector("#btn-finish");
let arrAnswerOnly = [];
let selected = "";
let difficulty = "";
let start = 0;
let score = 0;
let questionData = [];
let arrCollectionNumAnswerAndIds = [];
let time;
var notyf = new Notyf({ position: { x: "center", y: "top" } });
document.querySelector("#difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
});

document.querySelector("#selected").addEventListener("change", (e) => {
  selected = e.target.value;
});

document.querySelector("#btn").addEventListener("click", (e) => {
  if (amount.value <= 0 || amount.value > 50) {
    notyf.error("number of question must be less than 50", {
      duration: 2000,
    });
  } else if (timeIn.value > 60 || timeIn.value <= 0) {
    notyf.error("time must be less than 60m", {
      duration: 2000,
    });
  } else {
    time = timeIn.value * 60;
    getData(
      `https://opentdb.com/api.php?amount=${amount.value}&category=${selected}&difficulty=${difficulty}&type=multiple`
    );
  }
});

function Time(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (time == 0) {
    innerTime.innerHTML = `  <i class="fa fa-spin fa-spinner"></i>`;
  } else {
    innerTime.innerHTML = `${minutes} m : ${seconds} s`;
  }
}
let clear = 1;
function StartTime() {
  clear = setInterval(() => {
    Time(time--);
    if (time < 0) {
      quizSection.classList.replace("d-block", "d-none");
      showScore.classList.replace("d-none", "d-block");
      document.querySelector(".cor").innerHTML = arrCollectionNumAnswerAndIds.length;
      document.querySelector(".inCor").innerHTML =
        questionData.length - arrCollectionNumAnswerAndIds.length;
      clearInterval(clear);
    }
  }, 1000);
}

function btnBackFn() {
  time = 0;
  clear = setInterval(() => {
    Time(time--);
    if (time < 0) {
      clearInterval(clear);
    }
  }, 1000);
}

function assign(questionDataP) {
  questionData = questionDataP;
}
async function getData(url) {
  try {
    StartTime();
    const resData = await fetch(`${url}`);
    const { results } = await resData.json();
    quizSection.classList.replace("d-none", "d-block");
    home.classList.replace("d-block", "d-none");
    assign(results);
    assignAns();
    display(questionData[0], 0);
    showNumberQ(0);
    innerTime.innerHTML = `  <i class="fa fa-spin fa-spinner"></i>`;
    console.log(questionData);
  } catch (e) {
    console.log(e);
  }
  // Timer  ;
}

function showNumberQ(s) {
  let blackBox = "";
  questionData.forEach((e, idx) => {
    blackBox += `  <div data-num="${idx}" class="box ${idx == s ? "active" : ""}">${idx + 1}</div>`;
  });
  boxMove.innerHTML = blackBox;

  boxMove.querySelectorAll(".box").forEach((e) => {
    e.addEventListener("click", (num) => {
      boxMove.querySelectorAll(".box").forEach((e) => {
        e.classList.remove("active");
      });
      num.target.classList.add("active");
      start = +num.target.dataset.num;
      s = start;
      if (s == questionData.length - 1) {
        buttonNext.classList.add("opacity-50-cursor");
      } else {
        buttonNext.classList.remove("opacity-50-cursor");
      }
      questionEl.innerHTML = `Question ${s + 1} of ${questionData.length}`;

      display(questionData[s], s);
    });
  });
}
let copyArrAnswerOnly = [];
function assignAns() {
  let ans = [];
  questionData.forEach((q, idxQ) => {
    ans = [...q.incorrect_answers, q.correct_answer].sort();
    ans.forEach((a, idxA) => {
      if (a == q.correct_answer) {
        copyArrAnswerOnly.push({ id: idxQ, idx: idxA });
      }
    });
  });
}
function display(questionObj, id) {
  let ans = [];
  ans = [...questionObj.incorrect_answers, questionObj.correct_answer].sort();
  // ans.forEach((e, idx) => {
  //   if (e == questionObj.correct_answer) {
  //     const flag = arrAnswerOnly.find((e) => {
  //       return e.id == id;
  //     });
  //     if (!flag) {
  //       arrAnswerOnly.push({ idx, id });
  //     }
  //   }
  // });
  // console.log(ans);
  questionEl.innerHTML = `Question ${id + 1} of ${questionData.length}`;
  let blackBox = `
              <h2 id="question" class="mt-3 ">${questionObj?.question}</h2>
              <ul class="ul-mobile my-3 py-3" data-numqu=${id} id="options">
                <li  data-num="0" class='${questionObj.num == 0 ? "active" : ""}'><span>${
    ans[0]
  }</span></li>
                <li data-num="1" class='${questionObj.num == 1 ? "active" : ""}'><span>${
    ans[1]
  }</span></li>
                <li data-num="2" class='${questionObj.num == 2 ? "active" : ""}'><span>${
    ans[2]
  }</span></li>
                <li data-num="3" class='${questionObj.num == 3 ? "active" : ""}'><span>${
    ans[3]
  }</span></li>
              </ul>`;

  document.querySelector(".showQ").innerHTML = blackBox;
  const lis = document.querySelectorAll("#options li");
  lis.forEach((li) => {
    li.addEventListener("click", (e) => {
      lis.forEach((e) => {
        e.classList.remove("active");
      });
      if (e.currentTarget.textContent == questionObj.correct_answer) {
        const foundObject = arrCollectionNumAnswerAndIds.find(
          (obj) =>
            obj.id == e.currentTarget.parentElement.dataset.numqu &&
            obj.answer == e.currentTarget.textContent
        );
        if (!foundObject) {
          arrCollectionNumAnswerAndIds.push({
            id: e.currentTarget.parentElement.dataset.numqu,
            answer: e.currentTarget.textContent,
            dataNumAnswer: e.currentTarget.dataset.num,
          });
        }
      } else {
        const foundObject = arrCollectionNumAnswerAndIds.find(
          (obj) => obj.id == e.currentTarget.parentElement.dataset.numqu
        );
        if (foundObject) {
          arrCollectionNumAnswerAndIds = arrCollectionNumAnswerAndIds.filter((i) => {
            return i.id != foundObject.id;
          });
        }
      }
      console.log(arrCollectionNumAnswerAndIds);
      e.currentTarget.classList.add("active");
      // console.log(e.currentTarget.dataset.num);

      // الاجابه اللي هو اختارها
      questionObj["num"] = e.currentTarget.dataset.num;
      console.log(questionObj);
      console.log(questionData);
    });
  });
}

buttonNext.addEventListener("click", (e) => {
  // if (start == questionData.length - 1) {
  //   buttonNext.classList.add("opacity-50-cursor");
  // }

  if (start < questionData.length - 1) {
    start++;
    if (start == questionData.length - 1) {
      buttonNext.classList.add("opacity-50-cursor");
    }
    display(questionData[start], start);
    console.log("Next", start);
    buttonPrev.classList.remove("opacity-50-cursor");
    showNumberQ(start);
  } else {
    buttonNext.classList.add("opacity-50-cursor");
  }
});
if (start == 0) {
  buttonPrev.classList.add("opacity-50-cursor");
}
buttonPrev.addEventListener("click", (e) => {
  if (start > 0) {
    start--;
    if (start == 0) {
      buttonPrev.classList.add("opacity-50-cursor");
    }
    display(questionData[start], start);
    showNumberQ(start);
    console.log("Prev ", start);

    buttonNext.classList.remove("opacity-50-cursor");
  } else {
    buttonPrev.classList.add("opacity-50-cursor");
  }
});

finishBtn.addEventListener("click", (e) => {
  clearInterval(clear);
  console.log("ansOnly", copyArrAnswerOnly);
  quizSection.classList.replace("d-block", "d-none");
  showScore.classList.replace("d-none", "d-block");
  // console.log(document.querySelector(".div-circle"));
  document.querySelector(".div-circle").style.cssText = `  
    background-image: conic-gradient(red ${Math.trunc(
      (arrCollectionNumAnswerAndIds.length / questionData.length) * 100
    )}%, #EEE 0%);
  `;

  document.querySelector(".div-circle").querySelector("p").innerHTML = `${Math.trunc(
    (arrCollectionNumAnswerAndIds.length / questionData.length) * 100
  )}%`;
  document.querySelector(".cor").innerHTML = arrCollectionNumAnswerAndIds.length;
  document.querySelector(".inCor").innerHTML =
    questionData.length - arrCollectionNumAnswerAndIds.length;
});
btnRes.addEventListener("click", (e) => {
  let ans = [];
  let blackBox = "";
  questionData.forEach((e, i) => {
    ans = [...e.incorrect_answers, e.correct_answer].sort();
    blackBox += `
       <div class="ress">
       
       <p class='fs-4 mt-2'> <span>${i + 1}.</span> ${e.question}</p>
    <ul class="ul-mobile my-3 py-3"  id="options">
      <li class="${
        e.num == copyArrAnswerOnly[i]?.idx && e.num == 0 ? "active" : e.num == 0 ? "noActive" : null
      } ${copyArrAnswerOnly[i]?.idx == 0 ? "active" : null} "><span>${ans[0]}</span></li>
      <li class="${
        e.num == copyArrAnswerOnly[i]?.idx && e.num == 1 ? "active" : e.num == 1 ? "noActive" : null
      } ${copyArrAnswerOnly[i]?.idx == 1 ? "active" : null}"><span>${ans[1]}</span></li>
      <li class="${
        e.num == copyArrAnswerOnly[i]?.idx && e.num == 2 ? "active" : e.num == 2 ? "noActive" : null
      } ${copyArrAnswerOnly[i]?.idx == 2 ? "active" : null}"><span>${ans[2]}</span></li>
      <li class="${
        e.num == copyArrAnswerOnly[i]?.idx && e.num == 3 ? "active" : e.num == 3 ? "noActive" : null
      } ${copyArrAnswerOnly[i]?.idx == 3 ? "active" : null}"><span>${ans[3]}</span></li>
    </ul>
       
       <div/>`;
  });
  document.querySelector(".showAnswerAndWrong").innerHTML = blackBox;
  copyArrAnswerOnly = [];
});
btnBack.addEventListener("click", (e) => {
  btnBackFn();
  amount.value = "";
  timeIn.value = "";
  home.classList.replace("d-none", "d-block");
  showScore.classList.replace("d-block", "d-none");
  document.querySelector(".showAnswerAndWrong").innerHTML = "";
  copyArrAnswerOnly = [];
  arrCollectionNumAnswerAndIds = [];
});
