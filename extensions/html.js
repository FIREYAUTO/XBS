/*
html.js XBS Extension
Adds HTML components to XBS for an easier way to make HTML elements

Example:

 * The "body" global must be an HTML element.

set x = parsehtml {
	p {
    		"Hello, ";
        	span [style="color:#ff1a4c"] {"world"};
        	"!";
	};
}
body.appendChild(x[0]);

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
					Node.Write("Properties",Stack.IdentifierListInside({Value:"IOPEN",Type:"Bracket"},{Value:"ICLOSE",Type:"Bracket"},{AllowDefault:true,AllowKeyword:true,SoftCheck:true}));
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
			function Apply(A,B){
				if(typeof B!="object")return;
				for(let k in B){
					let v = Stack.Parse(BS,B[k]);
					if(typeof v==="object")Apply(A[k],v);
					else A[k]=v;
				}
			}
			for(let V of Properties){
				let Val = Stack.Parse(BS,V.Value);
				if(typeof Val==="object")Apply(Element[V.Name],Val);
				else Element[V.Name]=Val;
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
