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
//boton de abrir listado de usuarios
manageUsersBtn.addEventListener('click',()=>{
    if (location.hash.startsWith('#manageUsers')){
        manageUsersBtn.classList.remove('active');
        location.hash='';
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("#"));
        window.history.replaceState({},document.title,clean_uri);
        currentHash = location.hash;
    } else {
        manageUsersBtn.classList.add('active');
        manageTeamBtn.classList.remove('active');
        currentListPage = 1;
        location.hash='#manageUsers';
    }
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
searchUsersBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    const inputTerm = searchUser.value;
    location.hash='';
    const newParams ='?searchAction=searchUser&searchTerm='+inputTerm;
    window.history.replaceState({},document.title, newParams);
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
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));
        window.history.replaceState({},document.title,clean_uri);
        location.hash='#manageTeam';}
        manageTeamBtn.classList.add('active');
        manageUsersBtn.classList.remove('active');
        currentListPage = 1;
});
//boton añadir jugador dentro de listado de jugadores
addPlayersBtn.addEventListener('click',()=>{
    location.hash='#addPlayer';
    //userDetailsTitle.textContent = 'Add user';
});
//boton buscar dentro de listado de jugadores
searchPlayersBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    const inputTerm = searchPlayer.value;
    location.hash='';
    const newParams ='?searchAction=searchPlayer&searchTerm='+inputTerm;
    window.history.replaceState({},document.title, newParams);
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
//cerrar modal cuando pulsas fuera del contenido
modalContainerBg.addEventListener('click',()=>{
   //ver los parametros de la URL
   const params = new URLSearchParams(document.location.search);
   const action = params.get('searchAction');

    //ver sobre qué seccion se ha pintado el modal para volver a añadir el hash correspondiente

    if (action === 'searchUser') {
        listLimit = 10;
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));
        window.history.replaceState({},document.title,clean_uri);
        location.hash = '#manageUsers';
    } else if (action === 'searchLeague') {
        listLimit = 10;
        const searchOrigin = params.get('searchOrigin');
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));
        window.history.replaceState({},document.title,clean_uri);
        if (searchOrigin === 'newPlayer') {
            location.hash = '#addPlayer';
        } else {
            location.hash = '#editPlayer='+searchOrigin;
        }
    } else if (action === 'searchPlayer') {
        listLimit = 10;
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));
        window.history.replaceState({},document.title,clean_uri);
        location.hash = '#manageTeam';
    } else if (action === 'searchTeam') {
        listLimit = 10;
        const searchOrigin = params.get('searchOrigin');
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));
        window.history.replaceState({},document.title,clean_uri);
        if (searchOrigin === 'newPlayer') {
            location.hash = '#addPlayer';
        } else {
            location.hash = '#editPlayer='+searchOrigin;
        }
    }
    


    // let params = new URLSearchParams(document.location.search);
    // console.log(params);
    // let searchLeagueForPlayer = params.get('searchLeagueForPlayer');
    // console.log(searchLeagueForPlayer);
    // let uri = window.location.toString();
    // let clean_uri = uri.substring(0,uri.indexOf("?"));
    
    //ocultamos el modal
    modalContainer.classList.add('cm-u-inactive');
    


    // if (manageUsersBtn.classList.contains('active') === true) {
    //     //console.log('estoy en manage users');
    //     listLimit = 10;
    //     location.hash='#manageUsers';
    // } else if (location.search.startsWith('?searchPlayer=')){ 
    //     listLimit = 10;
    //     location.hash='#manageTeam';
    // } 
    // window.history.replaceState({},document.title,clean_uri);
});
//boton buscar dentro modal
searchInModalBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    console.log("click in search in modal");
    //asignamos el name al input correcto para que busque en la seccion que procede
    if (location.search.startsWith('?searchAction=searchUser')){
        searchInModalInput.setAttribute('name','searchUser');
        const newParams ='?searchAction=searchUser&searchTerm='+searchInModalInput.value;
        window.history.replaceState({},document.title, newParams);
        window.dispatchEvent(new Event('popstate'));
    } else if (location.search.startsWith('?searchAction=searchPlayer')) {
        searchInModalInput.setAttribute('name','searchPlayer');
        const newParams ='?searchAction=searchPlayer&searchTerm='+searchInModalInput.value;
        window.history.replaceState({},document.title, newParams);
        window.dispatchEvent(new Event('popstate'));
    } else if (location.search.startsWith('?searchAction=searchLeague')) {
        const searchTerm = searchInModalInput.value;
        const params = new URLSearchParams(document.location.search);
        const playerID = params.get('searchOrigin');
        const newParams ='?searchAction=searchLeague&searchOrigin='+playerID+'&searchTerm='+searchTerm;
        window.history.replaceState({},document.title,newParams);
        //console.log('estoy buscando un equipo:'+inputTerm);
        window.dispatchEvent(new Event('popstate'));
    } else if (location.search.startsWith('?searchAction=searchTeam')) {
        const searchTerm = searchInModalInput.value;
        const params = new URLSearchParams(document.location.search);
        const playerID = params.get('searchOrigin');
        const leagueOrigin = params.get('leagueOrigin');
        const newParams ='?searchAction=searchTeam&searchOrigin='+playerID+'&leagueOrigin='+leagueOrigin+'&searchTerm='+searchTerm;
        window.history.replaceState({},document.title,newParams);
        //console.log('estoy buscando un equipo:'+inputTerm);
        window.dispatchEvent(new Event('popstate'));
    }
})
//boton buscar liga origen
playerLeagueOriginSearchBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    const originHash = location.hash;
    //recoger el ID del jugador que se está editando, si lo hay
    const [_,playerID] = location.hash.split('='); 
    let uri = window.location.toString();
    let clean_uri = uri.substring(0,uri.indexOf("#"));
    window.history.replaceState({},document.title,clean_uri);
    //recoger el value del input del listado de busqueda de ligas, meterlo en la URL como un parametro, 
    //recoger el player ID y meterlo como un parametro
    const searchTerm = playerLeagueOrigin.value;
    //si estamos añadiendo un jugador nuevo o si estamos editando un jugador existente añadir en el parametro
    let newParams;    
    if (originHash.startsWith('#addPlayer')) {
        newParams ='?searchAction=searchLeague&searchOrigin=newPlayer&searchTerm='+searchTerm;
    } else if (originHash.startsWith('#editPlayer=')) {
        newParams ='?searchAction=searchLeague&searchOrigin='+playerID+'&searchTerm='+searchTerm;
    }   
    window.history.pushState({},'',newParams);
    searchLeaguesPage();
    //window.dispatchEvent(new Event('popstate'));
    
});
//boton buscar club origen
playerOriginClubSearchBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    const originHash = location.hash;
     //recoger el ID del jugador que se está editando, si lo hay
    const [_,playerID] = location.hash.split('='); 
    let uri = window.location.toString();
    let clean_uri = uri.substring(0,uri.indexOf("#"));
    window.history.replaceState({},document.title,clean_uri);
    //recoger el nombre de la liga 
    let leagueOrigin = playerLeagueOrigin.getAttribute('data-id');
    //recoger el contenido del input del club para guardarlo com término de busqueda
    const searchTerm = playerOriginClub.value;
    //si estamos añadiendo un jugador nuevo o si estamos editando un jugador existente añadir en el parametro
    let newParams;    
    if (originHash.startsWith('#addPlayer')) {
        newParams ='?searchAction=searchTeam&searchOrigin=newPlayer&leagueOrigin='+leagueOrigin+'&searchTerm='+searchTerm;
    } else if (originHash.startsWith('#editPlayer=')) {
        newParams ='?searchAction=searchTeam&searchOrigin='+playerID+'&leagueOrigin='+leagueOrigin+'&searchTerm='+searchTerm;
    }   
    window.history.pushState({},'',newParams);
    searchTeamsPage();    
});


