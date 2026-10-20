(function(g){'use strict';const API={
select(bank,packs,limit=0,random=false,rng=Math.random){let items=bank.filter(q=>(q.papers||[q.pack]).some(id=>packs.includes(id)));if(random){items=[...items];for(let i=items.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[items[i],items[j]]=[items[j],items[i]]}}return limit?items.slice(0,limit):items},
draw(bank,count,seen=[],rng=Math.random){
const key=q=>q.canonical||q.id,unique=new Map();for(const q of bank)if(!unique.has(key(q)))unique.set(key(q),q);const used=new Set(seen);let pool=[...unique.values()].filter(q=>!used.has(key(q))),recycled=false;
if(!pool.length&&unique.size){for(const k of unique.keys())used.delete(k);pool=[...unique.values()];recycled=true}
const groups=new Map();for(const q of pool){const category=q.category||'general';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(q)}
function shuffle(list){for(let i=list.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list}
const queues=shuffle([...groups.values()].map(v=>shuffle([...v]))),picked=[];while(picked.length<Math.min(count,pool.length)){for(const queue of queues){if(queue.length&&picked.length<count){const q=queue.pop();picked.push(q);used.add(key(q))}}}
return {ids:picked.map(q=>q.id),seen:[...used],remaining:pool.length-picked.length,total:unique.size,recycled};
},
suspend(session,now=Date.now()){const copy=JSON.parse(JSON.stringify(session));if(copy.deadlineAt){copy.remainingSeconds=Math.max(0,Math.ceil((copy.deadlineAt-now)/1000));copy.deadlineAt=null}copy.pausedAt=now;return copy},
restore(session,now=Date.now()){const copy=JSON.parse(JSON.stringify(session));if(Number.isFinite(copy.remainingSeconds)){copy.deadlineAt=now+copy.remainingSeconds*1000;delete copy.remainingSeconds}delete copy.pausedAt;return copy},
score(ids,answers,bank){const byId=new Map(bank.map(q=>[q.id,q]));return ids.reduce((s,id)=>{if(typeof answers[id]==='boolean'){s.answered++;if(answers[id]===byId.get(id)?.answer)s.correct++}return s},{answered:0,correct:0,total:ids.length})},
record(records,q,answer){const old=records[q.id]||{attempts:0,correct:0,wrong:false};return {...records,[q.id]:{attempts:old.attempts+1,correct:old.correct+Number(answer===q.answer),wrong:answer!==q.answer,lastAt:Date.now()}}},
validSession(s,bank){const ids=new Set(bank.map(q=>q.id));return !!s&&['practice','exam'].includes(s.mode)&&Array.isArray(s.ids)&&s.ids.length>0&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>ids.has(id))&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.ids.length&&s.answers&&Object.entries(s.answers).every(([id,a])=>s.ids.includes(id)&&typeof a==='boolean')&&s.confirmed&&Object.entries(s.confirmed).every(([id,v])=>s.ids.includes(id)&&v===true&&typeof s.answers[id]==='boolean')},
};if(typeof module!=='undefined')module.exports=API;else g.Roadnote=API;
})(globalThis);
