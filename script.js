/* ===== IonLab – script.js ===== */
const googleDocsURL="MASUKKAN_LINK_GOOGLE_DOCS_DI_SINI"; // <-- GANTI dengan link Google Docs materi
const $=s=>document.querySelector(s),app=$('#app');
const NAMES=['Awal','Diagnostik','Materi','Apersepsi','Prediksi','Virtual Lab','Analisis','Penguatan','Evaluasi'];
const SUBT=['Konsep Dasar','Uji Daya Hantar','Disosiasi, Hidrasi, Ionisasi','Elektrolit Kuat, Lemah, Nonelektrolit','Kekuatan, Konsentrasi & Ion','Miskonsepsi & Pengayaan'];
let S;try{S=JSON.parse(sessionStorage.getItem('ionlab'))}catch(e){}
S=S||{cur:0,done:[0,0,0,0,0,0,0,0,0],sub:0,chk:{},wr:{d:[],f:[],n:[]},sc:{},lab:[],pred:{},act:{},refl:'',crit:''};
const save=()=>sessionStorage.setItem('ionlab',JSON.stringify(S));
const toast=t=>{const e=$('#toast');e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',2200)};
/* --- Karakter ilmuwan (SVG): ok=true jempol, false tangan menyilang --- */
const sci=ok=>`<svg viewBox="0 0 130 150" width="100" style="flex:none"><circle cx="60" cy="40" r="22" fill="#f3c9a5"/><path d="M36 36q4-26 24-24t24 24q-12-9-24-6t-24 6z" fill="#5a3b2a"/><circle cx="52" cy="42" r="7" fill="#fff" stroke="#3b3a33" stroke-width="2"/><circle cx="68" cy="42" r="7" fill="#fff" stroke="#3b3a33" stroke-width="2"/><circle cx="52" cy="42" r="2" fill="#3b3a33"/><circle cx="68" cy="42" r="2" fill="#3b3a33"/><path d="${ok?'M50 52q10 9 20 0':'M52 55h16'}" stroke="#b85c3e" stroke-width="3" fill="none"/><path d="M30 150v-52q0-16 30-16t30 16v52z" fill="#fff" stroke="#8fae8b" stroke-width="3"/>${ok?'<rect x="88" y="62" width="14" height="34" rx="7" fill="#f3c9a5" transform="rotate(-15 95 80)"/><rect x="92" y="46" width="9" height="22" rx="4.5" fill="#f3c9a5"/><text x="104" y="30" font-size="18" class="sp">✨</text><text x="8" y="40" font-size="16">⭐</text>':'<rect x="34" y="96" width="56" height="12" rx="6" fill="#f3c9a5" transform="rotate(25 62 102)"/><rect x="34" y="96" width="56" height="12" rx="6" fill="#f3c9a5" transform="rotate(-25 62 102)"/><text x="46" y="98" font-size="22">❌</text>'}</svg>`;
const beaker=(c='#ef8f7a')=>`<svg viewBox="0 0 200 180" width="100%"><path d="M50 40h100l-10 120q0 10-10 10H70q-10 0-10-10z" fill="#fff" stroke="#5f8362" stroke-width="4"/><path d="M58 90h84l-6 70H64z" fill="#dcebd9"/><circle cx="85" cy="115" r="8" fill="${c}"/><circle cx="115" cy="130" r="8" fill="#8fae8b"/><circle cx="100" cy="100" r="5" fill="#b85c3e"/><circle cx="100" cy="20" r="14" fill="#fde3d3" stroke="#b85c3e" stroke-width="3"/><path d="M100 34v6" stroke="#b85c3e" stroke-width="3"/></svg>`;
/* ================= QUIZ ENGINE =================
 soal = [pertanyaan, [opsi], indeksBenar, konsep(0-5), penjelasan, [hint1,hint2,hint3]] */
function quiz(el,qs,done){let i=0,sc=0,wr=[];function go(){const q=qs[i];let h=0,first=true;
el.innerHTML=`<small>Soal ${i+1} dari ${qs.length}</small><h3>${q[0]}</h3>${q[1].map((o,j)=>`<button class="opt" data-j="${j}">${o}</button>`).join('')}<div class="hs"></div><div class="fbk"></div><button class="btn ghost hb">💡 Petunjuk</button>`;
const hint=()=>{const H=q[5]||[];if(h<H.length)el.querySelector('.hs').insertAdjacentHTML('beforeend',`<p class="hint"><b>Hint ${h+1}:</b> ${H[h++]}</p>`)};
el.querySelector('.hb').onclick=hint;
el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=+b.dataset.j==q[2],f=el.querySelector('.fbk');
if(ok){if(first)sc++;el.querySelectorAll('.opt').forEach(x=>x.disabled=true);b.classList.add('ok');
f.innerHTML=`<div class="fb good">${sci(1)}<div><b>Benar! Kamu sudah memahami konsepnya.</b><p>${q[4]}</p><button class="btn nx">${i+1<qs.length?'Lanjut':'Selesai'}</button></div></div>`;
f.querySelector('.nx').onclick=()=>{++i<qs.length?go():done(sc,wr)}}
else{if(first){wr.push(q[3]);first=false}b.classList.add('no');b.disabled=true;hint();
f.innerHTML=`<div class="fb bad">${sci(0)}<div><b>Belum tepat. Coba perhatikan petunjuknya.</b><p>Tidak apa-apa, ini cara kita belajar!</p><button class="btn ghost" onclick="this.closest('.fb').remove()">Coba Lagi</button></div></div>`}})}
go()}
/* ================= DATA SOAL (edit di sini) ================= */
const DIAG=[
["Lampu uji tidak menyala pada suatu larutan. Kesimpulan paling tepat?",["Pasti nonelektrolit","Belum tentu: bisa elektrolit lemah/sangat encer sehingga ion terlalu sedikit","Tidak ada elektron bebas","Pasti elektrolit kuat"],1,1,"Lampu padam/sangat redup bisa karena ion sangat sedikit.",["Pikirkan: apakah hanya nonelektrolit yang membuat lampu tak tampak menyala?","Ion sedikit → arus kecil.","Elektrolit sangat encer juga bisa tampak padam."]],
["Lampu A lebih terang daripada lampu B. Pernyataan yang tepat?",["A pasti lebih pekat","A punya lebih banyak ion per volume; belum tentu lebih pekat","Lampu tidak berhubungan dengan ion","B pasti nonelektrolit"],1,4,"Terang lampu bergantung jumlah ion, bukan konsentrasi saja.",["Bandingkan kekuatan elektrolit dan konsentrasi.","Elektrolit kuat bisa encer.","Yang menentukan: jumlah ion total."]],
["Pembawa muatan di dalam larutan elektrolit adalah...",["Elektron bebas","Ion","Molekul air","Atom netral"],1,2,"Di kawat elektron mengalir; di larutan, ion yang bergerak.",["Elektron mengalir di kawat.","Partikel bermuatan di dalam larutan?","Kation ke elektroda negatif, anion ke positif."]],
["NaCl padat tidak menghantarkan listrik karena...",["Tidak tersusun dari ion","Ion ada, tetapi terikat pada posisinya","Tidak ada elektron","Terlalu dingin"],1,2,"Ion pada kristal tidak bebas bergerak.",["NaCl tersusun dari Na⁺ dan Cl⁻.","Apa yang berbeda saat dilarutkan?","Kata kunci: bebas bergerak."]],
["Semua zat yang larut dalam air pasti elektrolit. Benarkah?",["Ya","Tidak, glukosa larut tetapi tetap molekul netral","Ya, semua membentuk ion","Hanya zat padat"],1,0,"Larut tidak sama dengan membentuk ion.",["Pikirkan air gula.","Apakah gula menghasilkan ion?","Larutan gula tidak menyalakan lampu."]]];
const MAT=[
["Konsep Dasar","<b>Elektrolit</b>: zat yang larutannya menghantarkan listrik (NaCl, HCl). <b>Nonelektrolit</b>: larutannya tidak menghantarkan (gula, etanol, urea). Penghantar di larutan adalah <b>ion</b>.",["Mengapa larutan gula tidak menyalakan lampu?",["Gula tidak larut","Gula tetap molekul netral, tidak ada ion bebas","Gula menghasilkan elektron","Air melindungi elektroda"],1,0,"Tidak ada ion bebas.",["Apa yang dibawa arus di larutan?","Apakah gula membentuk ion?","Gula tetap molekul netral."]]],
["Uji Daya Hantar","Rangkaian: sumber listrik, lampu, 2 elektroda. Lampu <b>terang</b> + gelembung banyak = elektrolit kuat; <b>redup</b> + gelembung sedikit = lemah; <b>padam</b> = nonelektrolit. Bandingkan pada konsentrasi yang sama!",["Lampu redup dan gelembung sedikit menunjukkan...",["Nonelektrolit","Elektrolit lemah (ion sedikit)","Pasti konsentrasi rendah","Elektrolit kuat"],1,1,"Ion sedikit pada konsentrasi pembanding.",["Lihat tabel pengamatan.","Redup ≠ padam.","Sedikit ion → elektrolit lemah."]]],
["Disosiasi, Hidrasi, Ionisasi","<b>Disosiasi</b>: senyawa ion terpisah jadi ion (NaCl → Na⁺ + Cl⁻). <b>Hidrasi</b>: ion dikelilingi molekul air. <b>Ionisasi</b>: senyawa molekuler membentuk ion dalam air (HCl → H⁺ + Cl⁻). NaCl padat: ion terikat; leleh/larutan: ion bebas.",["Mengapa NaCl padat tidak menghantarkan listrik?",["Tidak ada ion","Ion terikat kuat pada posisi tetap","Tidak ada air","Elektron terikat"],1,2,"Ion tidak bebas bergerak.",["NaCl padat mengandung ion.","Bandingkan dengan larutan/lelehan.","Ion tidak bebas bergerak."]]],
["Elektrolit Kuat, Lemah, Nonelektrolit","Kuat: terion hampir sempurna, panah <b>→</b>. Lemah: terion sebagian kecil, panah <b>⇌</b> (CH₃COOH 0,10 M hanya ±1,3%). Nonelektrolit: tetap molekul.",["Mengapa CH₃COOH ditulis dengan panah bolak-balik?",["Hanya sebagian terionisasi, terjadi kesetimbangan","Reaksi selesai sempurna","Nonelektrolit","Bereaksi dengan logam"],0,3,"Terion sebagian → kesetimbangan.",["Kuat: panah satu arah.","Berapa persen molekul terionisasi?","Reaksi dua arah → ⇌."]]],
["Kekuatan, Konsentrasi & Ion","Kekuatan = persentase terion. Konsentrasi = mol per liter. Elektrolit kuat sangat encer bisa redup. [ion] = M × koefisien. Contoh CaCl₂ → Ca²⁺ + 2Cl⁻.",["[Cl⁻] dalam CaCl₂ 0,10 M adalah...",["0,10 M","0,20 M","0,30 M","0,05 M"],1,4,"2 × 0,10 = 0,20 M.",["Tulis persamaan disosiasi.","Koefisien Cl⁻ = 2.","2 × 0,10."]]],
["Miskonsepsi & Pengayaan","<b>HCl dan NH₃ sama-sama zat molekuler</b>, tetapi HCl elektrolit kuat sedangkan NH₃ elektrolit lemah. Jenis ikatan saja tidak menentukan kekuatan elektrolit; yang menentukan seberapa banyak zat terionisasi.",["Pernyataan yang benar tentang HCl dan NH₃:",["Keduanya kuat","HCl kuat, NH₃ lemah","Keduanya nonelektrolit","HCl lemah, NH₃ kuat"],1,5,"HCl terion hampir sempurna; NH₃ sebagian.",["Keduanya molekuler.","Mana yang asam kuat?","HCl kuat."]]]];
const FORM=[
["Larutan P (konsentrasi sama) tidak menyalakan lampu, tanpa gelembung. P adalah...",["Elektrolit kuat","Elektrolit lemah","Nonelektrolit","Elektrolit"],2,1,"Tidak ada ion bebas.",["Lihat tabel pengamatan."]],
["Gambaran partikel hanya berisi molekul netral utuh. Zat tersebut...",["Elektrolit kuat","Nonelektrolit","Elektrolit lemah","Senyawa ion"],1,0,"Tidak ada ion.",["Adakah ion?"]],
["Persamaan yang benar untuk asam asetat:",["CH₃COOH → CH₃COO⁻ + H⁺","CH₃COOH ⇌ CH₃COO⁻ + H⁺","CH₃COOH → CH₃COOH","CH₃COOH ⇌ CH₃COOH"],1,3,"Elektrolit lemah → ⇌.",["Kuat atau lemah?"]],
["[NO₃⁻] dalam Ca(NO₃)₂ 0,15 M:",["0,15 M","0,30 M","0,45 M","0,075 M"],1,4,"2 × 0,15 = 0,30 M.",["Ca(NO₃)₂ → Ca²⁺ + 2NO₃⁻"]],
["Lampu redup berarti...",["Nonelektrolit","Elektrolit lemah","Elektrolit kuat pekat","Tidak ada ion sama sekali"],1,1,"Ion ada, tetapi sedikit.",["Redup ≠ padam."]]];
const FIN=[
["(Makro) Lampu pada HNO₃ 0,1 M:",["Padam","Terang, gelembung banyak","Redup","Tidak dapat ditentukan"],1,3,"HNO₃ elektrolit kuat.",["Kuat atau lemah?"]],
["(Makro) Larutan etanol pada uji lampu:",["Terang","Redup","Padam, tanpa gelembung","Banyak gelembung"],2,0,"Etanol nonelektrolit.",["Etanol molekul netral."]],
["(Submikro) Hanya ada H⁺ dan Cl⁻, tanpa HCl utuh. Zat itu...",["HCl (kuat)","NH₃","Glukosa","CH₃COOH"],0,3,"Terionisasi sempurna.",["Tidak ada molekul tersisa."]],
["(Submikro) Sebagian besar molekul NH₃, sedikit NH₄⁺ dan OH⁻:",["Elektrolit kuat","Elektrolit lemah","Nonelektrolit","Senyawa ion"],1,5,"Terion sebagian.",["Berapa banyak ion?"]],
["(Simbolik) Persamaan disosiasi Na₂SO₄:",["Na₂SO₄ → Na⁺ + SO₄²⁻","Na₂SO₄ → 2Na⁺ + SO₄²⁻","Na₂SO₄ ⇌ Na₂⁺ + SO₄","Na₂SO₄ → Na₂ + SO₄"],1,4,"Setarakan muatan.",["Jumlah Na⁺ per rumus?"]],
["(Hitung) [Na⁺] dalam Na₂SO₄ 0,2 M:",["0,2 M","0,4 M","0,6 M","0,1 M"],1,4,"2 × 0,2.",["Koefisien Na⁺ = 2."]],
["(Data) HCl 0,001 M vs CH₃COOH 1 M. Lampu CH₃COOH bisa lebih terang karena...",["Asetat elektrolit kuat","Jumlah ion total CH₃COOH 1 M bisa lebih besar","HCl nonelektrolit","Mustahil"],1,4,"Terang bergantung jumlah ion.",["Bandingkan jumlah ion, bukan kekuatan saja."]],
["(Konsep) NaCl padat vs lelehan:",["Keduanya menghantarkan","Padat tidak (ion terikat), lelehan ya (ion bebas)","Padat ya, lelehan tidak","Keduanya tidak"],1,2,"Yang penting ion bebas.",["Apa beda posisi ion?"]],
["(Miskonsepsi) Air suling...",["Menghantarkan baik karena H⁺ dan OH⁻","Praktis tidak menghantarkan, ion sangat sedikit","Elektrolit kuat","Menghantarkan karena elektron"],1,1,"Ion air murni sangat sedikit.",["Seberapa banyak H⁺ dan OH⁻?"]],
["(Miskonsepsi) Dalam larutan, arus dibawa oleh...",["Elektron bebas","Ion bergerak","Molekul air","Atom"],1,2,"Ion yang bergerak, elektron di kawat.",["Pembawa muatan larutan?"]]];
/* ================= DATA LARUTAN (edit di sini) =================
 t: S kuat, W lemah, N non, D air suling, T air keran | a,b: jumlah kation/anion per rumus | k:'ion' = senyawa ion */
