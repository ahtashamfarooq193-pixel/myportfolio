(() => {
 const form=document.querySelector('#contactForm');if(!form)return;
 form.classList.add('code-workspace');
 form.querySelector('.brief-heading').innerHTML='<div class="workspace-title"><span class="window-dots" aria-hidden="true">&#9679; &#9679; &#9679;</span><span>ahtasham / collaboration</span><span aria-hidden="true">&lt;/&gt;</span></div>';
 const body=form.querySelector('.editor-body');
 const shell=document.createElement('div');shell.className='workspace-shell';body.before(shell);
 const explorer=document.createElement('aside');explorer.className='workspace-explorer';explorer.setAttribute('aria-label','Workspace decoration');explorer.innerHTML='<span class="explorer-heading">EXPLORER</span><p>&#8964; portfolio</p><span class="explorer-file">&#9639; README.md</span><span class="explorer-file selected">TS contact.ts</span><span class="explorer-file">&#9671; ideas.json</span><div class="explorer-bottom">BRANCH<br><strong>&#9095; next-big-thing</strong></div>';shell.append(explorer,body);
 const top=document.createElement('div');top.className='workspace-file';top.innerHTML='<span>TS</span> contact.ts <i aria-hidden="true"></i>';body.prepend(top);
 const intro=document.createElement('div');intro.className='code-intro';intro.innerHTML='<p><span class="syntax-comment">// Your idea. My next commit.</span></p><h3>Let&#39;s build<br><span>something great.</span></h3><p><span class="syntax-purple">const</span> <span class="syntax-blue">yourProject</span> = {</p>';top.after(intro);
 const labels=['name','email','subject','message'];
 body.querySelectorAll('.form-group').forEach((g,i)=>{g.dataset.line=String(i+3).padStart(2,'0');g.querySelector('label').innerHTML=`<span class="syntax-key">${labels[i]}</span><span class="syntax-punctuation">:</span> <span class="code-field-hint">${['Full name','Email address','Project subject','Your message'][i]} *</span>`;});
 const close=document.createElement('p');close.className='code-outro';close.textContent='};';body.append(close);
 const terminal=form.querySelector('.editor-terminal');terminal.querySelector('.brief-note').innerHTML='<span class="console-tab">OUTPUT</span><span class="console-command"><span class="syntax-green">&#10140;</span> send(yourProject)<span class="console-caret" aria-hidden="true">_</span></span>';
 const status=document.createElement('div');status.className='workspace-status';status.innerHTML='<span>&#9095; main &nbsp; &#10003; Ready to connect</span><span>UTF-8 &nbsp; TypeScript</span>';form.append(status);
})();
