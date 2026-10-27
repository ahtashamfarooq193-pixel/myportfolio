(() => {
 const contents=document.querySelector('.article-sidebar details');
 if(contents && matchMedia('(max-width:800px)').matches) contents.open=false;
 const links=[...document.querySelectorAll('.article-sidebar a[href^="#"]')];
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;links.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-5% 0px -60% 0px'});document.querySelectorAll('.article-prose h2[id]').forEach(el=>io.observe(el));}
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
