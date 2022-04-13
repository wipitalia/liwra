const stdres = Array.from(document.body.querySelectorAll('*'))
    .map(e => Array.from(e.querySelectorAll('*')))
    .flat();

const qsres = liwra.querySelect(liwra.querySelect(document.body, '*'), '*');

let correct = stdres.length === qsres.length;
for (let i = 0; correct && i < stdres.length; i++) {
    correct = correct && stdres[i] === qsres[i];
}
alert(`TEST: results should be the same: ${correct}`);