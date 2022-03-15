const Library = {
	//-- Debug Functions --\\
	log:(...a)=>console.log(...a),
	warn:(...a)=>console.warn(...a),
	info:(...a)=>console.info(...a),
	error:a=>{throw Error(a)},
	//-- Global Objects --\\
	document:document,
	window:window,
	console:console,
	object:Object,
	inf:Infinity,
	nan:NaN,
	//-- Type Functions --\\
	tostring:x=>String(x),
	toint:x=>parseInt(x),
	tofloat:x=>parseFloat(x),
	type:a=>XBS.Interpreter.GetType(a),
	//-- Other Functions --\\
	load:(x,e)=>XBS(x,e),
	time:()=>(Date.now()/1000),
	delay:(x,f,...a)=>window.setTimeout(()=>f(...a),x*1000),
	rawget:(a,b)=>a[b],
	rawset:(a,b,c)=>a[b]=c,
	//-- Libraries --\\
	string:Object.freeze({
		reverse:x=>x.split("").reverse().join(""),
		char:x=>x.charCodeAt(0),
		byte:x=>String.fromCharCode(x),
		lower:x=>x.toLowerCase(),
		upper:x=>x.toUpperCase(),
		split:(x,b)=>x.split(b||""),
		at:(x,b)=>x.charAt(b),
		repeat:(x,a)=>x.repeat(a),
		format:(s,...a)=>{
        	let formats={
            	"s":a=>String(a),
                "q":a=>`"${String(a)}"`,
                "a":a=>`'${String(a)}'`,
                "l":a=>String(a).toLowerCase(),
                "u":a=>String(a).toUpperCase(),
            };
            let i=0;
            let F=[];
            for(let k in formats)F.push(k);
            return s.replace(new RegExp(`\\%(${F.join("|")})`,"g"),function(m,d){
            	return formats[d](a[Math.min(i++,a.length-1)]);
            });
        }
	}),
	array:Object.freeze({
		find:(a,x)=>a.indexOf(x),
		remove:(a,x)=>a.splice(x,1),
		insert:(a,x,y)=>{
			a.splice(x,1)
			if(y===undefined)a.push(x);
			else a.splice(x,0,y);
		},
		append:(a,x)=>a.push(x),
		prepend:(a,x)=>a.unshift(x),
		delete:(a,x)=>a.splice(a.indexOf(x),1),
		reverse:(a,x)=>[...a].reverse(),
		join:(a,x)=>{
			if(x==undefined)x=" ";
			return a.join(x);
		},
		sort:(a,x)=>Array.prototype.sort.call(a,x),
		has:(a,x)=>a.includes(x),
	}),
	math:Object.freeze({
		sin:Math.sin,
		cos:Math.cos,
		tan:Math.tan,
		asin:Math.asin,
		acos:Math.acos,
		atan:Math.atan,
		atan2:Math.atan2,
		floor:Math.floor,
		floor:Math.floor,
		ceil:Math.ceil,
		round:Math.round,
		sqrt:Math.sqrt,
		pow:Math.pow,
		log:Math.log,
		abs:Math.abs,
		log10:Math.log10,
		logb:(x,b=10)=>Math.log10(x)/Math.log10(b),
		nround:(x,b=10)=>{let m=10**b;return Math.floor(x*m+0.5)/m},
		rad:x=>x*(Math.PI/180),
		deg:x=>x*(180/Math.PI),
		random:(mi,ma)=>Math.floor(Math.random()*(ma-mi+1)+mi),
		sqrt2:(x,b=2)=>x**(1/b),
		pi:Math.PI,
		e:Math.E,
		max:Math.max,
		min:Math.min,
		clamp:(x,a,b)=>Math.max(a,Math.min(x,b)),
	}),
	json:Object.freeze({
		encode:x=>JSON.stringify(x),
		decode:x=>JSON.parse(x),
	}),
};
Library.env = Library;
