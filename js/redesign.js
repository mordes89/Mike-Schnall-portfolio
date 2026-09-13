(() => {
 const hero=document.querySelector('#hero'), background=hero.querySelector('.hero-bg'), next=hero.querySelector('.hero-img-next');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let interval=null, paused=false, ready=next.complete&&next.naturalWidth>0;
 const pause=document.createElement('button');pause.type='button';pause.className='hero-pause';pause.textContent='Pause photos';pause.setAttribute('aria-label','Pause background photo slideshow');hero.append(pause);
 function syncSlides(){clearInterval(interval);interval=null;pause.hidden=motion.matches||!ready;if(motion.matches)background.classList.remove('show-next');if(ready&&!paused&&!motion.matches&&!document.hidden)interval=setInterval(()=>background.classList.toggle('show-next'),11200);}
 next.addEventListener('load',()=>{ready=true;syncSlides();});
 next.addEventListener('error',()=>{ready=false;background.classList.remove('show-next');syncSlides();});
 pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Play photos':'Pause photos';pause.setAttribute('aria-label',paused?'Play background photo slideshow':'Pause background photo slideshow');syncSlides();});
 motion.addEventListener('change',syncSlides);document.addEventListener('visibilitychange',syncSlides);syncSlides();
 // Reveal the name once, using the original template's typing cadence.
 const title=hero.querySelector('.hero-title');
 if(!motion.matches){const name=title.textContent;title.textContent='';[...name].forEach((letter,index)=>{const character=document.createElement('span');character.className='name-character';character.textContent=letter;character.setAttribute('aria-hidden','true');character.style.animationDelay=`${500+index*150}ms`;title.append(character);});}
 const menu=document.querySelector('#navToggle'), nav=document.querySelector('#navLinks');
 function close(){nav.classList.remove('active');menu.setAttribute('aria-expanded','false');}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('active',open);menu.setAttribute('aria-expanded',String(open));});
 document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))close();});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('active')){close();menu.focus();}});
 if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el);}});}
})();

(() => {
 const button=document.getElementById('sharePage');
 if(!button)return;
 const status=document.getElementById('shareStatus');
 const fallback=document.getElementById('shareFallback');
 const url='https://mordes89.github.io/Mike-Schnall-portfolio/';
 button.addEventListener('click',async()=>{
  status.textContent='';fallback.hidden=true;
  if(navigator.share){
   try{await navigator.share({title:'Mike Schnall | Portfolio',text:'Explore Mike Schnall’s portfolio.',url});return;}
   catch(error){if(error.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(url);status.textContent='Link copied. Paste it wherever you’d like to share.';}
  catch{fallback.hidden=false;status.textContent='Copy the link below to share this page.';}
 });
})();
