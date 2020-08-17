$('#navbar').load('navbar.html');  
$('#footer').load('footer.html');  

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://api-tawny-six.vercel.app';
const devices = JSON.parse(localStorage.getItem('devices')) || [];

const currentUser = localStorage.getItem('user');

console.log(currentUser);


if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
        // console.log(response);
        response.forEach((device) => {         
            // console.log("Inside devices");
            // console.log("Devices: "+device);
            $('#devices tbody').append(`<tr data-device-id=${device._id}>
                    <td>${device.user}</td>
                    <td>${device.name}</td>
            </tr>`);
        }); 

        // console.log("After for each");      

        $('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            $.get(`${API_URL}/devices/${deviceId}/device-history`)
            .then(response => {
                
                response.map(sensorData => {
                    $('#historyContent').append(`
                        <tr>
                            <td>${sensorData.ts}</td>
                            <td>${sensorData.temp}</td>
                            <td>${sensorData.loc.lat}</td>
                            <td>${sensorData.loc.lon}</td>
                        </tr>
                    `);
                });
                $('#historyModal').modal('show');
            // console.log(response);
            });
        });
})
.catch(error => {
        console.error(`Error: ${error}`);
    });
}else {
    const path = window.location.pathname;
    
    if (path !== '/login') {
        location.href = '/login';
    }
}

// $.get(`${API_URL}/devices`)
// .then(response => {
//     response.forEach(device => {
//         // console.log(response);
//         $('#devices tbody').append(`
//         <tr>
//             <td>${device.user}</td>
//             <td>${device.name}</td>
//         </tr>`
//         );
//     });
    
// })
// .catch(error => {
//     console.log(`Error: ${error}`);
// });

$('#add-device').on('click', function() {
    const user = $('#user').val();
    const name = $('#name').val();
    const sensorData = [];

    const body = {
        name,
        user,
        sensorData
    };

    $.post(`${API_URL}/devices`, body)
    .then(response => {
        location.href = '/';
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });

    // devices.push({ user, name });
    // localStorage.setItem('devices', JSON.stringify(devices));
    // location.href = 'device-list.html';
    // console.log('devices')
});

$('#send-command').on('click', function() {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
});

$('#register').on('click', function(){
    const username = $('#user').val();
    const password = $('#password').val();
    const conpassword = $('#conPassword').val();

    const isAdmin = true;

    $.post(`${API_URL}/registration`, { username, password, isAdmin})
    .then((response) =>{
        if (response.success) {
            localStorage.setItem('user', username);
            if(password == conpassword ){  
                localStorage.setItem('password', password);
                location.href = '/login';
            }else{
                $(document).ready(function(){
                        $("#message").append("<p class='alert alert-danger'>Passwords do not match!</p>");
                        });
                        console.log("Passwords do not match!");
                
            } 
            
        }else{
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
    
   
    // const users = JSON.parse(localStorage.getItem('users')) || [];

    // const exists = users.find(user => user.user === username);

    // console.log(users);
    // console.log(exists);

    // if(exists===undefined){
    //     //user not find
       
    //     if(password === conpassword){
            
    //         //register
    //         users.push({ user:username, password:password });
    //         localStorage.setItem('users', JSON.stringify(users));
           
    //         location.href = "/";
    //         console.log("Passwords match"); 

    //     }else{
            
    //         //password do not match
    //         $(document).ready(function(){
    //             $("#message").append("<p class='alert alert-danger'>password do not match</p>");
    //         });
    //         console.log("password do not match")

    //     }


    // }else{
    //     //user exists
    //     $(document).ready(function(){
    //         $("#message").append("<p class='alert alert-danger'>user already exists</p>");
    //     });
    //     console.log("user already exists");
    // }    

});


$('#login').on('click', function() {
    const username = $("#user").val();
    const password = $("#password").val();

    // const users = JSON.parse(localStorage.getItem('users')) || [];

    $.post(`${API_URL}/authenticate`, { username, password })
    .then((response) =>{
        if (response.success) {
            localStorage.setItem('user', username);
            localStorage.setItem('isAdmin', response.isAdmin);
            location.href = '/';
        }else{
            console.log(response);
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });

    // const exists = users.find(user => user.user === username);

    // if(exists===undefined){
        
    //     //name password incorrect
    //     $(document).ready(function(){
    //         $("#message").append("<p class='alert alert-danger'>User name or Password incorrect!</p>");
    //     });
    //     console.log("User name or Password incorrect!");

    // }else{
    //     if(password === exists.password){

    //         //login successful
    //         console.log("Password Match");

    //         const isAuthenticated = undefined;
    //         localStorage.setItem('isAuthenticated', "true");

    //         location.href = "/";

    //     }else{

    //         //password incorrect
    //         $(document).ready(function(){
    //             $("#message").append("<p class='alert alert-danger'>Password incorrect!</p>");
    //         });

    //         console.log("Password incorrect!");

    //     }
    // }           
   
});

const logout = () => {
    localStorage.removeItem('user');
    location.href = '/login';
}