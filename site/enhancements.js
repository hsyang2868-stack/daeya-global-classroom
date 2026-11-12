const root = document.querySelector('main');
const teacherButton = document.querySelector('#teacher-toggle');
teacherButton.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('teacher-mode');
  teacherButton.setAttribute('aria-pressed', String(enabled));
  teacherButton.textContent = enabled ? '학생 화면으로 보기' : '선생님 화면';
});
const questions = [
  {prompt:'학교에서 버려진 쓰레기에 대한 설명으로 알맞은 것은?', options:['모든 쓰레기는 반드시 바다에 도착한다.','비와 바람에 이동할 수 있지만, 수거와 처리로 유출을 줄일 수 있다.','바다에서 먼 학교는 해양 오염과 관계없다.'], answer:1, explanation:'자료 A처럼 이동 가능성과 수거·처리를 함께 생각해야 해요. 모든 쓰레기가 바다에 도달하는 것은 아니에요.'},
  {prompt:'자료 B에서 찾을 수 있는 플라스틱 오염의 영향은?', options:['동물이 플라스틱에 걸리거나 먹이로 착각할 수 있다.','플라스틱은 모든 동물의 먹이가 된다.','영향은 쓰레기를 버린 사람에게만 생긴다.'], answer:0, explanation:'자료 B는 동물과 생태계에 미치는 영향을 설명해요. 문제를 설명할 때 자료 속 근거를 함께 말해 보세요.'},
  {prompt:'개인의 실천과 사회의 협력을 함께 담은 해결안은?', options:['우리 반만 분리배출하면 모든 문제가 해결된다.','국제 협약이 생길 때까지 아무것도 하지 않는다.','우리 반은 일회용품을 줄이고, 지역사회·국가는 수거 체계와 감량 정책을 개선한다.'], answer:2, explanation:'개인과 학교의 행동에 지역사회·국가의 제도와 협력이 더해져야 해요. 각 주체가 맡을 일을 구체적으로 정해 보세요.'}
];
const attempts = new Map(), finished = new Set();
const quiz = document.querySelector('#practice-questions');
questions.forEach((q,i) => {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend'); legend.textContent = `${i+1}. ${q.prompt}`; fieldset.append(legend);
  q.options.forEach((text,j) => {
    const label = document.createElement('label'); const input = document.createElement('input');
    input.type='radio'; input.name=`practice-${i}`; input.value=String(j);
    label.append(input,document.createTextNode(text)); fieldset.append(label);
  });
  const check=document.createElement('button'); check.type='button'; check.textContent='답 확인';
  const reveal=document.createElement('button'); reveal.type='button'; reveal.textContent='정답과 해설 보기'; reveal.className='secondary';
  const feedback=document.createElement('p'); feedback.setAttribute('role','status');
  function complete(message) {
    feedback.textContent=message; finished.add(i); check.disabled=true; reveal.disabled=true;
    document.querySelector('#practice-progress').textContent=`${finished.size} / 3문항 확인${finished.size===3 ? ' · 해설까지 살펴봤어요! 이제 해결안을 제안해 보세요.' : ''}`;
  }
  check.addEventListener('click', () => {
    const selected=fieldset.querySelector('input:checked');
    if(!selected){feedback.textContent='먼저 보기를 하나 골라 주세요.';return;}
    if(Number(selected.value)===q.answer){complete(`정답이에요. ${q.explanation}`);return;}
    const count=(attempts.get(i)||0)+1; attempts.set(i,count);
    if(count<2)feedback.textContent='자료를 다시 읽고 한 번 더 생각해 보세요.';
    else complete(`정답: ${q.options[q.answer]} ${q.explanation}`);
  });
  reveal.addEventListener('click',()=>complete(`정답: ${q.options[q.answer]} ${q.explanation}`));
  fieldset.append(check,reveal,feedback); quiz.append(fieldset);
});
const planForm=document.querySelector('#plan-form');
const planOutput=document.querySelector('#plan-output');
planForm.addEventListener('submit',event=>{
  event.preventDefault(); planOutput.replaceChildren();
  const title=document.createElement('h3');title.textContent='우리 모둠의 바다 지키기 제안';planOutput.append(title);
  for(const [key,label] of [['problem','문제와 영향'],['evidence','자료에서 찾은 근거'],['actor','함께할 주체'],['action','구체적인 실천'],['measure','확인 방법']]){
    const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+': ';
    p.append(strong,document.createTextNode(planForm.elements.namedItem(key).value.trim()));planOutput.append(p);
  }
  planOutput.hidden=false;document.querySelector('#print-plan').disabled=false;planOutput.focus();
});
document.querySelector('#print-plan').addEventListener('click',()=>window.print());
document.querySelector('#clear-plan').addEventListener('click',()=>{planForm.reset();planOutput.replaceChildren();planOutput.hidden=true;document.querySelector('#print-plan').disabled=true;document.querySelector('#problem').focus();});
