//volver al inicio
logo.addEventListener('click', () =>{
    location.hash='';
    window.history.replaceState({},document.title,"/main.html");
})
//abrir notificaciones
notifsBtn.addEventListener('click',()=>{
    notifsContainer.classList.toggle('cm-u-inactive')
    notifsBtn.classList.toggle('active');
});
//cerrar modal cuando pulsas fuera del contenido
modalContainerBg.addEventListener('click',()=>{
    let uri = window.location.toString();
    let clean_uri = uri.substring(0,uri.indexOf("?")); 
    window.history.replaceState({},document.title,clean_uri);
    modalContainer.classList.add('cm-u-inactive');
});
//boton de abrir listado de usuarios
manageUsersBtn.addEventListener('click',()=>{
    if (location.hash.startsWith('#manageUsers')){
        manageUsersBtn.classList.remove('active');
        location.hash='';
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("#"));
        window.history.replaceState({},document.title,clean_uri);
    } else if ( manageUsersBtn.classList.contains('active')) {
        manageUsersBtn.classList.remove('active');
        navigator();
    } else {
        manageUsersBtn.classList.add('active');
        manageTeamBtn.classList.remove('active');
        location.hash='#manageUsers';}
});
//boton añadir usuario dentro de listado de usuarios
addUsersBtn.addEventListener('click',()=>{
    location.hash='#addUsers';
    userDetailsTitle.textContent = 'Add user';
});
//boton actualizar dentro de detalles de usuario
userDetailsFormUpdateBtn.addEventListener('click',()=>{
    const [_,userID] = location.hash.split('='); 
    updateUser(userID);
})
//boton borrar dentro de detalles de usuario
userDetailsFormDeleteBtn.addEventListener('click',()=>{
    confirmDeleteModal();    
})
//boton buscar dentro de listado de usuarios
searchUsersBtn.addEventListener('click',()=>{
    location.hash='';
})
//boton abrir listado de jugadores
manageTeamBtn.addEventListener('click',()=>{
    if (location.hash.startsWith('#manageTeam')){
        manageTeamBtn.classList.remove('active');
        manageUsersBtn.classList.remove('active');
        location.hash='';
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("#"));
        window.history.replaceState({},document.title,clean_uri);
    } else {
        manageTeamBtn.classList.add('active');
        manageUsersBtn.classList.remove('active');
        location.hash='#manageTeam';}
});
//boton añadir jugador dentro de listado de jugadores
addPlayersBtn.addEventListener('click',()=>{
    location.hash='#addPlayer';
    //userDetailsTitle.textContent = 'Add user';
});
//boton buscar dentro de listado de jugadores
searchPlayersBtn.addEventListener('click',()=>{
    location.hash='';
})
//boton añadir jugador dentro de detalles de jugadores
playerDetailsFormAddBtn.addEventListener('click',()=>{
    console.log("añadir jugador");
    addNewPlayer();
})
//boton actualizar dentro de detalles de jugadores
playerDetailsFormUpdateBtn.addEventListener('click',()=>{
    const [_,playerID] = location.hash.split('='); 
    updatePlayer(playerID);
})
//boton borrar dentro de detalles de jugadores
playerDetailsFormDeleteBtn.addEventListener('click',()=>{
    confirmDeletePlayerModal();    
})


//navegación
const navigator = () => {
    if (location.hash.startsWith('#manageUsers')){
        manageUsers();
    } else if (location.hash.startsWith('#addUsers')){
        addUsers();
    } else if (location.hash.startsWith('#manageTeam')){
        manageTeam();
    } else if (location.hash.startsWith('#addPlayer')){
        addPlayers();
    } else if (location.hash.startsWith('#editUser=')){
        editUserPage();
    } else if (location.hash.startsWith('#editPlayer=')){
        editPlayerPage();
    } else if (location.search.startsWith('?searchUser=')){
        searchUsers();
    } else if (location.search.startsWith('?searchPlayer=')){
        searchPlayers();
    } else {  
        homePage();
    }    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
}

const homePage = () => {
    // location.hash='';
    // let uri = window.location.toString();
    // let clean_uri = uri.substring(0,
    //     uri.indexOf("#"));
    // console.log("cleanurl:"+clean_uri);
    
    // window.history.replaceState({},document.title,"/main.html");
    usersListSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
}

