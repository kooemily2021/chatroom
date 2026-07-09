import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";



// ===========================
// 앱 시작
// ===========================

console.log("ChatRoom+ 실행");



// ===========================
// 로그인 상태 확인
// ===========================

onAuthStateChanged(auth,(user)=>{


    if(user){


        console.log(

            "로그인 사용자:",

            user.displayName

        );


        document.body.classList.add(
            "login"
        );


    }

    else{


        console.log(
            "로그아웃 상태"
        );


        document.body.classList.remove(
            "login"
        );


    }


});





// ===========================
// 모달 공통 닫기
// ===========================


document
.querySelectorAll(".closeModal")
.forEach((btn)=>{


    btn.addEventListener(

        "click",

        ()=>{


            const modal =
            btn.closest(".modal");


            if(modal){

                modal.style.display="none";

            }


        }

    );


});




// ===========================
// 모달 바깥 클릭 닫기
// ===========================


document
.querySelectorAll(".modal")
.forEach((modal)=>{


    modal.addEventListener(

        "click",

        (e)=>{


            if(e.target===modal){


                modal.style.display="none";


            }


        }

    );


});




// ===========================
// 채팅 입력 UX
// ===========================


const input =
document.getElementById(
    "messageInput"
);



if(input){


    input.addEventListener(

        "focus",

        ()=>{


            console.log(
                "입력 시작"
            );


        }

    );


}





// ===========================
// 검색 버튼
// ===========================


const searchBtn =
document.getElementById(
    "searchBtn"
);



if(searchBtn){


    searchBtn.onclick=()=>{


        const value =

        document
        .getElementById(
            "searchUser"
        )
        .value
        .trim();



        if(!value){

            alert(
                "검색할 ID를 입력하세요."
            );

            return;

        }



        console.log(

            "검색:",
            value

        );


        // 친구 검색 기능은
        // friends.js에서 처리



    };


}




// ===========================
// 페이지 준비 완료
// ===========================

window.addEventListener(

"load",

()=>{


    console.log(

        "ChatRoom+ 준비 완료"

    );


});
