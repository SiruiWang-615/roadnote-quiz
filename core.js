(function(g){'use strict';const API={
select(bank,packs,limit=0,random=false,rng=Math.random){let items=bank.filter(q=>packs.includes(q.pack));if(random){items=[...items];for(let i=items.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[items[i],items[j]]=[items[j],items[i]]}}return limit?items.slice(0,limit):items},
score(ids,answers,bank){const byId=new Map(bank.map(q=>[q.id,q]));return ids.reduce((s,id)=>{if(typeof answers[id]==='boolean'){s.answered++;if(answers[id]===byId.get(id)?.answer)s.correct++}return s},{answered:0,correct:0,total:ids.length})},
record(records,q,answer){const old=records[q.id]||{attempts:0,correct:0,wrong:false};return {...records,[q.id]:{attempts:old.attempts+1,correct:old.correct+Number(answer===q.answer),wrong:answer!==q.answer,lastAt:Date.now()}}},
validSession(s,bank){const ids=new Set(bank.map(q=>q.id));return !!s&&['practice','exam'].includes(s.mode)&&Array.isArray(s.ids)&&s.ids.length>0&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>ids.has(id))&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.ids.length&&s.answers&&Object.entries(s.answers).every(([id,a])=>s.ids.includes(id)&&typeof a==='boolean')&&s.confirmed&&Object.entries(s.confirmed).every(([id,v])=>s.ids.includes(id)&&v===true&&typeof s.answers[id]==='boolean')},
};if(typeof module!=='undefined')module.exports=API;else g.Roadnote=API;
})(globalThis);