const manageUsers = () => {
    manageUsersBtn.classList.add('active');
    usersListSection.classList.remove('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
    playerDetailsSection.classList.add('cm-u-inactive');
    getUsers();
    cleanUserDetails();
}

const addUsers = () => {
    cleanUserDetails();
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.remove('cm-u-inactive');
    userDetailsFormAddBtn.classList.remove('cm-u-inactive');
    userDetailsFormUpdateBtn.classList.add('cm-u-inactive');
    userDetailsFormDeleteBtn.classList.add('cm-u-inactive');
}

const editUserPage = () => {
    //console.log('edituser');
    cleanUserDetails();
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.remove('cm-u-inactive');
    userDetailsFormAddBtn.classList.add('cm-u-inactive');
    userDetailsFormUpdateBtn.classList.remove('cm-u-inactive');
    userDetailsFormDeleteBtn.classList.remove('cm-u-inactive');
    const [_,userID] = location.hash.split('='); 
    getUser(userID);
}

const searchUsers = () => {
    // console.log('SEARCH');
    // console.log(location.search);
    let uri = window.location.toString();
    let clean_uri = uri.substring(0,uri.indexOf("#")); 
    window.history.replaceState({},document.title,clean_uri);
    manageUsersBtn.classList.add('active');
    usersListSection.classList.remove('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
    const [_,searchTerm] = location.search.split('='); 
    // console.log('search:'+searchTerm);
    cleanUserDetails();
    getUsers();
    filterUsers(searchTerm);
}

const confirmDeleteModal = ()=>{
    const [_,userID] = location.hash.split('='); 
    modalSmall.innerHTML = '';
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.classList.add('cm-u-spacer-mb-bigger');
    const modalTitle = document.createElement('h3');
    modalTitle.classList.add('cm-u-text-black-cat');
    modalTitle.textContent = "You're about to delete a user";
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cm-o-button-cat--transparent');
    cancelBtn.setAttribute('id','cancelBtn')
    cancelBtn.textContent = 'Cancel';
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('cm-o-button-cat--primary');
    deleteBtn.setAttribute('id','deleteBtn')
    deleteBtn.textContent = "I'm fine, continue";

    modalFooter.appendChild(cancelBtn);
    modalFooter.appendChild(deleteBtn);
    modalBody.appendChild(modalTitle);
    modalSmall.appendChild(modalBody);
    modalSmall.appendChild(modalFooter);
    modalSmall.classList.remove('cm-u-inactive');
    modalContainer.classList.remove('cm-u-inactive');

    cancelBtn.addEventListener('click',()=>{
        modalContainer.classList.add('cm-u-inactive');
    })

    deleteBtn.addEventListener('click',()=>{
        deleteUser(userID);
        modalContainer.classList.add('cm-u-inactive');
    })
}

const manageTeam = () => {
    manageTeamBtn.classList.add('active');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.remove('cm-u-inactive');
    playerDetailsSection.classList.add('cm-u-inactive');
    getPlayers();
    cleanPlayerDetails();
}

const addPlayers = () => {
    cleanPlayerDetails();
    playersListSection.classList.add('cm-u-inactive');
    playerDetailsSection.classList.remove('cm-u-inactive');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playerDetailsFormAddBtn.classList.remove('cm-u-inactive');
    playerDetailsFormUpdateBtn.classList.add('cm-u-inactive');
    playerDetailsFormDeleteBtn.classList.add('cm-u-inactive');
}

const editPlayerPage = () => {
    cleanPlayerDetails();
    playersListSection.classList.add('cm-u-inactive');
    playerDetailsSection.classList.remove('cm-u-inactive');
    playerDetailsFormAddBtn.classList.add('cm-u-inactive');
    playerDetailsFormUpdateBtn.classList.remove('cm-u-inactive');
    playerDetailsFormDeleteBtn.classList.remove('cm-u-inactive');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    const [_,playerID] = location.hash.split('='); 
    getPlayer(playerID);
}

const confirmDeletePlayerModal = ()=>{
    const [_,playerID] = location.hash.split('='); 
    modalSmall.innerHTML = '';
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.classList.add('cm-u-spacer-mb-bigger');
    const modalTitle = document.createElement('h3');
    modalTitle.classList.add('cm-u-text-black-cat');
    modalTitle.textContent = "You're about to delete a user";
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cm-o-button-cat--transparent');
    cancelBtn.setAttribute('id','cancelBtn')
    cancelBtn.textContent = 'Cancel';
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('cm-o-button-cat--primary');
    deleteBtn.setAttribute('id','deleteBtn')
    deleteBtn.textContent = "I'm fine, continue";

    modalFooter.appendChild(cancelBtn);
    modalFooter.appendChild(deleteBtn);
    modalBody.appendChild(modalTitle);
    modalSmall.appendChild(modalBody);
    modalSmall.appendChild(modalFooter);
    modalSmall.classList.remove('cm-u-inactive');
    modalContainer.classList.remove('cm-u-inactive');

    cancelBtn.addEventListener('click',()=>{
        modalContainer.classList.add('cm-u-inactive');
    })

    deleteBtn.addEventListener('click',()=>{
        deletePlayer(playerID);
        modalContainer.classList.add('cm-u-inactive');
    })
}

const searchPlayers = () => {
    // console.log('SEARCH');
    // console.log(location.search);
    let uri = window.location.toString();
    let clean_uri = uri.substring(0,uri.indexOf("#")); 
    window.history.replaceState({},document.title,clean_uri);
    manageTeamBtn.classList.add('active');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.remove('cm-u-inactive');
    const [_,searchTerm] = location.search.split('='); 
    getPlayers();
    filterPlayers(searchTerm);
}

window.addEventListener('DOMContentLoaded', navigator, false);
 window.addEventListener('hashchange', navigator, false);