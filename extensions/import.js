/*
import.js XBS Extension
Adds import/export components to XBS for modular-like code.

Example:



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
	
	//{{ Export Syntax }}\\
  
	XBS.NewToken("EXPORT","export","Keyword");
	XBS.NewASTChunk({
		Value:"EXPORT",
		Type:"Keyword",
		Call:function(){
			let Node = this.NewNode("Export");
			this.Next();
      let Chunk = this.ParseRChunk(true);
      let ValidTypes = "Destructure NewVariable GetVariable Function Class Define".split(" ");
      if(!(Chunk instanceof ASTBase)||!ValidTypes.includes(Chunk.Type))ErrorHandler.AError(this,"Invalid","chunk after export statement; expected some form of variable declaration");
      Node.Write("Chunk",Chunk);
			return Node;
		}
	});
	XBS.NewInterpreterParseState("Export",function(State,Token){
		const Chunk = Token.Read("Chunk");
		let NS = new IState({Data: [], Line: Chunk.Line, Index: Chunk.Index},State);
		if(!State.GlobalVariables["XBS Exports"])State.GlobalVariables["XBS Exports"]={};
		let Exports = State.GlobalVariables["XBS Exports"];
		if(Chunk.Type==="GetVariable"){
			let V = State.GetGlobalRawVariable(Chunk.Read("Name"));
			NS.Variables.push(V);
		}else{
			this.ParseState(NS);	
		}
		for(let V of NS.Variables){
			V.State = State;
			Exports[V.Name]=V;
		}
	});
	
	//{{ Import Syntax }}\\
	
	XBS.NewToken("IMPORT","import","Keyword");
	XBS.NewASTChunk({
		Value:"IMPORT",
		Type:"Keyword",
		Call:function(){
			let Node = this.NewNode("Import");
			this.Next();
			Node.Write("URL",this.ParseExpression());
			this.TestNext("AS","Keyword");
			this.Next(2);
			let Tk = this.Token;
			if(AST.IsToken(Tk,"MUL","Operator")){
				Node.Write("Type","All");
			}else{
				let Result = [];
				do{
					let Identifier = {
						Name:undefined,
						Alias:undefined,
					};
					let Token = this.Token;
					this.ErrorIfEOS();
					if(!AST.IsType(Token,"Identifier"))ErrorHandler.AError(this,"Expected","identifier for import statement",`${Token.Type.toLowerCase()} ${Token.RawValue}`);
					Identifier.Name = Token.Value;
					if(this.CheckNext("AS","Keyword")){
						this.Next(2);
						let Token = this.Token;
						if(!AST.IsType(Token,"Identifier"))ErrorHandler.AError(this,"Expected","identifier for import statement alias",`${Token.Type.toLowerCase()} ${Token.RawValue}`);
						Identifier.Alias = Token.Value;
					}
					Result.push(Identifier);
					if(this.CheckNext("COMMA","Operator")){
						this.Next(2);
						continue;
					}
					break;
				}while(true);
				Node.Write("Names",Result);
			}
			return Node;
		},
	});
	XBS.NewInterpreterParseState("Import",function(State,Token){
		let Names = Token.Read("Names");
		let Type = Token.Read("Type");
		let XML = new XMLHttpRequest();
		XML.open("GET",this.Parse(State,Token.Read("URL")),false);
		XML.send();
		let Res = XBS(XML.response,this.Environment);
		if(!Res.Success)throw Error(Res.Error);
		let Exp = Res.GlobalSettings["XBS Exports"]||{};
		let R = {};
		if(Type==="All"){
			for(let Name in Exp){
				R[Name]=Exp[Name];	
			}
		}else{
			for(let V of Names){
				let N = V.Name;
				if(V.Alias)N=V.Alias;
				R[N]=Exp[V.Name];
			}
		}
		for(let Name in R){
			let V = R[Name];
			State.NewVariable(Name,V.Value,{
				Constant:V.Constant,
				Type:V.Type,
			});
		}
	});
})();
