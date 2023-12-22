const R= Math.pow(10,9)
function plus(a,b) {
    let r= (a*R+ b*R)/R
    return r
}
function multiply(a,b) {
    let r= (a*R)*(b*R)/R/R
    return r
}
export {plus, multiply}