const sleep=t=>new Promise(e=>setTimeout(e,t)),fetchTextFile=async t=>{try{let e=await fetch(t);if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let l=await e.text();return l.split("\n")}catch(n){return console.error("Error fetching the text file:",n),[]}},floodfill=async(t,e,l)=>{let n=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1],],o=(e,l)=>e>=0&&e<t.length&&l>=0&&l<t[0].length,a=[],r=new Set,i=new Set;for(let s=0;s<t.length;s++)for(let p=0;p<t[0].length;p++)null!==t[s][p]&&(a.push([s,p,t[s][p]]),i.add(`${s},${p}`));async function h(){let s=0;for(;a.length>0&&s<30;){let[p,c,f]=a.shift();if(r.has(`${p},${c}`)){s++;continue}if(r.add(`${p},${c}`),!i.has(`${p},${c}`)){let $=f.cloneNode(!0);f.parentNode.appendChild($),$.style.top=`${p*l}px`,$.style.left=`${c*e}px`,t[p][c]=$}for(let[d,y]of n){let g=p+d,u=c+y;o(g,u)&&null===t[g][u]&&(t[g][u]=f,a.push([g,u,f]))}s++}a.length>0&&(await sleep(20),await h())}await h()},applyFrameToGrid=(t,e)=>{let l=e.length,n=e[0].length;for(let o=0;o<40;o++){let a=Math.floor(o*(l/40));for(let r=0;r<40;r++){let i=Math.floor(r*(n/40));"b"===t[40*o+r]?e[a]&&e[a][i]&&(e[a][i].style.opacity=0):e[a]&&e[a][i]&&(e[a][i].style.opacity=1)}}},run=async()=>{let t=new Audio("https://raw.githubusercontent.com/vincent-qc/bad-sio-apple/main/badapple.mp3");t.crossOrigin="anonymous",t.preload="auto",t.volume=.5,await new Promise(e=>{t.addEventListener("canplaythrough",e,{once:!0})});let e=await fetchTextFile("https://raw.githubusercontent.com/vincent-qc/bad-sio-apple/refs/heads/main/badapple.txt"),l=document.getElementById("main-container"),n=document.querySelector(".f-pnl.col-lg-8.float-left.pad-right-none"),o=document.querySelector(".f-pnl.right-portal-col.side-tips.col-lg-4.float-right.side-tips-collapse-middle.pad-right-none");l.style.maxWidth="100%",n.style.maxWidth="80%",o.style.maxWidth="20%";let a=document.querySelectorAll(".minor-time-interval");if(a.length<1){console.error("No time intervals found");return}let r=Math.ceil(a.length/6),i=Array.from({length:r},()=>Array.from({length:30},()=>null)),s=13.5*a[0].clientHeight/2,p=a[0].clientWidth/30,h=document.querySelectorAll(".gwt-appointment");for(let c of h){let f=Math.floor(parseInt(c.style.left)/3.3),$=Math.floor(parseInt(c.style.top)/s);c.style.height=`${s}px`,c.style.width=`${p}px`,c.style.top=`${$*s}px`,c.style.left=`${f*p}px`,i[$][f]=c,await sleep(20)}await floodfill(i,p,s),setTimeout(async()=>{t.play();let l=0,n=()=>{l>=e.length||(applyFrameToGrid(e[l],i),l++,setTimeout(n,128))};n()},400)};run();
