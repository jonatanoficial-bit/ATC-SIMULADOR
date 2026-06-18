/* @skyward-module 00-quality-kernel
 * Pure deterministic rules shared by the production runtime and F05 automated tests.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('00-quality-kernel');
(function(){
  const REQUEST_PRIORITY=Object.freeze({urgent:300,warn:160,normal:60});
  const REQUEST_TYPE=Object.freeze({emergency:220,landing:120,takeoff:100,lineup:90,taxi:55,pushback:45,lowfuel:180,panpan:150});
  const DEFAULT_WAKE=Object.freeze({'J-H':8,'J-M':9,'J-L':10,'H-H':5,'H-M':6,'H-L':7,'M-M':4,'M-L':5,'L-L':3});
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)));
  const normalizeHeading=value=>((Number(value)%360)+360)%360;
  const shortestTurn=(from,to)=>((normalizeHeading(to)-normalizeHeading(from)+540)%360)-180;
  const distance=(a,b)=>Math.hypot(Number(a?.x||0)-Number(b?.x||0),Number(a?.y||0)-Number(b?.y||0));
  const headingTo=(from,to)=>normalizeHeading(Math.atan2(Number(to?.y||0)-Number(from?.y||0),Number(to?.x||0)-Number(from?.x||0))*180/Math.PI);
  const range=(min,max,unit)=>Number(min)+clamp(Number(unit),0,1)*(Number(max)-Number(min));
  const requestPriorityScore=(request,nowMs=0)=>{
    const age=Math.max(0,(Number(nowMs)-Number(request?.time||0))/1000);
    return (REQUEST_PRIORITY[request?.priority]||40)+(REQUEST_TYPE[request?.type]||40)+age;
  };
  const wakeSpacing=(leadCategory,trailCategory,weatherMultiplier=1,spacingTable=DEFAULT_WAKE)=>{
    const key=`${String(leadCategory||'M')}-${String(trailCategory||'M')}`;
    return Number(spacingTable?.[key]||4)*Math.max(1,Number(weatherMultiplier)||1);
  };
  const api=Object.freeze({
    schema:1,version:'1.0.0',clamp,normalizeHeading,shortestTurn,distance,headingTo,range,
    requestPriorityScore,wakeSpacing,
    tables:Object.freeze({requestPriority:REQUEST_PRIORITY,requestType:REQUEST_TYPE,wake:DEFAULT_WAKE})
  });
  window.SKYWARD_QUALITY_KERNEL=api;
})();
