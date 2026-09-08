const API="https://openlibrary.org/search.json";
const KEY="personal-reading-list";
const form=document.querySelector("#searchForm"), input=document.querySelector("#searchInput");
const status=document.querySelector("#status"), results=document.querySelector("#results");
const resultsGrid=document.querySelector("#resultsGrid"), resultCount=document.querySelector("#resultCount");
const list=document.querySelector("#list"), listCount=document.querySelector("#listCount");
let saved=JSON.parse(localStorage.getItem(KEY)||"[]");

const esc=s=>String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const cover=id=>id?`https://covers.openlibrary.org/b/id/${id}-M.jpg`:"";

function state(type,title,text,button=""){
 status.innerHTML=`<div class="state ${type}" role="${type==="error"?"alert":"status"}"><h2>${title}</h2><p>${text}</p>${button}</div>`;
}
function clearState(){status.innerHTML=""}

function card(book,remove=false){
 const title=esc(book.title), author=esc((book.author_name||["Unknown author"])[0]), img=cover(book.cover_i);
 return `<article class="card">${img?`<img class="cover" src="${img}" alt="Cover of ${title}" loading="lazy">`:`<div class="cover placeholder" role="img" aria-label="No cover available">No cover</div>`}
 <h3>${title}</h3><p class="author">${author}</p><div class="actions">${
 remove?`<button class="remove" data-remove="${esc(book.key)}" aria-label="Remove ${title} from reading list">Remove</button>`:
 saved.some(x=>x.key===book.key)?`<button class="saved" disabled>Already saved</button>`:
 `<button data-add="${esc(book.key)}">Add to reading list</button>`}</div></article>`;
}

function renderList(){
 listCount.textContent=`${saved.length} ${saved.length===1?"book":"books"}`;
 if(!saved.length){
   list.innerHTML=`<div class="state empty" style="grid-column:1/-1"><h2>Your list is empty</h2><p>This is where you can keep books you want to read later. Search above and add your first one.</p><button id="firstAction" type="button">Find your first book</button></div>`;
   document.querySelector("#firstAction").onclick=()=>input.focus();
 }else{
   list.innerHTML=saved.map(x=>card(x,true)).join("");
   list.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeBook(b.dataset.remove));
 }
}
function persist(){localStorage.setItem(KEY,JSON.stringify(saved))}
function addBook(book){if(saved.some(x=>x.key===book.key))return;saved.push(book);persist();renderList();search(input.value.trim())}
function removeBook(key){saved=saved.filter(x=>x.key!==key);persist();renderList();if(input.value.trim())search(input.value.trim())}

async function search(query){
 state("loading","Loading books…","We’re searching the Open Library catalogue. Please wait.");
 results.hidden=true;
 try{
   const r=await fetch(`${API}?title=${encodeURIComponent(query)}&limit=9&fields=key,title,author_name,cover_i`);
   if(!r.ok)throw Error();
   const data=await r.json(), books=(data.docs||[]).filter(x=>x.key&&x.title);
   clearState();results.hidden=false;resultCount.textContent=`${books.length} result${books.length===1?"":"s"}`;
   if(!books.length){resultsGrid.innerHTML=`<div class="state empty" style="grid-column:1/-1"><h2>No books found</h2><p>We couldn’t find a match. Try a different title or author.</p></div>`;return}
   resultsGrid.innerHTML=books.map(card).join("");
   resultsGrid.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addBook(books.find(x=>x.key===b.dataset.add)));
 }catch{
   results.hidden=true;
   state("error","We couldn’t load the books","The book search failed. Check your connection and try again.",`<button id="retry" type="button">Try again</button>`);
   document.querySelector("#retry").onclick=()=>search(query);
 }
}
form.onsubmit=e=>{e.preventDefault();const q=input.value.trim();if(!q){state("error","Search term needed","Enter a book title or author, then select Search.");input.focus();return}search(q)}
renderList();