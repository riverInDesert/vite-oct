function preCheck(a,p) {
    let signal,message;
    if (a.match(/^\d{11}$/)) {
        if(p[0].match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
            if(p.length==1||(p[0]===p[1])) {
                signal=true;
            } else {
                message='密码不一致';
            }
        }else {
            message='密码在6-12位间，且至少包含一个数字和一个小写字母';
        }
    } else {
        message='输入11位手机号码';
    }
    return {signal,message};
}
export default preCheck;