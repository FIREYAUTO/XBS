// {{-=~}} Error Classes {{~=-}} \\

class InternalError extends Error {
    constructor(Message) {
        super(Message).name = this.constructor.name;
    }
}

class LexError extends Error {
    constructor(Message) {
        super(Message).name = this.constructor.name;
    }
}

class CodeError extends Error {
    constructor(Message) {
        super(Message).name = this.constructor.name;
    }
}

// {{-=~}} Token Functions {{~=-}} \\

function FromToken(x) {
    for (let k in Lex.Tokens) {
        let v = Lex.Tokens[k];
        if (k == x) {
            return v.Token;
        }
    }
    return x;
}

function SmartFromToken(Token) {
    let v = Lex.Tokens[Token.Value];
    if (v && v.Type == Token.Type) {
        return v.Token;
    }
    return Token.Value;
}

// {{-=~}} Tokenizer {{~=-}} \\

const Lex = {
    Tokens: {
        /*
        "TK_":{
            Token:"",
            Type:"",
        },
        */
        "TK_SPACE": {
            Token: " ",
            Type: "Whitespace",
        },
        "TK_TAB": {
            Token: String.fromCharCode(9),
            Type: "Whitespace",
        },
        "TK_RETCHAR": {
            Token: String.fromCharCode(10),
            Type: "Whitespace",
        },
        "TK_BACKSLASH": {
            Token: "\\",
            Type: "None",
        },
        "TK_STRING1": {
            Token: "\"",
            Type: "String",
        },
        "TK_STRING2": {
            Token: "'",
            Type: "String",
        },
        "TK_ESTRING": {
            Token: "`",
            Type: "ExpressionString",
        },
        "TK_ADDEQ": {
            Token: "+=",
            Type: "Assignment",
        },
        "TK_SUBEQ": {
            Token: "-=",
            Type: "Assignment",
        },
        "TK_MULEQ": {
            Token: "*=",
            Type: "Assignment",
        },
        "TK_DIVEQ": {
            Token: "/=",
            Type: "Assignment",
        },
        "TK_MODEQ": {
            Token: "%=",
            Type: "Assignment",
        },
        "TK_POWEQ": {
            Token: "^=",
            Type: "Assignment",
        },
        "TK_EQ": {
            Token: "=",
            Type: "Assignment",
            Combinations: {
                "TK_EQS": "TK_EQ",
                "TK_GEQ": "TK_GT",
                "TK_LEQ": "TK_LT",
                "TK_NEQ": "TK_NOT",
                "TK_ADDEQ": "TK_ADD",
                "TK_SUBEQ": "TK_SUB",
                "TK_MULEQ": "TK_MUL",
                "TK_DIVEQ": "TK_DIV",
                "TK_MODEQ": "TK_MOD",
                "TK_POWEQ": "TK_POW",
            },
        },
        "TK_GT": {
            Token: ">",
            Type: "Compare",
            Combinations: {
                "TK_COMMENTLONGOPEN": "TK_COMMENT",
                "TK_PROPCALL": "TK_SUB",
                "TK_BITZRSHIFT": "TK_GT",
                "TK_BITRSHIFT": "TK_AND",
                "TK_FORCEPARSE": "TK_EQ",
            }
        },
        "TK_LT": {
            Token: "<",
            Type: "Compare",
            Combinations: {
                "TK_BITZLSHIFT": "TK_LT",
            },
        },
        "TK_EQS": {
            Token: "==",
            Type: "Compare",
        },
        "TK_GEQ": {
            Token: ">=",
            Type: "Compare",
        },
        "TK_LEQ": {
            Token: "<=",
            Type: "Compare",
        },
        "TK_NEQ": {
            Token: "!=",
            Type: "Compare",
        },
        "TK_NOT": {
            Token: "!",
            Type: "Conditional",
        },
        "TK_AND": {
            Token: "&",
            Type: "Conditional",
            Combinations: {
                "TK_BITAND": "TK_AND",
            },
        },
        "TK_OR": {
            Token: "|",
            Type: "Conditional",
            Combinations: {
                "TK_BITOR": "TK_OR",
            },
        },
        "TK_DOT": {
            Token: ".",
            Type: "None",
            Combinations: {
                "TK_NUMRANGE": "TK_DOT",
            }
        },
        "TK_NUMRANGE": {
            Token: "..",
            Type: "None",
        },
        "TK_ADD": {
            Token: "+",
            Type: "Operator",
            Combinations: {
                "TK_INC": "TK_ADD",
            },
        },
        "TK_SUB": {
            Token: "-",
            Type: "Operator",
            Combinations: {
                "TK_DEINC": "TK_SUB",
            },
        },
        "TK_MUL": {
            Token: "*",
            Type: "Operator",
        },
        "TK_DIV": {
            Token: "/",
            Type: "Operator",
        },
        "TK_POW": {
            Token: "^",
            Type: "Operator",
            Combinations: {
                "TK_BITXOR": "TK_POW",
            },
        },
        "TK_MOD": {
            Token: "%",
            Type: "Operator",
            Combinations: {
                "TK_POF": "TK_MOD",
            }
        },
        "TK_POF": {
            Token: "%of",
            Type: "Operator",
        },
        "TK_ROUND": {
            Token: "~",
            Type: "Operator",
            Combinations: {
                "TK_BITNOT": "TK_ROUND",
            },
        },
        "TK_INC": {
            Token: "++",
            Type: "Incremental",
        },
        "TK_DEINC": {
            Token: "--",
            Type: "Incremental",
        },
        "TK_TRUE": {
            Token: "true",
            Type: "Bool",
        },
        "TK_FALSE": {
            Token: "false",
            Type: "Bool",
        },
        "TK_NULL": {
            Token: "null",
            Type: "Null",
        },
        "TK_BOPEN": {
            Token: "{",
            Type: "Bracket",
        },
        "TK_BCLOSE": {
            Token: "}",
            Type: "Bracket",
        },
        "TK_POPEN": {
            Token: "(",
            Type: "Paren",
        },
        "TK_PCLOSE": {
            Token: ")",
            Type: "Paren",
        },
        "TK_IOPEN": {
            Token: "[",
            Type: "Brace",
        },
        "TK_ICLOSE": {
            Token: "]",
            Type: "Brace",
        },
        "TK_COMMENT": {
            Token: "#",
            Type: "Comment",
            Combinations: {
                "TK_COMMENTLONGCLOSE": "TK_LT",
            },
        },
        "TK_COMMENTLONGOPEN": {
            Token: "#>",
            Type: "Comment"
        },
        "TK_COMMENTLONGCLOSE": {
            Token: "<#",
            Type: "Comment"
        },
        "TK_COMMA": {
            Token: ",",
            Type: "None",
        },
        "TK_NONE": {
            Token: "",
            Type: "None",
        },
        "TK_LINEEND": {
            Token: ";",
            Type: "None",
        },
        "TK_SELFCALL": {
            Token: "::",
            Type: "None",
        },
        "TK_COLON": {
            Token: ":",
            Type: "None",
            Combinations: {
                "TK_SELFCALL": "TK_COLON",
            },
        },
        "TK_PROPCALL": {
            Token: "->",
            Type: "None",
        },
        "TK_LEN": {
            Token: "?",
            Type: "None",
        },
        "TK_AT": {
            Token: "@",
            Type: "None",
        },
        "TK_FORCEPARSE": {
            Token: "=>",
            Type: "None",
        },
        "TK_EOS": {
            Token: "&lt;eos&gt;",
            Type: "End",
        },
        "TK_BITAND": {
            Token: "&&",
            Type: "Bitwise",
        },
        "TK_BITOR": {
            Token: "||",
            Type: "Bitwise",
        },
        "TK_BITXOR": {
            Token: "^^",
            Type: "Bitwise",
        },
        "TK_BITNOT": {
            Token: "~~",
            Type: "Bitwise",
        },
        "TK_BITZLSHIFT": {
            Token: "<<",
            Type: "Bitwise",
        },
        "TK_BITZRSHIFT": {
            Token: ">>",
            Type: "Bitwise",
        },
        "TK_BITRSHIFT": {
            Token: "&>",
            Type: "Bitwise",
        },
        //Keywords
        "TK_SET": {
            Token: "set",
            Type: "Keyword",
        },
        "TK_IF": {
            Token: "if",
            Type: "Keyword",
        },
        "TK_ELIF": {
            Token: "elif",
            Type: "Keyword",
        },
        "TK_ELSE": {
            Token: "else",
            Type: "Keyword",
        },
        "TK_WHILE": {
            Token: "while",
            Type: "Keyword",
        },
        "TK_FOR": {
            Token: "for",
            Type: "Keyword",
        },
        "TK_FOREACH": {
            Token: "foreach",
            Type: "Keyword",
        },
        "TK_IN": {
            Token: "in",
            Type: "Keyword",
        },
        "TK_OF": {
            Token: "of",
            Type: "Keyword",
        },
        "TK_AS": {
            Token: "as",
            Type: "Keyword",
        },
        "TK_FUNC": {
            Token: "func",
            Type: "Keyword",
        },
        "TK_SEND": {
            Token: "send",
            Type: "Keyword",
        },
        "TK_DEL": {
            Token: "del",
            Type: "Keyword",
        },
        "TK_STOP": {
            Token: "stop",
            Type: "Keyword",
        },
        "TK_NEW": {
            Token: "new",
            Type: "Keyword",
        },
        "TK_WITH": {
            Token: "with",
            Type: "Keyword",
        },
        "TK_CLASS": {
            Token: "class",
            Type: "Keyword",
        },
        "TK_EXTENDS": {
            Token: "extends",
            Type: "Keyword",
        },
        "TK_DESTRUCT": {
            Token: "destruct",
            Type: "Keyword",
        },
        "TK_UNSET": {
            Token: "unset",
            Type: "Keyword",
        },
        "TK_ISA": {
            Token: "isa",
            Type: "Keyword",
        },
        "TK_USING": {
            Token: "using",
            Type: "Keyword",
        },
        "TK_SWAP": {
            Token: "swap",
            Type: "Keyword",
        },
        "TK_SWITCH": {
            Token: "switch",
            Type: "Keyword",
        },
        "TK_DEFAULT": {
            Token: "def",
            Type: "Keyword",
        },
        "TK_CASE": {
            Token: "case",
            Type: "Keyword",
        },
        "TK_CONST": {
            Token: "const",
            Type: "Keyword",
        },
        "TK_REPEAT": {
            Token: "repeat",
            Type: "Keyword",
        },
        "TK_SETTYPE": {
            Token: "settype",
            Type: "Keyword",
        },
        "TK_CHUNK": {
            Token: "chunk",
            Type: "Keyword",
        },
        "TK_EXCLUDE": {
            Token: "exclude",
            Type: "Keyword",
        },
        "TK_TRY": {
            Token: "try",
            Type: "Keyword",
        },
        "TK_CATCH": {
            Token: "catch",
            Type: "Keyword",
        },
        "TK_FINALLY": {
            Token: "finally",
            Type: "Keyword",
        },
        "TK_DEFINE": {
            Token: "define",
            Type: "Keyword",
        },
        "TK_ISTYPE": {
            Token: "istype",
            Type: "Keyword",
        },
        "TK_DOERROR": {
            Token: "doerror",
            Type: "Keyword",
        },
        "TK_CONTINUE": {
            Token: "continue",
            Type: "Keyword",
        },
        "TK_EACH": {
            Token: "each",
            Type: "Keyword",
        },
        "TK_LOCKVAR": {
            Token: "lockvar",
            Type: "Keyword",
        },
        "TK_UPVAR": {
            Token: "upvar",
            Type: "Keyword",
        },
        "TK_EXIT": {
            Token: "exit",
            Type: "Keyword",
        },
    },
    GetToken: function (x) {
        for (let k in this.Tokens) {
            let v = this.Tokens[k];
            if (v.Token == x) {
                return k;
            }
        }
        return x;
    },
    NewToken: function (Value, Type, Index, Line) {
        return {
            Value: Value,
            Type: Type,
            Position: Index,
            Line: Line,
            toString: function () {
                return `Type: "<b>${this.Type}</b>" => Value: "<b>${this.Value}</b>" => Position: <b>${this.Position}</b> => Line: <b>${this.Line}</b>${this.hasOwnProperty("CType") ? ` => CType: "<b>${this.CType}</b>"` : ""}`;
            }
        }
    },
    GetTokenType: function (x) {
        for (let k in this.Tokens) {
            let v = this.Tokens[k];
            if (k == x) {
                return v.Type;
            }
        }
        return "Identifier";
    },
    IsToken: function (x) {
        return this.Tokens.hasOwnProperty(x);
    },
    Tokenize: function (Code) {
        let Tokens = [];
        let Letters = 0;
        let Index = 1, Line = 1;
        let CL = Code.length;
        function Write(n, x, literal = false, forceIndex, forceLine) {
            let Type = !literal ? Lex.GetTokenType(x) : "Identifier";
            if (Type == "Whitespace" && x == "TK_RETCHAR") {
                Line++;
                Index = 0;
            }
            Tokens[(Tokens.length - 1) + n] = Lex.NewToken(x, Type, forceIndex || Index, forceLine || Line);
        }
        function Last() {
            return Tokens[Tokens.length - 1];
        }
        for (let i = 0; i <= CL - 1; i++) {
            let Raw = Code.substr(i, 1);
            let Token = this.GetToken(Raw);
            if (Token != Raw) {
                if (Letters > 0) {
                    let Behind = Code.substring(i - Letters, i);
                    let Literal = this.IsToken(Behind);
                    Write(1, this.GetToken(Behind), Literal, Index - Letters);
                    Letters = 0;
                }
                let Previous = Last();
                let Combinations = this.Tokens[Token].Combinations;
                let DidWrite = false;
                if (Combinations && Previous) {
                    for (let k in Combinations) {
                        let v = Combinations[k];
                        let tv = this.Tokens[v];
                        if (!tv) { continue }
                        if (v == Previous.Value && tv.Type == Previous.Type) {
                            Write(0, k);
                            DidWrite = true;
                            break;
                        }
                    }
                }
                if (!DidWrite) {
                    Write(1, Token);
                }
            } else {
                if (i >= CL - 1) {
                    let Behind = Code.substring(i - Letters, i + 1);
                    let Literal = this.IsToken(Behind);
                    Write(1, this.GetToken(Behind), Literal, Index - Letters);
                    break;
                } else {
                    Letters++;
                }
            }
            Index++;
        }
        Write(1, "TK_EOS", false);
        return this.RemoveWhitespace(this.MakeConstants(Tokens));
    },
    MakeConstants: function (Tokens) {
        let Result = [];
        let Current = -1;
        let Token = undefined;
        function Next() {
            Current++;
            Token = Tokens[Current];
            return Token;
        }
        function Jump(Amount = 1) {
            Current -= Amount;
            Token = Tokens[Current];
            return Token;
        }
        function IsEnd() {
            return Current >= Tokens.length;
        }
        function TypeToken(Token, Type) {
            if (!Token) { return false }
            return Token.Type == Type;
        }
        function PreciseToken(Token, Type, Value) {
            if (!Token) { return false }
            return TypeToken(Token, Type) && Token.Value == Value;
        }
        function TokenRaw(Value) {
            for (let k in Lex.Tokens) {
                let v = Lex.Tokens[k];
                if (k == Value) {
                    return v.Token;
                }
            }
            return Value;
        }
        function From(Token) {
            let v = Lex.Tokens[Token.Value];
            if (v && v.Type == Token.Type) {
                return v.Token;
            }
            return Token.Value;
        }
        function StringType(Token) {
            if (!TypeToken(Token, "String")) { return -1 }
            return Token.Value == "TK_STRING1" ? 0 : 1;
        }
        function IsENumeric(Value) {
            let Lower = Value.toLowerCase();
            if (Lower.length < 2) { return false }
            if (Lower.endsWith("e")) {
                let Start = Lower.substr(0, Lower.length - 1);
                return !isNaN(+Start);
            }
            return false;
        }
        function ParseENumber() {
            Next();
            if (PreciseToken(Token, "Operator", "TK_ADD")) {
                Next();
                if (!isNaN(+Token.Value)) {
                    return `+${Token.Value}`;
                }
            } else if (PreciseToken(Token, "Operator", "TK_SUB")) {
                Next();
                if (!isNaN(+Token.Value)) {
                    return `-${Token.Value}`;
                }
            }
            throw new CodeError(`Invalid number sequence at line ${Token.Line}`);
        }
        function MakeTypeToken(v) {
            return v.Value;
        }
        function Read() {
            let CT = Token;
            if (CT.Type == "String") {
                let New = "";
                Next();
                let ST = StringType(CT);
                if (!TypeToken(Token, "String") && !(StringType(Token) == ST)) {
                    while (!IsEnd()) {
                        if (PreciseToken(Token, "None", "TK_BACKSLASH")) {
                            Next();
                        }
                        New += From(Token);
                        Next();
                        if (TypeToken(Token, "String") && StringType(Token) == ST) {
                            break;
                        }
                    }
                }
                CT.Type = "Constant";
                CT.Value = New;
                CT.CType = "String";
            } else if (CT.Type == "ExpressionString") {
                Result.push(CT);
                Next();
                while (!IsEnd()) {
                    if (PreciseToken(Token, "None", "TK_BACKSLASH")) {
                        Result.push(Token);
                        Next();
                    }
                    if (TypeToken(Token, "Whitespace")) {
                        Token.IsPerm = true;
                    }
                    let Res = Read();
                    if (Res) {
                        Result.push(Res);
                    }
                    Next();
                    if (TypeToken(Token, "ExpressionString")) {
                        break;
                    }
                }
                Result.push(Token);
                return;
            } else if (!isNaN(+CT.Value)) {
                let Num = CT.Value;
                Next();
                if (PreciseToken(Token, "None", "TK_DOT")) {
                    Next();
                    if (Token) {
                        let IsENum = IsENumeric(Token.Value);
                        if (!isNaN(+Token.Value)) {
                            Num += `.${Token.Value}`;
                        } else if (IsENum) {
                            Num += `.${Token.Value}${ParseENumber()}`;
                        }
                    } else {
                        Jump(2);
                    }
                } else {
                    Jump();
                }
                CT.Type = "Constant";
                CT.Value = +Num;
                CT.CType = "Number";
            } else if (IsENumeric(CT.Value)) {
                CT.Type = "Constant";
                CT.Value = +`${CT.Value}${ParseENumber()}`;
                CT.CType = "Number";
                return CT;
            } else if (TypeToken(CT, "Bool")) {
                CT.Value = CT.Value == "TK_TRUE" ? true : false;
                CT.CType = "Bool";
                CT.Type = "Constant";
            } else if (TypeToken(CT, "Null")) {
                CT.Type = "Constant";
                CT.CType = "Null";
                CT.Value = null;
            } else if (PreciseToken(CT, "Comment", "TK_COMMENT")) {
                Next();
                while (!IsEnd()) {
                    Next();
                    if (PreciseToken(Token, "Whitespace", "TK_RETCHAR")) {
                        break;
                    }
                }
                return;
            } else if (PreciseToken(CT, "Comment", "TK_COMMENTLONGOPEN")) {
                Next();
                let NewSyntax = [];
                let IsNewSyntax = false;
                while (!IsEnd()) {
                    if (PreciseToken(Token, "Identifier", "newsyntax")) {
                        IsNewSyntax = true;
                        Next();
                    }
                    if (PreciseToken(Token, "None", "TK_BACKSLASH")) {
                        Next();
                        if (IsNewSyntax) {
                            NewSyntax.push(Token);
                        }
                    }
                    Next();
                    if (PreciseToken(Token, "Comment", "TK_COMMENTLONGCLOSE")) {
                        break;
                    }
                    if (IsNewSyntax) {
                        NewSyntax.push(Token);
                    }
                }
                if (IsNewSyntax) {
                    NewSyntax = Lex.MakeConstants(NewSyntax);
                    let Obj = {};
                    let c = -1;
                    let t = undefined;
                    let n = a => { c += a || 1; t = NewSyntax[c]; return t }
                    let r = () => {
                        if (PreciseToken(t, "None", "TK_AT")) {
                            let v = n();
                            n();
                            if (PreciseToken(t, "None", "TK_COLON")) {
                                let vv = n();
                                Obj[TokenRaw(v.Value)] = TokenRaw(MakeTypeToken(vv));
                            }
                        }
                    }
                    n();
                    while (c <= NewSyntax.length - 1) {
                        r();
                        n();
                    }
                    CT.Type = "CustomSyntax";
                    CT.Value = Obj;
                    return CT;
                }
                return;
            }
            return CT;
        }
        Next();
        while (!IsEnd()) {
            let T = Read();
            if (T) {
                Result.push(T);
            }
            Next();
        }
        return Result;
    },
    RemoveWhitespace: function (Tokens) {
        return Tokens.filter(x => {
            if (x.Type == "Whitespace") {
                if (x.IsPerm == true) {
                    return true;
                }
                return false;
            }
            return true;
        });
    },
    ThrowError: function (Class, Message, Stack) {
        let Result = Message;
        if (Stack) {
            Result = `[Line ${Stack.CurrentLine}]: ` + Result;
        }
        throw new (Class)(Result);
    },
}