const SUB={NaCl:{t:'S',k:'ion',a:1,b:1,e:'NaCl(s) → Na⁺(aq) + Cl⁻(aq)  (disosiasi)'},HCl:{t:'S',a:1,b:1,e:'HCl(g) → H⁺(aq) + Cl⁻(aq)  (ionisasi)'},NaOH:{t:'S',k:'ion',a:1,b:1,e:'NaOH(s) → Na⁺(aq) + OH⁻(aq)  (disosiasi)'},'CaCl₂':{t:'S',k:'ion',a:1,b:2,e:'CaCl₂(s) → Ca²⁺(aq) + 2Cl⁻(aq)  (disosiasi)'},'CH₃COOH':{t:'W',a:1,b:1,e:'CH₃COOH(aq) ⇌ CH₃COO⁻(aq) + H⁺(aq)  (ionisasi sebagian)'},'NH₃':{t:'W',a:1,b:1,e:'NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)  (ionisasi sebagian)'},glukosa:{t:'N',e:'C₆H₁₂O₆(s) → C₆H₁₂O₆(aq)  (tetap molekul, tanpa ion)'},etanol:{t:'N',e:'C₂H₅OH(l) → C₂H₅OH(aq)  (tetap molekul, tanpa ion)'},urea:{t:'N',e:'(NH₂)₂CO(s) → (NH₂)₂CO(aq)  (tetap molekul, tanpa ion)'},'air suling':{t:'D',e:'H₂O(l): ion H⁺/OH⁻ sangat sedikit'},'air keran':{t:'T',e:'Mengandung ion-ion terlarut (mis. Ca²⁺, Cl⁻, HCO₃⁻)'}};
const CL={S:'S',W:'W',N:'N',D:'N',T:'W'},CLN={S:'Elektrolit kuat',W:'Elektrolit lemah',N:'Nonelektrolit'};
/* tingkat kecerahan lampu 0-1 dari jumlah ion total */
function lv(s,c,m){const o=SUB[s];if(m!='Larutan')return o.k&&m=='Lelehan'?1:0;
const i=o.t=='S'?(o.a+o.b)*c:o.t=='W'?.08*Math.sqrt(c):o.t=='T'?.02:o.t=='D'?.0001:0;return Math.min(1,i/.2)**.5}
const lamp=l=>l>=.7?'Terang':l>=.08?'Redup':'Padam';
/* ================= NAVIGASI ================= */
function head(){$('#steps').innerHTML=NAMES.map((n,i)=>{const lk=i>0&&!S.done[i-1];return`<button class="st ${i==S.cur?'on':''} ${S.done[i]?'dn':''} ${lk?'lk':''}" data-i="${i}"><b>${S.done[i]?'✓':lk?'🔒':String(i+1).padStart(2,'0')}</b>${n}</button>`}).join('');
document.querySelectorAll('.st').forEach(b=>b.onclick=()=>go(+b.dataset.i));
$('#bar').style.width=S.done.filter(Boolean).length/9*100+'%';
const lk=S.cur<8&&!S.done[S.cur];
$('#nav').innerHTML=`<button class="btn ghost" id="n0">🏠 Beranda</button><button class="btn ghost" id="np" ${S.cur?'':'disabled'}>← Tahap sebelumnya</button><button class="btn" id="nn" ${S.cur>=8?'disabled':''}>${lk?'🔒 ':''}Tahap berikutnya →</button>`;
$('#n0').onclick=()=>go(0);$('#np').onclick=()=>go(S.cur-1);$('#nn').onclick=()=>go(S.cur+1)}
function go(i){if(i<0||i>8)return;if(i>0&&!S.done[i-1]){toast('🔒 Selesaikan tahap '+i+' ('+NAMES[i-1]+') dulu ya');return}S.cur=i;save();render();scrollTo(0,0)}
function render(){head();[st0,st1,st2,st3,st4,st5,st6,st7,st8][S.cur]()}
function fin(i){S.done[i]=1;save();head()}
/* ================= TAHAP 1 ================= */
function st0(){app.innerHTML=`<div class="hero"><div><h1>Menyelidiki Larutan Elektrolit dan Nonelektrolit</h1><p>Mari cari tahu mengapa beberapa larutan dapat menghantarkan listrik.</p><button class="btn" id="go">Mulai Belajar</button></div>${beaker()}</div>
<div class="card"><h2>🎯 Tujuan Pembelajaran</h2><ul><li>Membedakan elektrolit dan nonelektrolit</li><li>Menjelaskan hubungan ion dengan daya hantar listrik</li><li>Membedakan elektrolit kuat dan lemah</li><li>Menganalisis hasil pengujian</li><li>Menjelaskan disosiasi dan ionisasi</li><li>Menghubungkan representasi makroskopis, submikroskopis, dan simbolik</li></ul></div>
<div class="card"><h2>🧭 Cara Belajar</h2><ol><li>Ikuti 9 tahap secara berurutan.</li><li>Jawab soal, coba virtual lab, dan baca petunjuk.</li><li>Buku Saku, Glosarium, Bantuan selalu ada di menu.</li></ol></div>`;
$('#go').onclick=()=>{S.done[0]=1;save();go(1)}}
/* ================= TAHAP 2 ================= */
function st1(){if(S.sc.d!=null)return diagRes();app.innerHTML=`<h2>Asesmen Diagnostik</h2><p>5 soal untuk melihat konsep mana yang perlu diperkuat. Tenang, ini bukan ujian!</p><div class="card" id="q"></div>`;
quiz($('#q'),DIAG,(sc,wr)=>{S.sc.d=sc;S.wr.d=wr;save();fin(1);diagRes()})}
function diagRes(){const w=[...new Set(S.wr.d)];app.innerHTML=`<div class="card"><h2>Skor diagnostik: ${S.sc.d} / 5</h2><p>${w.length?'Sepertinya kamu perlu memperhatikan kembali: <b>'+w.map(i=>SUBT[i]).join(', ')+'</b>.':'Hebat, semua konsep sudah kuat. Tetap baca materinya ya!'}</p><button class="btn" onclick="go(2)">Ke Materi →</button><button class="btn ghost" id="rt">Ulangi</button></div>`;
$('#rt').onclick=()=>{S.sc.d=null;save();st1()}}
/* ================= TAHAP 3 ================= */
function st2(){const n=Object.keys(S.chk).length,m=MAT[S.sub];
app.innerHTML=`<h2>Materi</h2><p><b>Materi ${n} dari 6 selesai</b></p><div>${SUBT.map((t,i)=>`<button class="chip ${i==S.sub?'act':''}" data-i="${i}">${S.chk[i]?'✓ ':''}${i+1}. ${t}</button>`).join('')}</div>
<div class="card"><h3>${m[0]}</h3><div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;align-items:center"><p>${m[1]}</p>${beaker(['#ef8f7a','#8fae8b','#b85c3e'][S.sub%3])}</div>
<button class="btn ghost" id="gd">📄 Buka Materi Lengkap</button></div><div class="card"><h3>Cek Cepat</h3><div id="q"></div></div>`;
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{S.sub=+b.dataset.i;save();st2()});
$('#gd').onclick=()=>window.open(googleDocsURL,'_blank');
quiz($('#q'),[m[2]],()=>{S.chk[S.sub]=1;save();if(Object.keys(S.chk).length==6)fin(2);toast('Cek cepat selesai ✓');
$('#q').innerHTML=`<div class="fb good">${sci(1)}<b>Subtopik selesai!</b></div>`+(S.sub<5?'<button class="btn" id="ns">Subtopik berikutnya →</button>':'');
const x=$('#ns');if(x)x.onclick=()=>{S.sub++;save();st2()};head()})}
/* ================= TAHAP 4 ================= */
function st3(){const O={'Air hujan':'Air hujan murni nyaris tanpa ion, tetapi menyerap gas dan debu sehingga mengandung sedikit ion: penghantar lemah. Tangan basah tetap berisiko karena keringat dan kotoran menambah ion.','Air laut':'Air laut penuh ion Na⁺ dan Cl⁻ (hasil disosiasi garam) sehingga penghantar listrik sangat baik. Arus mudah mengalir: sangat berbahaya!','Air suling':'Air suling hampir tanpa ion sehingga daya hantarnya sangat rendah. Namun tangan basah bukan air suling: air melarutkan garam dari kulit dan kotoran sehingga menjadi larutan berion yang menghantarkan.'};
app.innerHTML=`<h2>Apersepsi</h2><div class="card"><div style="display:flex;gap:12px;align-items:center">${sci(0).replace('❌','❓')}<p><b>Mengapa tangan basah berbahaya saat memegang alat listrik, padahal air suling hampir tidak menghantarkan listrik?</b></p></div><p>Pilih air yang kamu curigai paling berperan:</p>${Object.keys(O).map(k=>`<button class="btn ghost bc">${k}</button>`).join('')}<div id="o"></div></div>`;
document.querySelectorAll('.bc').forEach(b=>b.onclick=()=>{$('#o').innerHTML=`<div class="fb good"><div><b>${b.textContent}</b><p>${O[b.textContent]}</p><p><i>Kamu boleh mencoba pilihan lain!</i></p></div></div>`;fin(3)})}
/* ================= TAHAP 5 ================= */
function st4(){let sel=null;const nm=Object.keys(SUB),Z={S:'ELEKTROLIT KUAT',W:'ELEKTROLIT LEMAH',N:'NONELEKTROLIT'};
function draw(){app.innerHTML=`<h2>Prediksi</h2><p>Seret (atau ketuk zat lalu ketuk kotak) untuk mengelompokkan. Jawaban belum diberitahu; akan dibandingkan dengan Virtual Lab.</p><div class="card" data-z="" id="pool">${nm.filter(n=>!S.pred[n]).map(chip).join('')||'✓ Semua zat sudah dikelompokkan'}</div><div class="zones">${Object.keys(Z).map(z=>`<div class="zone" data-z="${z}"><b>${Z[z]}</b><br>${nm.filter(n=>S.pred[n]==z).map(chip).join('')}</div>`).join('')}</div><button class="btn" id="sv" ${nm.every(n=>S.pred[n])?'':'disabled'}>Simpan Prediksi</button>`;
document.querySelectorAll('.chip').forEach(c=>{c.draggable=true;c.ondragstart=()=>sel=c.dataset.n;c.onclick=e=>{e.stopPropagation();sel=c.dataset.n;draw2()}});
document.querySelectorAll('[data-z]').forEach(z=>{z.ondragover=e=>e.preventDefault();z.ondrop=e=>{e.preventDefault();put(z.dataset.z)};z.onclick=()=>{if(sel)put(z.dataset.z)}});
$('#sv').onclick=()=>{fin(4);toast('Prediksi tersimpan ✓')};draw2()}
const chip=n=>`<span class="chip" data-n="${n}">${n}</span>`;
function draw2(){document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('sel',c.dataset.n==sel))}
function put(z){if(!sel)return;if(z)S.pred[sel]=z;else delete S.pred[sel];sel=null;save();draw()}
draw()}
/* ================= TAHAP 6: VIRTUAL LAB ================= */
let labId=0;
function st5(){const nm=Object.keys(SUB),L={s:'NaCl',c:.1,m:'Larutan'};let P=[];const id=++labId;
app.innerHTML=`<h2>Virtual Lab</h2><div class="lab"><div class="card"><div>${nm.map(n=>`<span class="chip sb" data-n="${n}">${n}</span>`).join('')}</div><div>Wujud: ${['Padat','Lelehan','Larutan'].map(m=>`<span class="chip mb" data-m="${m}">${m}</span>`).join('')}</div><label>Konsentrasi: <b id="cv"></b> M <input type="range" id="sl" min="-3" max="0" step="0.05" value="-1" style="width:100%"></label><div id="mac"></div></div>
<div class="card"><b>Submikroskopis</b><canvas id="cvs" width="320" height="210"></canvas><div class="sym" id="sym"></div></div></div>
<button class="btn" id="test">🧪 Uji & Catat Hasil</button><button class="btn ghost" id="ex">Lihat Penjelasan</button>
<div class="card" style="overflow:auto"><table><thead><tr><th>Zat</th><th>Konsentrasi</th><th>Prediksiku</th><th>Hasil</th><th>Cocok/Beda</th></tr></thead><tbody id="tb"></tbody></table></div>`;
function macro(l){const n=Math.round(l*8),y=l<.08?'#e8e2d5':'#ffd2a8';let b='';for(let i=0;i<n;i++)b+=`<circle class="bub" cx="${i%2?138:62}" cy="${150-i*3}" r="4" style="animation-delay:${i*.25}s"/>`;
return`<svg viewBox="0 0 200 190" width="100%"><circle cx="100" cy="28" r="22" fill="${y}" stroke="#b85c3e" stroke-width="3" opacity="${.35+.65*l}"/>${l>.08?'<g stroke="#ef8f7a" stroke-width="3">'+[0,45,90,135,180].map(a=>`<path d="M${100-36*Math.cos(a*Math.PI/180)} ${28-36*Math.sin(a*Math.PI/180)}l${-6*Math.cos(a*Math.PI/180)} ${-6*Math.sin(a*Math.PI/180)}"/>`).join('')+'</g>':''}<path d="M62 60v60M138 60v60M62 50q0-12 38-12M138 50q0-12-38-12" stroke="#3b3a33" stroke-width="3" fill="none"/><path d="M45 85h110l-8 95H53z" fill="#fff" stroke="#5f8362" stroke-width="4"/><path d="M50 110h100l-5 70H55z" fill="#dcebd9"/><rect x="58" y="60" width="8" height="100" fill="#b85c3e"/><rect x="134" y="60" width="8" height="100" fill="#5f8362"/>${b}</svg><b>Lampu: ${lamp(l)}</b> · Gelembung: ${n>4?'banyak':n>0?'sedikit':'tidak ada'}`}
function build(){const o=SUB[L.s],W=320;P=[];const add=(t,x,y,f)=>P.push({t,x,y,bx:x,by:y,f,vx:Math.random()-.5,vy:Math.random()-.5});const R=()=>[40+Math.random()*240,15+Math.random()*180];
if(L.m!='Larutan'&&(L.m=='Padat'||!o.k)){for(let r=0;r<4;r++)for(let c=0;c<6;c++){const t=o.k?((r+c)%2?'an':'ca'):'m';L.m=='Padat'?add(t,70+c*36,45+r*36,1):add(t,...R(),0)}return}
if(L.m=='Lelehan'){for(let i=0;i<9;i++){add('ca',...R());add('an',...R());if(o.b>1)add('an',...R())}return}
const u=Math.round(8+L.c*14);
if(o.t=='S')for(let i=0;i<u;i++){for(let j=0;j<o.a;j++)add('ca',...R());for(let j=0;j<o.b;j++)add('an',...R())}
else if(o.t=='W'){const k=Math.max(1,Math.round(1+3*Math.sqrt(L.c)));for(let i=0;i<14;i++)i<k?(add('ca',...R()),add('an',...R())):add('m',...R())}
else if(o.t=='T'){for(let i=0;i<4;i++){add(i%2?'ca':'an',...R())}for(let i=0;i<10;i++)add('m',...R())}
else for(let i=0;i<u+4;i++)add('m',...R())}
function upd(){const o=SUB[L.s],l=lv(L.s,L.c,L.m),can=!(o.t=='D'||o.t=='T');
$('#cv').textContent=(o.t=='D'||o.t=='T')?'–':L.c.toFixed(3).replace('.',',');$('#sl').disabled=!can||L.m!='Larutan';
document.querySelectorAll('.sb').forEach(c=>c.classList.toggle('act',c.dataset.n==L.s));document.querySelectorAll('.mb').forEach(c=>c.classList.toggle('act',c.dataset.m==L.m));
$('#mac').innerHTML=macro(l);
let s=L.m=='Padat'?(o.k?L.s+'(s): ion terikat pada posisi tetap → tidak menghantarkan':L.s+': molekul netral → tidak menghantarkan'):L.m=='Lelehan'?(o.k?L.s+'(l) → ion bergerak bebas → menghantarkan':L.s+'(l): molekul netral → tidak menghantarkan'):o.e+'<br>'+(o.t=='S'?'Kuat: panah →, ion banyak (±'+((o.a+o.b)*L.c).toFixed(3).replace('.',',')+' M)':o.t=='W'?'Lemah: panah ⇌, sebagian kecil terion; ion sedikit':'Tidak ada ion bebas');
$('#sym').innerHTML=s;build()}
function tick(){const cv=$('#cvs');if(id!=labId||!cv)return;const x=cv.getContext('2d'),t=Date.now(),l=lv(L.s,L.c,L.m);x.clearRect(0,0,320,210);
x.fillStyle='#b85c3e';x.fillRect(2,5,10,200);x.fillStyle='#5f8362';x.fillRect(308,5,10,200);x.fillStyle='#fff';x.font='bold 14px Nunito';x.fillText('−',4,18);x.fillText('+',310,18);
P.forEach(p=>{if(p.f){p.x=p.bx+Math.sin(t/180+p.bx)*1.5;p.y=p.by+Math.cos(t/200+p.by)*1.5}else{p.vx+=(Math.random()-.5)*.15+(l>.05?(p.t=='ca'?-.02:p.t=='an'?.02:0):0);p.vy+=(Math.random()-.5)*.15;p.vx=Math.max(-1.2,Math.min(1.2,p.vx));p.vy=Math.max(-1.2,Math.min(1.2,p.vy));p.x+=p.vx;p.y+=p.vy;if(p.x<18||p.x>302)p.vx*=-1;if(p.y<12||p.y>198)p.vy*=-1;p.x=Math.max(16,Math.min(304,p.x))}
x.beginPath();if(p.t=='m'){x.fillStyle='#d9a58f';x.arc(p.x,p.y,5,0,7);x.arc(p.x+6,p.y+2,4,0,7);x.fill()}
else{x.fillStyle=p.t=='ca'?'#ef8f7a':'#8fae8b';x.arc(p.x,p.y,7,0,7);x.fill();x.fillStyle='#fff';x.fillText(p.t=='ca'?'+':'−',p.x-4,p.y+5)}});requestAnimationFrame(tick)}
function table(){$('#tb').innerHTML=S.lab.map(r=>`<tr><td>${r.n} (${r.m})</td><td>${r.c}</td><td>${r.p?CLN[r.p]:'–'}</td><td>${r.r}</td><td>${r.p?(r.ok?'✅ Cocok':'⚠️ Beda'):'–'}</td></tr>`).join('')||'<tr><td colspan=5>Belum ada data. Pilih zat lalu klik “Uji & Catat Hasil”.</td></tr>'}
document.querySelectorAll('.sb').forEach(c=>c.onclick=()=>{L.s=c.dataset.n;if(!SUB[L.s].k&&L.m!='Larutan'&&(L.s=='air suling'||L.s=='air keran'))L.m='Larutan';upd()});
document.querySelectorAll('.mb').forEach(c=>c.onclick=()=>{L.m=c.dataset.m;upd()});
$('#sl').oninput=e=>{L.c=Math.pow(10,+e.target.value);upd()};
$('#test').onclick=()=>{const o=SUB[L.s],l=lv(L.s,L.c,L.m),c=(o.t=='D'||o.t=='T')?'–':L.c.toFixed(3).replace('.',','),p=S.pred[L.s];
S.lab=S.lab.filter(r=>!(r.n==L.s&&r.m==L.m&&r.c==c));S.lab.push({n:L.s,m:L.m,c,p,r:lamp(l)+' ('+(L.m=='Larutan'?CLN[CL[o.t]]:'tanpa larutan')+')',ok:p==CL[o.t],k:L.m=='Larutan'?CL[o.t]:null,s:L.s});
save();table();if(S.lab.filter(r=>r.m=='Larutan').length>=3)fin(5);toast('Hasil dicatat ✓')};
$('#ex').onclick=()=>{const o=SUB[L.s];S.sub=o.t=='N'||o.t=='D'?0:o.t=='T'?1:o.k?2:3;save();S.cur=2;S.done[1]&&render()};
upd();table();tick()}
/* ================= TAHAP 7 ================= */
function st6(){app.innerHTML=`<h2>Analisis Data</h2><p>Jawab pertanyaan penuntun. Gunakan “💡 Petunjuk” bertahap (3 tingkat).</p><div class="card" id="q"></div><div class="card"><b>Grafik: konsentrasi vs intensitas cahaya</b><canvas id="gr" width="560" height="260"></canvas><label>Konsentrasi: <b id="gc">0,50</b> M <input type="range" id="gs" min="0.01" max="1" step="0.01" value="0.5" style="width:100%"></label><p id="gt"></p></div>
<div class="card"><b>Susun kriteriamu: Larutan disebut elektrolit jika...</b><textarea id="cr" rows="3">${S.crit}</textarea><button class="btn" id="sc">Simpan Kriteria</button></div>`;
const G=[["Mengapa NaCl 0,10 M lebih terang daripada CH₃COOH 0,10 M?",["NaCl lebih pekat","NaCl terdisosiasi hampir sempurna → ion lebih banyak","CH₃COOH nonelektrolit","NaCl memberi elektron"],1,3,"Kekuatan elektrolit menentukan jumlah ion pada konsentrasi sama.",["Konsentrasinya sama.","Bandingkan persen yang menjadi ion.","Ion lebih banyak → lampu lebih terang."]],
["Jika NaCl diencerkan sangat jauh, lampu akan...",["Tetap terang","Makin redup karena ion per volume sedikit","Padam karena berubah nonelektrolit","Makin terang"],1,4,"Elektrolit kuat sangat encer bisa sangat redup.",["Lihat grafik ke kiri.","Apa yang berkurang saat diencerkan?","Jumlah ion per volume."]],
["Bisakah CH₃COOH 1 M lebih terang daripada NaCl 0,001 M?",["Tidak, lemah selalu lebih redup","Bisa, jumlah ion total CH₃COOH 1 M lebih besar","Tidak, asam nonelektrolit","Hanya jika NaCl padat"],1,4,"Terang bergantung jumlah ion, bukan kekuatan saja.",["Cek kedua kurva di grafik.","Bandingkan jumlah ion.","Konsentrasi bisa mengalahkan kekuatan."]]];
let gd=false;quiz($('#q'),G,()=>{S.act.g=1;save();$('#q').innerHTML=`<div class="fb good">${sci(1)}<b>Pertanyaan penuntun selesai!</b></div>`;chk()});
function chk(){if(S.act.g&&S.crit.length>=10)fin(6)}
function draw(){const x=$('#gr').getContext('2d'),c=+$('#gs').value;x.clearRect(0,0,560,260);x.strokeStyle='#3b3a33';x.beginPath();x.moveTo(40,10);x.lineTo(40,230);x.lineTo(540,230);x.stroke();x.font='12px Nunito';x.fillStyle='#3b3a33';x.fillText('Terang',2,14);x.fillText('Konsentrasi (M) →',420,252);x.fillText('0',36,244);x.fillText('1',530,244);
[['NaCl (kuat)','NaCl','#b85c3e'],['CH₃COOH (lemah)','CH₃COOH','#5f8362']].forEach(([n,s,col],k)=>{x.strokeStyle=col;x.lineWidth=3;x.beginPath();for(let i=0;i<=100;i++){const cc=Math.max(.001,i/100),y=230-lv(s,cc,'Larutan')*210;i?x.lineTo(40+i*5,y):x.moveTo(40,y)}x.stroke();x.fillStyle=col;x.fillText(n,380,40+k*16);
const y=230-lv(s,c,'Larutan')*210;x.beginPath();x.arc(40+c*500,y,6,0,7);x.fill()});
$('#gc').textContent=c.toFixed(2).replace('.',',');$('#gt').innerHTML=`Pada ${c.toFixed(2).replace('.',',')} M: NaCl → ${lamp(lv('NaCl',c,'Larutan'))}, CH₃COOH → ${lamp(lv('CH₃COOH',c,'Larutan'))}. Kurva menunjukkan: lampu naik seiring jumlah ion.`}
$('#gs').oninput=draw;draw();$('#sc').onclick=()=>{S.crit=$('#cr').value;save();toast('Kriteria tersimpan ✓');chk()}}
/* ================= TAHAP 8 ================= */
function st7(){const E=[['NaCl','→','Na⁺','+','Cl⁻'],['CaCl₂','→','Ca²⁺','+','2Cl⁻'],['Na₂SO₄','→','2Na⁺','+','SO₄²⁻'],['CH₃COOH','⇌','H⁺','+','CH₃COO⁻'],['NH₃ + H₂O','⇌','NH₄⁺','+','OH⁻']];
const IO=[['Na₂SO₄ 0,350 M',[['[Na⁺]',.7],['[SO₄²⁻]',.35]]],['FeBr₃ 0,225 M',[['[Fe³⁺]',.225],['[Br⁻]',.675]]]];
app.innerHTML=`<h2>Penguatan</h2><div class="card"><h3>1. Menyusun Persamaan</h3><p>Ketuk bagian secara berurutan untuk menyusun persamaan.</p>${E.map((e,i)=>`<div class="eq" data-i="${i}"><div class="ans" style="min-height:34px;font-weight:800;font-size:1.1rem"></div><div class="bank"></div><button class="btn ghost ck">Periksa</button><button class="btn ghost rs">Ulangi</button><span class="r"></span></div>`).join('')}</div>
<div class="card"><h3>2. Hitung Konsentrasi Ion (isi angka, mis. 0,7)</h3>${IO.map((o,i)=>`<div>${o[0]}: ${o[1].map((q,j)=>`${q[0]} <input type="text" style="width:90px" data-i="${i}" data-j="${j}"> M `).join('')}<button class="btn ghost ic" data-i="${i}">Periksa</button><span></span></div>`).join('')}</div>
<div class="card"><h3>3. Larutan Misterius (konsentrasi sama)</h3><table><tr><th>Larutan</th><th>Lampu</th><th>Gelembung</th><th>Kesimpulanmu</th></tr>${[['X','Terang','Banyak'],['Y','Redup','Sedikit'],['Z','Padam','Tidak ada']].map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><select class="ms" data-i="${i}"><option value="">Pilih…</option><option value="S">Elektrolit kuat</option><option value="W">Elektrolit lemah</option><option value="N">Nonelektrolit</option></select></td></tr>`).join('')}</table><button class="btn" id="mc">Periksa</button><p id="mr"></p></div>`;
const ok=m=>`<span class="fb good" style="display:inline-flex">${sci(1).replace('width="100"','width="50"')}<b>${m}</b></span>`,no=m=>`<span class="fb bad" style="display:inline-flex">${sci(0).replace('width="100"','width="50"')}<b>${m}</b></span>`;
function all(){S.act.e=E.every((_,i)=>S.act['e'+i]);S.act.i=IO.every((_,i)=>S.act['i'+i]);save();if(S.act.e&&S.act.i&&S.act.m)fin(7)}
document.querySelectorAll('.eq').forEach(d=>{const i=+d.dataset.i,e=E[i];let cur=[];const bank=[...e].sort(()=>Math.random()-.5);
function dr(){d.querySelector('.ans').textContent=cur.join(' ')||'…';d.querySelector('.bank').innerHTML=bank.map((t,k)=>`<button class="chip ${cur.includes(k)?'':''}" data-k="${k}" ${cur.idx&&cur.idx.includes(k)?'disabled':''}>${t}</button>`).join('');
d.querySelectorAll('.bank .chip').forEach(b=>b.onclick=()=>{cur.idx=cur.idx||[];cur.push(bank[+b.dataset.k]);cur.idx.push(+b.dataset.k);dr()})}
d.querySelector('.ck').onclick=()=>{const g=cur.join(' ')==e.join(' ');S.act['e'+i]=g;d.querySelector('.r').innerHTML=g?ok('Benar!'):no('Periksa urutan & jenis panah');all()};
d.querySelector('.rs').onclick=()=>{cur=[];dr()};dr()});
document.querySelectorAll('.ic').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const g=IO[i][1].every((q,j)=>Math.abs(parseFloat(document.querySelector(`input[data-i="${i}"][data-j="${j}"]`).value.replace(',','.'))-q[1])<.001);
S.act['i'+i]=g;b.nextElementSibling.innerHTML=g?ok('Benar!'):no('Petunjuk: kalikan M dengan koefisien ion');all()});
$('#mc').onclick=()=>{const k=['S','W','N'],g=[...document.querySelectorAll('.ms')].every((s,i)=>s.value==k[i]);S.act.m=g;$('#mr').innerHTML=g?ok('Benar! Terang=kuat, redup=lemah, padam=non'):no('Cek lagi: terang/redup/padam dan gelembungnya');all()}}
/* ================= TAHAP 9 ================= */
function st8(){if(S.sc.f==null){app.innerHTML='<h2>Evaluasi Formatif (5 soal)</h2><div class="card" id="q"></div>';return quiz($('#q'),FORM,(s,w)=>{S.sc.f=s;S.wr.f=w;save();st8()})}
if(S.sc.n==null){app.innerHTML='<h2>Evaluasi Akhir (10 soal)</h2><div class="card" id="q"></div>';return quiz($('#q'),FIN,(s,w)=>{S.sc.n=s;S.wr.n=w;save();fin(8);st8()})}
const w=[...S.wr.d,...S.wr.f,...S.wr.n],cnt=i=>w.filter(x=>x==i).length,bad=[0,1,2,3,4,5].filter(i=>cnt(i)),good=[0,1,2,3,4,5].filter(i=>!cnt(i)),L=S.lab.filter(r=>r.p),mt=L.filter(r=>r.ok).length;
app.innerHTML=`<div class="card"><h2>📋 LAPORAN HASIL BELAJAR</h2><table><tr><td>Progres materi</td><td>${Object.keys(S.chk).length} dari 6 selesai</td></tr><tr><td>Skor diagnostik</td><td>${S.sc.d??'–'} / 5</td></tr><tr><td>Skor formatif</td><td>${S.sc.f} / 5</td></tr><tr><td>Skor evaluasi akhir</td><td>${S.sc.n} / 10</td></tr><tr><td>Prediksi vs hasil lab</td><td>${mt} cocok dari ${L.length} pengujian berprediksi</td></tr><tr><td>Konsep paling dikuasai</td><td>${good.map(i=>SUBT[i]).join(', ')||'–'}</td></tr><tr><td>Perlu dipelajari lagi</td><td>${bad.map(i=>SUBT[i]).join(', ')||'Tidak ada, kerja bagus!'}</td></tr></table>
<h3>Refleksi</h3><p>Apa yang paling kamu pahami, dan apa yang masih membingungkan?</p><textarea id="rf" rows="4">${S.refl}</textarea><br><button class="btn" id="pr">🖨️ Simpan / Cetak Laporan</button><button class="btn ghost" id="rt">Ulangi Evaluasi</button></div>`;
$('#rf').oninput=e=>{S.refl=e.target.value;save()};$('#pr').onclick=()=>{S.refl=$('#rf').value;save();window.print()};
$('#rt').onclick=()=>{S.sc.f=null;S.sc.n=null;S.wr.f=[];S.wr.n=[];save();st8()}}
/* ================= MODAL: BUKU SAKU, GLOSARIUM, BANTUAN ================= */
const POCKET=[['Konsep elektrolit','Elektrolit: larutannya menghantarkan listrik karena ada ion bebas. Nonelektrolit: tetap molekul netral.'],['Uji daya hantar','Terang+gelembung banyak = kuat; redup+sedikit = lemah; padam = non. Bandingkan pada konsentrasi sama.'],['Disosiasi, hidrasi, ionisasi','Disosiasi: senyawa ion terpisah jadi ion. Hidrasi: ion dikelilingi air. Ionisasi: molekul membentuk ion. NaCl padat tidak menghantarkan (ion terikat); leleh/larutan menghantarkan.'],['Kuat, lemah, nonelektrolit','Kuat: panah →. Lemah: ⇌ (sebagian kecil terion). Non: tidak ada ion. HCl dan NH₃ sama-sama molekuler, tetapi HCl kuat dan NH₃ lemah.'],['Konsentrasi dan kekuatan','Kekuatan = persen terion; konsentrasi = mol/L. [ion] = M × koefisien. Kuat yang sangat encer bisa redup.'],['Miskonsepsi umum','Bukan elektron yang mengalir dalam larutan; redup bukan nonelektrolit; terang bukan otomatis pekat; air suling praktis tidak menghantarkan.']];
const GL=[['Elektrolit','Zat yang larutannya menghantarkan listrik.'],['Nonelektrolit','Zat yang larutannya tidak menghantarkan listrik; tetap berupa molekul.'],['Ion','Atom/gugus atom bermuatan listrik.'],['Disosiasi','Pemisahan senyawa ion menjadi kation dan anion.'],['Hidrasi','Pengelilingan ion oleh molekul air.'],['Ionisasi','Pembentukan ion dari senyawa molekuler dalam air.'],['Elektrolit kuat','Terion/terdisosiasi hampir sempurna; ion banyak.'],['Elektrolit lemah','Hanya sebagian kecil terionisasi; ion sedikit.'],['Konsentrasi','Banyaknya zat terlarut per volume larutan (molaritas, mol/L).'],['Daya hantar listrik','Kemampuan larutan menghantarkan arus, ditentukan jumlah ion bebas.']];
function modal(t,h){$('#mt').textContent=t;$('#mb').innerHTML=h;$('#modal').classList.remove('hidden')}
function open_(k){if(k=='home')return go(0);
if(k=='pocket')modal('📖 Buku Saku Materi',POCKET.map((p,i)=>`<div class="card"><b>${i+1}. ${p[0]}</b><p>${p[1]}</p></div>`).join(''));
if(k=='help')modal('❓ Bantuan','<ul><li><b>Website:</b> ikuti 9 tahap di bilah atas; tahap berikut terbuka setelah tahap sebelumnya selesai.</li><li><b>Memilih jawaban:</b> klik pilihan; gunakan 💡 Petunjuk bila perlu.</li><li><b>Virtual lab:</b> pilih zat, wujud, geser konsentrasi, lalu “Uji & Catat Hasil”.</li><li><b>Drag and drop:</b> seret zat ke kotak, atau ketuk zat lalu ketuk kotak (di HP).</li><li><b>Buku Saku:</b> klik “📖 Buku Saku” di menu kapan saja; progresmu tetap aman.</li></ul>');
if(k=='gloss'){modal('🔤 Glosarium','<input type="text" id="gq" placeholder="Cari istilah…"><div id="gl"></div>');const f=()=>{const q=$('#gq').value.toLowerCase();$('#gl').innerHTML=GL.filter(g=>(g[0]+g[1]).toLowerCase().includes(q)).map(g=>`<p><b>${g[0]}</b>: ${g[1]}</p>`).join('')||'Tidak ditemukan.'};$('#gq').oninput=f;f()}
$('#menu').classList.remove('open')}
document.querySelectorAll('#menu button').forEach(b=>b.onclick=()=>open_(b.dataset.m));
$('#hb').onclick=()=>$('#menu').classList.toggle('open');$('#mx').onclick=()=>$('#modal').classList.add('hidden');
$('#modal').onclick=e=>{if(e.target.id=='modal')$('#modal').classList.add('hidden')};
render();
