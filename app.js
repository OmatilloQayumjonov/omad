const DEFAULT_TEST={"id":"default","name":"English Vocabulary Test","questions":[{"question":"decline","options":["increase","decrease","remain stable","appear suddenly"],"correctAnswer":1},{"question":"diminish","options":["become larger or stronger","become smaller or weaker","change repeatedly","disappear completely"],"correctAnswer":1},{"question":"deteriorate","options":["become better","become worse","become faster","become larger"],"correctAnswer":1},{"question":"fluctuate","options":["remain unchanged","change repeatedly","develop gradually","increase permanently"],"correctAnswer":1},{"question":"expand","options":["become smaller","become larger","become weaker","disappear"],"correctAnswer":1},{"question":"accelerate","options":["become slower","become faster","become smaller","change completely"],"correctAnswer":1},{"question":"transform","options":["change slightly","change significantly","remain the same","develop gradually"],"correctAnswer":1},{"question":"evolve","options":["develop gradually","change suddenly","become smaller","disappear completely"],"correctAnswer":0},{"question":"emerge","options":["disappear completely","appear or develop","become weaker","remain hidden"],"correctAnswer":1},{"question":"undergo","options":["cause a change","experience a change","avoid a change","prevent development"],"correctAnswer":1},{"question":"indicate","options":["hide or conceal","show or suggest","remove completely","change significantly"],"correctAnswer":1},{"question":"demonstrate","options":["show clearly","suggest vaguely","hide evidence","change gradually"],"correctAnswer":0},{"question":"reveal","options":["make something unknown","make something known","measure something","change something"],"correctAnswer":1},{"question":"suggest","options":["prove something beyond doubt","give an idea that something is true","make something disappear","collect information"],"correctAnswer":1},{"question":"evidence","options":["a personal opinion","information showing whether something is true","a future prediction","a research question"],"correctAnswer":1},{"question":"findings","options":["research questions","results of research","research methods","personal opinions"],"correctAnswer":1},{"question":"data","options":["collected information","a conclusion","a hypothesis","a recommendation"],"correctAnswer":0},{"question":"survey","options":["a study involving questions or data collection","a laboratory instrument","a mathematical formula","a research conclusion"],"correctAnswer":0},{"question":"investigate","options":["ignore completely","examine carefully","summarize briefly","predict accurately"],"correctAnswer":1},{"question":"assess","options":["evaluate or judge","collect randomly","hide from view","develop gradually"],"correctAnswer":0},{"question":"approximately","options":["exactly","roughly","rarely","completely"],"correctAnswer":1},{"question":"predominantly","options":["partly","mostly","rarely","equally"],"correctAnswer":1},{"question":"numerous","options":["few","many","none","single"],"correctAnswer":1},{"question":"a substantial proportion","options":["a very small amount","a large percentage","exactly half","a single group"],"correctAnswer":1},{"question":"a minority","options":["a larger group","a smaller group","the entire population","more than half"],"correctAnswer":1},{"question":"a majority","options":["less than half","more than half","a very small amount","a single person"],"correctAnswer":1},{"question":"abundant","options":["existing in small quantities","existing in large quantities","difficult to find","completely absent"],"correctAnswer":1},{"question":"scarce","options":["easy to find","difficult to find / limited","available everywhere","existing in large quantities"],"correctAnswer":1},{"question":"marginal","options":["very large and important","very small or not important","more than half","extremely common"],"correctAnswer":1},{"question":"considerably","options":["by a very small amount","by a large amount","without any change","only occasionally"],"correctAnswer":1},{"question":"habitat","options":["a laboratory for research","natural home of an animal/plant","a group of species","a type of pollution"],"correctAnswer":1},{"question":"species","options":["a single organism","group of similar animals/plants","natural environment","protection of nature"],"correctAnswer":1},{"question":"biodiversity","options":["loss of natural resources","variety of living things","release of gases","change in climate"],"correctAnswer":1},{"question":"ecosystem","options":["a single species","community of organisms and their environment","a natural disaster","a research method"],"correctAnswer":1},{"question":"conservation","options":["destruction of nature","protection of nature","release of gases","increase in pollution"],"correctAnswer":1},{"question":"sustainable","options":["likely to cause serious damage","able to continue without causing serious damage","difficult to maintain temporarily","existing only in small quantities"],"correctAnswer":1},{"question":"depletion","options":["increase of something","reduction of something","complete transformation","natural protection"],"correctAnswer":1},{"question":"emission","options":["collection of information","release of gases/substances","protection of animals","gradual development"],"correctAnswer":1},{"question":"adaptation","options":["change that makes survival harder","change that helps something survive","complete disappearance","rapid increase"],"correctAnswer":1},{"question":"extinction","options":["gradual development of a species","complete disappearance of a species","protection of a species","increase in biodiversity"],"correctAnswer":1}]};

