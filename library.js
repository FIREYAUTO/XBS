const LibraryUtilities = {
	ReadOnlyObject:function(Properties={}){
		return new Proxy(Properties,{
			get:function(self,Name){
				return self[Name];	
			},
			set:function(){
				return;
			},
		});
	},
};

//{{ StandardLibrary }}\

const StandardLibrary = {
    window:window,
    document:document,
    console:console,
    pcall:function(x,...a){
    	let[s,r]=[false,null];
        try{r=x(...a);s=true}catch(e){r=e}
        return [s,r];
    },
    tostring:function(x){return String(x)},
    toint:function(x){return parseInt(x)},
    tofloat:function(x){return parseFloat(x)},
    log:function(...args){
    	document.write(`${args.join(" ")}<br>`);
    },
    warn:function(...args){
    	document.write(`<span style="color:#ff5621">${args.join(" ")}</span><br>`);
    },
    info:function(...args){
    	document.write(`<span style="color:#1a58ee">${args.join(" ")}</span><br>`);
    },
    type:function(x){
        let ty = typeof x;
        if (ty=="object"){
            if (x===null||x===undefined){
                return "null";
            }
        	return x instanceof Array?"array":"object";
        }
        return ty;
    },
    error:function(x){
    	throw new CodeError(x);
    },
    string:LibraryUtilities.ReadOnlyObject({
    	reverse:function(x){
        	return x.split("").reverse().join("");
        },
    }),
    load:function(x,g){
    	if (!g){
        	g = StandardLibrary;
        }
    	let ar = AST.StartParser(x);
        let vm = Interpreter.New(ar,{Globals:g});
        return function(){
        	Interpreter.Start(vm);
        };
    },
    table:LibraryUtilities.ReadOnlyObject({
    	find:function(a,x){
        	return a.includes(x);
        },
        remove:function(a,x){
        	a.splice(x,1);
        },
        insert:function(a,x,y){
        	if (y==undefined){
            	a.push(y);
            } else {
            	a.splice(x,0,y);
            }
        }
    }),
    object:Object,
    math:Math,
    rnd:function(mi,ma){
    	return Math.floor(Math.random() * (ma-mi+1) + mi);
    },
    time:function(){
    	return (Date.now()/1000);
    },
    delay:function(x,f,...a){
        window.setTimeout(()=>{
            f(...a);
        },x*1000);
    },
    rawget:function(x,n){
        return x[n];
    },
    rawset:function(x,n,v){
        x[n]=v;
    }
};

StandardLibrary.env = StandardLibrary;

//{{ New Library Utility }}\\

const Library = Object.freeze({
	Standard:{
		Globals:StandardLibrary,
	},
	New:function(Globals={}){
		return {
			Globals:Globals,
		};
	},
});
