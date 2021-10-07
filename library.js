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
        char:function(x){
            return x.charCodeAt(0); 
        },
        byte:function(x){
            return String.fromCharCode(x);
        },
        lower:function(x){
            return x.toLowerCase();  
        },
        upper:function(x){
            return x.toUpperCase();  
        },
        split:function(x,b){
            return x.split(b||"");
        },
        at:function(x,b){
            return x.charAt(b);
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
    number:Number,
    array:LibraryUtilities.ReadOnlyObject({
    	find:function(a,x){
        	return a.indexOf(x);
        },
        remove:function(a,x){
        	a.splice(x,1);
        },
        insert:function(a,x,y){
        	if (y==undefined){
            	a.push(x);
            } else {
            	a.splice(x,0,y);
            }
        },
        reverse:function(a){
            return [...a].reverse();
        },
        join:function(a,b){
            if (b==null||b==undefined){
                b=", ";
            }
            return a.join(b);
        },
        sort:function(a,b){
            return Array.prototype.sort.call(a,b);
        },
        has:function(a,b){
            return a.includes(b);
        }
    }),
    object:Object,
    math:LibraryUtilities.ReadOnlyObject({
        sin:function(x){
            return Math.sin(x);
        },
        cos:function(x){
            return Math.cos(x);
        },
        tan:function(x){
            return Math.tan(x);
        },
        acos:function(x){
            return Math.acos(x);
        },
        asin:function(x){
            return Math.asin(x);
        },
        atan:function(x){
            return Math.atan(x);
        },
        atan2:function(y,x){
            return Math.atan2(y,x);
        },
        rad:function(x){
            return x*(Math.PI/180);
        },
        deg:function(x){
            return x*(180/Math.PI);
        },
        random:function(mi,ma){
    	    return Math.floor(Math.random() * (ma-mi+1) + mi);
        },
        floor:function(x){
            return Math.floor(x);
        },
        ceil:function(x){
            return Math.ceil(x);
        },
        round:function(x){
            return Math.round(x);
        },
        sqrt:function(x){
            return Math.sqrt(x);
        },
        sqrt2:function(x,b=2){
            return x**(1/b);
        },
        pow:function(x,y){
            return Math.pow(x,y);
        },
        pi:Math.PI,
        e:Math.E,
        log:function(x){
            return Math.log(x);
        },
        logb:function(x,b=10){
            return Math.log10(x)/Math.log10(b);
        },
        log10:function(x){
            return Math.log10(x);
        },
        nround:function(x,y=0){
            let m = 10**y;
            return Math.floor(x*m+0.5)/m;
        },
    }),
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
    },
    json:LibraryUtilities.ReadOnlyObject({
        encode:function(x){
            return JSON.stringify(x);
        },
        decode:function(x){
            return JSON.parse(x);
        },
    }),
};

StandardLibrary.env = StandardLibrary;
StandardLibrary.table = StandardLibrary.array;

//{{ New Library Utility }}\\

const Library = {
	New:function(Globals={},Settings={}){
		return {
			Globals:Globals,
			Settings:Settings,
			AddGlobal:function(Name,Value){
			    this.Globals[Name]=Value;
			},
		};
	},
};

Library.Standard = Library.New(StandardLibrary);
