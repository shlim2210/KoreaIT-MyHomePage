
function sendit(){
    const userid = document.getElementById('userid');
    const userpw = document.getElementById('userpw');
    const username = document.getElementById('username');
    const usertel = document.getElementById('usertel');
    const date = document.getElementById('date');
    const email = document.getElementById('email');
    const isssn = document.getElementById('isssn');
    const zipcode = document.getElementById('sample6_postcode');
    const hobby = document.getElementsByName('hobby');

    const expIdText = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,16}$/;
    const expPwText = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{4,20}$/;
    const expNameText = /[가-힣]+$/;
    const expHpText = /^01\d-\d{3,4}-\d{4}$/;
    const expEmailText = /^[A-Za-z0-9\-\.]+@[A-Za-z0-9\-\.]+\.[A-za-z0-9]+$/;

    //아이디를 입력하지 않았을 때
    if(userid.value == ''){
        alert('아이디를 입력하세요');
        userid.focus();
        return false;
    }

    // 아이디에 영문자와 숫자가 포함되지 않았을 때
    if(!expIdText.test(userid.value)){
        alert("아이디는 4~16글자, 영문자와 숫자를 포함하여 입력하세요");
        userid.focus();
        return false;
    }

    //비밀번호를 입력하지 않았을 때
    if(userpw.value == ''){
        alert('비밀번호를 입력하세요');
        userpw.focus();
        return false;
    }

    // 비밀번호에 영문자와 숫자가 포함되지 않았을 때
    if(!expPwText.test(userpw.value)){
        alert("비밀번호는 4~20글자, 영문자, 숫자, 특수문자를 포함하여 입력하세요");
        userpw.focus();
        return false;
    }

    // 비밀번호 확인
    if(userpw.value != userpw_re.value){
        alert("비밀번호와 비밀번호 확인의 값이 다릅니다.");
        userpw_re.focus();
        return false;
    }

    // 이름
    if(!expNameText.test(username.value)){
        alert("이름 형식을 확인하세요\n한글만 입력 가능 합니다.");
        username.focus();
        return false;
    }

    //  전화번호
    if(!expHpText.test(usertel.value)){
        alert("전화번호 형식을 확인하세요\n(-을 포함해서 작성)");
        usertel.focus();
        return false;
    }

    // 생년월일
    if(!date.value){
        alert("생년월일을 입력하세요");
        date.focus();
        return false;
    }

    // 이메일
    if(!expEmailText.test(email.value)){
        alert("이메일 형식을 확인하세요");
        email.focus();
        return false;
    }

    // 주민번호 검증
    if(isssn.value=="false"){
        alert("주민번호를 검증하세요");
        ssncheck.focus();
        return false;
    }

    if(zipcode.value==""){
        alert("우편번호를 입력하세요");
        zipfind.focus();
        return false;
    }

    // 취미
    let count = 0;

    for(let i in hobby){
        if(hobby[i].checked){
            count++;
        }
    }
    if(count == 0){
        alert("취미를 적어도 한개 이상 선택하세요");
        return false;
    }

    alert(`${userid.value}님, 회원가입을 완료하였습니다!`)
    return true;
}

function moveFocus(){
    const ssn1 = document.getElementById('ssn1');
    if(ssn1.value.length >= 6){
        document.getElementById('ssn2').focus();
    }
}

function ssnCheck(){
    const ssn1 = document.getElementById('ssn1');
    const ssn2 = document.getElementById('ssn2');
    const ssn = ssn1.value + ssn2.value;
    const isssn = document.getElementById('isssn');

    if(ssn1.value == "" || ssn2.value == ''){
        alert('주민등록번호를 입력하세요');
        return false;
    }

    let sum = 0;

    for ( let i=0; i < ssn.length-1; i++){
        if (i < 8){
            sum += (i+2) * Number(ssn.substring(i,i+1));
        }else if (i >= 8){
            sum += (i-6) * Number(ssn.substring(i,i+1));
        }
    }

    sum = sum % 11;
    sum = 11-sum;
    if(sum >= 10) sum = sum % 10;

    if(sum == Number(ssn.substring(12))){
        alert("주민번호가 검증되었습니다.");
        isssn.value = 'true';
    }else{
        alert("유효하지 않은 주민등록번호입니다.");
    }
}

function ssnChange(){
    const isssn = document.getElementById("isssn");
    isssn.value = "false";
}