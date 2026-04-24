/* ============================================================
   CS1231 Study Guide — Shared JavaScript (nav.js)
   Provides: show(), tog(), rerender(), buildQuiz(), answer()
   Each chapter HTML must still define:
     - init()           (calls chapter-specific tool builders + rerender)
     - QUIZ             (array of quiz question objects)
     - Any tool-specific functions (calculators, simulators, etc.)
   ============================================================ */

var DLMS = [
  { left: '\\(', right: '\\)', display: false },
  { left: '\\[', right: '\\]', display: true  }
];

var qScore    = 0;
var qTotal    = 0;
var qAnswered = [];

/* --- Section switching --- */
function show(id, btn) {
  var secs = document.querySelectorAll('.sec');
  for (var i = 0; i < secs.length; i++) secs[i].classList.remove('on');
  document.getElementById(id).classList.add('on');

  var btns = document.querySelectorAll('.nb');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('act');
  btn.classList.add('act');
}

/* --- Toggle tutorial solution --- */
function tog(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var isOpen = el.classList.contains('open');
  el.classList.toggle('open');
  var btn = el.previousElementSibling;
  if (btn && btn.classList.contains('togbtn'))
    btn.textContent = isOpen ? 'Show solution \u25be' : 'Hide solution \u25b4';
  if (!isOpen) rerender(el);
}

/* --- Re-render KaTeX in a subtree --- */
function rerender(el) {
  if (window.renderMathInElement)
    renderMathInElement(el, {
      delimiters: DLMS,
      throwOnError: false,
      ignoredTags: ['script', 'style', 'textarea', 'pre']
    });
}

/* --- Build quiz from chapter's QUIZ array ---
   Requires in HTML:  <div id="quiz-area"></div>
   Requires globally: window.QUIZ  (set in each chapter's <script>)
*/
function buildQuiz() {
  var area = document.getElementById('quiz-area');
  if (!area || !window.QUIZ) return;
  var html = '';
  for (var i = 0; i < QUIZ.length; i++) {
    qAnswered.push(false);
    html += '<div class="qz" id="qz' + i + '">';
    html += '<p class="qt">Q' + (i + 1) + '. ' + QUIZ[i].q + '</p>';
    for (var j = 0; j < QUIZ[i].opts.length; j++) {
      html += '<button class="opt" onclick="answer(' + i + ',' + j + ')">'
            + String.fromCharCode(65 + j) + '. ' + QUIZ[i].opts[j]
            + '</button>';
    }
    html += '<div class="exp" id="exp' + i + '"></div>';
    html += '</div>';
  }
  area.innerHTML = html;
  rerender(area);
}

/* --- Handle quiz answer --- */
function answer(qi, oi) {
  if (qAnswered[qi]) return;
  qAnswered[qi] = true;
  var q    = QUIZ[qi];
  var box  = document.getElementById('qz' + qi);
  var btns = box.querySelectorAll('.opt');
  var correct = (oi === q.ans);
  if (correct) qScore++;
  qTotal++;

  for (var j = 0; j < btns.length; j++) {
    if      (j === q.ans)            btns[j].classList.add('sel-right');
    else if (j === oi && !correct)   btns[j].classList.add('sel-wrong');
    btns[j].onclick = null;
  }
  box.classList.add(correct ? 'right' : 'wrong');

  var exp = document.getElementById('exp' + qi);
  exp.innerHTML = (correct
    ? '<span class="badge badge-ok">Correct</span> '
    : '<span class="badge badge-err">Incorrect</span> ')
    + q.exp;
  exp.classList.add('open');
  rerender(exp);

  document.getElementById('scv').textContent = qScore + '/' + qTotal;
}
