
// window.onload ==> 페이지를 모두 로드한 뒤 함수를 실행하게 함 : html 정보가 불려오기 전에 함수를 읽으면 id값 등을 컴퓨터가 인식하지 못하기 때문에

window.onload = function(){
    // 작은 이미지 상자 상위 영역의 id값으로 태그 정보를 불러옴
    const small = document.getElementById('viewer_cont_small');
    // 큰 이미지 상자 영역의 id값으로 태그 정보를 불러옴
    const big = document.getElementById('viewer_big');

    // 작은 이미지 상자의 상위 영역에서 클릭에 대한 이벤트리스너를 만듦
    small.addEventListener('click', (e) =>{
        // 클릭한 영역이 이미지 상자의 상위영역이 아닐경우(이미지를 클릭했을 경우)
        if(e.target.id!="viewer_cont_small"){
            // 큰 이미지 상자의 배경을 클릭한 이미지 주소로 변경
            big.style.backgroundImage=`url(../images/${e.target.id}.png)`;
        }
    });

}