// {{-=~}} AST Class {{~=-}} \\

const AST = Object.freeze({
    NewStack: function (Options = {}) {
        let Stack = {
            Token: "TK_NONE",
            PToken: "TK_NONE",
            Current: -1,
            OpenChunks: [],
            CurrentLine: 1,
            Chunk: [],
            Result: [],
            CustomSyntaxes: {
                CH: [],
                PE: [],
                SE: [],
                CE: [],
            },
            InString:false,
        };
        for (let k in Options) {
            if (!Stack.hasOwnProperty(k)) {
                Stack[k] = Options[k];
            }
        }
        return Stack
    },
    CloseChunk: function (Stack) {
        if (Stack.OpenChunks.length > 1) {
            Stack.OpenChunks[Stack.OpenChunks.length - 1].push(Stack.Chunk);
            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length - 1];
            Stack.OpenChunks.pop();
        } else {
            if (Stack.Chunk) {
                Stack.Result.push(Stack.Chunk);
            }
            if (Stack.OpenChunks.length == 1) {
                Stack.Chunk = Stack.OpenChunks[0];
                Stack.OpenChunks.pop();
            } else {
                Stack.Chunk = null;
            }
        }
    },
    OpenChunk: function (Stack) {
        if (Stack.Chunk) {
            Stack.OpenChunks.push(Stack.Chunk);
        }
        Stack.Chunk = [];
    },
    IsPreciseToken: function (Token, Type, Value) {
        if (!Token) { return false }
        return Token.Type == Type && Token.Value == Value;
    },
    IsTokenType: function (Token, Type) {
        if (!Token) { return false }
        return Token.Type == Type;
    },
    ErrorIfTokenNotType: function (Stack, Type) {
        if (Stack.Token.Type != Type) {
            Lex.ThrowError(CodeError, `Expected ${Type}, got ${Stack.Token.Type} instead`, Stack);
        }
    },
    ChunkWrite: function (Stack, Value, Place) {
        if (Place === undefined) {
            Stack.Chunk.push(Value);
        } else {
            Stack.Chunk[Place] = Value;
        }
    },
    //{{ CustomSyntax }}\\
    IsCustomSyntax: function (Stack, Type, Token) {
        for (let v of Stack.CustomSyntaxes[Type]) {
            if (v.Token == Token.Value) {
                return [true, `(${v.Value})`, `(${v.Interpret})`, v.NoMath, v.NoCond];
            }
        }
        return [false];
    },
    //{{ Next }}\\
    Next: function (Stack) {
        Stack.Current++;
        Stack.PToken = Stack.Token;
        Stack.Token = Stack.Tokens[Stack.Current];
        Stack.CurrentLine = Stack.Token?.Line;
        if (!Stack.InString&&Stack.Token&&Stack.Token.Type=="Whitespace"){
            this.Next(Stack);
        }
        return Stack.Token;
    },
    Move: function (Stack, Amount = 1) {
        Stack.Current += Amount;
        Stack.PToken = Stack.Token;
        Stack.Token = Stack.Tokens[Stack.Current];
        Stack.CurrentLine = Stack.Token?.Line;
        if (!Stack.InString &&Stack.Token && Stack.Token.Type == "Whitespace") {
            this.Next(Stack);
        }
        return Stack.Token;
    },
    JumpBack: function (Stack, Amount = 1) {
        for (let i = 1; i <= Amount; i++) {
            Stack.Current--;
            Stack.PToken = Stack.Tokens[Stack.Current - 1];
            Stack.Token = Stack.Tokens[Stack.Current];
        }
        return Stack.Token;
    },
    //{{ Chunk Editing }}\\
    NewChunk: function (Type) {
        return [Type];
    },
    ChunkAdd: function (Chunk, Value) {
        Chunk.push(Value);
    },
    ChunkEdit: function (Chunk, Value, Place) {
        Chunk[Place] = Value;
    },
    //{{ CheckNext }}\\
    CheckNext: function (Stack, Type, Value) {
        let Token = this.Next(Stack);
        this.JumpBack(Stack);
        return this.IsPreciseToken(Token, Type, Value);
    },
    TypeCheckNext: function (Stack, Type) {
        let Token = this.Next(Stack);
        this.JumpBack(Stack);
        return this.IsTokenType(Token, Type);
    },
    TestNext: function (Stack, Type, Value) {
        if (!this.CheckNext(Stack, Type, Value)) {
            Lex.ThrowError(CodeError, `Expected ${FromToken(Value)}, got ${FromToken(this.Next(Stack).Value)} instead`, Stack);
        }
    },
    TypeTestNext: function (Stack, Type) {
        if (!this.TypeCheckNext(Stack, Type)) {
            Lex.ThrowError(CodeError, `Expected type "${Type}", got type "${this.Next(Stack).Type}"`, Stack);
        }
    },
    //{{ Type Handling }}\\
    FinishTypeExpression: function (Stack, Value) {
        let Union = this.CheckNext(Stack, "Conditional", "TK_OR");
        let Concat = this.CheckNext(Stack, "Conditional", "TK_AND");
        if (Union) {
            this.Move(Stack, 2);
            let Chunk = [];
            Chunk.push("IN_TYPEUNION");
            Chunk.push(Value);
            Chunk.push(this.TypeExpression(Stack));
            Value = this.FinishTypeExpression(Stack, Chunk);
        } else if (Concat) {
            this.Move(Stack, 2);
            let Chunk = [];
            Chunk.push("IN_TYPECONCAT");
            Chunk.push(Value);
            Chunk.push(this.TypeExpression(Stack));
            Value = this.FinishTypeExpression(Stack, Chunk);
        }
        return Value;
    },
    TypeExpression: function (Stack, NoFinish) {
        let Token = Stack.Token;
        let Result = null;
        if (Token.Type == "Identifier") {
            Result = ["IN_TYPEGET", Token.Value];
        } else if (Token.Type == "Constant" && Token.Value == null) {
            return ["IN_TYPEGET", "null"];
        } else if (this.IsPreciseToken(Token, "Paren", "TK_POPEN")) {
            this.Next(Stack);
            Result = this.TypeExpression(Stack);
            this.TestNext(Stack, "Paren", "TK_PCLOSE");
            this.Next(Stack);
        } else if (this.IsPreciseToken(Token, "Brace", "TK_IOPEN")) {
            this.Next(Stack);
            Result = ["IN_TYPEARR", this.TypeExpression(Stack)];
            this.TestNext(Stack, "Brace", "TK_ICLOSE");
            this.Next(Stack);
        } else if (this.IsPreciseToken(Token, "None", "TK_LEN")) {
            this.Next(Stack);
            Result = ["IN_TYPENULL", this.TypeExpression(Stack, true)];
        } else if (this.IsPreciseToken(Token, "Bracket", "TK_BOPEN")) {
            this.Next(Stack);
            Result = ["IN_TYPEOBJ"];
            let Obj = { Type: "Object", Value: {} };
            let Write = true;
            Result.push(Obj);
            while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                if (this.IsPreciseToken(Stack.Token, "Brace", "TK_IOPEN")) {
                    this.Next(Stack);
                    Obj.Type = "TypeObject";
                    Obj.Key = this.TypeExpression(Stack);
                    this.TestNext(Stack, "Brace", "TK_ICLOSE");
                    this.Next(Stack);
                    this.TestNext(Stack, "None", "TK_COLON");
                    this.Move(Stack, 2);
                    Obj.Value = this.TypeExpression(Stack);
                    Write = false;
                } else {
                    if (Write) {
                        KeyName = Stack.Token;
                        if (KeyName.Type != "Constant" && KeyName.Type != "Identifier") {
                            throw new CodeError(`Invalid typed-object Key "${KeyName.Value}"`);
                        }
                        let Value = null;
                        this.TestNext(Stack, "None", "TK_COLON");
                        this.Move(Stack, 2);
                        Value = this.TypeExpression(Stack);
                        Obj.Value[KeyName.Value] = Value;
                    }
                }
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                    this.Next(Stack);
                }
            }
        }
        if (!NoFinish) {
            Result = this.FinishTypeExpression(Stack, Result);
        }
        return Result;
    },
    //{{ AssignmentGet }}\\
    AssignmentGet: function (Stack, Value) {
        this.TypeTestNext(Stack, "Assignment");
        this.Next(Stack);
        let TValue = Stack.Token.Value;
        if (TValue == "TK_EQ") {
            this.ChunkAdd(Value, "eq");
        } else if (TValue == "TK_ADDEQ") {
            this.ChunkAdd(Value, "addeq");
        } else if (TValue == "TK_SUBEQ") {
            this.ChunkAdd(Value, "subeq");
        } else if (TValue == "TK_MULEQ") {
            this.ChunkAdd(Value, "muleq");
        } else if (TValue == "TK_DIVEQ") {
            this.ChunkAdd(Value, "diveq");
        } else if (TValue == "TK_POWEQ") {
            this.ChunkAdd(Value, "poweq");
        } else if (TValue == "TK_MODEQ") {
            this.ChunkAdd(Value, "modeq");
        }
    },
    SkipEndings: function (Stack) {
        let Token = Stack.Token;
        if (this.IsPreciseToken(Token, "None", "TK_COMMA") || this.IsPreciseToken(Token, "None", "TK_LINEEND")) {
            this.Next(Stack);
        }
    },
    FinishComplexExpression: function (Stack, Value, NoCond) {
        if (NoCond) {
            return Value;
        }
        if (this.IsPreciseToken(Stack.Token, "None", "TK_LINEEND") || this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
            return Value;
        }
        //Conditional
        let And = this.CheckNext(Stack, "Conditional", "TK_AND") || this.IsPreciseToken(Stack.Token, "Conditional", "TK_AND");
        let Or = this.CheckNext(Stack, "Conditional", "TK_OR") || this.IsPreciseToken(Stack.Token, "Conditional", "TK_OR");

        let IsA = this.CheckNext(Stack, "Keyword", "TK_ISA") || this.IsPreciseToken(Stack.Token, "Keyword", "TK_ISA");

        let Eq = this.CheckNext(Stack, "Compare", "TK_EQS") || this.IsPreciseToken(Stack.Token, "Compare", "TK_EQS");
        let GEq = this.CheckNext(Stack, "Compare", "TK_GEQ") || this.IsPreciseToken(Stack.Token, "Compare", "TK_GEQ");
        let LEq = this.CheckNext(Stack, "Compare", "TK_LEQ") || this.IsPreciseToken(Stack.Token, "Compare", "TK_LEQ");
        let NEq = this.CheckNext(Stack, "Compare", "TK_NEQ") || this.IsPreciseToken(Stack.Token, "Compare", "TK_NEQ");
        let Gt = this.CheckNext(Stack, "Compare", "TK_GT") || this.IsPreciseToken(Stack.Token, "Compare", "TK_GT");
        let Lt = this.CheckNext(Stack, "Compare", "TK_LT") || this.IsPreciseToken(Stack.Token, "Compare", "TK_LT");

        //Bitwise
        let BitAnd = this.CheckNext(Stack, "Bitwise", "TK_BITAND") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITAND");
        let BitOr = this.CheckNext(Stack, "Bitwise", "TK_BITOR") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITOR");
        let BitXor = this.CheckNext(Stack, "Bitwise", "TK_BITXOR") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITXOR");

        let BitZLShift = this.CheckNext(Stack, "Bitwise", "TK_BITZLSHIFT") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITZLSHIFT");
        let BitZRShift = this.CheckNext(Stack, "Bitwise", "TK_BITZRSHIFT") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITZRSHIFT");
        let BitRShift = this.CheckNext(Stack, "Bitwise", "TK_BITRSHIFT") || this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITRSHIFT");

        let Ques = this.CheckNext(Stack, "None", "TK_LEN");
        if (And) {
            let Chunk = this.NewChunk("IN_AND");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Conditional", "TK_AND")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (Or) {
            let Chunk = this.NewChunk("IN_OR");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Conditional", "TK_OR")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (IsA) {
            let Chunk = this.NewChunk("IN_ISA");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Conditional", "TK_ISA")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (Eq) {
            let Chunk = this.NewChunk("IN_EQ");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_EQS")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (GEq) {
            let Chunk = this.NewChunk("IN_GEQ");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_GEQ")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (LEq) {
            let Chunk = this.NewChunk("IN_LEQ");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_LEQ")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (NEq) {
            let Chunk = this.NewChunk("IN_NEQ");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_NEQ")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (Gt) {
            let Chunk = this.NewChunk("IN_GT");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_GT")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (Lt) {
            let Chunk = this.NewChunk("IN_LT");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Compare", "TK_LT")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitAnd) {
            let Chunk = this.NewChunk("IN_BITAND");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITAND")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitOr) {
            let Chunk = this.NewChunk("IN_BITOR");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITOR")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitXor) {
            let Chunk = this.NewChunk("IN_BITXOR");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITXOR")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitZLShift) {
            let Chunk = this.NewChunk("IN_BITZLSHIFT");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITZLSHIFT")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitZRShift) {
            let Chunk = this.NewChunk("IN_BITZRSHIFT");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITZRSHIFT")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (BitRShift) {
            let Chunk = this.NewChunk("IN_BITRSHIFT");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Bitwise", "TK_BITRSHIFT")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
        } else if (Ques) {
            let Chunk = this.NewChunk("IN_CHECK");
            this.ChunkAdd(Chunk, Value);
            this.Move(Stack, 2);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            this.Next(Stack);
            this.SkipEndings(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        }
        return Value;
    },
    //{{ ParseExpression }}\\
    FinishExpression: function (Stack, Value, NoMath, NoCond) {
        if (this.CheckNext(Stack, "None", "TK_LINEEND") || this.CheckNext(Stack, "None", "TK_COMMA")) {
            this.Next(Stack);
            return Value;
        }
        if (this.IsPreciseToken(Stack.Token, "None", "TK_LINEEND") || this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
            return Value;
        }
        let Indexing = this.CheckNext(Stack, "Brace", "TK_IOPEN");
        let AddInc = this.CheckNext(Stack, "Incremental", "TK_INC");
        let SubInc = this.CheckNext(Stack, "Incremental", "TK_DEINC");
        let DotIndexing = this.CheckNext(Stack, "None", "TK_DOT");
        let Calling = this.CheckNext(Stack, "Paren", "TK_POPEN");
        let SelfCalling = this.CheckNext(Stack, "None", "TK_SELFCALL");
        let PropCalling = this.CheckNext(Stack, "None", "TK_PROPCALL");
        let SetIndex = this.CheckNext(Stack, "None", "TK_COLON");
        let NumRange = this.CheckNext(Stack, "None", "TK_NUMRANGE");
        let Add = this.CheckNext(Stack, "Operator", "TK_ADD") || this.IsPreciseToken(Stack.Token, "Operator", "TK_ADD");
        let Sub = this.CheckNext(Stack, "Operator", "TK_SUB") || this.IsPreciseToken(Stack.Token, "Operator", "TK_SUB");
        let Mul = this.CheckNext(Stack, "Operator", "TK_MUL") || this.IsPreciseToken(Stack.Token, "Operator", "TK_MUL");
        let Div = this.CheckNext(Stack, "Operator", "TK_DIV") || this.IsPreciseToken(Stack.Token, "Operator", "TK_DIV");
        let Pow = this.CheckNext(Stack, "Operator", "TK_POW") || this.IsPreciseToken(Stack.Token, "Operator", "TK_POW");
        let Mod = this.CheckNext(Stack, "Operator", "TK_MOD") || this.IsPreciseToken(Stack.Token, "Operator", "TK_MOD");
        let POf = this.CheckNext(Stack, "Operator", "TK_POF") || this.IsPreciseToken(Stack.Token, "Operator", "TK_POF");

        let In = this.CheckNext(Stack, "Keyword", "TK_IN") || this.IsPreciseToken(Stack.Token, "Keyword", "TK_IN");
        if (Indexing) {
            let Chunk = this.NewChunk("IN_INDEX");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, NoMath, NoCond));
            this.Next(Stack);
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else if (SetIndex) {
            let Chunk = this.NewChunk("IN_SETINDEX");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            this.Next(Stack);
            let Token = Stack.Token;
            if (this.IsPreciseToken(Token, "Brace", "TK_IOPEN")) {
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
                this.TestNext(Stack, "Brace", "TK_ICLOSE");
                this.Next(Stack);
                this.AssignmentGet(Stack, Chunk);
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            } else if (Token.Type == "Constant" || Token.Type == "Identifier" || Token.Type == "Keyword") {
                let Var = Token.Value;
                if (Token.Type == "Keyword") {
                    Var = FromToken(Var);
                }
                this.ChunkAdd(Chunk, Var);
                this.AssignmentGet(Stack, Chunk);
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            } else {
                Lex.ThrowError(CodeError, `"${FromToken(Token.Value)}" is not a valid index name`, Stack);
            }
            Value = Chunk
            return Value;
        } else if (AddInc) {
            let Chunk = this.NewChunk("IN_INC");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else if (SubInc) {
            let Chunk = this.NewChunk("IN_DEINC");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else if (DotIndexing) {
            let Chunk = this.NewChunk("IN_INDEX");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            this.Next(Stack);
            let Var = Stack.Token.Value;
            if (Stack.Token.Type == "Keyword") {
                Var = FromToken(Var);
            }
            this.ChunkAdd(Chunk, Var);
            Value = this.FinishExpression(Stack, Chunk, NoMath, NoCond);
            Value = this.FinishComplexExpression(Stack, Value, NoMath, NoCond);
            return Value;
        } else if (SelfCalling) {
            let Chunk = this.NewChunk("IN_SELFCALL");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            this.Next(Stack);
            if (this.IsPreciseToken(Stack.Token, "Brace", "TK_IOPEN")) {
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
                this.TestNext(Stack, "Brace", "TK_ICLOSE");
                this.Next(Stack);
            } else if (Stack.Token.Type == "Constant" || Stack.Token.Type == "Identifier" || Stack.Token.Type == "Keyword") {
                if (Stack.Token.Type == "Keyword") {
                    this.ChunkAdd(Chunk, FromToken(Stack.Token.Value));
                } else {
                    this.ChunkAdd(Chunk, Stack.Token.Value);
                }
            } else {
                Lex.ThrowError(CodeError, `"${FromToken(Stack.Token.Value)}" is not a valid index name`, Stack);
            }
            this.TestNext(Stack, "Paren", "TK_POPEN");
            this.Next(Stack);
            this.Next(Stack);
            let Params = [];
            let i = 0;
            if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                while (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                    i++;
                    if (i > 100) { break }
                    Params.push(this.ParseExpression(Stack));
                    this.Next(Stack);
                };
            }
            this.ChunkAdd(Chunk, Params);
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else if (PropCalling) {
            let Chunk = this.NewChunk("IN_PROPCALL");
            this.ChunkAdd(Chunk, Value);
            this.Next(Stack);
            this.Next(Stack);
            if (this.IsPreciseToken(Stack.Token, "Brace", "TK_IOPEN")) {
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
                this.TestNext(Stack, "Brace", "TK_ICLOSE");
                this.Next(Stack);
            } else if (Stack.Token.Type == "Constant" || Stack.Token.Type == "Identifier" || Stack.Token.Type == "Keyword") {
                if (Stack.Token.Type == "Keyword") {
                    this.ChunkAdd(Chunk, FromToken(Stack.Token.Value));
                } else {
                    this.ChunkAdd(Chunk, Stack.Token.Value);
                }
            } else {
                Lex.ThrowError(CodeError, `"${FromToken(Stack.Token.Value)}" is not a valid index name`, Stack);
            }
            this.TestNext(Stack, "Paren", "TK_POPEN");
            this.Next(Stack);
            this.Next(Stack);
            let Params = [];
            let i = 0;
            if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                while (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                    i++;
                    if (i > 100) { break }
                    Params.push(this.ParseExpression(Stack));
                    this.Next(Stack);
                };
            }
            this.ChunkAdd(Chunk, Params);
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else if (Calling) {
            if (!this.IsPreciseToken(Stack.Token, "None", "TK_COMMA") && !this.IsPreciseToken(Stack.Token, "None", "TK_LINEEND")) {
                let Chunk = this.NewChunk("IN_CALL");
                this.ChunkAdd(Chunk, Value);
                this.Next(Stack);
                this.Next(Stack);
                let Params = [];
                let i = 0;
                if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                    while (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                        i++;
                        if (i > 100) { break }
                        Params.push(this.ParseExpression(Stack));
                        this.Next(Stack);
                    };
                }
                this.ChunkAdd(Chunk, Params);
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            }
        } else if (In) {
            let Chunk = this.NewChunk("IN_IN");
            this.ChunkAdd(Chunk, Value);
            if (!this.IsPreciseToken(Stack.Token, "Keyword", "TK_IN")) {
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        }else if(NumRange){
            let Chunk = this.NewChunk("IN_NUMRANGE");
            this.ChunkAdd(Chunk,Value);
            this.Move(Stack,2);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack,false,true));
            Value = this.FinishExpression(Stack, Chunk);
            Value = this.FinishComplexExpression(Stack, Value);
            return Value;
        } else {
            if (NoMath == true) { return Value }
            if (Add) {
                let Chunk = this.NewChunk("IN_ADD");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_ADD")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (Sub) {
                let Chunk = this.NewChunk("IN_SUB");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_SUB")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (Mul) {
                let Chunk = this.NewChunk("IN_MUL");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_MUL")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (Div) {
                let Chunk = this.NewChunk("IN_DIV");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_DIV")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (Pow) {
                let Chunk = this.NewChunk("IN_POW");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_POW")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (Mod) {
                let Chunk = this.NewChunk("IN_MOD");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_MOD")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            } else if (POf) {
                let Chunk = this.NewChunk("IN_POF");
                this.ChunkAdd(Chunk, Value);
                if (!this.IsPreciseToken(Stack.Token, "Operator", "TK_POF")) {
                    this.Next(Stack);
                }
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack, undefined, true));
                Value = this.FinishExpression(Stack, Chunk);
                Value = this.FinishComplexExpression(Stack, Value);
                return Value;
            }
        }
        if (this.TypeCheckNext(Stack, "Identifier") && Stack.Token.Type == "Identifier") {
            Lex.ThrowError(CodeError, `Unexpected Identifier "${Stack.Token.Value}"`, Stack);
        }
        Value = this.FinishComplexExpression(Stack, Value, NoCond);
        return Value;
    },
    ParseExpression: function (Stack, NoMath, NoCond) {
        let Token = Stack.Token;
        let Result = null;
        if (!Token) {
            return Result;
        }
        let Res = this.IsCustomSyntax(Stack, "PE", Token);
        if (Res[0]) {
            let Chunk = this.NewChunk("IN_CUSTOMSYNTAX");
            this.ChunkAdd(Chunk, Token.Value);
            this.ChunkAdd(Chunk, eval(Res[2]).bind(Interpreter));
            this.ChunkAdd(Chunk, eval(Res[1]).bind(this)(Stack, Res[3], Res[4]));
            Result = Chunk;
            NoMath = Res[3];
            NoCond = Res[4];
            Result = this.FinishExpression(Stack, Result, NoMath, NoCond);
            return Result;
        }
        if (Token.Type == "Constant") {
            Result = Token.Value;
        } else if (Token.Type == "Identifier") {
            Result = ["IN_GET", Token.Value];
        } else if (this.IsPreciseToken(Token, "Conditional", "TK_NOT")) {
            this.Next(Stack);
            Result = ["IN_NOT", this.ParseExpression(Stack, NoMath, NoCond)]
        } else if (this.IsPreciseToken(Token, "Paren", "TK_POPEN")) {
            this.Next(Stack);
            Result = this.ParseExpression(Stack, NoMath, NoCond);
            this.TestNext(Stack, "Paren", "TK_PCLOSE");
            this.Next(Stack);
            if (!this.CheckNext(Stack, "None", "TK_COMMA")) {
                return this.FinishExpression(Stack, Result);
            }
            return Result;
        } else if (this.IsPreciseToken(Token, "Bracket", "TK_BOPEN")) {
            let Arr = {};
            let ArrTypes = {};
            this.Next(Stack);
            while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                let Var = Stack.Token;
                let Inner = null;
                if (this.IsPreciseToken(Var, "Brace", "TK_IOPEN")) {
                    this.Next(Stack);
                    Inner = this.ParseExpression(Stack);
                    this.TestNext(Stack, "Brace", "TK_ICLOSE");
                    this.Next(Stack);
                } else if (Var.Type == "Constant" || Var.Type == "Identifier") {
                    Inner = Var.Value
                } else if (Var.Type == "Keyword") {
                    Inner = FromToken(Var.Value);
                }
                if (this.CheckNext(Stack, "None", "TK_COLON")) {
                    this.Move(Stack, 2);
                    ArrTypes[Inner] = this.TypeExpression(Stack);
                }
                this.TestNext(Stack, "Assignment", "TK_EQ");
                this.Next(Stack);
                this.Next(Stack);
                let Value = this.ParseExpression(Stack);
                Arr[Inner] = Value;
                this.Next(Stack);
            }
            Result = ["IN_ARRAY", Arr, ArrTypes];
        } else if (this.IsPreciseToken(Token, "Brace", "TK_IOPEN")) {
            let Arr = [];
            this.Next(Stack);
            while (!this.IsPreciseToken(Stack.Token, "Brace", "TK_ICLOSE")) {
                let Value = this.ParseExpression(Stack, NoMath, NoCond);
                Arr.push(Value);
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                    this.Next(Stack);
                }
            }
            Result = ["IN_ARRAY", Arr];
        } else if (this.IsPreciseToken(Token, "Keyword", "TK_FUNC")) {
            let Chunk = this.NewChunk("IN_FASTFUNC");
            this.TestNext(Stack, "Paren", "TK_POPEN");
            this.Next(Stack);
            this.Next(Stack);
            let Params = [];
            let ParamTypes = {};
            let Defaults = {};
            let VArgs = [];
            let i = 0;
            if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                while (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                    i++;
                    if (i > 100) { break }
                    let VArg = false;
                    if (this.IsPreciseToken(Stack.Token, "Operator", "TK_MUL")) {
                        VArg = true;
                        this.Next(Stack);
                    }
                    this.ErrorIfTokenNotType(Stack, "Identifier");
                    Params.push(Stack.Token.Value);
                    let Name = Stack.Token.Value;
                    if (VArg == true) {
                        VArgs.push(Name);
                    }
                    this.Next(Stack);
                    if (this.IsPreciseToken(Stack.Token, "None", "TK_COLON")) {
                        this.Next(Stack);
                        ParamTypes[Name] = this.TypeExpression(Stack);
                        this.Next(Stack);
                    }
                    if (this.IsPreciseToken(Stack.Token, "Assignment", "TK_EQ")) {
                        this.Next(Stack);
                        Defaults[Name] = this.ParseExpression(Stack);
                        this.Next(Stack);
                    }
                    if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                        this.Next(Stack);
                    }
                }
            }
            this.ChunkAdd(Chunk, Params);
            this.Next(Stack);
            let ReturnType = null;
            if (this.IsPreciseToken(Stack.Token, "None", "TK_COLON")) {
                this.Next(Stack);
                ReturnType = this.TypeExpression(Stack);
                this.TestNext(Stack, "Bracket", "TK_BOPEN");
            }
            this.Next(Stack);
            let CodeBlock = [];
            this.OpenChunk(Stack);
            while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                this.ParseChunk(Stack);
                this.Next(Stack);
            }
            if (this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                this.Next(Stack);
            }
            CodeBlock = Stack.Chunk;
            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length - 1];
            Stack.OpenChunks.pop();
            this.ChunkAdd(Chunk, CodeBlock);
            Result = Chunk;
            this.JumpBack(Stack);
            if (Object.getOwnPropertyNames(Defaults).length > 0) { //Default parameters
                this.ChunkAdd(Chunk, Defaults);
            }
            Chunk[10] = ParamTypes;
            Chunk[11] = ReturnType;
            Chunk[12] = VArgs;
        } else if (this.IsPreciseToken(Token, "None", "TK_LEN")) {
            let Chunk = this.NewChunk("IN_LEN");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token, "Operator", "TK_MUL")) {
            let Chunk = this.NewChunk("IN_UNPACK");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token, "Bitwise", "TK_BITNOT")) {
            let Chunk = this.NewChunk("IN_BITNOT");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token, "Operator", "TK_ROUND")) {
            let Chunk = this.NewChunk("IN_ROUND");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token, "Bitwise", "TK_BITZLSHIFT")) { //Placement Operator
            let Chunk = this.NewChunk("IN_PLACEMENT");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
            return this.FinishExpression(Stack, Result, true, true);
        } else if (this.IsPreciseToken(Token, "Operator", "TK_SUB")) {
            let Chunk = this.NewChunk("IN_UNM");
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, NoCond));
            Result = Chunk;
            if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                return Result;
            }
        } else if (this.IsPreciseToken(Token, "Keyword", "TK_NEW")) {
            let Chunk = this.NewChunk("IN_MAKENEW");
            this.Next(Stack);
            let Expression = this.ParseExpression(Stack);
            this.ChunkAdd(Chunk, Expression);
            if (this.CheckNext(Stack, "Keyword", "TK_WITH")) {
                this.Next(Stack);
                this.Next(Stack);
                this.ChunkAdd(Chunk, this.ParseExpression(Stack));
            } else {
                if (Expression[0] == "IN_CALL") {
                    Chunk[1] = Expression[1];
                    this.ChunkAdd(Chunk, Expression[2]);
                }
            }
            Result = Chunk;
        } else if (this.IsPreciseToken(Token, "None", "TK_FORCEPARSE")) {
            let CLast = Stack.Chunk[Stack.Chunk.length - 1];
            let PChunk = Stack.Chunk;
            this.Next(Stack);
            this.ParseChunk(Stack, true, true);
            let NLast = Stack.Chunk[Stack.Chunk.length - 1];
            let CChunk = Stack.Chunk;
            if (NLast != CLast && PChunk == CChunk) {
                Result = NLast;
                PChunk.pop();
            }
            return Result;
        } else if (this.IsPreciseToken(Token, "None", "TK_SELFCALL")) {
            let Chunk = this.NewChunk("IN_INTERNAL");
            this.TypeTestNext(Stack, "Identifier");
            this.Next(Stack);
            this.ChunkAdd(Chunk, Stack.Token.Value);
            this.Next(Stack);
            this.ChunkAdd(Chunk, this.ParseExpression(Stack, true, true));
            Result = Chunk;
            return Result;
        } else if (this.IsPreciseToken(Token, "Keyword", "TK_DEFINE")) {
            let Chunk = this.NewChunk("IN_FASTDEFINE");
            this.OpenChunk(Stack);
            this.TestNext(Stack, "Bracket", "TK_BOPEN");
            this.Move(Stack, 2);
            this.CodeBlock(Stack);
            this.JumpBack(Stack);
            this.ChunkAdd(Chunk, Stack.Chunk[0])
            Stack.Chunk = Stack.OpenChunks.pop();
            return Chunk;
        } else if (this.IsPreciseToken(Token, "ExpressionString", "TK_ESTRING")) {
            let Chunk = ["IN_ESTRING"];
            let Res = [];
            this.Next(Stack);
            Stack.InString = true;
            while (!this.IsPreciseToken(Stack.Token, "ExpressionString", "TK_ESTRING")) {
                if (this.IsPreciseToken(Stack.Token, "Bracket", "TK_BOPEN")) {
                    this.Next(Stack);
                    Stack.InString = false;
                    Res.push(this.ParseExpression(Stack));
                    this.TestNext(Stack, "Bracket", "TK_BCLOSE");
                    Stack.InString = true;
                    this.Move(Stack, 2);
                    continue;
                }
                if (this.IsPreciseToken(Stack.Token, "ExpressionString", "TK_ESTRING")) {
                    break;
                }
                if (this.IsPreciseToken(Stack.Token, "None", "TK_BACKSLASH")) {
                    this.Next(Stack);
                }
                Res.push(SmartFromToken(Stack.Token));
                this.Next(Stack);
            }
            Chunk.push(Res);
            Stack.InString = false;
            Result = Chunk;
        }
        Result = this.FinishExpression(Stack, Result, NoMath, NoCond);
        return Result;
    },
    //{{ SetState }}\\
    SetState: function (Stack) {
        let Name = this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Name.Value);
        this.AssignmentGet(Stack, Stack.Chunk);
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.CloseChunk(Stack);
    },
    //{{ NewState }}\\
    NewState: function (Stack) {
        let Name = this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Name.Value);
        let Type = null;
        if (this.CheckNext(Stack, "None", "TK_COLON")) {
            this.Next(Stack);
            this.Next(Stack);
            Type = this.TypeExpression(Stack);

        }
        let Result = this.CheckNext(Stack, "Assignment", "TK_EQ");
        if (Result) {
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkWrite(Stack, this.ParseExpression(Stack));
        } else {
            this.ChunkWrite(Stack, null);
        }
        if (Type) {
            this.ChunkWrite(Stack, Type)
        }
        this.CloseChunk(Stack);
    },
    //{{ UpVarState }}\\
    UpVarState: function (Stack) {
        let Name = this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Name.Value);
        let Type = null;
        if (this.CheckNext(Stack, "None", "TK_COLON")) {
            this.Next(Stack);
            this.Next(Stack);
            Type = this.TypeExpression(Stack);

        }
        let Result = this.CheckNext(Stack, "Assignment", "TK_EQ");
        if (Result) {
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkWrite(Stack, this.ParseExpression(Stack));
        } else {
            this.ChunkWrite(Stack, null);
        }
        if (Type) {
            this.ChunkWrite(Stack, Type)
        }
        this.CloseChunk(Stack);
    },
    //{{ CodeBlock }}\\
    CodeBlock: function (Stack) {
        this.OpenChunk(Stack);
        while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
            this.ParseChunk(Stack);
            this.Next(Stack);
        }
        if (this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
            this.Next(Stack);
        }
        this.CloseChunk(Stack);
    },
    //{{ IfState }}\\
    IfState: function (Stack) {
        this.TestNext(Stack, "Paren", "TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.TestNext(Stack, "Paren", "TK_PCLOSE");
        this.Next(Stack);
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ElseState }}\\
    ElseState: function (Stack) {
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    EachState:function(Stack){
        this.Next(Stack);
        let Arr = this.ParseExpression(Stack);
        this.TestNext(Stack,"Keyword","TK_AS");
        this.Move(Stack,2);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.TestNext(Stack,"None","TK_COMMA");
        this.Move(Stack,2);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.ChunkWrite(Stack,Arr);
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Move(Stack, 2);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ForEachState }}\\
    ForEachState: function (Stack) {
        this.TestNext(Stack, "Paren", "TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.Next(Stack);
        if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
            this.Next(Stack);
            this.ErrorIfTokenNotType(Stack, "Identifier");
            this.ChunkWrite(Stack, Stack.Token.Value);
            this.TestNext(Stack, "Keyword", "TK_AS");
            this.Next(Stack);
            Stack.Chunk[0] = "IN_FORALL";
        } else {
            this.ErrorIfTokenNotType(Stack, "Keyword");
            let Token = Stack.Token;
            if (Token.Value == "TK_OF" || Token.Value == "TK_IN") {
                this.ChunkWrite(Stack, FromToken(Token.Value));
            } else {
                Lex.ThrowError(CodeError, `Unexpected keyword ${FromToken(Token.Value)}`, Stack);
            }
        }
        this.Next(Stack);
        let Arr = this.ParseExpression(Stack);
        this.ChunkWrite(Stack, Arr);
        this.TestNext(Stack, "Paren", "TK_PCLOSE");
        this.Next(Stack);
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ForState }}\\
    ForState: function (Stack) {
        this.TestNext(Stack, "Paren", "TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.TestNext(Stack, "Assignment", "TK_EQ");
        this.Next(Stack);
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.TestNext(Stack, "Paren", "TK_PCLOSE");
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    // {{ FuncState }}\\
    FuncState: function (Stack) {
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.TestNext(Stack, "Paren", "TK_POPEN");
        this.Next(Stack);
        this.Next(Stack);
        let Params = [];
        let ParamTypes = {};
        let Defaults = {};
        let VArgs = [];
        let i = 0;
        if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
            while (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                i++;
                if (i > 100) { break }
                let VArg = false;
                if (this.IsPreciseToken(Stack.Token, "Operator", "TK_MUL")) {
                    VArg = true;
                    this.Next(Stack);
                }
                this.ErrorIfTokenNotType(Stack, "Identifier");
                let Name = Stack.Token.Value;
                Params.push(Stack.Token.Value);
                if (VArg == true) {
                    VArgs.push(Name);
                }
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token, "None", "TK_COLON")) {
                    this.Next(Stack);
                    ParamTypes[Name] = this.TypeExpression(Stack);
                    this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token, "Assignment", "TK_EQ")) {
                    this.Next(Stack);
                    Defaults[Name] = this.ParseExpression(Stack);
                    this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                    this.Next(Stack);
                }
            }
        }
        this.ChunkWrite(Stack, Params);
        this.Next(Stack);
        let ReturnType = null;
        if (this.IsPreciseToken(Stack.Token, "None", "TK_COLON")) {
            this.Next(Stack);
            ReturnType = this.TypeExpression(Stack);
            this.TestNext(Stack, "Bracket", "TK_BOPEN");
        }
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.JumpBack(Stack);
        if (Object.getOwnPropertyNames(Defaults).length > 0) { //Default parameters
            this.ChunkWrite(Stack, Defaults)
        }
        Stack.Chunk[10] = ParamTypes;
        Stack.Chunk[12] = VArgs;
        if (ReturnType) {
            Stack.Chunk[11] = ReturnType;
        }
        this.CloseChunk(Stack);
    },
    //{{ DelState }}\\
    DelState: function (Stack) {
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack, "Identifier");
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.CloseChunk(Stack)
    },
    //{{ RetState }}\\
    RetState: function (Stack) {
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ClassState }}\\
    ClassState: function (Stack) {
        this.TypeTestNext(Stack, "Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack, Stack.Token.Value);
        if (this.CheckNext(Stack, "Keyword", "TK_EXTENDS")) {
            this.Next(Stack);
            this.Next(Stack);
            let Value = this.ParseExpression(Stack);
            let HasSuper = false;
            if (this.CheckNext(Stack, "Keyword", "TK_WITH")) {
                this.Next(Stack);
                this.TestNext(Stack, "Identifier", "super");
                HasSuper = true;
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkWrite(Stack, this.ParseExpression(Stack));
            this.ChunkWrite(Stack, Value);
            this.ChunkWrite(Stack, HasSuper);
        } else {
            this.Next(Stack);
            this.ChunkWrite(Stack, this.ParseExpression(Stack));
        }
        this.CloseChunk(Stack);
    },
    //{{ DestructState }}\\
    DestructState: function (Stack) {
        this.TestNext(Stack, "Brace", "TK_IOPEN");
        this.Next(Stack);
        this.Next(Stack);
        let Args = [];
        if (!this.IsPreciseToken(Stack.Token, "Brace", "TK_ICLOSE")) {
            while (!this.IsPreciseToken(Stack.Token, "Brace", "TK_ICLOSE")) {
                this.ErrorIfTokenNotType(Stack, "Identifier");
                Args.push(Stack.Token.Value);
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                    this.Next(Stack);
                }
            }
        }
        this.ChunkWrite(Stack, ["IN_ARRAY", Args]);
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.CloseChunk(Stack);
    },
    //{{ UnsetState }}\\
    UnsetState: function (Stack) {
        this.Next(Stack);
        let Value = this.ParseExpression(Stack);
        Value[0] = "IN_UNSET";
        Stack.Chunk = Value;
        this.CloseChunk(Stack);
    },
    //{{ UsingState }}\\
    UsingState: function (Stack) {
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        let Excludes = [];
        if (this.CheckNext(Stack, "Keyword", "TK_EXCLUDE")) {
            this.Next(Stack);
            this.TestNext(Stack, "Brace", "TK_IOPEN");
            this.Move(Stack, 2);
            let Args = [];
            if (!this.IsPreciseToken(Stack.Token, "Brace", "TK_ICLOSE")) {
                while (!this.IsPreciseToken(Stack.Token, "Brace", "TK_ICLOSE")) {
                    this.ErrorIfTokenNotType(Stack, "Identifier");
                    Args.push(Stack.Token.Value);
                    this.Next(Stack);
                    if (this.IsPreciseToken(Stack.Token, "None", "TK_COMMA")) {
                        this.Next(Stack);
                    }
                }
            }
            Excludes = Args;
        }
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        Stack.Chunk[10] = Excludes;
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ SwapState }}\\
    SwapState: function (Stack) {
        this.TypeTestNext(Stack, "Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.TypeTestNext(Stack, "Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.CloseChunk(Stack);
    },
    //{{ SwitchState }}\\
    SwitchState: function (Stack) {
        this.TestNext(Stack, "Paren", "TK_POPEN");
        this.Next(Stack);
        this.Next(Stack);
        let Expression = this.ParseExpression(Stack);
        if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
            this.TestNext(Stack, "Paren", "TK_PCLOSE");
            this.Next(Stack);
        }
        let Cases = [];
        let Default = null;
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
            if (this.IsPreciseToken(Stack.Token, "Keyword", "TK_CASE")) {
                this.TestNext(Stack, "Paren", "TK_POPEN");
                this.Next(Stack);
                this.Next(Stack);
                let CaseExp = this.ParseExpression(Stack);
                if (!this.IsPreciseToken(Stack.Token, "Paren", "TK_PCLOSE")) {
                    this.TestNext(Stack, "Paren", "TK_PCLOSE");
                    this.Next(Stack);
                }
                this.TestNext(Stack, "Bracket", "TK_BOPEN");
                this.Next(Stack);
                this.Next(Stack);
                this.OpenChunk(Stack);
                let CodeBlock = [];
                while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                    this.ParseChunk(Stack);
                    this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                    this.Next(Stack);
                }
                CodeBlock = Stack.Chunk;
                Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length - 1];
                Stack.OpenChunks.pop();
                Cases.push({
                    Expression: CaseExp,
                    Block: CodeBlock,
                });
            } else if (this.IsPreciseToken(Stack.Token, "Keyword", "TK_DEFAULT")) {
                this.TestNext(Stack, "Bracket", "TK_BOPEN");
                this.Next(Stack);
                this.Next(Stack);
                this.OpenChunk(Stack);
                let CodeBlock = [];
                while (!this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                    this.ParseChunk(Stack);
                    this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token, "Bracket", "TK_BCLOSE")) {
                    this.Next(Stack);
                }
                CodeBlock = Stack.Chunk;
                Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length - 1];
                Stack.OpenChunks.pop();
                Default = CodeBlock;
            } else {
                throw new CodeError(`Unexpected token "${FromToken(Stack.Token.Value)}" of type "${Stack.Token.Type.toLowerCase()}"`)
            }
        }
        this.ChunkWrite(Stack, Expression);
        this.ChunkWrite(Stack, Cases);
        this.ChunkWrite(Stack, Default);
        this.CloseChunk(Stack);
    },
    //{{ RepeatState }}\\
    RepeatState: function (Stack) {
        this.Next(Stack);
        let VarName = undefined;
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        if (this.CheckNext(Stack, "Keyword", "TK_AS")) {
            this.Next(Stack);
            this.TypeTestNext(Stack, "Identifier");
            VarName = this.Next(Stack).Value;
        }
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        if (VarName) {
            this.ChunkWrite(Stack, VarName);
        }
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ SetTypeState }}\\
    SetTypeState: function (Stack) {
        this.TypeTestNext(Stack, "Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack, Stack.Token.Value);
        this.TestNext(Stack, "Assignment", "TK_EQ");
        this.Move(Stack, 2);
        this.ChunkWrite(Stack, this.TypeExpression(Stack));
        this.CloseChunk(Stack);
    },
    //{{ ChunkState }}\\
    ChunkState: function (Stack) {
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ TryState }}\\
    TryState: function (Stack) {
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Move(Stack, 2);
        this.CodeBlock(Stack);
        this.JumpBack(Stack);
        this.TestNext(Stack, "Keyword", "TK_CATCH");
        this.Next(Stack);
        this.TestNext(Stack, "Paren", "TK_POPEN");
        this.Next(Stack);
        this.TypeTestNext(Stack, "Identifier");
        this.ChunkWrite(Stack, this.Next(Stack).Value);
        this.TestNext(Stack, "Paren", "TK_PCLOSE");
        this.Next(Stack);
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Move(Stack, 2);
        this.CodeBlock(Stack);
        if (this.IsPreciseToken(Stack.Token, "Keyword", "TK_FINALLY")) {
            this.TestNext(Stack, "Bracket", "TK_BOPEN");
            this.Move(Stack, 2);
            this.CodeBlock(Stack);
        }
        this.JumpBack(Stack);
        this.CloseChunk(Stack);
    },
    //{{ DefineState }}\\
    DefineState: function (Stack) {
        this.TypeTestNext(Stack, "Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack, Stack.Token.Value);
        if (this.CheckNext(Stack,"Keyword","TK_AS")){
            this.Next(Stack);
        }
        this.TestNext(Stack, "Bracket", "TK_BOPEN");
        this.Move(Stack, 2);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ IsTypeState }}\\
    IsTypeState: function (Stack) {
        this.Next(Stack);
        this.ChunkWrite(Stack, this.ParseExpression(Stack));
        this.TestNext(Stack, "Keyword", "TK_AS");
        this.Move(Stack, 2);
        this.ChunkWrite(Stack, this.TypeExpression(Stack));
        let Res = false;
        if (this.CheckNext(Stack, "Keyword", "TK_DOERROR")) {
            Res = true
            this.Next(Stack);
        }
        if (this.CheckNext(Stack, "Bracket", "TK_BOPEN")) {
            this.Move(Stack, 2);
            this.CodeBlock(Stack);
            this.JumpBack(Stack);
        }
        Stack.Chunk[10] = Res;
        this.CloseChunk(Stack);
    },
    //{{ LockVarState }}\\
    LockVarState:function(Stack){
        this.TypeTestNext(Stack,"Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.CloseChunk(Stack);
    },
    //{{ AsState }}\\
    AsState:function(Stack){
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Move(Stack,2);
        this.CodeBlock(Stack);
        this.JumpBack(Stack);
        this.CloseChunk(Stack);
    },
    //{{ ParseChunk }}\\
    ParseChunk: function (Stack, NoMath, NoCond) {
        let Token = Stack.Token;
        if (Token.Type == "Keyword") {
            if (Token.Value == "TK_SET") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_NEW");
                this.NewState(Stack);
            } else if (Token.Value == "TK_CONST") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_CONST");
                this.NewState(Stack);
            } else if (Token.Value == "TK_IF") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_IF");
                this.IfState(Stack);
            } else if (Token.Value == "TK_ELIF") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_ELIF");
                this.IfState(Stack);
            } else if (Token.Value == "TK_ELSE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_ELSE");
                this.ElseState(Stack);
            } else if (Token.Value == "TK_WHILE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_WHILE");
                this.IfState(Stack);
            } else if (Token.Value == "TK_FOREACH") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_FOREACH");
                this.ForEachState(Stack);
            } else if (Token.Value == "TK_FOR") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_FOR");
                this.ForState(Stack);
            } else if (Token.Value == "TK_FUNC") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_FUNC");
                this.FuncState(Stack);
            } else if (Token.Value == "TK_SEND") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_RETURN");
                this.RetState(Stack);
            } else if (Token.Value == "TK_DEL") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_DEL");
                this.DelState(Stack);
            } else if (Token.Value == "TK_STOP") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_STOP");
                this.CloseChunk(Stack);
            } else if (Token.Value == "TK_CLASS") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_CLASS");
                this.ClassState(Stack);
            } else if (Token.Value == "TK_DESTRUCT") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_DESTRUCT");
                this.DestructState(Stack);
            } else if (Token.Value == "TK_UNSET") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_UNSET");
                this.UnsetState(Stack);
            } else if (Token.Value == "TK_USING") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_USING");
                this.UsingState(Stack);
            } else if (Token.Value == "TK_SWAP") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_SWAP");
                this.SwapState(Stack);
            } else if (Token.Value == "TK_SWITCH") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_SWITCH");
                this.SwitchState(Stack);
            } else if (Token.Value == "TK_REPEAT") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_REPEAT");
                this.RepeatState(Stack);
            } else if (Token.Value == "TK_SETTYPE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_SETTYPE");
                this.SetTypeState(Stack);
            } else if (Token.Value == "TK_CHUNK") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_CHUNK");
                this.ChunkState(Stack);
            } else if (Token.Value == "TK_TRY") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_TRY");
                this.TryState(Stack);
            } else if (Token.Value == "TK_DEFINE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_DEFINE");
                this.DefineState(Stack);
            } else if (Token.Value == "TK_ISTYPE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_ISTYPE");
                this.IsTypeState(Stack);
            } else if (Token.Value == "TK_CONTINUE") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_CONTINUE");
                this.CloseChunk(Stack);
            } else if (Token.Value == "TK_EXIT") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_EXIT");
                this.CloseChunk(Stack);
            } else if (Token.Value == "TK_EACH") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_FORALL");
                this.EachState(Stack);
            } else if (Token.Value == "TK_LOCKVAR") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_LOCKVAR");
                this.LockVarState(Stack);
            }else if(Token.Value=="TK_UPVAR"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_UPVAR");
                this.UpVarState(Stack);
            } else if (Token.Value == "TK_AS") {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_AS");
                this.AsState(Stack);
            } else {
                Lex.ThrowError(CodeError, `Unexpected ${String(Token.Type).toLowerCase()} "${Token.Value}"`, Stack);
            }
        } else if (Token.Type == "Identifier") {
            let Res = this.IsCustomSyntax(Stack, "PE", Token);
            if (Res[0]) {
                let Chunk = this.NewChunk("IN_CUSTOMSYNTAX");
                this.ChunkAdd(Chunk, Token.Value);
                this.ChunkAdd(Chunk, eval(Res[2]).bind(Interpreter));
                this.ChunkAdd(Chunk, eval(Res[1]).bind(this)(Stack, Res[3], Res[4]));
                Result = Chunk;
                NoMath = Res[3];
                NoCond = Res[4];
                Result = this.FinishExpression(Stack, Result, NoMath, NoCond);
                this.OpenChunk(Stack);
                Stack.Chunk = Chunk;
                this.CloseChunk(Stack);
            }
            Res = this.IsCustomSyntax(Stack, "CH", Token);
            if (Res[0]) {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_CUSTOMSYNTAX");
                this.ChunkWrite(Stack, Token.Value);
                this.ChunkWrite(Stack, eval(Res[2]).bind(Interpreter));
                this.ChunkWrite(Stack, eval(Res[1]).bind(this)(Stack));
                this.CloseChunk(Stack);
                return;
            }
            if (this.TypeCheckNext(Stack, "Assignment")) {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_SET");
                this.JumpBack(Stack);
                this.SetState(Stack);
            } else {
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack, "IN_GET");
                this.ChunkWrite(Stack, Token.Value);
                Stack.Chunk = this.FinishExpression(Stack, Stack.Chunk);
                this.CloseChunk(Stack);
            }
        } else if (this.IsPreciseToken(Token, "None", "TK_AT")) {
            this.OpenChunk(Stack);
            this.ChunkWrite(Stack, "IN_GLOBALASSIGN");
            this.Next(Stack);
            let Name = Stack.Token.Value;
            if (Stack.Token.Type == "Identifier" || Stack.Token.Type == "Keyword") {
                if (Stack.Token.Type == "Keyword") {
                    Name = FromToken(Name);
                }
            } else {
                this.JumpBack(Stack);
                this.TypeTestNext(Stack, "Identifier");

            }
            this.ChunkWrite(Stack, Stack.Token.Value);
            this.TestNext(Stack, "Assignment", "TK_EQ");
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkWrite(Stack, this.ParseExpression(Stack));
            this.CloseChunk(Stack);
        } else if (Token.Type == "CustomSyntax") {
            let Value = Token.Value;
            Stack.CustomSyntaxes[Value.in].push({
                Token: Value.token,
                Value: Value[Value.in],
                Interpret: Value.Interpret,
                NoMath: Value.NoMath || false,
                NoCond: Value.NoCond || false,
            });
        } else {
            let NoChecks = {
                "None": ["TK_LINEEND", "TK_COMMA"],
                "Bracket": ["TK_BOPEN", "TK_BCLOSE"],
                "Paren": ["TK_PCLOSE"],
            }
            let Pass = true;
            for (let k in NoChecks) {
                let v = NoChecks[k];
                for (let vv of v) {
                    if (this.IsPreciseToken(Token, k, vv)) {
                        Pass = false;
                        break;
                    }
                }
            }
            if (Pass) {
                this.OpenChunk(Stack);
                Stack.Chunk = this.ParseExpression(Stack, NoMath, NoCond);
                this.CloseChunk(Stack);
            }
        }
    },
    StartParser: function (Code) {
        let Stack = this.NewStack({
            Tokens: Lex.Tokenize(Code),
            Code: Code,
        });
        while (Stack.Current <= Stack.Tokens.length - 1 && !this.IsPreciseToken(Stack.Token, "End", "TK_EOS")) {
            this.Next(Stack);
            if (Stack.Current >= Stack.Tokens.length - 1 || this.IsPreciseToken(Stack.Token, "End", "TK_EOS")) { break }
            this.ParseChunk(Stack);
        }
        return Stack.Result;
    },
});

