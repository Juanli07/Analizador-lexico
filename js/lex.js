let tokens = [{
    token: 'TD', 
    expr: /Void|Int|Double|Float|String|Char/,
    cont: 0
},{
    token: 'ID',
    expr: /(^[A-Z|a-z][a-zA-Z0-9]*)/,
    cont: 0
},{
    token: 'DELIM',
    expr: /\{|\}|\(|\)/,
    cont: 0
},{
    token: 'AS',
    expr: /\=/,
    cont: 0
},{
    token: 'OA',
    expr: /\+|\-|\*|\//,
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
let semantica = [{
    expr: /(TD[\d]*[\s]ID[\d]*[\s]DELIM[\d]*[\s](TD[\d]*[\s]ID[\d]*[\s](MIS[\d]*[\s]TD[\d]*[\s]ID[\d]*[\s])*)?DELIM[\d]*)/
},{
    expr: /(ID[\d]*[\s]AS[\d]*[\s](ID|CNV)[\d]*[\s]OA[\d]*[\s](ID|CNV)[\d]*([\s]OA[\d]*[\s](ID|CNV)[\d]*)*)/
}]

function lexer(code){
    let results = Array();
    let lexemes = Array();
    let  word = '';
    for(let letter in code){
        if(/[^A-Za-z0-9_.]/.test(code[letter])){
            lexemes.push(word);
            lexemes.push(code[letter]);
            word = '';
        }else{
            word += code[letter];
        }
    }
    lexemes.push(word);
    let band = true;
    lexemes.forEach(element => {
        band = false;
        for(let token in tokens){
            if(element.match(tokens[token].expr) && element != '\n'){
                tokens[token].cont++;
                results.push({ lexeme: element, token: tokens[token].token+tokens[token].cont });
                band = true;
                break;
            }
        }
        if(!band && !/[]*/.test(element)){
            results.push({lexeme: element, token: 'ERLX'});
        }
    });
    tokens.forEach( item => {
        item.cont = 0;
    })
    return results
}

function checksemantic(results){
    let aux = '';
    result = Array()

    results.forEach( index => {
        aux += index.token+' '
        semantica.forEach( item => {
            if(aux.match(item.expr)){
                result.push(aux);
                aux = '';
            }
        })
    })
    return result
}
