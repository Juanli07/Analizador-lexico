let tokens = [{
    token: 'TD', 
    expr: /void|int|double|float|string|char/,
    cont: 0
},{
    token: 'ID',
    expr: /(^[A-Z|a-z][a-zA-Z0-9]*)/,
    cont: 0
},{
    token: 'DELIM',
    expr: /\(|\)/,
    cont: 0
},{
    token: 'AS',
    expr: /\=/,
    cont: 0
},{
    token: 'OA',
    expr: /^(\+|\-|\*|\/)$/,
    cont: 0
},{
    token: 'CNV',
    expr: /[0-9]+[\.0-9]*/,
    cont: 0
},{
    token: 'MIS',
    expr: /[\,]/,
    cont: 0
}]

const semantic = [
    {
        expr: /([A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+[\s]*[(]([\s]*[A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+([\,][\s]*[A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+[\s]*)*)?[\)])/,
        id: 'function'
    },
    {
        expr: /([A-Za-z0-9!"#$%&/_()¡¿?]+[\s]*[\=]([\s]*[A-Za-z0-9!"#$%&/_()¡¿?]+([\s]*[\/\-\+\%\*][\s]*[A-Za-z0-9!"#$%&/_()¡¿?]+)*)+)/,
        id: 'operation'
    }
]
function setLexemes(code){
    let lines = code.split('\n');
    let results = new Array();
    lines.forEach(element => {
        for(item in semantic){
            if(semantic[item].expr.test(element)){
                results.push({ line: element, type: semantic[item].id});
            }
        }
    });
    return results
}

function setTokens(lines){
    let lexemes = new Array();
    let word = '';
    let tok;
    let results = new Array();
    lines.forEach( item => {
        if(item.type === 'function'){
            tok = getTokensFunc(item.line);
            for(let letter in item.line){
                if(/[^A-Za-z0-9_.]/.test(item.line[letter])){
                    lexemes.push(word);
                    lexemes.push(item.line[letter]);
                    word = '';
                }else{
                    word += item.line[letter];
                }
            }
            lexemes.push(word);
            let cont  = 0, band = 0;;
            lexemes.forEach( lex => {
                if(lex != '' && lex != ' '){
                    for(tk in tokens){
                        if(tokens[tk].token == tok[cont]){
                            band = tk;
                            break;
                        }
                    }
                    if(tokens[band].expr.test(lex)){
                        tokens[band].cont++;
                        results.push({lexeme: lex, token: tokens[band].token+tokens[band].cont})
                    }else{
                        tokens[band].cont++;
                        results.push({lexeme: lex, token: 'ERLX'+tokens[band].token+tokens[band].cont})
                    }
                    cont++;
                }
            })
        }else if(item.type === 'operation'){
            lexemes = []
            tok = getTokensOpe(item.line);
            for(let letter in item.line){
                if(/[^A-Za-z0-9_./*+-]/.test(item.line[letter])){
                    lexemes.push(word);
                    lexemes.push(item.line[letter]);
                    word = '';
                }else{
                    word += item.line[letter];
                }
            }
            lexemes.push(word);
            let cont  = 0, band = 0;;
            lexemes.forEach( lex => {
                if(lex != '' && lex != ' '){
                    for(tk in tokens){
                        if(tokens[tk].token == tok[cont]){
                            band = tk;
                            break;
                        }else if(tok[cont] == 'X'){
                            band = false;
                        }
                    }
                    if(band){
                        if(tokens[band].expr.test(lex)){
                            tokens[band].cont++;
                            results.push({lexeme: lex, token: tokens[band].token+tokens[band].cont})
                        }else{
                            tokens[band].cont++;
                            results.push({lexeme: lex, token: 'ERLX'+tokens[band].token+tokens[band].cont})
                        }
                        cont++;
                    }else{
                        if(tokens[1].expr.test(lex)){
                            band = 1;
                        }else if(tokens[5].expr.test(lex)){
                            band = 5;
                        }
                        if(band){
                            tokens[1].cont++;
                            results.push({lexeme: lex, token: tokens[band].token+tokens[band].cont})
                        }else{
                            tokens[1].cont++;
                            results.push({lexeme: lex, token: 'ERLX'+tokens[band].token+tokens[band].cont})
                        }
                        cont++;
                    }
                }
            })
        }
    })
    tokens.forEach( item => {
        item.cont = 0;
    })
    return results;
}

function getTokensFunc(arr){
    let lexemes = new Array();
    let word = '';
    for(let letter in arr){
        if(/[^A-Za-z0-9_.]/.test(arr[letter])){
            lexemes.push(word);
            lexemes.push(arr[letter]);
            word = '';
        }else{
            word += arr[letter];
        }
    }
    lexemes.push(word);
    let num = 0;
    for(let i in lexemes){
        if(lexemes[i] != ' ' && lexemes[i] != ''){
            num++;
        }
    }
    let position = ['TD','ID', 'DELIM'];
    num = num - 4;
    while(num > 0){
        position.push('TD');
        position.push('ID');
        num  -= 2;
        if( num > 0){
            position.push('MIS');
            num -= 1;
        }
    }
    position.push('DELIM');
    return position;
}

function getTokensOpe(arr){
    let lexemes = new Array();
    let word = '';
    for(let letter in arr){
        if(/[^A-Za-z0-9_./*+-]/.test(arr[letter])){
            lexemes.push(word);
            lexemes.push(arr[letter]);
            word = '';
        }else{
            word += arr[letter];
        }
    }
    lexemes.push(word);
    let position = ['ID', 'AS', 'X']
    let num = 0;
    for(let i in lexemes){
        if(lexemes[i] != ' ' && lexemes[i] != ''){
            num++;
        }
    }
    num -= 3;
    while( num > 0){
        position.push('OA');
        position.push('X');
        num -= 2;
    }
    return position;
}