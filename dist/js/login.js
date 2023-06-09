$(document).ready(function() {
/* ////////////////////////////////////// */

$('#login').click(function(){
    login();
})

function login() {
    window.location.href = 'http://localhost:8888/auth/google';
}

$.get('/UserInfo',{
},(data) => {
    if(data){
        userID = data.id;
        $('.modal').css('display', 'flex').css('opacity', '1');
    }
})


/* ////////////////////////////////////// */

$('#done').click(function(){
    $.get('/UserInfoChange',{
        userpic: $('#userpic').attr('src'),
        username: $('#username').val(),
        userID: userID
    },(data) => {
        window.location.href = 'http://localhost:8888/sort.html'
    });
})

/* ////////////////////////////////////// */

$('#quit').click(function(){
    $('.modal').css('display', 'none').css('opacity', '0');
    $.get('/logout',{
    },(data) => {
    });
})

$('#visitor').click(function(){
    window.location.href = 'http://localhost:8888/sort.html'
})

/* ////////////////////////////////////// */
})