/* Layered constellation: bounded rendering, local interaction, quiet motion. */
(() => {
 const host=document.querySelector('.ambient-bg'); if(!host)return;
 const canvas=document.createElement('canvas');canvas.className='depth-field';canvas.setAttribute('aria-hidden','true');host.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let w=0,h=0,points=[],dust=[],ripples=[],frame=0,last=0,time=0;
 const mouse={x:-9999,y:-9999},offset={x:0,y:0};
 function resize(){
  w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  let seed=42;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
  points=Array.from({length:Math.min(105,Math.max(34,Math.round(w*h/11500)))},()=>({x:rand()*w,y:rand()*h,z:.25+rand()*.75,phase:rand()*Math.PI*2}));
  dust=Array.from({length:w<600?35:85},()=>({x:rand()*w,y:rand()*h,a:.08+rand()*.18}));draw();
 }
 function dot(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 function draw(){
  ctx.clearRect(0,0,w,h);const active=mouse.x>=0&&!reduced.matches;
  offset.x+=((active?(mouse.x-w/2)*.025:0)-offset.x)*.055;
  offset.y+=((active?(mouse.y-h/2)*.025:0)-offset.y)*.055;
  const gx=active?mouse.x:w*.72,gy=active?mouse.y:h*.4;
  const glow=ctx.createRadialGradient(gx,gy,0,gx,gy,Math.min(w,550));glow.addColorStop(0,'rgba(48,119,153,.12)');glow.addColorStop(1,'rgba(9,12,16,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  dust.forEach(p=>dot(p.x+offset.x*.2,p.y+offset.y*.2,.65,`rgba(183,212,232,${p.a})`));
  ripples=ripples.filter(r=>time-r.start<1.6);
  const projected=points.map(p=>{
   let x=p.x+Math.sin(time*.15+p.phase)*22*p.z+offset.x*p.z,y=p.y+Math.cos(time*.12+p.phase)*18*p.z+offset.y*p.z;
   const dx=x-mouse.x,dy=y-mouse.y,d=Math.hypot(dx,dy);
   if(active&&d<230&&d>1){const force=(1-d/230)*18*p.z;x-=dy/d*force;y+=dx/d*force;}
   let pulse=0;for(const r of ripples){const distance=Math.hypot(x-r.x,y-r.y);pulse=Math.max(pulse,Math.max(0,1-Math.abs(distance-(time-r.start)*210)/45)*(1-(time-r.start)/1.6));}
   return{x,y,z:p.z,light:Math.max(active?Math.max(0,1-d/240):0,pulse)};
  });
  const reach=w<600?135:185;
  projected.forEach((p,i)=>{
   const neighbors=[];
   for(let j=i+1;j<projected.length;j++){const q=projected[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<reach)neighbors.push({q,d,j});}
   neighbors.sort((a,b)=>a.d-b.d);
   for(const {q,d,j} of neighbors.slice(0,3)){
    const light=Math.max(p.light,q.light),alpha=(1-d/reach)*(.18+light*.34);
    ctx.lineWidth=.6;ctx.strokeStyle=`rgba(133,187,213,${alpha})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
    if((i+j)%7===0&&!reduced.matches){const t=(time*.16+i*.19)%1;dot(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,1.3,`rgba(183,231,244,${alpha*2})`);}
   }
   dot(p.x,p.y,.65+p.z,`rgba(179,220,236,${.25+p.z*.35+p.light*.3})`);
   if(p.light>.05){dot(p.x,p.y,5+p.light*5,`rgba(129,198,230,${p.light*.045})`);dot(p.x,p.y,2,`rgba(219,246,252,${p.light*.65})`);}
  });
  for(const r of ripples){const age=time-r.start;ctx.strokeStyle=`rgba(156,214,234,${.16*(1-age/1.6)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.arc(r.x,r.y,age*210,0,Math.PI*2);ctx.stroke();}
 }
 function tick(now){frame=0;if(document.hidden||reduced.matches)return;const dt=now-last;if(dt>=32){time+=Math.min(dt,64)/1000;last=now;draw();}frame=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(frame);frame=0;last=performance.now();if(reduced.matches){ripples=[];offset.x=offset.y=0;}draw();if(!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}
 addEventListener('resize',resize,{passive:true});
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!reduced.matches){mouse.x=e.clientX;mouse.y=e.clientY;}},{passive:true});
 addEventListener('pointerdown',e=>{if(reduced.matches||e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button,input,textarea,select,summary'))return;ripples.push({x:e.clientX,y:e.clientY,start:time});if(ripples.length>3)ripples.shift();},{passive:true});
 function leave(){mouse.x=mouse.y=-9999;}
 document.documentElement.addEventListener('pointerleave',leave);addEventListener('blur',leave);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();sync();
})();
