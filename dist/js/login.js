$(document).ready(function() {
/* ////////////////////////////////////// */

$('#login').click(function(){
    login();
})

function login() {
    window.location.href = 'http://localhost:8888/auth/google';
}

/* ////////////////////////////////////// */

$.get('/UserInfo',{
},(data) => {
    if(data){
        $('.modal').css('display', 'flex').css('opacity', '1');
        userID = data.id;
    }
})

/* ////////////////////////////////////// */

$('#done').click(function(){
    console.log($('#username').val())
    $.get('/UserInfoChange',{
        userpic: $('#userpic').attr('src'),
        username: $('#username').val(),
        userID: userID
    },(data) => {
        console.log(data);
        window.location.href = 'http://localhost:8888/sort.html'
    });
})

/* ////////////////////////////////////// */
})