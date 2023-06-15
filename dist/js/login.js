$(document).ready(function () {
/* ////////////////////////////////////// */

    $('#login').click(function () {
    login();
})

function login() {
        window.location.href = 'http://localhost:8888/auth/google';
}


    fetch('/NickName')
        .then(response => response.text())
        .then(data => {
            loading()
            console.log("data =", data);
            if (data == "Edit nickname"){
            $('.modal').css('display', 'flex').css('opacity', '1');
            $('.loading').css('display', 'none');
    }
            else { 
                console.log("跳轉");
                window.location.href = 'http://localhost:8888/sort.html'; 
    }
})
        .catch(error => {
            // 處理錯誤
            console.error(error);
        });


    $.get('/UserInfo', {
    }, (data) => {
        if (data) {
            userID = data.id;
        }
    })

    function loading(){
        let loading = $('<div>').addClass('loading');
        $('body').append(loading);
        $.get('/loading', {
        }, (data) => {
            $('.loading').html(data);
        });
    }
/* ////////////////////////////////////// */

    $('#done').click(function () {
        $.get('/UserInfoChange', {
        userpic: $('#userpic').attr('src'),
        username: $('#username').val(),
        userID: userID
        }, (data) => {
            window.location.href = 'http://localhost:8888/sort.html'
    });
})

/* ////////////////////////////////////// */

    $('#quit').click(function () {
    $('.modal').css('display', 'none').css('opacity', '0');
        $.get('/logout', {
        }, (data) => {
    });
})

    $('#visitor').click(function () {
        window.location.href = 'http://localhost:8888/sort.html'
})

/* ////////////////////////////////////// */
})