const KEY="evt_tests";
let tests=JSON.parse(localStorage.getItem(KEY)||"null")||[DEFAULT_TEST];
let cur=null,qidx=0,score=0,answered=false;

function save(){
  localStorage.setItem(KEY,JSON.stringify(tests));
}

function esc(s){
  return String(s).replace(/[&<>"']/g,c=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

function home(){
  document.getElementById("app").innerHTML=`
  <div class="container">
    <div class="hero">
      <h1>English Vocabulary Test</h1>
      <p>Inglizcha testlarni yaratish, Word'dan import qilish va ishlash.</p>

      <div class="actions">
        <button class="primary" onclick="newTest()">➕ Yangi test yaratish</button>
        <button class="secondary" onclick="library()">📚 Testlar kutubxonasi</button>
        <button class="secondary" onclick="pickWord()">📄 Word'dan import</button>
      </div>

      <input id="file" type="file" accept=".docx" hidden onchange="importWord(this.files[0])">
    </div>
  </div>`;
}

function pickWord(){
  document.getElementById("file").click();
}

function library(){
  document.getElementById("app").innerHTML=`
  <div class="container">
    <h2>📚 Testlar kutubxonasi</h2>

    <button class="primary" onclick="newTest()">➕ Yangi test</button>
    <button class="secondary" onclick="pickWord()">📄 Word import</button>

    <div id="list"></div>
  </div>`;

  let list=document.getElementById("list");

  tests.forEach((t,i)=>{
    list.innerHTML+=`
    <div class="card">
      <h3>${esc(t.name)}</h3>
      <p>${t.questions.length} ta savol</p>

      <button class="primary" onclick="start(${i})">
        ▶️ Boshlash
      </button>

      <button class="secondary" onclick="edit(${i})">
        ✏️ Tahrirlash
      </button>

      <button class="danger" onclick="del(${i})">
        🗑 O‘chirish
      </button>
    </div>`;
  });
}

function newTest(){
  document.getElementById("app").innerHTML=`
  <div class="container">
    <div class="card">
      <h2>➕ Yangi test</h2>

      <input
        id="name"
        class="field"
        value="Yangi test"
        placeholder="Test nomi">

      <div id="forms"></div>

      <button class="secondary" onclick="addForm()">
        ➕ Savol qo‘shish
      </button>

      <button class="primary" onclick="saveNew()">
        💾 Saqlash
      </button>

      <button onclick="library()">
        ← Orqaga
      </button>
    </div>
  </div>`;

  addForm();
}

function addForm(q={
  question:"",
  options:["","","",""],
  correctAnswer:0
}){
  let d=document.createElement("div");
  d.className="card";

  let radioName="r"+Date.now()+Math.random();

  d.innerHTML=`
    <input
      class="field q"
      placeholder="Savol"
      value="${esc(q.question)}">

    ${q.options.map((x,i)=>`
      <input
        class="field o"
        placeholder="${String.fromCharCode(65+i)} variant"
        value="${esc(x)}">
    `).join("")}

    <p>To‘g‘ri javob:</p>

    ${["A","B","C","D"].map((x,i)=>`
      <label>
        <input
          type="radio"
          name="${radioName}"
          value="${i}"
          ${q.correctAnswer===i?"checked":""}>
        ${x}
      </label>
    `).join("")}

    <br>

    <button
      class="danger"
      onclick="this.parentElement.remove()">
      🗑 Savolni o‘chirish
    </button>
  `;

  document.getElementById("forms").appendChild(d);
}

function collect(){
  return [...document.querySelectorAll("#forms .card")]
    .map(d=>({
      question:d.querySelector(".q").value.trim(),

      options:[
        ...d.querySelectorAll(".o")
      ].map(x=>x.value.trim()),

      correctAnswer:Number(
        d.querySelector("input[type=radio]:checked")?.value||0
      )
    }))
    .filter(q=>
      q.question &&
      q.options.length===4 &&
      q.options.every(Boolean)
    );
}

function saveNew(){
  let q=collect();

  if(!q.length){
    alert("Kamida bitta to‘liq savol kiriting.");
    return;
  }

  tests.push({
    id:"t"+Date.now(),
    name:
      document.getElementById("name").value.trim() ||
      "Yangi test",
    questions:q
  });

  save();
  library();
}

function edit(i){
  let t=tests[i];

  document.getElementById("app").innerHTML=`
  <div class="container">
    <div class="card">

      <h2>✏️ Testni tahrirlash</h2>

      <input
        id="name"
        class="field"
        value="${esc(t.name)}">

      <div id="forms"></div>

      <button class="secondary" onclick="addForm()">
        ➕ Savol qo‘shish
      </button>

      <button class="primary" onclick="saveEdit(${i})">
        💾 Saqlash
      </button>

      <button onclick="library()">
        ← Orqaga
      </button>

    </div>
  </div>`;

  t.questions.forEach(q=>addForm(q));
}

function saveEdit(i){
  let q=collect();

  if(!q.length){
    alert("Kamida bitta to‘liq savol kiriting.");
    return;
  }

  tests[i].name=
    document.getElementById("name").value.trim() ||
    "Test";

  tests[i].questions=q;

  save();
  library();
}

function del(i){
  if(confirm("Bu test o‘chirilsinmi?")){
    tests.splice(i,1);
    save();
    library();
  }
}

function start(i){
  cur={
    ...tests[i],
    questions:tests[i].questions.map(q=>{

      let a=q.options
        .map((x,j)=>({x,j}))
        .sort(()=>Math.random()-.5);

      return {
        question:q.question,
        options:a.map(z=>z.x),
        correctAnswer:
          a.findIndex(z=>z.j===q.correctAnswer)
      };
    })
  };

  qidx=0;
  score=0;

  showQ();
}

function speak(text){
  if("speechSynthesis" in window){
    speechSynthesis.cancel();

    let u=new SpeechSynthesisUtterance(text);

    u.lang="en-US";
    u.rate=.9;

    speechSynthesis.speak(u);
  }
}

function showQ(){
  answered=false;

  let q=cur.questions[qidx];

  document.getElementById("app").innerHTML=`
  <div class="container">
    <div class="card">

      <p>
        ${esc(cur.name)}
        —
        ${qidx+1}/${cur.questions.length}
      </p>

      <h2>${esc(q.question)}</h2>

      <button
        class="secondary"
        onclick="speakQuestion()">
        🔊 Savolni o‘qish
      </button>

      <button
        class="secondary"
        onclick="readAll()">
        🔊 Read All
      </button>

      <div id="opts"></div>

      <div id="fb"></div>

    </div>
  </div>`;

  q.options.forEach((x,i)=>{

    let b=document.createElement("button");

    b.className="option";

    b.innerHTML=
      `${String.fromCharCode(65+i)}) ${esc(x)} 🔊`;

    b.onclick=()=>answer(i);

    b.oncontextmenu=e=>{
      e.preventDefault();
      speak(x);
    };

    document.getElementById("opts").appendChild(b);
  });
}

function speakQuestion(){
  speak(cur.questions[qidx].question);
}

function readAll(){
  let q=cur.questions[qidx];

  speak(
    q.question+
    ". "+
    q.options
      .map((x,i)=>
        String.fromCharCode(65+i)+". "+x
      )
      .join(". ")
  );
}

function answer(i){
  if(answered)return;

  answered=true;

  let q=cur.questions[qidx];

  let buttons=[
    ...document.querySelectorAll(".option")
  ];

  let correct=i===q.correctAnswer;

  buttons[q.correctAnswer]
    .classList.add("correct");

  if(!correct){
    buttons[i].classList.add("wrong");
  }

  if(correct){
    score++;
  }

  document.getElementById("fb").innerHTML=`
    <div class="${correct?"ok":"bad"}">

      <b>
        ${correct?"🟢 Correct!":"🔴 Incorrect!"}
      </b>

      ${
        correct
        ? ""
        : `<br>
           To‘g‘ri javob:
           ${String.fromCharCode(65+q.correctAnswer)})
           ${esc(q.options[q.correctAnswer])}`
      }

    </div>

    <button
      class="primary"
      onclick="next()">

      ${
        qidx<cur.questions.length-1
        ?"Keyingi savol →"
        :"Natija"
      }

    </button>
  `;

  speak(
    correct
    ?"Correct!"
    :"Incorrect. The correct answer is "+
      q.options[q.correctAnswer]
  );
}

function next(){
  if(qidx<cur.questions.length-1){
    qidx++;
    showQ();
  }else{
    result();
  }
}

function result(){
  let p=Math.round(
    score/cur.questions.length*100
  );

  document.getElementById("app").innerHTML=`
  <div class="container">
    <div class="hero">

      <h1>📊 Yakuniy natija</h1>

      <h2>
        ${score}/${cur.questions.length}
      </h2>

      <h2>${p}%</h2>

      <button
        class="primary"
        onclick="start(${tests.findIndex(t=>t.id===cur.id)})">

        🔄 Qayta ishlash
      </button>

      <button onclick="library()">
        📚 Kutubxona
      </button>

    </div>
  </div>`;
}

async function importWord(file){

  try{

    if(!file)return;

    if(!window.JSZip){
      throw Error(
        "Word import uchun internet kerak."
      );
    }

    let z=
      await JSZip.loadAsync(file);

    let entry=z.file("word/document.xml");

    if(!entry){
      throw Error(
        "Bu fayl haqiqiy DOCX Word fayli emas."
      );
    }

    let xml=
      await entry.async("string");

    let doc=
      new DOMParser()
      .parseFromString(
        xml,
        "application/xml"
      );

    let lines=[
      ...doc.getElementsByTagName("w:p")
    ]
    .map(p=>
      [...p.getElementsByTagName("w:t")]
        .map(t=>t.textContent)
        .join("")
        .replace(/\s+/g," ")
        .trim()
    )
    .filter(Boolean);

    let qs=[];

    for(
      let i=0;
      i<lines.length-5;
      i++
    ){

      let validOptions=
        ["A","B","C","D"].every(
          (c,j)=>
            new RegExp(
              "^"+c+"\\)\\s+"
            ).test(lines[i+1+j])
        );

      let validAnswer=
        /^Answer:\s*[A-D]$/i
          .test(lines[i+5]);

      if(validOptions && validAnswer){

        let options=
          lines
            .slice(i+1,i+5)
            .map(x=>
              x.replace(
                /^[A-D]\)\s+/,
                ""
              ).trim()
            );

        let correctAnswer=
          "ABCD".indexOf(
            lines[i+5]
              .split(":")[1]
              .trim()
              .toUpperCase()
          );

        qs.push({
          question:lines[i],
          options:options,
          correctAnswer:correctAnswer
        });

        i+=5;
      }
    }

    if(!qs.length){
      throw Error(
        "Word faylda test topilmadi.\n\n"+
        "Format:\n"+
        "savol\n"+
        "A) variant\n"+
        "B) variant\n"+
        "C) variant\n"+
        "D) variant\n"+
        "Answer: B"
      );
    }

    tests.push({
      id:"t"+Date.now(),
      name:file.name.replace(
        /\.docx$/i,
        ""
      ),
      questions:qs
    });

    save();

    alert(
      qs.length+
      " ta savol import qilindi."
    );

    library();

  }catch(e){

    alert(
      "Word import xatosi:\n"+
      e.message
    );
  }
}

home();
