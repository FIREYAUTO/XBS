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
	
	//{{ Internal AST Functions }}\\
	
	const States = [
		{
			Type:"Constant",
			Call:function(Stack){
				let Node = Stack.NewNode("Constant");
				Node.Write("Value",Stack.Token.Value);
				return Node;
			},
		},
		{
			Type:"Bool",
			Call:function(Stack){
				let Node = Stack.NewNode("Constant");
				Node.Write("Value",Stack.Token.Value);
				return Node;
			},
		},
		{
			Type:"Null",
			Call:function(Stack){
				let Node = Stack.NewNode("Constant");
				Node.Write("Value",Stack.Token.Value);
				return Node;
			},
		},
		{
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Element");
				Node.Write("Tag",Stack.Token.Value);
				if(Stack.CheckNext("IOPEN","Bracket")){
					Stack.Next();
					Node.Write("Properties",Stack.IdentifierListInside({Value:"IOPEN",Type:"Bracket"},{Value:"ICLOSE",Type:"Bracket"},{AllowDefault:true,SoftCheck:true}));
				}else{
					Node.Write("Properties",[]);	
				}
				if(Stack.CheckNext("BOPEN","Bracket")){
					Stack.Next();
					Node.Write("Body",ParseBlock(Stack));
				}else{
					Node.Write("Body",Stack.NewBlock("HtmlChunk"));	
				}
				return Node;
			},
		},
	];
	function ParseState(Stack){
		let Result = undefined;
		let Token = Stack.Token;
		for(let State of States){
			if(!State.Value&&State.Type){
				if(AST.IsType(Token,State.Type)){
					Result = State.Call(Stack);
					break;
				}
			}else{
				if(AST.IsToken(Token,State.Value,State.Type)){
					Result = State.Call(Stack);
					break;
				}	
			}
			
		}
		return Result;
	}
	function ParseBlock(Stack){
		Stack.ErrorIfEOS();
		if(AST.IsToken(Stack.Token,"BOPEN","Bracket")){
			let Block = Stack.NewBlock("HtmlChunk");
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
		Element:function(Stack,State,Token){
			let Elements = State.Data.Elements,
				Body = Token.Read("Body"),
				PE = [],
				BS = new IState(Body,State,{Elements:PE}),
				Properties = Token.Read("Properties");
			let Element = document.createElement(Token.Read("Tag"));
			BS.NewVariable("_self",Element);
			for(let V of Properties){
				Element[V.Name]=Stack.Parse(BS,V.Value);
			}
			ParseCState(Stack,BS);
			for(let V of PE){
				if(typeof V!="object"){
					Element.insertAdjacentText("beforeend",V);
				}else{
					Element.appendChild(V);	
				}
			}
			Elements.push(Element);
		},
		Constant:function(Stack,State,Token){
			let Elements = State.Data.Elements;
			Elements.push(Token.Read("Value"));
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
	
	XBS.NewToken("HTML","parsehtml","Keyword");
	XBS.NewASTExpression({
		Value:"HTML",
		Type:"Keyword",
		Stop:false,
		Call:function(Priority){
			let Node = this.NewNode("Html");
			this.Next();
			Node.Write("Body",ParseBlock(this));
			return [Node,Priority];
		}
	});
	XBS.NewInterpreterParseState("Html",function(State,Token){
		const Body = Token.Read("Body");
		let Elements = [];
		let NS = new IState(Body,State,{Elements:Elements});
		ParseCState(this,NS);
		return Elements;
	});
})();