// {{-=~}} Interpreter {{~=-}} \\\

class DefineBlock {
    constructor(AST, Tokens) {
        if (!AST) {
            throw new CodeError(`An AST is required for a DefineBlock`);
        }
        if (!(Tokens instanceof Array)) {
            throw new CodeError(`Invalid DefineBlock Tokens`);
        }
        this.AST = AST;
        this.Tokens = Tokens;
    }
    RunCode() {
        Interpreter.CondState(this.AST, DeepCopy(this.Tokens));
    }
    toString() {
        return "[Chunk]";
    }
}


const DeepCopy = (inObject) => {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
        value = inObject[key]

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = DeepCopy(value)
    }

    return outObject
}

const Interpreter = Object.freeze({
    NewStack: function (AST, Tokens) {
        const NewStack = {
            Current: -1,
            PToken: "",
            Token: "",
            CloneTokens: DeepCopy(Tokens),
            Tokens: Tokens,
            Upper: this.GetStack(AST, AST.CStack),
            VariableReference: new Proxy({}, {
                get: function (self, Name) {
                    let Value = self[Name];
                    if (!Value) {
                        let Current = AST.Variables[Name];
                        if (Current) {
                            return Current.Value
                        } else {
                            if (NewStack.Upper) {
                                return NewStack.Upper.VariableReference[Name];
                            }
                        }
                    }
                    return Value;
                },
                set: function (self, Name, Value) {
                    self[Name] = Value;
                },
            }),
        };
        AST.Stacks.push({
            Tokens: Tokens,
            Stack: NewStack,
        });
        return NewStack;
    },
    GetStack: function (AST, Tokens) {
        for (let v of AST.Stacks) {
            if (v.Tokens == Tokens) {
                return v.Stack;
            }
        }
    },
    RemoveStack: function (AST, Tokens) {
        for (let k in AST.Stacks) {
            k = +k;
            let v = AST.Stacks[k];
            if (v.Tokens == Tokens) {
                AST.Stacks.splice(k, 1);
                return;
            }
        }
    },
    Next: function (AST, Stack, Amount = 1) {
        if (!this.GetStack(AST, Stack)) {
            this.NewStack(AST, Stack);
        }
        let ParseStack = this.GetStack(AST, Stack);
        ParseStack.Current += Amount;
        ParseStack.PToken = ParseStack.Token;
        ParseStack.Token = ParseStack.Tokens[ParseStack.Current];
        AST.CStack = Stack
        if (ParseStack) {
            AST.StackCurrent = ParseStack
        }
    },
    GetCurrentVariables: function (AST) {
        let Variables = [];
        for (let v of AST.Variables) {
            if (v.Block <= AST.Block) {
                Variables.push(v);
            }
        }
        return Variables;
    },
    GetHighestVariable: function (AST, Name) {
        let Variables = this.GetCurrentVariables(AST);
        let Variable = null;
        for (let v of Variables) {
            if (v.Name == Name && v.Block <= AST.Block) {
                if (!Variable) {
                    Variable = v
                } else if (v.Block > Variable.Block) {
                    Variable = v;
                }
            }
        }
        return Variable;
    },
    NewVariable: function (Name, Value, Block) {
        return {
            Name: Name,
            Value: Value,
            Block: Block,
        };
    },
    SetVariable: function (AST, Name, Value, Type) {
        let Variable = this.GetHighestVariable(AST, Name);
        let CStack = this.GetStack(AST, AST.CStack);
        let Set = false;
        if (!Variable && CStack) {
            let v = CStack.VariableReference[Name];
            if (v) {
                Variable = this.NewVariable(Name, v, AST.Block);
                Set = true;
            }
        }
        if (Variable && Variable.Const == true) {
            throw new CodeError(`Attempt to set the const variable "${Name}"`);
        }
        if (Variable) {
            if (!Type || Type == "eq") {
                Variable.Value = Value;
            } else if (Type == "addeq") {
                Variable.Value += Value;
            } else if (Type == "subeq") {
                Variable.Value -= Value;
            } else if (Type == "muleq") {
                Variable.Value *= Value;
            } else if (Type == "diveq") {
                Variable.Value /= Value;
            } else if (Type == "poweq") {
                Variable.Value **= Value;
            } else if (Type == "modeq") {
                Variable.Value %= Value;
            }
        } else {
            this.MakeVariable(AST, Name, Value);
        }
        if (Set) {
            CStack.VariableReference[Name] = Variable.Value;
            if (CStack.Upper) {
                CStack.Upper.VariableReference[Name] = Variable.Value;
            }
        }
    },
    GetType: function (x) {
        let ty = typeof x;
        if (ty == "object") {
            if (x === null || x === undefined) {
                return "null";
            }
            return x instanceof Array ? "array" : "object";
        }
        if (String(ty) == "undefined") {
            ty = "null";
        }
        return String(ty);
    },
    TypeParse: function (AST, Token) {
        if (!(Token instanceof Array)) {
            return Token;
        }
        if (Token[0] == "IN_TYPEGET") {
            let Type = AST.Types[Token[1]];
            if (!Type) {
                return Token[1];
            }
            return this.TypeParse(AST, Type);
        } else if (Token[0] == "IN_TYPEUNION") {
            return {
                Type: "Union", V1: this.TypeParse(AST, Token[1]), V2: this.TypeParse(AST, Token[2]), toString: function () {
                    return `${String(this.V1)}|${String(this.V2)}`;
                }
            };
        } else if (Token[0] == "IN_TYPECONCAT") {
            return {
                Type: "Concat", V1: this.TypeParse(AST, Token[1]), V2: this.TypeParse(AST, Token[2]), toString: function () {
                    return `${String(this.V1)}&${String(this.V2)}`;
                }
            };
        } else if (Token[0] == "IN_TYPEARR") {
            return {
                Type: "Array", V: this.TypeParse(AST, Token[1]), toString: function () {
                    return `[${String(this.V)}]`;
                }
            };
        } else if (Token[0] == "IN_TYPENULL") {
            return {
                Type: "Null", V: this.TypeParse(AST, Token[1]), toString: function () {
                    return `?${String(this.V)}`;
                }
            };
        } else if (Token[0] == "IN_TYPEOBJ") {
            let Ty = { Type: "Object" };
            let Obj = Token[1];
            if (Obj.Type == "TypeObject") {
                Ty.OType = "TypeObject";
                Ty.Key = this.TypeParse(AST, Obj.Key);
                Ty.Value = this.TypeParse(AST, Obj.Value);
                Ty.toString = function () {
                    return `{[${String(this.Key)}]:${String(this.Value)}}`;
                }
            } else {
                Ty.Value = {};
                Ty.OType = "Object";
                for (let k in Obj.Value) {
                    let v = Obj.Value[k];
                    Ty.Value[k] = this.TypeParse(AST, v);
                }
                Ty.toString = function () {
                    let Str = [];
                    for (let k in this.Value) {
                        let v = this.Value[k];
                        Str.push(`${String(k).match(/\s/) ? `"${k}"` : k}:${String(v)}`);
                    }
                    return `{${Str.join(", ")}}`;
                }
            }
            return Ty;
        }
    },
    TypeCheck: function (AST, x, t, NoError) {
        let ts = AST.Types;
        let type = this.TypeParse(AST, t);
        function Check(a, b) {
            let ta = Interpreter.GetType(a);
            if (b instanceof Object) {
                if (b.Type == "Union") {
                    return Check(a, b.V1) || Check(a, b.V2);
                } else if (b.Type == "Concat") {
                    return Check(a, b.V1) && Check(a, b.V2);
                } else if (b.Type == "Array") {
                    return Check(a, "array") && (!a.find((v, k) => !Check(v, b.V)))
                } else if (b.Type == "Null") {
                    return Check(a, "null") || Check(a, b.V);
                } else if (b.Type == "Object") {
                    if (!Check(a, "object")) {
                        return false;
                    }
                    if (b.OType == "TypeObject") {
                        for (let k in a) {
                            let v = a[k];
                            if (!Check(k, b.Key) || !Check(v, b.Value)) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        for (let k in b.Value) {
                            let v = b.Value[k];
                            if (a.hasOwnProperty(k) && !Check(a[k], v)) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            } else {
                if (b == "any") { return true }
                return b == ta;
            }
        }
        let Result = Check(x, type);
        let ta = this.GetType(x);
        if (!Result && !NoError) {
            throw new CodeError(`"${String(x)}" of type "${this.GetType(x)}" does not match type "${String(type)}"`);
        }
        return !!Result;
    },
    MakeVariable: function (AST, Name, Value, Extra, ForceBlock) {
        let Variable = this.GetHighestVariable(AST, Name);
        if (Variable && Variable.Block == AST.Block && ForceBlock == undefined) { return }
        Variable = this.NewVariable(Name, Value, AST.Block);
        if (ForceBlock != undefined) {
            Variable.Block = ForceBlock;
        }
        if (Extra && typeof Extra == "object") {
            for (let k in Extra) {
                Variable[k] = Extra[k];
            }
        }
        AST.Variables.push(Variable);
    },
    RemoveVariable: function (AST, Name) {
        let Variable = this.GetHighestVariable(AST, Name);
        if (Variable) {
            AST.Variables.splice(AST.Variables.indexOf(Variable), 1);
        }
    },
    ParseInnerToken: function (AST, Token) {
        return this.Parse(AST, Token)
    },
    UnpackState: function (AST, Token, k, R) {
        Token[k] = R[0][1][0];
        for (let kk in R[0][1]) {
            kk = +kk;
            let vv = R[0][1][kk];
            if (kk > 0) {
                Token.splice(k + kk, 0, vv);
            }
        }
    },
    ParseToken: function (AST, Token) {
        if (Token.length == 0) { return }
        for (let k in Token) {
            k = +k;
            let v = Token[k];
            if (v instanceof Array) {
                let R = [this.Parse(AST, v)];
                if (R[0] instanceof Array && R[0][0] == "IN_UNPACK") {
                    this.UnpackState(AST, Token, k, R);
                } else {
                    Token[k] = R[0];
                }
            } else if (v instanceof Object) {
                this.ParseToken(AST, v);
                for (let kk in v) {
                    let vv = v[kk];
                    v[kk] = this.Parse(AST, v[kk]);
                }
            }
        }
    },
    OpenBlock: function (AST) {
        AST.Block++;
    },
    CloseBlock: function (AST) {
        let Variables = this.GetCurrentVariables(AST);
        let New = [];
        for (let v of Variables) {
            if (v.Block < AST.Block) {
                New.push(v);
            } else {
                //Save variables to Stack VariableReference
                let CStack = AST.CStack;
                let Stack = this.GetStack(AST, CStack);
                if (Stack) {
                    Stack.VariableReference[v.Name] = v.Value;
                }
            }
        }
        AST.Variables = New;
        AST.Block--;
    },
    GetExtendingClasses: function (Class) {
        if (!Class) { return [] }
        let Extensions = [];
        Extensions.push(Class);
        let Proto = Object.prototype.hasOwnProperty.call(Class, "Extends") ? Class.Extends : Object.getPrototypeOf(Class);
        while (Proto) {
            if (Extensions.includes(Proto)) {
                Extensions.pop();
                break;
            }
            Extensions.push(Proto);
            Proto = Object.prototype.hasOwnProperty.call(Proto, "Extends") ? Proto.Extends : Object.getPrototypeOf(Proto.constructor);
        }
        return Extensions;
    },
    SetState: function (AST, Token) {
        let Var = this.GetHighestVariable(AST, Token[1]);
        if (Var) {
            if (Var.hasOwnProperty("Type")) {
                this.TypeCheck(AST, Token[3], Var.Type);
            }
        }
        this.SetVariable(AST, Token[1], Token[3], Token[2]);
    },
    NewState: function (AST, Token) {
        let Extra = {};
        if (Token[3]) {
            Extra.Type = Token[3];
            this.TypeCheck(AST, Token[2], Extra.Type);
        }
        this.MakeVariable(AST, Token[1], Token[2], Extra);
    },
    UpVarState: function (AST, Token) {
        let Extra = {};
        if (Token[3]) {
            Extra.Type = Token[3];
            this.TypeCheck(AST, Token[2], Extra.Type);
        }
        this.MakeVariable(AST, Token[1], Token[2], Extra,AST.Block-1);
    },
    ConstState: function (AST, Token) {
        let Extra = {
            Const: true,
        };
        if (Token[3]) {
            Extra.Type = Token[3];
            this.TypeCheck(AST, Token[2], Extra.Type);
        }
        this.MakeVariable(AST, Token[1], Token[2], Extra);
    },
    GetIndexFromType: function (AST, Type, Name) {
        let Global = AST.LibGlobals[Type];
        if (!Global) { return }
        return Global[Name];
    },
    IndexState: function (AST, Token) {
        let Value = Token[1];
        let Idx = Token[2];
        let Res = Value[Idx];
        let ty = this.GetType(Value);
        let Method = "__index";
        if ((Value instanceof Object) && Object.prototype.hasOwnProperty.call(Value, Method)) {
            Res = Value[Method](Value, Idx);
        } else {
            Res = Value[Idx];
        }
        if (ty == "object") {
            return Res;
        }
        let Ind = this.GetIndexFromType(AST, ty, Idx);
        if (Ind) { return Ind }
        return Res;
    },
    CallState: function (AST, Token) {
        let Check = Token[1];
        if (typeof Check != "function") {
            throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
        return Token[1](...(Token[2] || []));
    },
    SelfCallState: function (AST, Token) {
        let Check = this.IndexState(AST, Token);
        if (typeof Check != "function") {
            throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
        return Check(Token[1], ...Token[3]);
    },
    PropCallState: function (AST, Token) {
        let Check = this.IndexState(AST, Token);
        if (typeof Check != "function") {
            throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
        return Check.call(Token[1], ...Token[3]);
    },
    FastFuncState: function (AST, Args, Tokens, DefaultParams = {}, ParamTypes = {}, ReturnType = null, VArgs = []) {
        let Block = AST.Block;
        this.NewStack(AST, Tokens);
        DefaultParams = this.Parse(AST, DefaultParams);
        ParamTypes = ParamTypes;
        VArgs = VArgs;
        const Callback = function (...Params) {
            Interpreter.OpenBlock(AST);
            let Stack = Interpreter.GetStack(AST, Tokens);
            for (let k in Args) {
                k = +k;
                let v = Args[k];
                let Param = Params[k];
                if (Param == null || Param == undefined) {
                    if (DefaultParams.hasOwnProperty(v)) {
                        let P = DeepCopy(DefaultParams[v])
                        Param = P;
                    }
                }
                if (!VArgs.includes(v)) {
                    if (ParamTypes.hasOwnProperty(v)) {
                        Interpreter.TypeCheck(AST, Param, ParamTypes[v]);
                    }
                    Interpreter.MakeVariable(AST, v, Param);
                } else {
                    let NP = [];
                    for (let i = k; i <= Params.length - 1; i++) {
                        NP.push(Params[i]);
                    }
                    if (ParamTypes.hasOwnProperty(v)) {
                        Interpreter.TypeCheck(AST, NP, ParamTypes[v]);
                    }
                    Interpreter.MakeVariable(AST, v, NP);
                    break;
                }
            }
            let Result = undefined;
            let CStack = AST.CStack;
            let PreBlock = AST.InBlock;
            AST.InBlock = true;
            //Make sure the function can call itself
            let CloneTokens = DeepCopy(Stack.CloneTokens);
            Tokens = CloneTokens;
            Interpreter.NewStack(AST, CloneTokens);
            let CS = Interpreter.GetStack(AST, CloneTokens);
            //CS.VariableReference = Stack.VariableReference;
            CS.Upper = Stack.Upper;
            if (Stack.Tokens.length > 0) {
                do {
                    if (AST.Exited == true) { AST.Exited = false; break }
                    Interpreter.Next(AST, Stack.Tokens);
                    if (Stack.Token[0] == "IN_RETURN") {
                        Result = Interpreter.Parse(AST, Stack.Token);
                        Stack.Result = null;
                        break;
                    }
                    Interpreter.Parse(AST, Stack.Token);
                    if (AST.Returned == true) {
                        Result = AST.Result;
                        AST.Result = null;
                        break;
                    }
                } while (Stack.Current < Stack.Tokens.length - 1);
            }
            Interpreter.CloseBlock(AST);
            Interpreter.RemoveStack(AST, Stack.Tokens);
            Interpreter.RemoveStack(AST, CloneTokens);
            let NewTokens = DeepCopy(Stack.CloneTokens);
            Tokens = NewTokens;
            AST.CStack = CStack;
            AST.Result = null;
            Interpreter.NewStack(AST, NewTokens);
            CS = Interpreter.GetStack(AST, NewTokens);
            //CS.VariableReference = Stack.VariableReference;
            CS.Upper = Stack.Upper;
            AST.InBlock = PreBlock;
            AST.Returned = false;
            if (ReturnType) {
                Interpreter.TypeCheck(AST, Result, ReturnType)
            }
            return Result;
        }
        return Callback;
    },
    FuncState: function (AST, Token) {
        let Name = Token[1];
        let Args = Token[2];
        let Tokens = Token[3];
        let Block = AST.Block;
        const Callback = this.FastFuncState(AST, Args, Tokens, Token[4], Token[10], Token[11], Token[12]);
        this.SetVariable(AST, Name, Callback, Block);
    },
    SkipIfState: function (AST, Token) {
        if ((AST.Returned && AST.InBlock) || (AST.Broken)) { return }
        let Stack = this.GetStack(AST, Token);
        if (!Stack.Token) {
            return
        }
        if (Stack.Token[0] != "IN_ELIF" && Stack.Token[0] != "IN_ELSE") {
            return this.Parse(AST, Stack.Token);
        }
        do {
            this.Next(AST, Token);
            if (Stack.Current >= Stack.Tokens.length - 1) {
                if (!Stack.Token) { return }
                if (Stack.Token[0] == "IN_ELIF" || Stack.Token[0] == "IN_ELSE") {
                    this.Next(AST, Token);
                }
                break;
            }
        } while (Stack.Token[0] == "IN_ELIF" || Stack.Token[0] == "IN_ELSE");
        if (!Stack.Token) { return }
        if (Stack.Token[0] == "IN_ELIF" || Stack.Token[0] == "IN_ELSE") {
            this.Next(AST, Token);
        }
        return this.Parse(AST, Stack.Token);
    },
    CondState: function (AST, Token) {
        this.OpenBlock(AST);
        this.NewStack(AST, Token);
        let Stack = this.GetStack(AST, Token);
        do {
            if (AST.Continued==true||AST.Returned==true||AST.Broken==true){break}
            if (AST.Exited==true){AST.Exited=false;break}
            this.Next(AST, Stack.Tokens);
            if (!Stack.Token) { break }
            if (Stack.Token[0] == "IN_RETURN" && AST.InBlock) {
                AST.Result = this.Parse(AST, Stack.Token);
                AST.Returned = true;
                break;
            } else if (Stack.Token[0] == "IN_STOP" && AST.InLoop) {
                AST.InLoop = false;
                AST.Broken = true;
                break;
            } else if (Stack.Token[0] == "IN_CONTINUE" && AST.InLoop){
                AST.Continued = true;
                break;
            }
            this.Parse(AST, Stack.Token);
        } while (Stack.Current < Stack.Tokens.length - 1);
        this.CloseBlock(AST);
        this.RemoveStack(AST, Token);
    },
    IfState: function (AST, Token) {
        let Comp = this.Parse(AST, Token[1]);
        let CStack = AST.CStack;
        let Stack = Token[2];
        if (Comp) {
            this.CondState(AST, Stack);
            if (AST.Continued==true||AST.Returned==true||AST.Broken==true){return}
            this.Next(AST, CStack);
            this.SkipIfState(AST, CStack);
            return;
        } else {
            this.Next(AST, CStack);
            let NStack = this.GetStack(AST, CStack);
            if (!NStack.Token) { return }
            if (NStack.Token[0] == "IN_ELIF") {
                return this.IfState(AST, NStack.Token);
            } else if (NStack.Token[0] == "IN_ELSE") {
                return this.CondState(AST, NStack.Token);
            }
            return this.Parse(AST, NStack.Token);
        }
    },
    WhileState: function (AST, Token) {
        let Comp = Token[1];
        let Stack = Token[2];
        let NewComp = DeepCopy(Comp);
        let PreLoop = AST.InLoop;
        AST.InLoop = true;
        while (this.ParseUnpack(AST, NewComp)) {
            let NewStack = DeepCopy(Stack);
            this.CondState(AST, NewStack);
            NewComp = DeepCopy(Comp);
            if (!AST.InLoop || AST.Returned) { break }
            if (AST.Continued){AST.Continued=false;continue}
        }
        AST.Broken = false;
        AST.InLoop = PreLoop;
    },
    ForEachState: function (AST, Token) {
        let VName = Token[1];
        let Type = Token[2];
        let Arr = this.ParseUnpack(AST, Token[3]);
        let Stack = Token[4];
        let PreLoop = AST.InLoop
        AST.InLoop = true
        for (let k in Arr) {
            let v = Arr[k];
            this.MakeVariable(AST, VName, Type == "in" ? k : v, undefined, AST.Block + 1);
            let NewStack = DeepCopy(Stack);
            this.CondState(AST, NewStack);
            if (!AST.InLoop || AST.Returned) { break }
            if (AST.Continued) { AST.Continued = false; continue }
        }
        AST.Broken = false;
        AST.InLoop = PreLoop;
    },
    ForAllState: function (AST, Token) {
        let VName1 = Token[1];
        let VName2 = Token[2];
        let Arr = this.ParseUnpack(AST, Token[3]);
        let Stack = Token[4];
        let PreLoop = AST.InLoop
        AST.InLoop = true
        for (let k in Arr) {
            let v = Arr[k];
            this.MakeVariable(AST, VName1, k, undefined, AST.Block + 1);
            this.MakeVariable(AST, VName2, v, undefined, AST.Block + 1);
            let NewStack = DeepCopy(Stack);
            this.CondState(AST, NewStack);
            if (!AST.InLoop || AST.Returned) { break }
            //if (AST.Continued) { AST.Continued = false; continue }
        }
        AST.Broken = false;
        AST.InLoop = PreLoop;
    },
    ForState: function (AST, Token) {
        let VName = Token[1];
        let Start = this.ParseUnpack(AST, Token[2]);
        let End = this.ParseUnpack(AST, Token[3]);
        let Inc = this.ParseUnpack(AST, Token[4]);
        let Stack = Token[5];
        let PreLoop = AST.InLoop;
        AST.InLoop = true;
        for (let i = Start; ; i += Inc) {
            if (Start <= End && i > End) { break }
            if (Start >= End && i < End) { break }
            this.MakeVariable(AST, VName, i, undefined, AST.Block + 1);
            let NewStack = DeepCopy(Stack);
            this.CondState(AST, NewStack);
            if (!AST.InLoop || AST.Returned) { break }
            if (AST.Continued) { AST.Continued = false; continue }
        }
        AST.Broken = false;
        AST.InLoop = PreLoop;
    },
    ArrayState: function (AST, Token) {
        let Arr = Token[1];
        let ArrTypes = Token[2] || {};
        for (let k in Arr) {
            let Result = this.Parse(AST, Arr[k]);
            if (ArrTypes.hasOwnProperty(k)) {
                this.TypeCheck(AST, Result, ArrTypes[k]);
            }
            if (Result instanceof Array && Result[0] == "IN_UNPACK") {
                Result = [Result];
                this.UnpackState(AST, Arr, +k, Result);
            } else {
                Arr[k] = Result;
            }
        }
        return Arr;
    },
    ClassState: function (AST, Token) {
        const Obj = Token[2];
        if (!Obj.construct) { throw new CodeError(`Invalid class ${Token[1]}`) }
        const Extends = Token[3];
        const HasSuper = Token[4];
        const RClass = function (...a) {
            let New = this;
            if (Extends && !HasSuper) {
                let Result = new Extends(...a);
                for (k in Result) {
                    New[k] = Result[k];
                }
            }
            for (k in Obj) {
                if (k != "construct") {
                    New[k] = DeepCopy(Obj[k]);
                }
            }
            let Super = function (...ar) {
                if (Extends && HasSuper) {
                    let Result = new Extends(...ar);
                    for (k in Result) {
                        New[k] = Result[k];
                    }
                }
            }
            Interpreter.MakeVariable(AST, "super", Super, null, AST.Block + 1);
            let Sent = Obj.construct(New, ...a);
            if (Sent != null && Sent != undefined) {
                New = Sent;
            }
            return New;
        }
        if (Extends != undefined) {
            RClass.Extends = Extends;
        }
        this.SetVariable(AST, Token[1], RClass);
    },
    DestructState: function (AST, Token) {
        let Arr = Token[1];
        let Obj = Token[2];
        let Default = Obj.default;
        for (let v of Arr) {
            if (Obj.hasOwnProperty(v)) {
                this.MakeVariable(AST, v, Obj[v]);
            } else if (Default != undefined) {
                this.MakeVariable(AST, v, Default);
            }
        }
    },
    UsingState: function (AST, Token) {
        let PreUsing = AST.InUsing;
        let PreUse = AST.Using;
        AST.InUsing = true;
        AST.Using = this.ParseUnpack(AST, Token[1]);
        AST.UsingExclude = Token[10];
        this.CondState(AST, Token[2]);
        AST.InUsing = PreUsing;
        AST.Using = PreUse;
    },
    SwitchState: function (AST, Token) {
        let Expression = this.ParseUnpack(AST, Token[1]);
        let Cases = Token[2];
        let Default = Token[3];
        for (let v of Cases) {
            let e = this.ParseUnpack(AST, v.Expression);
            if (Expression == e) {
                this.CondState(AST, v.Block)
                return;
            }
        }
        if (Default) {
            this.CondState(AST, Default);
        }
    },
    IncState: function (AST, Token, State) {
        let Item = Token[1];
        if (this.GetType(Item) != "array") {
            throw new CodeError(`Attempt to ${State ? "increment" : "decrement"} a ${this.GetType(Item)}`);
        }
        if (Item[0] == "IN_INDEX") {
            let Name = this.ParseUnpack(AST, Item[1]);
            let Value = this.ParseUnpack(AST, Item[2]);
            if (State) {
                Name[Value]++;
            } else {
                Name[Value]--;
            }
        } else if (Item[0] == "IN_GET") {
            let Name = Item[1];
            let Var = this.GetHighestVariable(AST, Name);
            if (Var) {
                if (Var.Const == true) {
                    throw new CodeError(`Attempt to change const "${Name}"`);
                }
                if (State) {
                    Var.Value++;
                } else {
                    Var.Value--;
                }
            } else {
                let CStack = NVM.CStack;
                let Stack = Interpreter.GetStack(NVM, CStack);
                if (Stack && Stack.VariableReference[Name]) {
                    if (State) {
                        Stack.VariableReference[Name]++;
                    } else {
                        Stack.VariableReference[Name]--;
                    }
                }
                if (State) {
                    AST.Globals[Name]++;
                } else {
                    AST.Globals[Name]--;
                }
            }
        }
    },
    RepeatState: function (AST, Token) {
        let Count = this.ParseUnpack(AST, Token[1]);
        if (this.GetType(Count) != "number") {
            throw new CodeError(`Expected type "number" for repeat loop, got type "${this.GetType(Count)}" instead!`);
        }
        let Stack = Token[2];
        let VarName = Token[3];
        let PreLoop = AST.InLoop;
        AST.InLoop = true;
        for (let i = 1; i <= Count; i++) {
            let NewStack = DeepCopy(Stack);
            if (VarName) {
                this.MakeVariable(AST, VarName, i, undefined, AST.Block + 1);
            }
            this.CondState(AST, NewStack);
            if (!AST.InLoop || AST.Returned) { break }
            if (AST.Continued) { AST.Continued = false; continue }
        }
        AST.Broken = false;
        AST.InLoop = PreLoop;
    },
    ChunkState: function (AST, Token) {
        let Tokens = Token[1];
        this.CondState(AST, Tokens);
    },
    FastDefineState: function (AST, Code) {
        return new DefineBlock(AST, Code);
    },
    DefineState: function (AST, Token) {
        let Name = Token[1];
        let Code = Token[2];
        this.MakeVariable(AST, Name, this.FastDefineState(AST, Code), undefined, AST.Block);
    },
    GetFromLibGlobal: function (AST, Value) {
        try {
            let Checks = new Map();
            Checks.set(AST.LibGlobals.string, String);
            Checks.set(AST.LibGlobals.array, Array);
            return Checks.get(Value) || Value;
        } catch (e) {
            return Value;
        }
    },
    ParseUnpack: function (AST, Token) {
        if (Token instanceof Array && Token[0] == "IN_UNPACK") {
            throw new CodeError(`Invalid unpack statement`);
        } else {
            return this.Parse(AST, Token);
        }
        return Token;
    },
    TryState: function (AST, Token) {
        let Block = Token[1];
        let VName = Token[2];
        let CatchBlock = Token[3];
        let FinallyBlock = Token[4];
        try {
            this.CondState(AST, Block);
        } catch (e) {
            this.MakeVariable(AST, VName, e.message, undefined, AST.Block + 1);
            this.CondState(AST, CatchBlock);
        } finally {
            if (FinallyBlock && !AST.Returned) {
                this.CondState(AST, FinallyBlock);
            }
        }
    },
    IsTypeState: function (AST, Token) {
        let Exp = this.Parse(AST, Token[1]);
        let Type = Token[2];
        let DoError = Token[10];
        let Code = Token[3];
        let Result = this.TypeCheck(AST, Exp, Type, !DoError);
        if (!Code) { return }
        let CStack = AST.CStack;
        if (Result) {
            this.CondState(AST, Code);
            this.Next(AST, CStack);
            this.SkipIfState(AST, CStack);
            return;
        } else {
            this.Next(AST, CStack);
            let NStack = this.GetStack(AST, CStack);
            if (!NStack.Token) { return }
            if (NStack.Token[0] == "IN_ELSE") {
                return this.CondState(AST, NStack.Token);
            }
            return this.Parse(AST, NStack.Token);
        }
    },
    EStringState: function (AST, Token) {
        let Res = Token[1];
        let Str = "";
        for (let v of Res) {
            Str += String(this.Parse(AST, v));
        }
        return Str;
    },
    AsState:function(AST,Token){
        let Expression = Token[0];
        let NewExpression = DeepCopy(Expression);
        let Code = Token[1];
        this.OpenBlock(AST);
        this.NewStack(AST, Code);
        let Stack = this.GetStack(AST, Code);
        do {
            if(!this.Parse(AST,NewExpression)){
                break;
            }
            NewExpression = DeepCopy(Expression);
            if (AST.Continued == true || AST.Returned == true || AST.Broken == true) { break }
            if (AST.Exited == true) { AST.Exited = false; break }
            this.Next(AST, Stack.Tokens);
            if (!Stack.Token) { break }
            if (Stack.Token[0] == "IN_RETURN" && AST.InBlock) {
                AST.Result = this.Parse(AST, Stack.Token);
                AST.Returned = true;
                break;
            } else if (Stack.Token[0] == "IN_STOP" && AST.InLoop) {
                AST.InLoop = false;
                AST.Broken = true;
                break;
            } else if (Stack.Token[0] == "IN_CONTINUE" && AST.InLoop) {
                AST.Continued = true;
                break;
            }
            this.Parse(AST, Stack.Token);
        } while (Stack.Current < Stack.Tokens.length - 1);
        this.CloseBlock(AST);
        this.RemoveStack(AST, Code);
    },
    Parse: function (AST, Token) {
        if (!(Token instanceof Array)) {
            return Token
        }
        //Non-Parsed
        if (Token[0] == "IN_FUNC") {
            return this.FuncState(AST, Token);
        } else if (Token[0] == "IN_FASTFUNC") {
            return this.FastFuncState(AST, Token[1], Token[2], Token[3], Token[10], Token[11], Token[12]);
        } else if (Token[0] == "IN_IF") {
            return this.IfState(AST, Token);
        } else if (Token[0] == "IN_WHILE") {
            return this.WhileState(AST, Token);
        } else if (Token[0] == "IN_FOREACH") {
            return this.ForEachState(AST, Token);
        } else if (Token[0] == "IN_FOR") {
            return this.ForState(AST, Token);
        } else if (Token[0] == "IN_FORALL") {
            return this.ForAllState(AST, Token);
        } else if (Token[0] == "IN_ARRAY") {
            return this.ArrayState(AST, Token);
        } else if (Token[0] == "IN_USING") {
            return this.UsingState(AST, Token);
        } else if (Token[0] == "IN_AND") {
            let v1 = this.Parse(AST, Token[1]);
            let v2 = Token[2];
            if (v1) {
                v2 = this.Parse(AST, v2);
                return v1 && v2;
            }
            return false;
        } else if (Token[0] == "IN_OR") {
            let v1 = this.Parse(AST, Token[1]);
            let v2 = Token[2];
            if (v1) {
                return v1;
            } else {
                v2 = this.Parse(AST, v2);
                if (v2) {
                    return v2;
                }
                return v1 || v2;
            }
        } else if (Token[0] == "IN_SWITCH") {
            return this.SwitchState(AST, Token);
        } else if (Token[0] == "IN_INC") {
            return this.IncState(AST, Token, true);
        } else if (Token[0] == "IN_DEINC") {
            return this.IncState(AST, Token, false);
        } else if (Token[0] == "IN_REPEAT") {
            return this.RepeatState(AST, Token);
        } else if (Token[0] == "IN_CHECK") {
            let Exp = this.Parse(AST, Token[1]);
            if (Exp) {
                return this.Parse(AST, Token[2]);
            } else {
                return this.Parse(AST, Token[3]);
            }
        } else if (Token[0] == "IN_CHUNK") {
            return this.ChunkState(AST, Token);
        } else if (Token[0] == "IN_TRY") {
            return this.TryState(AST, Token);
        } else if (Token[0] == "IN_DEFINE") {
            return this.DefineState(AST, Token);
        } else if (Token[0] == "IN_FASTDEFINE") {
            return this.FastDefineState(AST, Token[1]);
        } else if (Token[0] == "IN_ISTYPE") {
            return this.IsTypeState(AST, Token);
        } else if (Token[0] == "IN_CUSTOMSYNTAX") {
            let Callback = Token[2];
            if (Callback) {
                return Callback(AST, Token);
            }
        } else if (Token[0] == "IN_ESTRING") {
            return this.EStringState(AST, Token);
        } else if (Token[0]=="IN_AS"){
            return this.AsState(AST,Token);
        }
        this.ParseToken(AST, Token);
        //Parsed
        if (Token[0] == "IN_SET") {
            return this.SetState(AST, Token);
        } else if (Token[0] == "IN_NEW") {
            return this.NewState(AST, Token);
        } else if (Token[0] == "IN_UPVAR") {
            return this.UpVarState(AST, Token);
        } else if (Token[0] == "IN_CONST") {
            return this.ConstState(AST, Token);
        } else if (Token[0] == "IN_CALL") {
            return this.CallState(AST, Token);
        } else if (Token[0] == "IN_SELFCALL") {
            return this.SelfCallState(AST, Token);
        } else if (Token[0] == "IN_PROPCALL") {
            return this.PropCallState(AST, Token);
        } else if (Token[0] == "IN_GET") {
            return AST.Globals[Token[1]];
        } else if (Token[0] == "IN_ADD") { //Math Start
            let Result = null, Method = "__add";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] + Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_SUB") {
            let Result = null, Method = "__sub";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] - Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_MUL") {
            let Result = null, Method = "__mul";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] * Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_DIV") {
            let Result = null, Method = "__div";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] / Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_POW") {
            let Result = null, Method = "__pow";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] ** Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_MOD") { //Math End
            let Result = null, Method = "__mod";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)) {
                Result = Token[1][Method](Token[1], Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)) {
                Result = Token[2][Method](Token[2], Token[1]);
            } else {
                Result = Token[1] % Token[2];
            }
            return Result;
        } else if (Token[0] == "IN_POF") {
            let P = Token[1] / 100;
            return Token[2] * P;
        } else if (Token[0] == "IN_NOT") {
            return !Token[1];
        } else if (Token[0] == "IN_EQ") {
            return Token[1] == Token[2];
        } else if (Token[0] == "IN_GEQ") {
            return Token[1] >= Token[2];
        } else if (Token[0] == "IN_LEQ") {
            return Token[1] <= Token[2];
        } else if (Token[0] == "IN_NEQ") {
            return Token[1] != Token[2];
        } else if (Token[0] == "IN_GT") {
            return Token[1] > Token[2];
        } else if (Token[0] == "IN_LT") {
            return Token[1] < Token[2];
        } else if (Token[0] == "IN_INDEX") {
            return this.IndexState(AST, Token);
        } else if (Token[0] == "IN_SETINDEX") {
            let Type = Token[3];
            if (Type == "eq") {
                let v = Token[1];
                let Method = "__setindex";
                if ((v instanceof Object) && Object.prototype.hasOwnProperty.call(v, Method)) {
                    Result = v[Method](v, Token[2], Token[4]);
                } else {
                    v[Token[2]] = Token[4];
                }
            } else if (Type == "addeq") {
                Token[1][Token[2]] += Token[4];
            } else if (Type == "subeq") {
                Token[1][Token[2]] -= Token[4];
            } else if (Type == "muleq") {
                Token[1][Token[2]] *= Token[4];
            } else if (Type == "diveq") {
                Token[1][Token[2]] /= Token[4];
            } else if (Type == "poweq") {
                Token[1][Token[2]] **= Token[4];
            } else if (Type == "modeq") {
                Token[1][Token[2]] %= Token[4];
            }
            return
        } else if (Token[0] == "IN_DEL") {
            return this.RemoveVariable(AST, Token[1]);
        } else if (Token[0] == "IN_RETURN") {
            if (!AST.InBlock) {
                throw new CodeError("Expected return");
            }
            AST.Result = Token[1];
            AST.Returned = true;
            return Token[1];
        } else if (Token[0] == "IN_LEN") {
            return Token[1].length;
        } else if (Token[0] == "IN_STOP") {
            return;
        } else if (Token[0] == "IN_MAKENEW") {
            if (Token[2]) {
                if (!(Token[2] instanceof Array)) {
                    throw new CodeError(`Adding parameters to "new" with "with" must be an array`);
                }
                return new Token[1](...Token[2]);
            } else {
                return new Token[1];
            }
        } else if (Token[0] == "IN_CLASS") {
            return this.ClassState(AST, Token);
        } else if (Token[0] == "IN_DESTRUCT") {
            return this.DestructState(AST, Token);
        } else if (Token[0] == "IN_ROUND") {
            return Math.round(Token[1]);
        } else if (Token[0] == "IN_UNM") {
            let Result = null, Method = "__unm";
            if ((Token[1] instanceof Object) && Object.prototype.hasOwnProperty.call(Token[1], Method)) {
                Result = Token[1][Method](Token[1]);
            } else {
                Result = -Token[1];
            }
            return Result;
        } else if (Token[0] == "IN_UNSET") {
            delete Token[1][Token[2]];
            return;
        } else if (Token[0] == "IN_GLOBALASSIGN") {
            AST.GlobalSettings[Token[1]] = Token[2];
            return;
        } else if (Token[0] == "IN_ISA") {
            let v1 = Token[1];
            let v2 = Token[2];
            let vv = v1;
            v2 = this.GetFromLibGlobal(AST, v2);
            try {
                vv = v1.constructor;
            } catch (e) { }
            let ex = this.GetExtendingClasses(vv);
            let inst = ex.includes(v2);
            return inst;
        } else if (Token[0] == "IN_SWAP") {
            let v1 = this.GetHighestVariable(AST, Token[1]);
            if (!v1) {
                throw new CodeError(`Invalid variable name "${Token[1]}"`);
            }
            let v2 = this.GetHighestVariable(AST, Token[2]);
            if (!v2) {
                throw new CodeError(`Invalid variable name "${Token[2]}"`);
            }
            let [v1v, v2v] = [v1.Value, v2.Value];
            this.SetVariable(AST, Token[1], v2v, "eq");
            this.SetVariable(AST, Token[2], v1v, "eq");
            return
        } else if (Token[0] == "IN_IN") {
            let v1 = Token[2];
            let v2 = Token[1];
            let ty = this.GetType(v1);
            if (ty == "string") {
                return !!v1.match(v2.replace(/[\+\-\{\}\(\)\[\]\|\=\?\&\.\>\<\*\$\^\\]/g, "\\$&"));
            } else if (ty == "object") {
                return Object.prototype.hasOwnProperty.call(v1, v2);
            } else if (ty == "array") {
                return v1.includes(v2);
            }
        } else if (Token[0] == "IN_BITAND") {
            return Token[1] & Token[2];
        } else if (Token[0] == "IN_BITOR") {
            return Token[1] | Token[2];
        } else if (Token[0] == "IN_BITXOR") {
            return Token[1] ^ Token[2];
        } else if (Token[0] == "IN_BITZLSHIFT") {
            return Token[1] << Token[2];
        } else if (Token[0] == "IN_BITZRSHIFT") {
            return Token[1] >>> Token[2];
        } else if (Token[0] == "IN_BITRSHIFT") {
            return Token[1] >> Token[2];
        } else if (Token[0] == "IN_BITNOT") {
            return ~Token[1]
        } else if (Token[0] == "IN_SETTYPE") {
            AST.Types[Token[1]] = Token[2];
            return;
        } else if (Token[0] == "IN_PLACEMENT") {
            let Variable = Token[1];
            if (Variable instanceof DefineBlock) {
                Variable.RunCode();
            } else {
                throw new CodeError(`Attempt to use the placement operator on a non-DefineBlock class`);
            }
        } else if (Token[0] == "IN_INTERNAL") {
            let State = Token[1];
            if (State == "move") {
                let Stack = this.GetStack(AST, AST.CStack);
                this.Next(AST, Stack.Tokens, ...Token[2]);
            } else if (State == "gv") {
                return AST.Globals[Token[2][0]];
            }
            return
        }else if(Token[0]=="IN_LOCKVAR"){
            let Var = this.GetHighestVariable(AST,Token[1]);
            if (Var){
                Var.Const = true;
            } else {
                console.log(Token);
            }
        }else if(Token[0]=="IN_NUMRANGE"){
            let Min=Token[1];
            let Max=Token[2];
            let Result = [];
            for(let i=Min;i<=Max;i++){
                Result.push(i);
            }
            return Result;
        }else if (Token[0]=="IN_EXIT"){
            AST.Exited = true;
        }
        return Token;
    },
    DeprecatedCall: function (AST, Name) {
        let Deps = AST.LibSettings.DeprecatedCalls;
        if (!AST.DeprecatedCalls.includes(Name) && (Deps && Deps.includes(Name))) {
            let DepCall = AST.LibSettings.DeprecatedCallback;
            if (DepCall && typeof DepCall == "function") {
                DepCall(`The global ${Name} is deprecated, consider not using it.`);
            }
            AST.DeprecatedCalls.push(Name);
        }
    },
    New: function (Tokens, Library = {}) {
        if (!Library.hasOwnProperty("Globals")) {
            Library.Globals = {};
        }
        let Globals = Library.Globals;
        const NVM = {
            Stacks: [],
            MainStack: Tokens,
            Variables: [],
            Block: 1,
            CStack: [],
            Returned: false,
            InBlock: false,
            InLoop: false,
            Continued: false,
            Result: null,
            InUsing: false,
            Exited:false,
            Using: null,
            Types: {},
            StackCurrent: {},
            UsingExclude: [],
            GlobalSettings: {},
            Library: Library,
            DeprecatedCalls: [],
            LibSettings: Library.Settings || {},
            LibGlobals: Globals,
            Globals: new Proxy(Globals, {
                get: function (_, Name) {
                    let CStack = NVM.CStack;
                    let Stack = Interpreter.GetStack(NVM, CStack);
                    let Var = Interpreter.GetHighestVariable(NVM, Name);
                    if (Stack) {
                        if (Stack.VariableReference[Name]) {
                            return Stack.VariableReference[Name];
                        }
                        if (Var) {
                            return Var.Value;
                        } else {
                            if (NVM.InUsing && NVM.Using && !NVM.UsingExclude.includes(Name)) {
                                if (NVM.Using[Name]) {
                                    return NVM.Using[Name];
                                } else {
                                    Interpreter.DeprecatedCall(NVM, Name);
                                    return _[Name];
                                }
                            } else {
                                Interpreter.DeprecatedCall(NVM, Name);
                                return _[Name];
                            }
                        }
                    }
                    if (Var) {
                        return Var.Value;
                    } else {
                        if (NVM.InUsing && NVM.Using && !NVM.UsingExclude.includes(Name)) {
                            if (NVM.Using[Name]) {
                                return NVM.Using[Name];
                            } else {
                                Interpreter.DeprecatedCall(NVM, Name);
                                return _[Name];
                            }
                        } else {
                            Interpreter.DeprecatedCall(NVM, Name);
                            return _[Name];
                        }
                    }
                },
            }),
        };
        if (Library.Settings?.ASTVariable === true) {
            this.MakeVariable(NVM, "$AST", NVM, undefined, 1);
        }
        this.NewStack(NVM, Tokens);
        return NVM;
    },
    Start: function (AST) {
        AST.CStack = AST.MainStack;
        let Stack = this.GetStack(AST, AST.MainStack);
        do {
            if (AST.Exited == true) { AST.Exited = false; break }
            this.Next(AST, AST.MainStack);
            this.Parse(AST, Stack.Token);
            Stack = this.GetStack(AST, AST.MainStack);
        } while (Stack.Current <= Stack.Tokens.length);
        return {
            GlobalSettings: AST.GlobalSettings,
            AST: AST,
        };
    },
});

