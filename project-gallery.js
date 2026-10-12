(() => {
 const grid=document.querySelector('#projects .projects-grid'); if(!grid)return;
 const cards=[...grid.children], names=['SwitchON','Strug','Briefbox','RydeIt','FireTexts AI','Innovative AI'];
 let active=0, start=null, suppressClick=false;
 const toolbar=document.createElement('div'); toolbar.className='gallery-toolbar';
 toolbar.innerHTML='<div><span class="gallery-eyebrow">THE PROJECT ORBIT</span><p>Swipe left or right to explore.</p></div><div class="gallery-controls"><span class="gallery-count" aria-live="polite"></span><button type="button" aria-label="Previous project">&#8592;</button><button type="button" aria-label="Next project">&#8594;</button></div>';
 grid.before(toolbar);
 const details=document.createElement('div');details.className='orbit-details';grid.after(details);
 const contents=[];
 cards.forEach((card,i)=>{
  card.classList.remove('reveal');
  const content=card.querySelector('.project-content');content.id=`orbit-detail-${i}`;contents.push(content);details.append(content);
  const button=document.createElement('button');button.type='button';button.className='gallery-trigger';button.setAttribute('aria-controls',content.id);
  button.innerHTML=`<span class="gallery-number">0${i+1}</span><span class="gallery-title">${names[i]}</span><span aria-hidden="true">&#8599;</span>`;
  card.append(button); button.onclick=()=>{if(!suppressClick)select(i)};
  card.querySelector('img').draggable=false;
 });
 function select(index){
  active=(index+cards.length)%cards.length;
  cards.forEach((card,i)=>{
   let offset=(i-active+cards.length)%cards.length;if(offset>2)offset-=cards.length;
   card.dataset.position=String(offset);card.classList.toggle('is-active',i===active);
   const hidden=offset===-3;card.inert=hidden;card.setAttribute('aria-hidden',String(hidden));
   card.querySelector('button').setAttribute('aria-expanded',String(i===active));
   contents[i].hidden=i!==active;
  });
  toolbar.querySelector('.gallery-count').textContent=`0${active+1} / 06`;
 }
 const arrows=toolbar.querySelectorAll('button');arrows[0].onclick=()=>select(active-1);arrows[1].onclick=()=>select(active+1);
 grid.tabIndex=0;
 grid.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();select(e.key==='Home'?0:e.key==='End'?5:active+(e.key==='ArrowRight'?1:-1));grid.focus({preventScroll:true});});
 // Trackpads emit horizontal wheel events, including momentum after release.
 let wheelDistance=0, wheelLocked=false, wheelReset, wheelDirection=0;
 let lastStep=-Infinity, previousDelta=0, repeatDistance=0;
 grid.addEventListener('wheel',e=>{
  if(e.ctrlKey||Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;
  e.preventDefault();
  clearTimeout(wheelReset);
  wheelReset=setTimeout(()=>{wheelDistance=0;wheelLocked=false;wheelDirection=0;previousDelta=0;repeatDistance=0;},90);
  const scale=e.deltaMode===1?16:e.deltaMode===2?grid.clientWidth:1;
  const delta=Math.abs(e.deltaX*scale), now=performance.now();
  const direction=Math.sign(e.deltaX);
  if(wheelDirection && direction!==wheelDirection){wheelDistance=0;wheelLocked=false;repeatDistance=0;}
  wheelDirection=direction;
  // Momentum can overlap the next finger stroke: do not wait indefinitely for silence.
  if(wheelLocked){
   const renewedStroke=delta>=6 && delta>previousDelta*1.4;
   const sustainedStroke=delta>=6 && delta>=previousDelta*.95;
   if(now-lastStep>=240){
    repeatDistance=sustainedStroke?repeatDistance+delta:0;
    if(renewedStroke||repeatDistance>=36){wheelLocked=false;wheelDistance=0;repeatDistance=0;}
   }
   previousDelta=delta;
   if(wheelLocked)return;
  }
  previousDelta=delta;
  if(wheelDistance && Math.sign(wheelDistance)!==Math.sign(e.deltaX))wheelDistance=0;
  wheelDistance+=e.deltaX*scale;
  if(Math.abs(wheelDistance)>=12){select(active+(wheelDistance>0?1:-1));wheelLocked=true;lastStep=now;repeatDistance=0;}
 },{passive:false});
 grid.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='mouse')return;start={x:e.clientX,y:e.clientY,id:e.pointerId};suppressClick=false;});
 grid.addEventListener('pointermove',e=>{
  if(!start||e.pointerId!==start.id)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)){
   suppressClick=true;grid.classList.add('is-dragging');
   if(!grid.hasPointerCapture(e.pointerId))grid.setPointerCapture(e.pointerId);
  }
 });
 window.addEventListener('pointerup',e=>{
  if(!start||e.pointerId!==start.id)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;
  grid.classList.remove('is-dragging');
  if(grid.hasPointerCapture(e.pointerId))grid.releasePointerCapture(e.pointerId);
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;select(active+(dx<0?1:-1));}
  setTimeout(()=>suppressClick=false,0);
 });
 grid.addEventListener('pointercancel',()=>{start=null;suppressClick=false;grid.classList.remove('is-dragging');});
 grid.classList.add('project-gallery');grid.setAttribute('aria-label','Project carousel. Swipe or select a card.');select(0);
})();
