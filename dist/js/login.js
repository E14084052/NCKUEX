$(document).ready(function() {
/* ////////////////////////////////////// */
$('#login').click(function(){
    login();
})

if(true){
    $('.modal').css('display', 'flex').css('opacity', '1');
}

function login() {
    window.location.href = 'http://localhost:8888/auth/google';
}
/* ////////////////////////////////////// */
})