//{{ Print }}\\

function ReduceValue(Value) {
    let Type = typeof Value;
    if (Type == "string") {
        return `"${Value}"`;
    } else {
        return String(Value);
    }
}

function GetTabs(Count) {
    let t = "";
    for (let i = 1; i <= Count; i++) {
        t += "\t";
    }
    return t;
}

function NonReduceString(Add) {
    let New = Add;
    let Type = typeof Add;
    if (Type == "string") {
        if (Add.match(/\s/)) {
            New = `["${Add}"]`;
        }
    } else {
        New = `[${Add}]`;
    }
    return New;
}

function Print(Table, Arr, Tabs) {
    let TabCount = Tabs || 0;
    let Arrr = Arr || [];
    for (let k in Table) {
        let v = Table[k];
        if (typeof v == "object") {
            Arrr.push(GetTabs(TabCount) + `${NonReduceString(k)} = ` + `{` + "<br>");
            Print(v, Arrr, TabCount + 1);
            Arrr.push(GetTabs(TabCount) + "}<br>");
        } else {
            let sv = `${NonReduceString(k)} = `
            Arrr.push(GetTabs(TabCount) + sv + ReduceValue(v) + "<br>");
        }
    }
    return Arrr;
}

//{{ XBS Proxy }}\\

const XBS = Object.freeze({
    Version: "0.0.1.9",
    Parse: function (Code) {
        return AST.StartParser(Code);
    },
    StylePrint: function (Text) {
        document.write(`<pre style="border-left:5px solid #eeeeee;padding-left:5px;tab-size:3;font-size:12px;line-height:12px;">${Text}</pre>`);
    },
    Run: function (Code, Library, Settings = {}) {
        Library.Globals._VERSION = XBS.Version;
        if (Settings.PrintCode === true) {
            this.StylePrint(Code);
        }
        if (Settings.PrintTokens == true) {
            let Tokens = this.Tokenize(Code);
            this.StylePrint(Print(Tokens).join(""));
        }
        let ASTResult = this.Parse(Code);
        if (Settings.PrintAST === true) {
            this.StylePrint(Print(ASTResult).join(""));
        }
        let VM = Interpreter.New(ASTResult, Library);
        return Interpreter.Start(VM);
    },
    Tokenize: function (Code) {
        return Lex.Tokenize(Code);
    },
});
