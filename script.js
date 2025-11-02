const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");

startBtn.addEventListener("click", () => {
  const level = document.getElementById("level").value;
  startQuiz(level);
});

function startQuiz(level) {
  quizContainer.innerHTML = "<p>載入題目中...</p>";
  const folder = ""; // 所有 CSV 都在根目錄
  const files = level === "L1"
    ? ["L1_1.csv", "L1_2.csv", "L1_3.csv", "L1_A1.csv", "L1_A2.csv", "L1_A3.csv"]
    : ["L3_1.csv", "L3_2.csv", "L3_3.csv", "L3_A1.csv", "L3_A2.csv", "L3_A3.csv"];

  let allQuestions = [];
  let loaded = 0;

  files.forEach(file => {
    Papa.parse(folder + file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const cleaned = results.data.filter(q =>
          q.題目 && q.選項1 && q.選項2 && q.選項3 && q.選項4 && q.正確答案
        );
        allQuestions = allQuestions.concat(cleaned);
        loaded++;
        if (loaded === files.length) {
          const selected = shuffle(allQuestions).slice(0, 30);
          displayQuestions(selected);
        }
      }
    });
  });
}

function displayQuestions(questions) {
  quizContainer.innerHTML = "";
  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `
      <h3>第 ${index + 1} 題：${q.題目}</h3>
      <div class="options">
        ${[1,2,3,4].map(i => `
          <button>${q["選項" + i]}</button>
        `).join("")}
      </div>
      <div class="explanation" style="display:none;"></div>
    `;
    const buttons = div.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.disabled = true);
        const correct = q["選項" + q.正確答案];
        if (btn.textContent === correct) {
          btn.classList.add("correct");
          div.querySelector(".explanation").innerHTML = `✅ ${q.正確答案解說 || "答對了！"}`;
        } else {
          btn.classList.add("incorrect");
          div.querySelector(".explanation").innerHTML = `❌ ${q.錯誤答案解說 || "再接再厲！"}`;
        }
        div.querySelector(".explanation").style.display = "block";
      });
    });
    quizContainer.appendChild(div);
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