//navegación
const navigator = () => {
    if (location.hash.startsWith('#manageUsers')){
        manageUsersPage();
    } else if (location.hash.startsWith('#addUsers')){
        addUsersPage();
    } else if (location.hash.startsWith('#manageTeam')){
        manageTeamPage();
    } else if (location.hash.startsWith('#addPlayer')){
        addPlayersPage();
    } else if (location.hash.startsWith('#editUser=')){
        editUserPage();
    } else if (location.hash.startsWith('#editPlayer=')){
        editPlayerPage();
    } else if (location.search.startsWith('?searchAction=searchUser')){
        searchUsersPage();
    } else if (location.search.startsWith('?searchAction=searchPlayer')){
        searchPlayersPage();
    } else if (location.search.startsWith('?searchAction=searchLeague')){
        searchLeaguesPage();
    } else if (location.search.startsWith('?searchAction=searchTeam')){
        searchTeamsPage();           
    } else {  
        homePage();
    }    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
}
//pagina de inicio
const homePage = () => {
    // location.hash='';
    // let uri = window.location.toString();
    // let clean_uri = uri.substring(0,uri.indexOf("#"));
    // console.log("cleanurl:"+clean_uri);
    
    // window.history.replaceState({},document.title,"/main.html");
    usersListSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
}
//pagina listado usuarios
const manageUsersPage = () => {
    listLimit = 10;
    manageUsersBtn.classList.add('active');
    usersListSection.classList.remove('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
    playerDetailsSection.classList.add('cm-u-inactive');
    getUsers();
    cleanUserDetails();
}
//pagina añadir usuario
const addUsersPage = () => {
    cleanUserDetails();
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.remove('cm-u-inactive');
    userDetailsFormAddBtn.classList.remove('cm-u-inactive');
    userDetailsFormUpdateBtn.classList.add('cm-u-inactive');
    userDetailsFormDeleteBtn.classList.add('cm-u-inactive');
}
//pagina editar detalles usuario
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
//modal buscar usuarios
const searchUsersPage = () => {
    const params = new URLSearchParams(document.location.search);
    const searchTerm = params.get('searchTerm');
    manageUsersBtn.classList.add('active');
    usersListSection.classList.remove('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
    getUsers();
    filterUsers(searchTerm, {limit:5});
}
//modal confirmar borrar 
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
//pagina listado plantilla jugadores
const manageTeamPage = () => {
    listLimit = 10;
    manageTeamBtn.classList.add('active');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.remove('cm-u-inactive');
    playerDetailsSection.classList.add('cm-u-inactive');
    getPlayers();
    cleanPlayerDetails();
}
//pagina añadir jugador
const addPlayersPage = () => {
    cleanPlayerDetails();
    playerDetailsTitle.innerHTML = 'New Player';
    playersListSection.classList.add('cm-u-inactive');
    playerDetailsSection.classList.remove('cm-u-inactive');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playerDetailsFormAddBtn.classList.remove('cm-u-inactive');
    playerDetailsFormUpdateBtn.classList.add('cm-u-inactive');
    playerDetailsFormDeleteBtn.classList.add('cm-u-inactive');
}
//pagina editar detalles jugador
const editPlayerPage = () => {
    cleanPlayerDetails();
    playerDetailsTitle.innerHTML = 'Edit Player';    
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
//modal confirmar borrar jugador
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
//modal buscar jugadores
const searchPlayersPage = () => {
    let params = new URLSearchParams(document.location.search);
    let searchTerm = params.get('searchTerm');
    manageTeamBtn.classList.add('active');
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.remove('cm-u-inactive');
    getPlayers();
    filterPlayers(searchTerm, {limit:5});
}
//modal buscar ligas
const searchLeaguesPage = () => {
    //console.log('MODAL TEAMS');
    //cogemos los parametros de la URL
    const params = new URLSearchParams(document.location.search);
    const searchOrigin = params.get('searchOrigin');
    const searchTerm = params.get('searchTerm');
    //mostramos el modal
    usersListSection.classList.add('cm-u-inactive');
    userDetailsSection.classList.add('cm-u-inactive');
    playersListSection.classList.add('cm-u-inactive');
    //quitamos el error al campo de ligas, si lo tiene
    const errorSpan = document.querySelector('span.error');
    errorSpan.remove();
    playerLeagueOriginContainer.classList.remove('error');

    //si el input de la ficha del jugador tiene contenido lanzar el modal y setear el value del input de busqueda con el value del input de la ficha del jugador
    if (searchTerm === null || searchTerm.length === 0) {
        searchInModalInput.value = '';
        searchInModalInput.setAttribute('placeholder','Search Leagues');
        getLeagues();
    } else {
        //filtrar la busqueda por el value del input de la ficha del jugador
        filterLeagues(searchTerm);
        searchInModalInput.value = searchTerm;
    }
}
//modal buscar equipos
const searchTeamsPage = () => {
    console.log('MODAL TEAMS');
    //seteamos el listLimit en 5 para que no muestre más de 5 resultados
    listLimit = 5;
    //cogemos los parametros de la URL
    const params = new URLSearchParams(document.location.search);
    const searchOrigin = params.get('searchOrigin');
    const searchTerm = params.get('searchTerm');
    //cogemos el valor del input de la liga
    const inputLeague = playerLeagueOrigin.value;
    //cogemos el valor del input de equipos
    const inputTeam = playerOriginClub.value;
    //si el input de liga tiene contenido, hay que chequear que es una liga valida
    if (inputLeague.length > 0) {        
        (async function (league){
            console.log("busco ligas que contengan: "+league);
            resource = '/leagues?search='+league;
            origin = 'getTeams';
            const results = await filterData(resource, currentListPage, listLimit, 'id', 'asc')
            .then(function (response) {             
                if (response.count > 0) {
                    //si existe y es valida, entonces buscar los equipos que esta en esa liga 
                    //mostramos el modal
                    usersListSection.classList.add('cm-u-inactive');
                    userDetailsSection.classList.add('cm-u-inactive');
                    playersListSection.classList.add('cm-u-inactive'); 
                    const nameLiga = response.items[0].leagueName;
                    const idLiga = response.items[0].id;
                    console.log('la liga '+nameLiga+' con id '+idLiga+' es valida');
                    console.log(response);
                    //chequeamos si el input de equipo tiene contenido
                    //si esta relleno filtramos la busqueda de equipo
                    if (inputTeam.length > 0) {
                        searchInModalInput.value = searchTerm;
                        filterTeams(idLiga, searchTerm);
                    // si está vacío lanzamos un listado generico de todos los equipos dentro de la liga seleccionada
                    } else {
                        searchInModalInput.value = '';
                        searchInModalInput.setAttribute('placeholder','Search Teams');
                        getTeams(idLiga);
                    }
                } else {
                    //si existe y no es valida, hay que devolver un error para escoger una liga 
                    //console.warn('hay que rellenar el campo de liga primero con una liga valida');                    
                    //tengo que mirar si ya había un error puesto antes para que no meta dos veces el mismo error
                    const leagueLabel = playerLeagueOrigin.closest('.panel-field-long')
                    playerLeagueOriginContainer.classList.add('error');
                    const errorSpan = document.querySelector('span.error');
                    console.log(errorSpan);
                    if (errorSpan == null) {
                        const errorSpan = document.createElement('span');
                        errorSpan.classList.add('error');
                        errorSpan.innerHTML = 'You need to select a valid league first';
                        leagueLabel.appendChild(errorSpan);
                    } else {
                        errorSpan.innerHTML = 'You need to select a valid league first';
                    }
                    //y hay que setear el hash como estaba
                    const uri = window.location.toString();
                    const clean_uri = uri.substring(0,uri.indexOf("?"));                
                    window.history.replaceState({},document.title,clean_uri);
                    if (searchOrigin === 'newPlayer') {
                        history.pushState('', '', '#addPlayer');
                    } else {
                        history.pushState('', '', '#editPlayer='+searchOrigin);                        
                    }
                    
                }
            })
            .catch(function (error) {
                console.log('busque "'+resource+'" y me ha dado error');
                // console.warn(error);
                const leagueLabel = playerLeagueOrigin.closest('.panel-field-long')
                playerLeagueOriginContainer.classList.add('error');
                const errorSpan = document.querySelector('span.error');
                console.log(errorSpan);
                if (errorSpan == null) {
                    const errorSpan = document.createElement('span');
                    errorSpan.classList.add('error');
                    errorSpan.innerHTML = 'You need to select a valid league first';
                    leagueLabel.appendChild(errorSpan);
                } else {
                    errorSpan.innerHTML = 'You need to select a valid league first';
                }
                //y hay que setear el hash como estaba
                const uri = window.location.toString();
                const clean_uri = uri.substring(0,uri.indexOf("?"));                
                window.history.replaceState({},document.title,clean_uri);
                if (searchOrigin === 'newPlayer') {
                    history.pushState('', '', '#addPlayer');
                } else {
                    history.pushState('', '', '#editPlayer='+searchOrigin);                        
                }
            });
        })(inputLeague);
    //si el input de liga está vacio, hay que devover un error
    } else {        
        // console.warn('hay que rellenar el campo de liga primero con una liga');
        const leagueLabel = playerLeagueOrigin.closest('.panel-field-long')
        playerLeagueOriginContainer.classList.add('error');
        const errorSpan = document.querySelector('span.error');
        console.log(errorSpan);
        if (errorSpan == null) {
            const errorSpan = document.createElement('span');
            errorSpan.classList.add('error');
            errorSpan.innerHTML = 'You need to select a league first';
            leagueLabel.appendChild(errorSpan);
        } else {
            errorSpan.innerHTML = 'You need to select a league first';
        }
        

        //y hay que setear el hash como estaba
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?"));                
        window.history.replaceState({},document.title,clean_uri);
        if (searchOrigin === 'newPlayer') {
            history.pushState('', '', '#addPlayer');
        } else {
            history.pushState('', '', '#editPlayer='+searchOrigin);                        
        }
    }   
}



window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('popstate', navigator, false);