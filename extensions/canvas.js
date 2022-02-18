/*
canvas.js XBS Extension
Adds drawing components to XBS for HTML canvas elements

Example:

 * The "canvas" global must be the 2d context of a HTML canvas element

func main(){ #Draws a house
	cdraw canvas {
    		val lineWidth=10,strokeStyle="#000000",fillStyle="#000000";
    		strokerect [new Vector(75,140),new Vector(150,110)];
        	fillrect [new Vector(130,190),new Vector(40,60)];
        	path begin;
        	moveto new Vector(50,140);
        	lineto new Vector(150,60);
        	lineto new Vector(250,140);
        	path close;
        	stroke;
	};
}

main();

*/

(()=>{
	
	//{{ Variable References }}\\
	
	const Tokenizer=XBS.Tokenizer,
		  AST=XBS.AST,
		  Interpreter=XBS.Interpreter,
		  ErrorHandler=XBS.ErrorHandler,
		  IState=XBS.IState,
		  ASTBase=XBS.ASTBase,
		  ASTNode=XBS.ASTNode,
		  ASTBlock=XBS.ASTBlock;
	
	function Lerp(a,b,t){
		return (1-t)*a+t*b;
	}
	
	class VectorBase {
		constructor(){
			return this;
		}
		Add(v){return this.Math(v,(a,b)=>a+b)}
		Sub(v){return this.Math(v,(a,b)=>a-b)}
		Mul(v){return this.Math(v,(a,b)=>a*b)}
		Div(v){return this.Math(v,(a,b)=>a/b)}
		Mod(v){return this.Math(v,(a,b)=>a%b)}
		Pow(v){return this.Math(v,(a,b)=>a**b)}
	}

	class Vector extends VectorBase {
		constructor(x=0,y=0){super();this.x=x;this.y=y}
		get X(){return this.x}
		get Y(){return this.y}
		set X(v){return this.x=v}
		set Y(v){return this.y=v}
		toString(){return `${this.x},${this.y}`}
		Math(v,c){let x=v,y=v;if(v instanceof Vector)x=v.x,y=v.y;return new Vector(c(this.x,x),c(this.y,y))}
		get Magnitude(){return Math.sqrt((this.x**2)+(this.y**2))}
		Normalize(){let m = this.Magnitude;return new Vector(this.x/m,this.y/m)}
		NoNan(){let{x,y}=this;return new Vector(isNaN(x)?0:x,isNaN(y)?0:y)}
		Lerp(v,t){return new Vector(Lerp(this.x,v.x,t),Lerp(this.y,v.y,t))}
	}
	
	//{{ Internal AST Functions }}\\
	
	const States = [
		{
			Value:"line",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Line");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"val",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Value");
				Stack.Next();
				Node.Write("List",Stack.IdentifierList({AllowDefault:true}));
				return Node;
			},
		},
		{
			Value:"lineto",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("LineTo");
				Stack.Next();
				Node.Write("V",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"moveto",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("MoveTo");
				Stack.Next();
				Node.Write("V",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"fillrect",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("FillRect");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"strokerect",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("StrokeRect");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"stroke",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Stroke");
				Stack.Next();
				Node.Write("Style",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"fill",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Fill");
				Stack.Next();
				Node.Write("Style",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"path",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Path");
				Stack.Next();
				if(AST.IsToken(Stack.Token,"begin","Identifier")){
					Node.Write("Type","Begin");
				}else if(AST.IsToken(Stack.Token,"close","Identifier")){
					Node.Write("Type","Close");	
				}else{
					Stack.ErrorIfEOS();
					ErrorHandler.AError(Stack,"Expected","begin or close for path",`${Stack.Token.RawValue}`);	
				}
				return Node;
			},
		},
		{
			Value:"do",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Do");
				Stack.Next();
				Node.Write("Body",Stack.ParseBlock());
				return Node;
			},
		},
		{
			Value:"filltext",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("FillText");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"stroketext",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("StrokeText");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"custom",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Custom");
				Stack.TypeTestNext("Identifier");
				Stack.Next();
				Node.Write("Name",Stack.Token.Value);
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
	];
	function ParseState(Stack){
		let Result = undefined;
		let Token = Stack.Token;
		for(let State of States){
			if(AST.IsToken(Token,State.Value,State.Type)){
				Result = State.Call(Stack);
				break;
			}
		}
		return Result;
	}
	function ParseBlock(Stack){
		Stack.ErrorIfEOS();
		if(AST.IsToken(Stack.Token,"BOPEN","Bracket")){
			let Block = Stack.NewBlock("CanvasChunk");
			while(!Stack.IsEnd()){
				Stack.ErrorIfEOS();
				if(Stack.CheckNext("BCLOSE","Bracket"))break;
				Stack.Next();
				Block.Write(ParseState(Stack));
				if(Stack.CheckNext("LINEEND","Operator"))Stack.Next();
			}
			Stack.TestNext("BCLOSE","Bracket");
			Stack.Next();
			return Block;
		}else ErrorHandler.AError(Stack,"Expected","bracket {",`${Stack.Token.Type.toLowerCase()} ${Stack.Token.RawValue}`);
	}
	
	//{{ Internal Interpreter Functions }}\\
	
	const IStates = {
		Line:function(Stack,State,Token){
			let C = State.Data.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let V1 = List[0],
				V2 = List[1];
			if(!(V1 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v1",Stack.GetType(V1));
			if(!(V2 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v2",Stack.GetType(V2));
			if(!(List[2]===null||List[2]===undefined)){
				C.lineWidth=List[2];
			}
			C.moveTo(V1.x,V1.y);
			C.lineTo(V2.x,V2.y);
		},
		Path:function(Stack,State,Token){
			let C = State.Data.Context,
				Type = Token.Read("Type");
			if(Type==="Begin"){
				C.beginPath();	
			}else if(Type==="Close"){
				C.closePath();
			}
		},
		Stroke:function(Stack,State,Token){
			let C = State.Data.Context,
				Style = Stack.Parse(State,Token.Read("Style"));
			if(Style)C.strokeStyle=Style;
			C.stroke();
		},
		Fill:function(Stack,State,Token){
			let C = State.Data.Context,
				Style = Stack.Parse(State,Token.Read("Style"));
			if(Style)C.fillStyle=Style;
			C.fill();
		},
		FillRect:function(Stack,State,Token){
			let C = State.Data.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let V1 = List[0],
				V2 = List[1];
			if(!(V1 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v1",Stack.GetType(V1));
			if(!(V2 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v2",Stack.GetType(V2));
			if(!(List[2]===null||List[2]===undefined)){
				C.fillStyle=List[2];
			}
			C.fillRect(V1.x,V1.y,V2.x,V2.y);
		},
		StrokeRect:function(Stack,State,Token){
			let C = State.Data.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let V1 = List[0],
				V2 = List[1];
			if(!(V1 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v1",Stack.GetType(V1));
			if(!(V2 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v2",Stack.GetType(V2));
			if(!(List[3]===null||List[3]===undefined)){
				C.lineWidth=List[3];
			}
			if(!(List[2]===null||List[2]===undefined)){
				C.strokeStyle=List[2];
			}
			C.strokeRect(V1.x,V1.y,V2.x,V2.y);
		},
		Do:function(Stack,State,Token){
			let C = State.Data.Context,
				Body = Token.Read("Body"),
				NS = new IState(Body,State,{Context:C});
			Stack.ParseState(NS);
		},
		LineTo:function(Stack,State,Token){
			let C = State.Data.Context;
			let V = Stack.Parse(State,Token.Read("V"));
			if(!(V instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for lineto v",Stack.GetType(V));
			C.lineTo(V.x,V.y);
		},
		MoveTo:function(Stack,State,Token){
			let C = State.Data.Context;
			let V = Stack.Parse(State,Token.Read("V"));
			if(!(V instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for moveto v",Stack.GetType(V));
			C.moveTo(V.x,V.y);
		},
		Value:function(Stack,State,Token){
			let C = State.Data.Context;
			let List = Token.Read("List");
			for(let V of List)C[V.Name]=Stack.Parse(State,V.Value);
		},
		FillText:function(Stack,State,Token){
			let C = State.Data.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let T = List[0],
				V = List[1];
			if(!(V instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for filltext v",Stack.GetType(V));
			if(!(List[2]===null||List[2]===undefined)){
				C.fillStyle=List[2];
			}
			C.fillText(T,V.x,V.y);
		},
		StrokeText:function(Stack,State,Token){
			let C = State.Data.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let T = List[0],
				V = List[1];
			if(!(V instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for stroketext v",Stack.GetType(V));
			if(!(List[2]===null||List[2]===undefined)){
				C.strokeStyle=List[2];
			}
			if(!(List[3]===null||List[3]===undefined)){
				C.lineWidth=List[3];
			}
			C.strokeText(T,V.x,V.y);
		},
		Custom:function(Stack,State,Token){
			let C = State.Data.Context,
			    	List = Stack.Parse(State,Token.Read("List"));
			C[Token.Read("Name")](...List);
		},
	};
	
	function ParseIState(Stack,State,Token){
		if(!(Token instanceof ASTBase))return Token;
		for(let Name in IStates){
			let Call = IStates[Name];
			if(Token.Type===Name){
				return Call(Stack,State,Token);
			}
		}
		return null;
	}
	
	function ParseCState(Stack,State){
		while(!State.IsEnd()){
			if (State.Read("InAs") === true) {
				if (!Stack.Parse(State, State.Read("AsExpression"))) {
					break;
				}
			}
			ParseIState(Stack,State,State.Token);
			if (State.Read("Returned") === true) {
				State.Write("InLoop", false);
				break;
			}
			if (State.Read("Stopped") === true) {
				State.Write("InLoop", false);
				break;
			}
			if (State.Read("Continued") === true) break;
			if (State.Read("Exited") === true) break;
			State.Next();
		}
		State.Close();
	}
	
	//{{ Canvas Syntax }}\\
	
	XBS.NewToken("CANVAS","cdraw","Keyword");
	XBS.NewASTChunk({
		Value:"CANVAS",
		Type:"Keyword",
		Call:function(){
			let Node = this.NewNode("CanvasDraw");
			this.Next();
			Node.Write("Context",this.ParseExpression());
			this.Next();
			Node.Write("Body",ParseBlock(this));
			return Node;
		}
	});
	XBS.NewInterpreterParseState("CanvasDraw",function(State,Token){
		const Context = this.Parse(State,Token.Read("Context"));
		const Body = Token.Read("Body");
		let NS = new IState(Body,State,{Context:Context});
		NS.NewVariable("Vector",Vector);
		ParseCState(this,NS);
	});
})();
