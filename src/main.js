const app = {
    currentListPage: 1,
    listLimit: 10,
    listSortBy: 'id',
    listOrder: 'asc',
    searchTerm: '',
    init: () => {
        window.addEventListener('DOMContentLoaded', app.navigator);
        window.addEventListener('hashchange', app.navigator);
        window.addEventListener('popstate', app.navigator);
        app.navigationEvents();
        app.variousUtils();
    },
    navigator: () => {
        const page = document.body.id;
        //console.log('location.search: '+location.search);
        if (page === 'home') {
            app.homePage();
        } else if (page === 'login'){
            app.loginPage();
        } else if (page === 'notifications'){
            app.notificationsPage();
        } else if (page === 'manageUsers' && location.search == ''){
            app.manageUsersPage();
        } else if (page === 'manageUsers' && location.search.startsWith('?searchAction=searchUser')) {
            app.searchUsersModal();
        } else if (page === 'manageUser') {
            app.manageUserPage();
        } else if (page === 'manageTeam' && location.search == '') {
            app.manageTeamPage();
        } else if (page === 'manageTeam' && location.search.startsWith('?searchAction=searchPlayer')) {
            app.searchPlayersModal();
        } else if (page === 'managePlayer' && location.search.startsWith('?player=')){
            app.managePlayerPage();
        } else if (page === 'managePlayer' && location.search.startsWith('?searchAction=searchLeague')) {
            app.searchLeaguesPage();
        } else if (page === 'managePlayer' && location.search.startsWith('?searchAction=searchTeam')) {
            app.searchTeamsPage();
        }
    },
    //------------------------------------API & API FUNCTIONS ------------------------------------------
    api: axios.create({
        baseURL: 'https://64492e4ae7eb3378ca41f493.mockapi.io/api/v1/',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        params: {
        }
    }),
    //get generico
    getData: async(resource, page, limit, sortBy, order) => {
        const {data} = await app.api(resource,{params: { page: page, limit: limit, sortBy:sortBy, order:order } });
        return results = data;
    },
    //obtener usuarios
    getUsers: async ({page = app.currentListPage, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = 10;
        resource = '/users';
        const results = await app.getData(resource, page, limit, sortBy, order)
        .then(function (response) {
            app.listUsers(response,usersListContainer);
            app.paginateList(response, tablePaginationUsers);
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //obtener detalles usuario
    getUser: async (userID) => {
        resource = '/users/'+userID;
        const results = await app.getData(resource)
        .then(function (response) {
            //console.log(response);
            app.listUserDetails(response);
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //obtener jugadores
    getPlayers: async ({page = app.currentListPage, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = 10;
        resource = '/players';
        const results = await app.getData(resource, page, limit, sortBy, order)
        .then(function (response) {
            //console.log(response);
            app.listPlayers(response,playersListContainer);
            app.paginateList(response, tablePaginationPlayers);
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //obtener detalles jugador
    getPlayer: async (playerID) => {
        resource = '/players/'+playerID;
        const data = await app.getData(resource)
        .then(function (response) {
            console.log(response.id);
            app.listPlayerDetails(response);
            //leer la foto con el ID que corresponde al jugador
            (async ()=>{
                const readPlayerIdPicture = await app.getData('/players/'+response.id+'/idImages')
                .then(function(response){
                    app.listPlayerIdPicture(response);
                })
                .catch(function(error){
                    console.warn(error);
                });
            })();
        })
        .catch(function(error){
            console.log(error);
        });
    },
    //obtener ligas
    getLeagues: async ({page = app.currentListPage, limit = 5, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = limit;
        resource = '/leagues';
        origin = 'getLeagues';
        const results = await app.getData(resource, page, limit, sortBy, order)
        .then(function (response) {
            app.listOptionsSelector(response,searchResultsListContainer,origin);
            if (response.count > 0) {
                //console.log('teams:'+response.count);
                app.paginateList(response, tablePaginationSearchResults);
            }  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //obtener dato especifico
    getSpecificValueData: async (resource, id, field) => {
        resource = resource+id;
        field = field;
        const results = await app.getData(resource);
        return results;
    },
    //obtener equipos
    getTeams: async (leagueOfOrigin, {page = app.currentListPage, limit = 5, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = limit;
        resource = '/leagues/'+leagueOfOrigin+'/teams';
        origin = 'getTeams';
        const results = await app.getData(resource, page, app.listLimit, sortBy, order)
        .then(function (response) {
            app.listOptionsSelector(response,searchResultsListContainer,origin,leagueOfOrigin);
            if (response.count > 0) {
                // console.log('teams:'+response.count);
                // console.log(response);
                app.paginateList(response, tablePaginationSearchResults);
            }  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //obtener notificaciones
    getNotifications: async (user, {page = app.currentListPage, limit = 10, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = limit;
        resource = '/users/'+user+'/notifications';
        const results = await app.getData(resource, page, app.listLimit, sortBy, order)
        .then(function (response) {
            app.listNotifications(response,notificationsListContainer);
            app.paginateList(response, tablePaginationNotifications);
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //añadir nuevo usuario
    addNewUser: async () => {
        const newUserData = new FormData(userDetailsForm);
        const data = {};
        newUserData.forEach((value, key) => data[key] = value);
        const postNewUser = await app.api.post('/users', {
            userName:data.userName,
            userLastname:data.userLastname,
            userEmail:data.userEmail,
            userPwd:data.userPwd,
            userForm1read:data.userForm1read,
            userForm1write:data.userForm1write,
            userForm2read:data.userForm2read,
            userForm2write:data.userForm2write,
        })
        .then(function (response) {
            location.href = "manage-users.html";
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //añadir nuevo jugador
    addNewPlayer: async () => {
        const newPlayerData = new FormData(playerDetailsForm); 
        const data = {};
        newPlayerData.forEach((value, key) => data[key] = value);
        // console.log(data);        
        const postNewPlayer = await app.api.post('/players', {
            active:data.playerActive,
            userName:data.playerName,
            userLastname:data.playerLastname,
            userLastname2:data.playerLastname2,
            alias:data.playerAlias,
            country:data.playerCountry,
            passport:data.playerPassportNumber,
            dni:data.playerIdNumber,
            passportDate:data.playerPassportDate,
            dniDate:data.playerIdDate,
            socialSecurityNr:data.playerSocialSecurityNumber,
            sixMonthsResidency:data.playerResidencyToggle,
            clubFrom:data.playerOriginClub,
            leagueFrom:data.playerLeagueOrigin,
            position:data.playerNaturalPosition,
            height:data.playerHeight,
            weight:data.playerWeight,
            armsWingspan:data.playerWinspan,
            standingJump:data.playerStandingJump,
            runningJump:data.playerRunningJump,
            intermediary1Name:data.playerIntermediary1,
            contractStartDate:data.playerStartContractDate,
            contractEndDate:data.playerEndContractDate,
            contractType:data.playerContractType,
            transferCost:data.playerTransferCost,
            netSalary:data.playerSalary,
        })
        .then(function (response) {
            // console.log(response);
            const uploadInputItems = document.querySelectorAll('.fileUploadRow');
            console.log(uploadInputItems.length);

            uploadInputItems.forEach(uploadInputItem =>{
                const pictureInput = uploadInputItem.querySelector('.pictureInput');
                const inputImage = pictureInput.files[0];
                // console.log('input properties:')
                // console.log('input value:'+pictureInput.value);
                // console.log(inputImage);
                // console.log('input filenam+inputImage.name);'

                if (pictureInput.value !== ''){
                    console.log('subo imagen');
                    (async ()=>{
                        const postNewPlayerId = await app.api.post('/players/'+response.data.id+'/idImages',{
                            pictureName:inputImage.name,
                            id:response.data.id,
                            pictureURL:'https://loremflickr.com/640/480/'+inputImage.name,
                        })
                        .then(function(response){
                            console.log(response);
                            location.href="manage-team.html";
                        })
                        .catch(function(error){
                            console.warn(error);
                        });
                    })();
                } else {
                    console.log('no subo imagen porque el value esta vacío');
                    location.href="manage-team.html";
                }
            })  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //actualizar usuario existente
    updateUser: async (userID) => {
        const updatedUserData = new FormData(userDetailsForm);
        const data = {};
        updatedUserData.forEach((value, key) => data[key] = value);
        const updateUserData = await app.api.put('/users/'+userID, {
            userName:data.userName,
            userLastname:data.userLastname,
            userEmail:data.userEmail,
            userPwd:data.userPwd,
            userForm1read:data.userForm1read,
            userForm1write:data.userForm1write,
            userForm2read:data.userForm2read,
            userForm2write:data.userForm2write,
        })
        .then(function (response) {
            //console.log(response);
            location.href = "manage-users.html";
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //actualizar jugador existente
    updatePlayer: async (playerID) => {
        const updatedPlayerData = new FormData(playerDetailsForm);
        const data = {};
        
        updatedPlayerData.forEach((value, key) => data[key] = value);
        if (data.playerActive === undefined) { data.playerActive = 'false'};
        if (data.playerResidencyToggle === undefined){data.playerResidencyToggle = 'false'};
        
        const updatePlayerrData = await app.api.put('/players/'+playerID, {
            active:data.playerActive,
            userName:data.playerName,
            userLastname:data.playerLastname,
            userLastname2:data.playerLastname2,
            alias:data.playerAlias,
            country:data.playerCountry,
            passport:data.playerPassportNumber,
            dni:data.playerIdNumber,
            passportDate:data.playerPassportDate,
            dniDate:data.playerIdDate,
            socialSecurityNr:data.playerSocialSecurityNumber,
            sixMonthsResidency:data.playerResidencyToggle,
            clubFrom:data.clubOfOrigin,
            leagueFrom:data.leagueOfOrigin,
            position:data.playerNaturalPosition,
            height:data.playerHeight,
            weight:data.playerWeight,
            armsWingspan:data.playerWinspan,
            standingJump:data.playerStandingJump,
            runningJump:data.playerRunningJump,
            intermediary1Name:data.playerIntermediary1,
            contractStartDate:data.playerStartContractDate,
            contractEndDate:data.playerEndContractDate,
            contractType:data.playerContractType,
            transferCost:data.playerTransferCost,
            netSalary:data.playerSalary,
        })
        .then(function (response) {
            console.log('id del jugador: '+response.data.id);

            const uploadInputItems = document.querySelectorAll('.fileUploadRow');
            console.log(uploadInputItems.length);

            uploadInputItems.forEach(uploadInputItem =>{
                const pictureInput = uploadInputItem.querySelector('.pictureInput');
                const pictureInputID = pictureInput.getAttribute('data-pictureid');
                const pictureInputName = uploadInputItem.querySelector('.pictureInputName');
                const pictureInputNameText = pictureInputName.textContent;
                const inputImage = pictureInput.files[0];
                console.log('input properties:')
                console.log('input value:'+pictureInput.value);
                console.log('pictureName:'+pictureInputNameText);

                if (pictureInput.value !== ''){
                    console.log('actualizo imagen');
                    (async ()=>{
                        const postNewPlayerId = await app.api.put('/players/'+response.data.id+'/idImages/'+pictureInputID,{
                            pictureName:inputImage.name,
                            id:response.data.id,
                            pictureURL:'https://loremflickr.com/640/480/'+inputImage.name,
                        })
                        .then(function(response){
                            console.log(response);
                            //location.href="manage-team.html";
                        })
                        .catch(function(error){
                            console.warn(error);
                        });
                    })();
                } else {
                    if (pictureInputNameText === 'Click to select') {
                        console.log('aquí han borrado la imagen y debería borrarla de la bbdd');
                        //borrar imagen jugador
                        (async () => {    
                            const deleteImage = await app.api.delete('/players/'+response.data.id+'/idImages/'+pictureInputID)
                            .then(response => {
                                location.href="manage-team.html";
                            }).catch(e => {
                                console.log(e);
                            });        
                        })();
                    } else {
                        console.log('no subo imagen porque el value esta vacío y eso es que no ha cambiado desde que lo pinté');
                    }
                    
                }
            })
            location.href="manage-team.html"; 
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //borrar usuario
    deleteUser: async(userID) => {    
        const deleteUser = await api.delete('/users/'+userID)
        .then(response => {
            location.href = "manage-users.html";
        }).catch(e => {
            console.log(e);
        });
        
    },
    //borrar usuario
    deleteUser: async(userID) => {    
        const deleteUser = await app.api.delete('/users/'+userID)
        .then(response => {
            location.href = "manage-users.html";
        }).catch(e => {
            console.log(e);
        });        
    },
    //borrar jugador
    deletePlayer: async(playerID) => {    
        const deleteUser = await app.api.delete('/players/'+playerID)
        .then(response => {
            location.href="manage-team.html";
        }).catch(e => {
            console.log(e);
        });        
    },
    //filtrar genérico
    filterData: async(resource, page, limit, sortBy, order) => {
        const { data } = await app.api(resource,{params: { page: page, limit: limit, sortBy:sortBy, order:order } });
        return results = data;
    },
    //filtrar usuarios por busqueda
    filterUsers: async (searchTerm, {page = app.currentListPage, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = 5;
        resource = '/users?search='+searchTerm;
        const results = await app.filterData(resource, page, limit, sortBy, order)
        .then(function (response) {
            app.listSearchResults(response,searchResultsListContainer,searchTerm);
            if (response.count > 0) {
                app.paginateList(response, tablePaginationSearchResults);
            }  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //filtrar jugadores por busqueda
    filterPlayers: async (searchTerm, {page = 1, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = 5;
        resource = '/players?search='+searchTerm;
        const results = await app.getData(resource, page, limit, sortBy, order)
        .then(function (response) {
            //console.log(response);
            app.listSearchResults(response,searchResultsListContainer,searchTerm);
            if (response.count > 0) {
                app.paginateList(response, tablePaginationSearchResults);
            }  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //filtrar jugadores por busqueda
    filterPlayers: async (searchTerm, {page = 1, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        app.listLimit = 5;
        resource = '/players?search='+searchTerm;
        const results = await app.getData(resource, page, limit, sortBy, order)
        .then(function (response) {
            //console.log(response);
            app.listSearchResults(response,searchResultsListContainer,searchTerm);
            if (response.count > 0) {
                app.paginateList(response, tablePaginationSearchResults);
            }  
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //filtrar ligas por busqueda
    filterLeagues: async (searchTerm, {page = app.currentListPage, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        listLimit = limit;
        resource = '/leagues?search='+searchTerm;
        origin = 'getLeagues';
        const results = await app.filterData(resource, page, limit, sortBy, order)
        .then(function (response) {
            app.listOptionsSelector(response,searchResultsListContainer,origin);
            if (response.count > 0) {
                console.log('teams:'+response.count);
                app.paginateList(response, tablePaginationSearchResults);
            }
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //filtrar equipos por busqueda
    filterTeams: async (leagueOfOrigin,searchTerm, {page = app.currentListPage, limit = app.listLimit, sortBy = 'id', order = 'asc'} = {}) => {
        listLimit = limit;
        resource = '/leagues/'+leagueOfOrigin+'/teams?search='+searchTerm;
        origin = 'getTeams';
        const results = await app.filterData(resource, page, limit, sortBy, order)
        .then(function (response) {
            console.log('resultado filtrar equipos:');
            console.log(response);
            app.listOptionsSelector(response,searchResultsListContainer,origin,leagueOfOrigin);
            if (response.count > 0) {
                console.log('teams:'+response.count);
                app.paginateList(response, tablePaginationSearchResults);
            }
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //funcionalidad login
    passLogin: async () => {
        const loginData = new FormData(loginPageForm);
        const data = {};
        loginData.forEach((value, key) => data[key] = value);
        console.log(data);
        const searchTerm = data.loginEmail;
        const pwdForm = data.loginPwd;
        const resource = '/users?search='+searchTerm;
        const filterLogin = await app.filterData(resource)
        .then(function (response) {
            // console.log(response);
            if (response.count === 1) {
                // console.log(response.items[0].userEmail);
                // console.log(response.items[0].userPwd);
                if (searchTerm === response.items[0].userEmail && pwdForm === response.items[0].userPwd) {
                    //console.log('user y pwd son buenos');
                    //si está todo ok mando email, nombre y apellidos a LS
                    app.setActiveUser(response.items[0]);
                    //location.href = "main.html";
                } else if (searchTerm === response.items[0].userEmail && pwdForm !== response.items[0].userPwd)  {
                    //console.log('user bien pero pwd mal');
                    app.setInputFieldError(loginPwd,'Password is not right');
                }
            } else {
                app.setInputFieldError(loginEmail,'User does not exist');
            }
        })
        .catch(function (error) {
            console.warn(error);
        });

    },
    //------------------------------------------PAGES------------------------------------------
    loginPage: () => {

        //checkeo campos cuando pulso el boton de enviar
        loginPageSubmitBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            if (!loginEmail.checkValidity()) {
                app.setInputFieldError(loginEmail,loginEmail.validationMessage);
            } else {
                if (!loginPwd.checkValidity()) {
                    app.setInputFieldError(loginPwd,loginPwd.validationMessage);
                } else {
                    const errorEmailMsg = loginEmail.nextElementSibling;
                    if (errorEmailMsg) { 
                        loginEmail.parentElement.classList.remove('error');
                        errorEmailMsg.remove();}
                    const errorPwdMsg = loginPwd.nextElementSibling;
                    if (errorPwdMsg) { 
                        loginPwd.parentElement.classList.remove('error');
                        errorPwdMsg.remove();}
                    app.passLogin();
                }
            }
        });

        //quito el error al campo si lo tiene cuando vuelvo a hacer focus en el
        loginEmail.addEventListener('focus', event => {
            if (loginEmail.parentElement.classList.contains('error') === true) {
                const errorEmailMsg = loginEmail.nextElementSibling;
                loginEmail.parentElement.classList.remove('error');
                errorEmailMsg.remove();
            }
        });
        loginPwd.addEventListener('focus', event => {
            if (loginPwd.parentElement.classList.contains('error') === true) {
                const errorPwdMsg = loginPwd.nextElementSibling;
                loginPwd.parentElement.classList.remove('error');
                errorPwdMsg.remove();
            }
        });

    },
    homePage: () => {
        console.log('estoy en la home');
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
    },
    notificationsPage: () => {
        console.log('estoy en la página de notificaciones');
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
        const activeUser = app.activeUserList();
        const activeUserId = activeUser.activeUser.id;
        app.listLimit = 10;
        notifsBtn.classList.add('active');
        manageUsersBtn.classList.remove('active');
        manageTeamBtn.classList.remove('active');
        app.getNotifications(activeUserId);

    },
    //pagina manage users
    manageUsersPage: () => {
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
        app.listLimit = 10;
        manageUsersBtn.classList.add('active');
        manageTeamBtn.classList.remove('active');
        // manageUsersBtn.classList.add('active');
        // usersListSection.classList.remove('cm-u-inactive');
        // userDetailsSection.classList.add('cm-u-inactive');
        // playersListSection.classList.add('cm-u-inactive');
        // playerDetailsSection.classList.add('cm-u-inactive');
        app.getUsers();
        //app.cleanUserDetails();

        //boton buscar dentro de listado de usuarios
        searchUsersBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            const inputTerm = searchUser.value;
            const newParams ='?searchAction=searchUser&searchTerm='+inputTerm;
            window.history.replaceState({},document.title, newParams);
            app.searchUsersModal();
        });

        //boton añadir usuario dentro de listado de usuarios
        addUsersBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            location.href="manage-user.html?user=new";
        });
    },
    //pagina añadir/editar usuario
    manageUserPage: () => {
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
        manageUsersBtn.classList.add('active');
        if (location.search.startsWith('?user=new')) {
            userDetailsTitle.textContent = 'Add new user';
            userDetailsFormUpdateBtn.classList.add('cm-u-inactive');
            userDetailsFormDeleteBtn.classList.add('cm-u-inactive');
            //pulsar el boton de añadir
            userDetailsFormAddBtn.addEventListener('click',()=>{
                app.addNewUser();
            });
        } else {
            app.cleanUserDetails();
            const params = new URLSearchParams(document.location.search);
            const userID = params.get('user');
            app.getUser(userID);
            userDetailsFormAddBtn.classList.add('cm-u-inactive');
            userDetailsCancelBtn.classList.add('cm-u-inactive');
        }
        //boton cancelar
        userDetailsCancelBtn.addEventListener('click',()=>{
            window.history.back();
        })
        //boton actualizar dentro de detalles de usuario
        userDetailsFormUpdateBtn.addEventListener('click',()=>{
            const params = new URLSearchParams(document.location.search);
            const userID = params.get('user');
            app.updateUser(userID);
        })
        //boton borrar dentro de detalles de usuario
        userDetailsFormDeleteBtn.addEventListener('click',()=>{
            app.confirmDeleteModal();    
        })
        
    },
    //modal buscar usuarios sobre manage users
    searchUsersModal: () => {
        const params = new URLSearchParams(document.location.search);
        const searchTerm = params.get('searchTerm');
        app.filterUsers(searchTerm, {limit:5});
    },
    //modal confirmar borrar
    confirmDeleteModal: ()=>{
        const params = new URLSearchParams(document.location.search);
        const userID = params.get('user');
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
            app.deleteUser(userID);
            modalContainer.classList.add('cm-u-inactive');
        })
    },
    //pagina listado plantilla jugadores
    manageTeamPage: () => {
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
        listLimit = 10;
        manageTeamBtn.classList.add('active');
        // usersListSection.classList.add('cm-u-inactive');
        // userDetailsSection.classList.add('cm-u-inactive');
        // playersListSection.classList.remove('cm-u-inactive');
        // playerDetailsSection.classList.add('cm-u-inactive');
        app.getPlayers();
        // cleanPlayerDetails();

        //boton buscar dentro de listado de jugadores
        searchPlayersBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            const inputTerm = searchPlayer.value;
            const newParams ='?searchAction=searchPlayer&searchTerm='+inputTerm;
            window.history.replaceState({},document.title, newParams);
            app.searchPlayersModal();
        })

        //boton añadir jugador dentro de listado de jugadores
        addPlayersBtn.addEventListener('click',()=>{
            location.href="manage-player.html?player=new";
        });
    },
    //pagina añadir/editar usuario
    managePlayerPage: () => {
        app.setActiveUserOnMenu();
        app.setActiveUserNotificationsBubble();
        app.cleanPlayerDetails();
        manageTeamBtn.classList.add('active');
        if (location.search.startsWith('?player=new')) {
            console.log('estoy añadiendo un jugador nuevo');
            playerDetailsTitle.innerHTML = 'Add new Player';
            //añadir al menos una fila para subir imagenes de ID
            app.addIdImageRow();
            playerDetailsFormAddBtn.classList.remove('cm-u-inactive');
            playerDetailsFormUpdateBtn.classList.add('cm-u-inactive');
            playerDetailsFormDeleteBtn.classList.add('cm-u-inactive');
            playerDetailsCancelBtn.classList.remove('cm-u-inactive');
            //pulsar el boton de añadir
            playerDetailsFormAddBtn.addEventListener('click',()=>{
                app.addNewPlayer();
            });
            //remake upload inputs
            app.manageFileInputs();
        } else {
            console.log('estoy editando un jugador que ya existe');
            app.cleanPlayerDetails();
            playerDetailsTitle.innerHTML = 'Edit Player';    
            playerDetailsSection.classList.remove('cm-u-inactive');
            playerDetailsFormAddBtn.classList.add('cm-u-inactive');
            playerDetailsFormUpdateBtn.classList.remove('cm-u-inactive');
            playerDetailsFormDeleteBtn.classList.remove('cm-u-inactive');
            playerDetailsCancelBtn.classList.add('cm-u-inactive');
            const params = new URLSearchParams(document.location.search);
            const playerID = params.get('player');
            app.getPlayer(playerID);
            //boton borrar jugador
            playerDetailsFormDeleteBtn.addEventListener('click',()=>{
                app.confirmDeletePlayerModal();    
            })
            //boton actualizar dentro de detalles de jugadores
            playerDetailsFormUpdateBtn.addEventListener('click',()=>{
                app.updatePlayer(playerID);
            })
        }
        //boton cancelar
        playerDetailsCancelBtn.addEventListener('click',()=>{
            window.history.back();
        })
        //boton buscar liga origen
        playerLeagueOriginSearchBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            const params = new URLSearchParams(document.location.search);
            const originPlayer = params.get('player');
            //recoger el value del input del listado de busqueda de ligas, meterlo en la URL como un parametro, 
            //recoger el player ID y meterlo como un parametro
            const searchTerm = playerLeagueOrigin.value;
            //si estamos añadiendo un jugador nuevo o si estamos editando un jugador existente añadir en el parametro
            let newParams;    
            if (originPlayer === 'new') {
                newParams ='?searchAction=searchLeague&searchOrigin=newPlayer&searchTerm='+searchTerm;
            } else {
                newParams ='?searchAction=searchLeague&searchOrigin='+originPlayer+'&searchTerm='+searchTerm;
            }   
            window.history.pushState({},'',newParams);
            app.searchLeaguesPage();
            //window.dispatchEvent(new Event('popstate'));            
        });        
        //boton buscar club origen
        playerOriginClubSearchBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            //recoger el ID del jugador que se está editando, si lo hay
            const params = new URLSearchParams(document.location.search);
            const originPlayer = params.get('player');
            // let uri = window.location.toString();
            // let clean_uri = uri.substring(0,uri.indexOf("#"));
            // window.history.replaceState({},document.title,clean_uri);
            //recoger el nombre de la liga 
            let leagueOrigin = playerLeagueOrigin.getAttribute('data-id');
            //recoger el contenido del input del club para guardarlo com término de busqueda
            const searchTerm = playerOriginClub.value;
            //si estamos añadiendo un jugador nuevo o si estamos editando un jugador existente añadir en el parametro
            let newParams;    
            if (originPlayer === 'new') {
                newParams ='?searchAction=searchTeam&searchOrigin=newPlayer&leagueOrigin='+leagueOrigin+'&searchTerm='+searchTerm;
            } else {
                newParams ='?searchAction=searchTeam&searchOrigin='+originPlayer+'&leagueOrigin='+leagueOrigin+'&searchTerm='+searchTerm;
            }   
            window.history.pushState({},'',newParams);
            app.searchTeamsPage();    
        });
        
    },
    //modal buscar jugadores sobre manage team
    searchPlayersModal: () => {
        let params = new URLSearchParams(document.location.search);
        let searchTerm = params.get('searchTerm');
        // manageTeamBtn.classList.add('active');
        // usersListSection.classList.add('cm-u-inactive');
        // userDetailsSection.classList.add('cm-u-inactive');
        // playersListSection.classList.remove('cm-u-inactive');
        app.getPlayers();
        app.filterPlayers(searchTerm, {limit:5});
    },
    //modal buscar ligas jugadores
    searchLeaguesPage: () => {
        //console.log('MODAL TEAMS');
        const playerLeagueOriginContainer = playerLeagueOrigin.closest('.cm-c-field-icon');
        //cogemos los parametros de la URL
        const params = new URLSearchParams(document.location.search);
        const searchOrigin = params.get('searchOrigin');
        const searchTerm = params.get('searchTerm');
        //mostramos el modal
        // usersListSection.classList.add('cm-u-inactive');
        // userDetailsSection.classList.add('cm-u-inactive');
        // playersListSection.classList.add('cm-u-inactive');

        //quitamos el error al campo de ligas, si lo tiene
        const errorSpan = document.querySelector('span.error');
        if (errorSpan) {
            errorSpan.remove();
            playerLeagueOriginContainer.classList.remove('error');
        }
    
        //si el input de la ficha del jugador tiene contenido lanzar el modal y setear el value del input de busqueda con el value del input de la ficha del jugador
        if (searchTerm === null || searchTerm.length === 0) {
            searchInModalInput.value = '';
            searchInModalInput.setAttribute('placeholder','Search Leagues');
            app.getLeagues();
        } else {
            //filtrar la busqueda por el value del input de la ficha del jugador
            app.filterLeagues(searchTerm);
            searchInModalInput.value = searchTerm;
        }
    },
    //modal buscar equipos jugadores
    searchTeamsPage: () => {
        console.log('MODAL TEAMS');
        const playerOriginClubContainer = playerOriginClub.closest('.cm-c-field-icon');
        const playerLeagueOriginContainer = playerLeagueOrigin.closest('.cm-c-field-icon');
        //seteamos el listLimit en 5 para que no muestre más de 5 resultados
        app.listLimit = 5;
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
                const results = await app.filterData(resource, app.currentListPage, app.listLimit, 'id', 'asc')
                .then(function (response) {             
                    if (response.count > 0) {
                        console.log(response);
                        const nameLiga = response.items[0].leagueName;
                        const idLiga = response.items[0].id;
                        console.log('la liga '+nameLiga+' con id '+idLiga+' es valida');
                        console.log(response);
                        //chequeamos si el input de equipo tiene contenido
                        //si esta relleno filtramos la busqueda de equipo
                        if (inputTeam.length > 0) {
                            searchInModalInput.value = searchTerm;
                            app.filterTeams(idLiga, searchTerm);
                        // si está vacío lanzamos un listado generico de todos los equipos dentro de la liga seleccionada
                        } else {
                            searchInModalInput.value = '';
                            searchInModalInput.setAttribute('placeholder','Search Teams');
                            app.getTeams(idLiga);
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
                            history.pushState('', '', '?player=new');
                        } else {
                            history.pushState('', '', '?player='+searchOrigin);                         
                        }
                        
                    }
                })
                .catch(function (error) {
                    console.log('busque "'+resource+'" y me ha dado error de conexion');
                    console.warn(error);
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
                        history.pushState('', '', '?player=new');
                    } else {
                        history.pushState('', '', '?player='+searchOrigin);                         
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
                history.pushState('', '', '?player=new');
            } else {
                history.pushState('', '', '?player='+searchOrigin);                        
            }
        }   
    },
    //modal confirmar borrar jugador
    confirmDeletePlayerModal: ()=>{
        const params = new URLSearchParams(document.location.search);
        const playerID = params.get('player');
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
            app.deletePlayer(playerID);
            modalContainer.classList.add('cm-u-inactive');
        })
    },
    //------------------------------------------EVENTOS NAVEGACION ESTRUCTURALES------------------------------------------
    navigationEvents:() => {
        const page = document.body.id;
        if (page !== 'login') {
            //boton notificaciones
            notifsBtn.addEventListener('click', ()=>{
                location.href="notifications.html";
            });
            //boton listado de usuarios
            manageUsersBtn.addEventListener('click',()=>{
                const page = document.body.id;
                if (page === 'manageUsers') {
                    window.history.back();
                } else {
                    location.href="manage-users.html";
                    app.currentListPage = 1;
                }
            });
            //boton abrir listado de jugadores
            manageTeamBtn.addEventListener('click',()=>{
                const page = document.body.id;
                if (page === 'manageTeam'){
                    window.history.back();
                } else {
                    manageTeamBtn.classList.add('active');
                    manageUsersBtn.classList.remove('active');
                    location.href="manage-team.html";
                    app.currentListPage = 1;
            }
            });
            //llamar a sortButton desde los botones que ya estaban precreados en el html
            sortBtns.forEach(btn => {
                app.sortButton(btn, sortBtns);
            })
            //boton buscar dentro modal
            searchInModalBtn.addEventListener('click',(event)=>{
                event.preventDefault();
                console.log("click in search in modal");
                //asignamos el name al input correcto para que busque en la seccion que procede
                if (location.search.startsWith('?searchAction=searchUser')){
                    searchInModalInput.setAttribute('name','searchUser');
                    const newParams ='?searchAction=searchUser&searchTerm='+searchInModalInput.value;
                    window.history.replaceState({},document.title, newParams);
                    // window.dispatchEvent(new Event('popstate'));
                    app.searchUsersModal();
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
            });
            //cerrar modal cuando pulsas fuera del contenido
            modalContainerBg.addEventListener('click',()=>{
            const params = new URLSearchParams(document.location.search);
            const action = params.get('searchAction');

                //ver sobre qué seccion se ha pintado el modal para volver a añadir el hash correspondiente
                if (action === 'searchUser') {
                    app.listLimit = 10;
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?"));
                    window.history.replaceState({},document.title,clean_uri);
                    window.dispatchEvent(new Event('popstate'));
                } else if (action === 'searchLeague') {
                    app.listLimit = 10;
                    const searchOrigin = params.get('searchOrigin');
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?"));
                    window.history.replaceState({},document.title,clean_uri);
                    if (searchOrigin === 'newPlayer') {
                        const newParams ='?player=new';
                        window.history.replaceState({},document.title,newParams);
                    } else {
                        const newParams ='?player='+searchOrigin;
                        window.history.replaceState({},document.title,newParams);
                    }
                } else if (action === 'searchPlayer') {
                    app.listLimit = 10;
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?"));
                    window.history.replaceState({},document.title,clean_uri);
                    window.dispatchEvent(new Event('popstate'));
                } else if (action === 'searchTeam') {
                    app.listLimit = 10;
                    const searchOrigin = params.get('searchOrigin');
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?"));
                    window.history.replaceState({},document.title,clean_uri);
                    if (searchOrigin === 'newPlayer') {
                        const newParams ='?player=new';
                        window.history.replaceState({},document.title,newParams);
                    } else {
                        const newParams ='?player='+searchOrigin;
                        window.history.replaceState({},document.title,newParams);
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
        }
        
    },
    //--------------------------------------------------------UTILS--------------------------------------------------------
    //activeUserList
    activeUserList: () =>{
        //esta función solo mira si existe un usuario activo listado en LS. Si lo hay, lo devuelve como un objeto JS, si no lo hay, devuelve un objeto vacío.
        let activeUsers;
        const item = JSON.parse(localStorage.getItem('active_user'));   
        if(item) {
            activeUsers = item;
        } else {
            activeUsers = {};
        }
        return activeUsers;
    },
    setActiveUser: (user) =>{ 
        console.log('lo que recibo en setActiveUser');
        // console.log(user.userUsername);
        //miramos si el usuario activo está de hecho como usuario activo ya, si lo está, simplemente pasamos a la siguiente pantalla, si no lo está, borramos el que haya y ponemos el introducido como activo.    
        //nos guardamos en una variable el objeto activeUserList
        const activeUser = app.activeUserList();
        console.log('activeUser lenght:');
        console.log(Object.keys(activeUser).length);
        //console.log(activeUser.activeUser.userUsername);
        //si el usuario que ha pasado el form de login ya está en el el listado de usuario activo, entonces simplemente navegamos a la siguiente página
        if (Object.keys(activeUser).length > 0 && user.userUsername === activeUser.activeUser.userUsername) {
            console.log('ese usuario ya estaba activo asi que solo continuo a la siguiente pantalla');
            location.href = "main.html"
        } else {
        //si el usuario no está hay que poner el que mandamos
            console.log('ese usuario no estaba activo así que lo pongo como activo')
            //primero me lo cargo
            activeUser['activeUser'] = undefined;
            //despues lo activo con la informacion que yo quiero
            activeUser['activeUser'] = {
                id: user.id,
                userUsername: user.userUsername,
                userEmail: user.userEmail,
                userLastname: user.userLastname
            };
            location.href = "main.html"
        }
        //escribir en el llistado de usuarios activos en LS la nueva información
        localStorage.setItem('active_user', JSON.stringify(activeUser));
        console.log(localStorage);
    },
    setActiveUserOnMenu: () => {
        //escribir el usuario activo en el menu superior y habilitar el menu de logout
        const activeUser = app.activeUserList();

        if (Object.keys(activeUser).length > 0) {
            activeUserBtn.innerHTML = activeUser.activeUser.userUsername;
            //desplegar overlay menu usuario
            activeUserBtn.addEventListener('click',()=>{
                activeUserBtn.classList.toggle('active');
                activeUserMenu.classList.toggle('cm-u-inactive');
            });
            //logout usuario activo si click en logout btn
            activeUserLogoutBtn.addEventListener('click', app.logoutActiveUser);
        } else {
            // console.log('no hay usuario activo');            
            location.href = "index.html";
        }
    },
    //colocar el buble de notificaciones sin leer
    setActiveUserNotificationsBubble: () => {
        userUnreadNotifs.classList.add('cm-u-inactive');
        const activeUser = app.activeUserList();
        const activeUserId = activeUser.activeUser.id;
        //miro las notificaciones que existen para ese usuario
        (async()=>{
            resource = '/users/'+activeUserId+'/notifications';
            const results = await app.getData(resource)
            .then(function (response) {
                //me guardo las notificaciones
                const notifs = Object.values(response.items);
                let unreadNotifs = 0;
                //para cada una, si no está leida, le sumo 1 al contador
                notifs.forEach((notif) => {
                    if (!notif.read) {
                        unreadNotifs++;
                    }
                });
                //pinto las notifiaciones no leidas en el bubble
                if (unreadNotifs > 0) {
                    userUnreadNotifs.classList.remove('cm-u-inactive');
                    userUnreadNotifs.innerHTML = unreadNotifs;
                }
            })
            .catch(function (error) {
                console.warn(error);
            });
        })();
    },
    //logoutUser
    logoutActiveUser: ()=>{
        localStorage.removeItem('active_user');
        location.href = "index.html"
    },
    //listar notificaciones
    listNotifications: (notifications,container,{clean = true} = {}) => {
        const truncLenght = 80;
        if(clean) {
            container.innerHTML = '';
        }
        //crear notificacion
        notifications.items.forEach(notification => {
            // console.log(notification);
            const notifCompleteText = notification.description;
            let notifDescrText;
            if (notifCompleteText.length >= truncLenght) {
                const truncatedDescription = notifCompleteText.substring(0,truncLenght);
                notifDescrText = truncatedDescription+' (..click to expand)';
            } else {
                notifDescrText = notifCompleteText;
            }
            
            const notifRow = document.createElement('div');
            notifRow.classList.add('cm-l-tabledata__row');
            if (!notification.read) notifRow.classList.add('cm-l-tabledata__row--noRead');
            notifRow.setAttribute('data-notifId',notification.id);
            const levelCell = document.createElement('div');
            levelCell.classList.add('tablecell-short');
            levelCell.classList.add('cm-u-centerText');
            const levelButton = document.createElement('button');
            const levelIconBtn = document.createElement('span');
            levelIconBtn.classList.add('material-symbols-outlined');
            if (notification.level <= 33) {
                levelButton.classList.add('cm-o-icon-roundel-small--primary');
                levelIconBtn.textContent = 'low_priority';
            }else if (notification.level > 33 && notification.level <= 66 ) {
                levelButton.classList.add('cm-o-icon-roundel-small--warning');
                levelIconBtn.textContent = 'priority';
            } else {
                levelButton.classList.add('cm-o-icon-roundel-small--danger');
                levelIconBtn.textContent = 'priority_high';
            }
            levelButton.appendChild(levelIconBtn);
            levelCell.appendChild(levelButton);
            const markReadCell = document.createElement('div');
            markReadCell.classList.add('tablecell-short');
            markReadCell.classList.add('cm-u-centerText');
            const markReadBtn = document.createElement('button');
            if (!notification.read) {
                markReadBtn.classList.add('cm-o-icon-button-small--primary');
                markReadBtn.setAttribute('data-readState','false')
            } else {
                markReadBtn.classList.add('cm-o-icon-button-small--success');
                markReadBtn.setAttribute('data-readState','true')
            }
            markReadBtn.setAttribute('id','markReadNotifBtn');
            const markReadBtnSpan = document.createElement('span');
            markReadBtnSpan.classList.add('material-symbols-outlined');
            markReadBtnSpan.textContent = 'mark_email_read';
            markReadBtn.appendChild(markReadBtnSpan);
            markReadCell.appendChild(markReadBtn);
            const subjectCell = document.createElement('div');
            subjectCell.classList.add('tablecell-medium');
            subjectCell.textContent = notification.subject;
            const dateCell = document.createElement('div');
            dateCell.classList.add('tablecell-medium');
            dateCell.textContent = notification.date;
            const descriptionCell = document.createElement('div');
            descriptionCell.classList.add('tablecell-long');
            descriptionCell.textContent = notifDescrText;
            descriptionCell.setAttribute('id','notifDescriptionText');
            descriptionCell.setAttribute('data-completeDescription',notifCompleteText)
            const validateCell = document.createElement('div');
            validateCell.classList.add('tablecell-short');
            validateCell.classList.add('cm-u-centerText');
            const validateBtn = document.createElement('button');
            if (!notification.validated){
                validateBtn.classList.add('cm-o-icon-button-small--primary');
                validateBtn.setAttribute('data-valState','false');
            } else {
                validateBtn.classList.add('cm-o-icon-button-small--success');
                validateBtn.setAttribute('data-valState','true');
            }
            validateBtn.setAttribute('id','setValNotifBtn');
            const validateBtnSpan = document.createElement('span');
            validateBtnSpan.classList.add('material-symbols-outlined');
            validateBtnSpan.textContent = 'done';
            validateBtn.appendChild(validateBtnSpan);
            validateCell.appendChild(validateBtn);

            notifRow.appendChild(levelCell);
            notifRow.appendChild(markReadCell);
            notifRow.appendChild(subjectCell);
            notifRow.appendChild(dateCell);
            notifRow.appendChild(descriptionCell);
            notifRow.appendChild(validateCell);
            container.appendChild(notifRow);
        });
        //expandir texto notificacion
        const notifDescriptionTexts = document.querySelectorAll('#notifDescriptionText');
        notifDescriptionTexts.forEach(description => {
            description.addEventListener('click',()=>{
                description.textContent = description.getAttribute('data-completeDescription');
            });
        });
        //vars comunes para marcar leidas o validadas
        const activeUser = app.activeUserList();
        const activeUserId = activeUser.activeUser.id;

        //marcar notificacion leida
        const markReadNotifBtns = document.querySelectorAll('#markReadNotifBtn');
        markReadNotifBtns.forEach(markReadNotifBtn => {
            markReadNotifBtn.addEventListener('click',()=>{     
                const markReadBtnNotifParent = markReadNotifBtn.parentNode.parentNode;
                const notifID = markReadBtnNotifParent.getAttribute('data-notifid');           
                const currentReadState = markReadNotifBtn.getAttribute('data-readstate');
                let newReadState;
                (currentReadState === 'false') ? newReadState = true : newReadState = false;

                (async(userID,notifId) => {
                    const updateReadState = await app.api.put('/users/'+activeUserId+'/notifications/'+notifID, {
                        read:newReadState,
                    })
                    .then(function (response) {
                        // console.log(response);
                        app.setActiveUserNotificationsBubble();
                        if (newReadState === false) {
                            markReadBtnNotifParent.classList.add('cm-l-tabledata__row--noRead');
                            markReadNotifBtn.setAttribute('data-readstate','false');
                            markReadNotifBtn.classList.remove('cm-o-icon-button-small--success');
                            markReadNotifBtn.classList.add('cm-o-icon-button-small--primary');

                        } else {
                            markReadBtnNotifParent.classList.remove('cm-l-tabledata__row--noRead');
                            markReadNotifBtn.setAttribute('data-readstate','true');
                            markReadNotifBtn.classList.add('cm-o-icon-button-small--success');
                            markReadNotifBtn.classList.remove('cm-o-icon-button-small--primary');
                        }
                    })
                    .catch(function (error) {
                        console.warn(error);
                    });
                })();
            })
        });

        //marcar notificacion validada
        const markValNotifBtns = document.querySelectorAll('#setValNotifBtn');
        markValNotifBtns.forEach(markValNotifBtn => {
            markValNotifBtn.addEventListener('click',()=>{
                const markValBtnNotifParent = markValNotifBtn.parentNode.parentNode;
                const notifID = markValBtnNotifParent.getAttribute('data-notifid');    
                const currentValState = markValNotifBtn.getAttribute('data-valstate');
                let newValState;
                (currentValState === 'false') ? newValState = true : newValState = false;

                (async(userID,notifId) => {
                    const updateValState = await app.api.put('/users/'+activeUserId+'/notifications/'+notifID, {
                        validated:newValState,
                    })
                    .then(function (response) {
                        console.log(response);
                        app.setActiveUserNotificationsBubble();
                        if (newValState === false) {
                            markValNotifBtn.setAttribute('data-valstate','false');
                            markValNotifBtn.classList.remove('cm-o-icon-button-small--success');
                            markValNotifBtn.classList.add('cm-o-icon-button-small--primary');

                        } else {
                            markValNotifBtn.setAttribute('data-valstate','true');
                            markValNotifBtn.classList.add('cm-o-icon-button-small--success');
                            markValNotifBtn.classList.remove('cm-o-icon-button-small--primary');
                        }
                    })
                    .catch(function (error) {
                        console.warn(error);
                    });
                })();
            })
        })
    },
    //listar usuarios en pagina de usuarios
    listUsers: (users,container,{clean = true} = {}) => {
        if(clean) {
            container.innerHTML = '';
        }
        users.items.forEach(user => {
            const personContainer = document.createElement('div');
            personContainer.classList.add('cm-l-tabledata__row');
            const personName = document.createElement('div');
            personName.classList.add('tablecell-medium');
            personName.textContent = user.userName;
            const personLastname = document.createElement('div');
            personLastname.classList.add('tablecell-medium');
            personLastname.textContent = user.userLastname;
            const personEmail = document.createElement('div');
            personEmail.classList.add('tablecell-long');
            personEmail.textContent = user.userEmail;
            const personLastTime = document.createElement('div');
            personLastTime.classList.add('tablecell-medium');
            personLastTime.textContent = user.userLastTime.slice(0,10);
            const personEditBtnContainer = document.createElement('div');
            personEditBtnContainer.classList.add('tablecell-short');
            personEditBtnContainer.classList.add('cm-u-centerText');
            const personEditBtn = document.createElement('button');
            personEditBtn.classList.add('cm-o-icon-button-small--primary');
            personEditBtn.setAttribute('id','editUserDetailsBtn');
            personEditBtn.setAttribute('data-userId',user.id);
            const personEditBtnIcon = document.createElement('span');
            personEditBtnIcon.classList.add('material-symbols-outlined');
            personEditBtnIcon.textContent = 'border_color';
            personEditBtn.appendChild(personEditBtnIcon);
            personEditBtnContainer.appendChild(personEditBtn);
    
            personContainer.appendChild(personName);
            personContainer.appendChild(personLastname);
            personContainer.appendChild(personEmail);
            personContainer.appendChild(personLastTime);
            personContainer.appendChild(personEditBtnContainer);
            container.appendChild(personContainer);
        });
        const editUserBtns = document.querySelectorAll('#editUserDetailsBtn');
    
        editUserBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                location.href='manage-user.html?user='+btn.getAttribute('data-userId');
            })
        })
    },
    //listar detalles de usuario
    listUserDetails: (user) => {
        userDetailsTitle.textContent = 'Edit user details';
        userDetailsFieldName.setAttribute('value',user.userName);
        userDetailsFieldLastname.setAttribute('value',user.userLastname);
        userDetailsFieldEmail.setAttribute('value',user.userEmail);
        if (user.userForm1read === 'on'){userDetailsFieldForm1read.checked = true;}
        if (user.userForm1write === 'on'){userDetailsFieldForm1write.checked = true;}
        if (user.userForm2read === 'on'){userDetailsFieldForm2read.checked = true;}
        if (user.userForm2write === 'on'){userDetailsFieldForm2write.checked = true;}
    },
    //listar plantilla de jugadores
    listPlayers: (players,container,{clean = true}={}) => {
        if(clean) {
            container.innerHTML = '';
        }

        players.items.forEach(player => {
            const playerContainer = document.createElement('div');
            playerContainer.classList.add('cm-l-tabledata__row');
            const playerName = document.createElement('div');
            playerName.classList.add('tablecell-medium');
            playerName.textContent = player.userName;
            const playerLastname = document.createElement('div');
            playerLastname.classList.add('tablecell-medium');
            playerLastname.textContent = player.userLastname;
            const playerAlias = document.createElement('div');
            playerAlias.classList.add('tablecell-medium');
            playerAlias.textContent = player.alias;
            const playerCountry = document.createElement('div');
            playerCountry.classList.add('tablecell-medium');
            playerCountry.textContent = player.country;
            const playerDorsal = document.createElement('div');
            playerDorsal.classList.add('tablecell-short');
            playerDorsal.classList.add('cm-u-centerText');
            playerDorsal.textContent = player.dorsal;
            const playerPosition = document.createElement('div');
            playerPosition.classList.add('tablecell-medium');
            playerPosition.textContent = player.position;
            const playerActive = document.createElement('div');
            playerActive.classList.add('tablecell-short');
            playerActive.classList.add('cm-u-centerText');
            const playerActiveIconContainer = document.createElement('div');
            const playerActiveIconState = document.createElement('span');
            playerActiveIconState.classList.add('material-symbols-outlined');
            if(player.active === 'on') {
                playerActiveIconState.textContent = 'check';
                playerActiveIconContainer.classList.add('cm-o-icon-button-small--success');
            } else {
                playerActiveIconState.textContent = 'block';
                playerActiveIconContainer.classList.add('cm-o-icon-button-small--error');
            }
            playerActiveIconContainer.appendChild(playerActiveIconState);
            playerActive.appendChild(playerActiveIconContainer);
            
            const playerEditBtnContainer = document.createElement('div');
            playerEditBtnContainer.classList.add('tablecell-short');
            playerEditBtnContainer.classList.add('cm-u-centerText');
            const playerEditBtn = document.createElement('button');
            playerEditBtn.classList.add('cm-o-icon-button-small--primary');
            playerEditBtn.setAttribute('id','editPlayerDetailsBtn');
            playerEditBtn.setAttribute('data-playerId',player.id);
            const playerEditBtnIcon = document.createElement('span');
            playerEditBtnIcon.classList.add('material-symbols-outlined');
            playerEditBtnIcon.textContent = 'border_color';        
            playerEditBtn.appendChild(playerEditBtnIcon);
            playerEditBtnContainer.appendChild(playerEditBtn);

            playerContainer.appendChild(playerName);
            playerContainer.appendChild(playerLastname);
            playerContainer.appendChild(playerAlias);
            playerContainer.appendChild(playerCountry);
            playerContainer.appendChild(playerDorsal);
            playerContainer.appendChild(playerPosition);
            playerContainer.appendChild(playerActive);
            playerContainer.appendChild(playerEditBtnContainer);
            container.appendChild(playerContainer);
        })

        const editPlayerBtns = document.querySelectorAll('#editPlayerDetailsBtn');

        editPlayerBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                // console.log('edit player:'+btn.getAttribute('data-playerid'));
                location.href="manage-player.html?player="+btn.getAttribute('data-playerid');
            })
        })
    },
    //listar detalles jugador
    listPlayerDetails: (player) => {
        if (player.active === 'on'){playerActive.checked = true;} else if (player.active === false){playerActive.checked = false;}
        playerDetailsTitle.textContent = 'Edit player';
        playerName.setAttribute('value',player.userName);
        playerLastname.setAttribute('value',player.userLastname);
        playerLastname2.setAttribute('value',player.userLastname2);
        playerAlias.setAttribute('value',player.alias);
        playerCountry.setAttribute('value',player.country);
        playerPassportNumber.setAttribute('value',player.passport);
        playerPassportDate.setAttribute('value',player.passportDate);
        playerIdNumber.setAttribute('value',player.dni);
        playerIdDate.setAttribute('value',player.dniDate);
        playerSocialSecurityNumber.setAttribute('value',player.socialSecurityNr);
        if (player.sixMonthsResidency === 'on'){playerResidencyToggle.checked = true;}else if (player.sixMonthsResidency === false){playerResidencyToggle.checked = false;}
        playerOriginClub.setAttribute('value',player.clubFrom);
        playerLeagueOrigin.setAttribute('value',player.leagueFrom);
        playerLeagueOrigin.setAttribute('data-id',player.leagueFromID);
        playerNaturalPosition.value = player.position;
        playerHeight.setAttribute('value',player.height);
        playerWeight.setAttribute('value',player.weight);
        playerWinspan.setAttribute('value',player.armsWingspan);
        playerStandingJump.setAttribute('value',player.standingJump);
        playerRunningJump.setAttribute('value',player.runningJump);
        playerIntermediary1.setAttribute('value',player.intermediary1Name);
        playerStartContractDate.setAttribute('value',player.contractStartDate);
        playerEndContractDate.setAttribute('value',player.contractEndDate);
        playerContractType.value = player.contractType;
        playerTransferCost.setAttribute('value',player.transferCost);
        playerSalary.setAttribute('value',player.netSalary);
    },
    //listar detalles de imagen de jugador
    listPlayerIdPicture: (data) => {
        for(let i=1; i <= data.length; i++) {
            app.addIdImageRow(i);
            const fileUploadRow = document.querySelector('#pictureInputRow'+i);
            const pictureInput = fileUploadRow.querySelector('.pictureInput');
            pictureInput.setAttribute('data-pictureID', data[i-1].pictureId);
            const playerIDPictureName = fileUploadRow.querySelector('.pictureInputName');
            playerIDPictureName.innerHTML = data[i-1].pictureName;
            console.log('pinto una imageRow con el data-id:'+data[i-1].pictureId);
        }

        //remake upload inputs
        app.manageFileInputs();
    },
    //listar resultados de busqueda en modal
    listSearchResults: (results,container,searchTerm,{clean = true} = {}) => {
        searchTerm = searchTerm;
        if(clean) {
            container.innerHTML = '';
        }
    
        if (results.count === 0) {
            container.innerHTML = 'No results. Try again.';
        }
    
        if (searchResultsListHeaderContainer.childNodes.length === 0){
            //create Header
            const headerContainer = document.createElement('div');
            headerContainer.classList.add('cm-l-tabledata__header');
            const firstCell = document.createElement('div');
            firstCell.classList.add('tablecell-long');    
            const firstBtn = document.createElement('button');
            firstBtn.classList.add('cm-o-sortButton');
            firstBtn.setAttribute('data-field','userName');
            firstBtn.textContent = 'Name ';
            const firstCellBtnDescIcon = document.createElement('span');
            firstCellBtnDescIcon.classList.add('material-symbols-outlined');
            firstCellBtnDescIcon.classList.add('sortIcon--desc');
            firstCellBtnDescIcon.classList.add('cm-u-inactive');
            firstCellBtnDescIcon.textContent = 'expand_more';
            const firstCellBtnAscIcon = document.createElement('span');
            firstCellBtnAscIcon.classList.add('material-symbols-outlined');
            firstCellBtnAscIcon.classList.add('sortIcon--asc');
            firstCellBtnAscIcon.classList.add('cm-u-inactive');
            firstCellBtnAscIcon.textContent = 'expand_less';
            firstBtn.appendChild(firstCellBtnDescIcon);
            firstBtn.appendChild(firstCellBtnAscIcon);
            firstCell.appendChild(firstBtn);
            const secondCell = document.createElement('div');
            secondCell.classList.add('tablecell-long');
            const secondBtn = document.createElement('button');
            secondBtn.classList.add('cm-o-sortButton');
            secondBtn.setAttribute('data-field','userLastname');
            secondBtn.textContent = 'Lastname ';
            const secondCellBtnDescIcon = document.createElement('span');
            secondCellBtnDescIcon.classList.add('material-symbols-outlined');
            secondCellBtnDescIcon.classList.add('sortIcon--desc');
            secondCellBtnDescIcon.classList.add('cm-u-inactive');
            secondCellBtnDescIcon.textContent = 'expand_more';
            const secondCellBtnAscIcon = document.createElement('span');
            secondCellBtnAscIcon.classList.add('material-symbols-outlined');
            secondCellBtnAscIcon.classList.add('sortIcon--asc');
            secondCellBtnAscIcon.classList.add('cm-u-inactive');
            secondCellBtnAscIcon.textContent = 'expand_less';
            secondBtn.appendChild(secondCellBtnDescIcon);
            secondBtn.appendChild(secondCellBtnAscIcon);
            secondCell.appendChild(secondBtn);
            const thirdCell = document.createElement('div');
            thirdCell.classList.add('tablecell-medium');
            headerContainer.appendChild(firstCell);
            headerContainer.appendChild(secondCell);
            headerContainer.appendChild(thirdCell);
            searchResultsListHeaderContainer.appendChild(headerContainer);
            //llamar a la función de reordenar listado para los botones del header
            const searchResultsSortBtns = searchResultsListHeaderContainer.querySelectorAll('.cm-o-sortButton');
            searchResultsSortBtns.forEach(searchResultsSortBtn => {
                app.sortButton(searchResultsSortBtn, searchResultsSortBtns);
            })
        } 
        
        results.items.forEach(result => {
            const resultRow = document.createElement('div');
            resultRow.classList.add('cm-l-tabledata__row');
            const cellName = document.createElement('div');
            cellName.classList.add('tablecell-long');
            cellName.textContent = result.userName;
            const cellLastname = document.createElement('div');
            cellLastname.classList.add('tablecell-long');
            cellLastname.textContent = result.userLastname;
            const btnCell = document.createElement('div');
            btnCell.classList.add('tablecell-medium');
            btnCell.classList.add('cm-u-textRight');
            const editUserBtn = document.createElement('button');
            editUserBtn.classList.add('cm-o-button-cat-small--primary');
            editUserBtn.setAttribute('id','editUserDetailsBtn');
            editUserBtn.setAttribute('data-userId',result.id);
            editUserBtn.textContent = "Edit";
            btnCell.appendChild(editUserBtn);
    
            resultRow.appendChild(cellName);
            resultRow.appendChild(cellLastname);
            resultRow.appendChild(btnCell);
            container.appendChild(resultRow);
            
        });
        modalBig.classList.remove('cm-u-inactive');
        modalContainer.classList.remove('cm-u-inactive');
        searchInModalInput.value = searchTerm;
    
        const editUserBtns = document.querySelectorAll('#editUserDetailsBtn');
    
        //ver los parametros de la URL
       const params = new URLSearchParams(document.location.search);
       const action = params.get('searchAction');
       console.log('action: '+action);
    
        if (action === 'searchUser'){
            editUserBtns.forEach(btn => {
                btn.addEventListener('click', event => {
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?")); 
                    window.history.replaceState({},document.title,clean_uri);
                    modalContainer.classList.add('cm-u-inactive');
                    location.href='manage-user.html?user='+btn.getAttribute('data-userId');
                })
            })
        } else if (action === 'searchPlayer') {
            editUserBtns.forEach(btn => {
                btn.addEventListener('click', event => {
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?")); 
                    window.history.replaceState({},document.title,clean_uri);
                    modalContainer.classList.add('cm-u-inactive');
                    location.href='manage-player.html?player='+btn.getAttribute('data-userId');
                })
            })
        } 
    },
    //listar ligas/equipos en modal
    listOptionsSelector: (results,container,origin,resourceExtraID, {clean = true} = {}) => {
        console.log('ListOptionsSelector origin:'+origin);
        searchResultsListHeaderContainer.innerHTML = '';
        if(clean) { container.innerHTML = '';}
        if (results.count === 0) {container.innerHTML = 'No results. Try again.';}    
        const isHeaderEmpty = searchResultsListHeaderContainer.hasChildNodes();
        
        if (origin === 'getTeams'){  
            console.log("entro en getTeams");
            console.log("la cabecera está vacía: "+isHeaderEmpty);      
            modalBigListTitle.textContent = 'Choose Team';

            //create Header
            if (!isHeaderEmpty) {           
                const headerContainer = document.createElement('div');
                headerContainer.classList.add('cm-l-tabledata__header');
                const firstCell = document.createElement('div');
                firstCell.classList.add('tablecell-long');    
                const firstBtn = document.createElement('button');
                firstBtn.classList.add('cm-o-sortButton');
                firstBtn.setAttribute('data-field','teamName');
                firstBtn.textContent = 'Name';
                const firstCellBtnDescIcon = document.createElement('span');
                firstCellBtnDescIcon.classList.add('material-symbols-outlined');
                firstCellBtnDescIcon.classList.add('sortIcon--desc');
                firstCellBtnDescIcon.classList.add('cm-u-inactive');
                firstCellBtnDescIcon.textContent = 'expand_more';
                const firstCellBtnAscIcon = document.createElement('span');
                firstCellBtnAscIcon.classList.add('material-symbols-outlined');
                firstCellBtnAscIcon.classList.add('sortIcon--asc');
                firstCellBtnAscIcon.classList.add('cm-u-inactive');
                firstCellBtnAscIcon.textContent = 'expand_less';
                firstBtn.appendChild(firstCellBtnDescIcon);
                firstBtn.appendChild(firstCellBtnAscIcon);
                firstCell.appendChild(firstBtn);
                const secondCell = document.createElement('div');
                secondCell.classList.add('tablecell-long');
                const secondBtn = document.createElement('button');
                secondBtn.classList.add('cm-o-sortButton');
                secondBtn.setAttribute('data-field','teamLeague');
                secondBtn.textContent = 'League ';
                const secondCellBtnDescIcon = document.createElement('span');
                secondCellBtnDescIcon.classList.add('material-symbols-outlined');
                secondCellBtnDescIcon.classList.add('sortIcon--desc');
                secondCellBtnDescIcon.classList.add('cm-u-inactive');
                secondCellBtnDescIcon.textContent = 'expand_more';
                const secondCellBtnAscIcon = document.createElement('span');
                secondCellBtnAscIcon.classList.add('material-symbols-outlined');
                secondCellBtnAscIcon.classList.add('sortIcon--asc');
                secondCellBtnAscIcon.classList.add('cm-u-inactive');
                secondCellBtnAscIcon.textContent = 'expand_less';
                secondBtn.appendChild(secondCellBtnDescIcon);
                secondBtn.appendChild(secondCellBtnAscIcon);
                secondCell.appendChild(secondBtn);
                const thirdCell = document.createElement('div');
                thirdCell.classList.add('tablecell-long');       
                const thirdBtn = document.createElement('button');
                thirdBtn.classList.add('cm-o-sortButton');
                thirdBtn.setAttribute('data-field','teamCountry');
                thirdBtn.textContent = 'Country ';
                const thirdCellBtnDescIcon = document.createElement('span');
                thirdCellBtnDescIcon.classList.add('material-symbols-outlined');
                thirdCellBtnDescIcon.classList.add('sortIcon--desc');
                thirdCellBtnDescIcon.classList.add('cm-u-inactive');
                thirdCellBtnDescIcon.textContent = 'expand_more';
                const thirdCellBtnAscIcon = document.createElement('span');
                thirdCellBtnAscIcon.classList.add('material-symbols-outlined');
                thirdCellBtnAscIcon.classList.add('sortIcon--asc');
                thirdCellBtnAscIcon.classList.add('cm-u-inactive');
                thirdCellBtnAscIcon.textContent = 'expand_less';
                thirdBtn.appendChild(thirdCellBtnDescIcon);
                thirdBtn.appendChild(thirdCellBtnAscIcon);
                thirdCell.appendChild(thirdBtn);
                const fourthCell = document.createElement('div');
                fourthCell.classList.add('tablecell-medium');
                headerContainer.appendChild(firstCell);
                headerContainer.appendChild(secondCell);
                headerContainer.appendChild(thirdCell);
                headerContainer.appendChild(fourthCell);
                searchResultsListHeaderContainer.appendChild(headerContainer);
                // llamar a la función de reordenar listado para los botones del header
                const searchResultsSortBtns = searchResultsListHeaderContainer.querySelectorAll('.cm-o-sortButton');
                searchResultsSortBtns.forEach(searchResultsSortBtn => {
                    app.sortButton(searchResultsSortBtn, searchResultsSortBtns);
                })
            } 

            results.items.forEach(result => {
                const resultRow = document.createElement('div');
                resultRow.classList.add('cm-l-tabledata__row');
                
                const cellName = document.createElement('div');
                cellName.classList.add('tablecell-long');
                cellName.textContent = result.teamName;

                const cellTeamLeague = document.createElement('div');
                cellTeamLeague.classList.add('tablecell-long');
                cellTeamLeague.textContent = result.teamLeague.leagueName;

                const cellTeamCountry = document.createElement('div');
                cellTeamCountry.classList.add('tablecell-long');
                cellTeamCountry.textContent = result.teamLeague.leagueCountry;

                const btnCell = document.createElement('div');
                btnCell.classList.add('tablecell-medium');
                btnCell.classList.add('cm-u-textRight');

                const editUserBtn = document.createElement('button');
                editUserBtn.classList.add('cm-o-button-cat-small--primary');
                editUserBtn.classList.add('chooseOptionBtn');
                editUserBtn.setAttribute('data-teamId',result.id);
                editUserBtn.textContent = "Choose";
                btnCell.appendChild(editUserBtn);
        
                resultRow.appendChild(cellName);
                resultRow.appendChild(cellTeamLeague);
                resultRow.appendChild(cellTeamCountry);
                resultRow.appendChild(btnCell);
                container.appendChild(resultRow);
                
            });
        } else if (origin === 'getLeagues') {
            modalBigListTitle.textContent = 'Choose League of origin';

            //create Header
            if (!isHeaderEmpty) {
                //console.log('header empty, hay que crearlo');
                const headerContainer = document.createElement('div');
                headerContainer.classList.add('cm-l-tabledata__header');

                const firstCell = document.createElement('div');
                firstCell.classList.add('tablecell-long');    
                const firstBtn = document.createElement('button');
                firstBtn.classList.add('cm-o-sortButton');
                firstBtn.setAttribute('data-field','leagueName');
                firstBtn.textContent = 'Name of League ';

                const firstCellBtnDescIcon = document.createElement('span');
                firstCellBtnDescIcon.classList.add('material-symbols-outlined');
                firstCellBtnDescIcon.classList.add('sortIcon--desc');
                firstCellBtnDescIcon.classList.add('cm-u-inactive');
                firstCellBtnDescIcon.textContent = 'expand_more';
                const firstCellBtnAscIcon = document.createElement('span');
                firstCellBtnAscIcon.classList.add('material-symbols-outlined');
                firstCellBtnAscIcon.classList.add('sortIcon--asc');
                firstCellBtnAscIcon.classList.add('cm-u-inactive');
                firstCellBtnAscIcon.textContent = 'expand_less';
                firstBtn.appendChild(firstCellBtnDescIcon);
                firstBtn.appendChild(firstCellBtnAscIcon);
                firstCell.appendChild(firstBtn);

                const secondCell = document.createElement('div');
                secondCell.classList.add('tablecell-long');
                const secondBtn = document.createElement('button');
                secondBtn.classList.add('cm-o-sortButton');
                secondBtn.setAttribute('data-field','leagueCountry');
                secondBtn.textContent = 'Country ';
                const secondCellBtnDescIcon = document.createElement('span');
                secondCellBtnDescIcon.classList.add('material-symbols-outlined');
                secondCellBtnDescIcon.classList.add('sortIcon--desc');
                secondCellBtnDescIcon.classList.add('cm-u-inactive');
                secondCellBtnDescIcon.textContent = 'expand_more';
                const secondCellBtnAscIcon = document.createElement('span');
                secondCellBtnAscIcon.classList.add('material-symbols-outlined');
                secondCellBtnAscIcon.classList.add('sortIcon--asc');
                secondCellBtnAscIcon.classList.add('cm-u-inactive');
                secondCellBtnAscIcon.textContent = 'expand_less';
                secondBtn.appendChild(secondCellBtnDescIcon);
                secondBtn.appendChild(secondCellBtnAscIcon);
                secondCell.appendChild(secondBtn);

                const thirdCell = document.createElement('div');
                thirdCell.classList.add('tablecell-medium');

                headerContainer.appendChild(firstCell);
                headerContainer.appendChild(secondCell);
                headerContainer.appendChild(thirdCell);
                searchResultsListHeaderContainer.appendChild(headerContainer);
                // llamar a la función de reordenar listado para los botones del header
                const searchResultsSortBtns = searchResultsListHeaderContainer.querySelectorAll('.cm-o-sortButton');
                searchResultsSortBtns.forEach(searchResultsSortBtn => {
                    app.sortButton(searchResultsSortBtn, searchResultsSortBtns);
                })
            }
            results.items.forEach(result => {
                const resultRow = document.createElement('div');
                resultRow.classList.add('cm-l-tabledata__row');
                
                const cellName = document.createElement('div');
                cellName.classList.add('tablecell-long');
                cellName.textContent = result.leagueName;

                const cellTeamLeague = document.createElement('div');
                cellTeamLeague.classList.add('tablecell-long');
                cellTeamLeague.textContent = result.leagueCountry;

                const btnCell = document.createElement('div');
                btnCell.classList.add('tablecell-medium');
                btnCell.classList.add('cm-u-textRight');

                const editUserBtn = document.createElement('button');
                editUserBtn.classList.add('cm-o-button-cat-small--primary');
                editUserBtn.classList.add('chooseOptionBtn');
                editUserBtn.setAttribute('data-leagueID',result.id);
                editUserBtn.textContent = "Choose";
                btnCell.appendChild(editUserBtn);
        
                resultRow.appendChild(cellName);
                resultRow.appendChild(cellTeamLeague);
                resultRow.appendChild(btnCell);
                container.appendChild(resultRow);            
            });
        }
        
        modalBig.classList.remove('cm-u-inactive');
        modalContainer.classList.remove('cm-u-inactive');

        const chooseOptionBtns = document.querySelectorAll('.chooseOptionBtn');

        if (location.search.startsWith('?searchAction=searchTeam')){
            chooseOptionBtns.forEach(btn => {
                btn.addEventListener('click', event => {
                    const teamID = btn.getAttribute('data-teamID');
                    let params = new URLSearchParams(document.location.search);
                    let searchOrigin = params.get('searchOrigin');
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?")); 
                    //asignamos el la liga escogida al input del listado
                    app.inputSetValue(playerOriginClub,'/leagues/'+resourceExtraID+'/teams/',teamID,'teamName');

                    window.history.replaceState({},document.title,clean_uri);
                    //colocamos el hash adecuado para volver de la modal si es un jugador nuevo o estamos editando uno existente
                    if (searchOrigin === 'newPlayer') {
                        //location.hash='#addPlayer';
                        history.pushState('', '', '?player=new');
                    } else {
                        //location.hash='#editPlayer='+searchOrigin;
                        history.pushState('', '', '?player='+searchOrigin);
                    }
                    //ocultamos el modal
                    modalContainer.classList.add('cm-u-inactive');
                });
            })
        } else if (location.search.startsWith('?searchAction=searchLeague')) {
            chooseOptionBtns.forEach(btn => {
                btn.addEventListener('click', event => {
                    const leagueID = btn.getAttribute('data-leagueID');
                    let params = new URLSearchParams(document.location.search);
                    let searchOrigin = params.get('searchOrigin');
                    let uri = window.location.toString();
                    let clean_uri = uri.substring(0,uri.indexOf("?")); 
                    window.history.replaceState({},document.title,clean_uri);
                    //colocamos el hash adecuado para volver de la modal si es un jugador nuevo o estamos editando uno existente
                    if (searchOrigin === 'newPlayer') {
                        //location.hash='#addPlayer';
                        history.pushState('', '', '?player=new');
                    } else {
                        //location.hash='#editPlayer='+searchOrigin;
                        history.pushState('', '', '?player='+searchOrigin);
                    }
                    //asignamos el la liga escogida al input del listado
                    app.inputSetValue(playerLeagueOrigin,'/leagues/',leagueID,'leagueName');
                    //ocultamos el modal
                    modalContainer.classList.add('cm-u-inactive');
                });
            })
        }        
    },
    //añadir paginacion en listados o resultados de busquedas
    paginateList: (users, container) =>{
        const count = users.count;
        const maxPages = Math.ceil(count/app.listLimit);
        container.innerHTML = '';
        // console.log('<------- paginateList');
        // console.log('añadir paginacion para: '+count);
        // console.log('limite listado: '+app.listLimit);
        // console.log('paginas maximas: '+maxPages);
        // construir la tabla de paginación
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('cm-l-tabledata__footer');
        paginationContainer.classList.add('cm-u-spacer-mt-medium');
        const paginationCellBack = document.createElement('div');
        paginationCellBack.classList.add('tablecell-long');
        const paginationCellInfo = document.createElement('div');
        paginationCellInfo.classList.add('tablecell-long');
        paginationCellInfo.classList.add('cm-u-centerText');
        paginationCellInfo.textContent = `Page ${app.currentListPage} of ${maxPages}`;
        const paginationCellForward = document.createElement('div');
        paginationCellForward.classList.add('tablecell-long');
        paginationCellForward.classList.add('cm-u-textRight');
        const paginationButtonForward = document.createElement('button');
        paginationButtonForward.classList.add('cm-o-icon-button-small--primary');
        paginationButtonForward.id = 'goNextPage';
        paginationButtonForward.textContent = '>';
        const paginationButtonBack = document.createElement('button');
        paginationButtonBack.classList.add('cm-o-icon-button-small--disabled');
        paginationButtonBack.id = 'goPrevPage';
        paginationButtonBack.textContent = '<';
        paginationCellBack.appendChild(paginationButtonBack);
        paginationCellForward.appendChild(paginationButtonForward);
        paginationContainer.appendChild(paginationCellBack);
        paginationContainer.appendChild(paginationCellInfo);
        paginationContainer.appendChild(paginationCellForward);    
        container.appendChild(paginationContainer);
    
        //botones de paginacion
        const activatePagination = () => {
            //console.log('estoy en la pagina: '+app.currentListPage);
            // console.log('location.search: '+location.search);
            const page = document.body.id;
            const goNextBtn = container.querySelector('#goNextPage');
            const goPrevBtn = container.querySelector('#goPrevPage');
            const goNextBtnActive = goNextBtn.classList.contains('cm-o-icon-button-small--primary');
            const goPrevBtnActive = goPrevBtn.classList.contains('cm-o-icon-button-small--primary');
        
            if (goNextBtnActive) {
                goNextBtn.addEventListener('click',()=>{
                    app.currentListPage++;
                    const params = new URLSearchParams(document.location.search);
                    if (page === 'manageUsers' && location.search === ''){ app.getUsers({page:app.currentListPage});}
                    else if (page === 'manageTeam' && location.search === ''){ app.getPlayers({page:app.currentListPage})}
                    else if (page === 'manageUsers' && location.search.startsWith('?searchAction=searchUser')){ 
                        searchTerm = searchInModalInput.value;
                        app.filterUsers(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (page === 'manageTeam' && location.search.startsWith('?searchAction=searchPlayer')){ 
                        searchTerm = searchInModalInput.value;
                        app.filterPlayers(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (location.search.startsWith('?searchAction=searchLeague')){ 
                        console.log("click filtrando ligas adelante");
                        searchTerm = searchInModalInput.value;
                        app.filterLeagues(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (location.search.startsWith('?searchAction=searchTeam')){ 
                        const leagueOrigin = params.get('leagueOrigin');
                        console.log('league of origin: '+leagueOrigin);
                        searchTerm = searchInModalInput.value;
                        app.filterTeams(leagueOrigin, searchTerm, {page:app.currentListPage, limit:5});
                    }
                    console.log('voy a la pagina: '+app.currentListPage);                    
                })
            }
        
            if (goPrevBtnActive) {
                goPrevBtn.addEventListener('click',()=>{
                    app.currentListPage--;
                    const params = new URLSearchParams(document.location.search);
                    if (page === 'manageUsers' && location.search === ''){ app.getUsers({page:app.currentListPage});}
                    else if (page === 'manageTeam' && location.search === ''){ app.getPlayers({page:app.currentListPage})}
                    else if (page === 'manageUsers' && location.search.startsWith('?searchAction=searchUser')){ 
                        searchTerm = searchInModalInput.value;
                        app.filterUsers(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (page === 'manageTeam' && location.search.startsWith('?searchAction=searchPlayer')){ 
                        searchTerm = searchInModalInput.value;
                        app.filterPlayers(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (location.search.startsWith('?searchAction=searchLeague')){ 
                        console.log("click filtrando ligas atrás");
                        searchTerm = searchInModalInput.value;
                        app.filterLeagues(searchTerm, {page:app.currentListPage, limit:5});
                    } else if (location.search.startsWith('?searchAction=searchTeam')){ 
                        const leagueOrigin = params.get('leagueOrigin');
                        searchTerm = searchInModalInput.value;
                        filterTeams(leagueOrigin, searchTerm, {page:app.currentListPage, limit:5});
                    }
                    //console.log('voy a la pagina: '+app.currentListPage);  
                })
            }
        }
        if (maxPages > 1 && app.currentListPage === 1) {
            // console.log('estoy al principio');
            paginationButtonForward.classList.remove('cm-o-icon-button-small--primary');
            paginationButtonForward.classList.add('cm-o-icon-button-small--primary');
            paginationButtonBack.classList.remove('cm-o-icon-button-small--primary');
            paginationButtonBack.classList.add('cm-o-icon-button-small--disabled');
            activatePagination();
        } else if (maxPages > 1 && app.currentListPage === maxPages) {
            // console.log('estoy al final');
            paginationButtonForward.classList.remove('cm-o-icon-button-small--primary');
            paginationButtonForward.classList.add('cm-o-icon-button-small--disabled');
            paginationButtonBack.classList.remove('cm-o-icon-button-small--disabled');
            paginationButtonBack.classList.add('cm-o-icon-button-small--primary');
            activatePagination();
        } else if (maxPages > 1 && app.currentListPage < maxPages) {
            // console.log('estoy en medio');
            paginationButtonBack.classList.remove('cm-o-icon-button-small--disabled');
            paginationButtonBack.classList.add('cm-o-icon-button-small--primary');
            activatePagination();
        } else if (maxPages === 1 && app.currentListPage === 1 ) {
            // console.log('solo hay una página');
            paginationButtonForward.classList.remove('cm-o-icon-button-small--primary');
            paginationButtonForward.classList.add('cm-o-icon-button-small--disabled');
            paginationButtonBack.classList.remove('cm-o-icon-button-small--primary');
            paginationButtonBack.classList.add('cm-o-icon-button-small--disabled');
        }
    },
    //reordenar listados
    sortButton: (element, elements) => {
        const page = document.body.id;
        //span que cuelgan del botón y que muestran los iconos descendentes o ascendentes
        const descIcon = element.querySelector(':scope > span.sortIcon--desc');
        const ascIcon = element.querySelector(':scope > span.sortIcon--asc'); 
    
        element.addEventListener('click', event => {
            //oculto todos los iconos de todos los botones en cada click        
            elements.forEach(element =>{ 
                const descIcon = element.querySelector(':scope > span.sortIcon--desc');
                const ascIcon = element.querySelector(':scope > span.sortIcon--asc');  
                ascIcon.classList.add('cm-u-inactive');
                descIcon.classList.add('cm-u-inactive'); 
            });        
            //recojo el nombre del campo
            const sortField = element.getAttribute('data-field');
    
            //llamo a la api para que filtre por ese campo
            if (page === 'manageUsers' && location.search === ''){ 
                app.getUsers({page:app.currentListPage, sortBy:sortField, order:app.listOrder});
            } else if (page === 'manageTeam' && location.search === ''){ 
                app.getPlayers({page:app.currentListPage, sortBy:sortField, order:app.listOrder});
            } else if (page === 'manageUsers' && location.search.startsWith('?searchAction=searchUser')) {
                const params = new URLSearchParams(document.location.search);
                const searchTermObtained = params.get('searchTerm');
                app.filterUsers(searchTermObtained, {page:1, limit:5, sortBy:sortField, order:app.listOrder});
            } else if (location.search.startsWith('?searchAction=searchPlayer')) {
                const [_,searchTermObtained] = location.search.split('=');
                app.filterPlayers(searchTermObtained, {page:1, limit:5, sortBy:sortField, order:listOrder});
            } else if (location.hash.startsWith('#searchClub')) {
                app.getTeams({page:1, limit:5, sortBy:sortField, order:listOrder});
            } else if (location.hash.startsWith('#searchLeague')) {
                app.getLeagues({page:1, limit:5, sortBy:sortField, order:listOrder});
            }
            
            //muestro el icono correspondiente para el botón que se pulsa
            if (app.listOrder === 'desc'){ 
                app.listOrder = 'asc';
                descIcon.classList.remove('cm-u-inactive');
                ascIcon.classList.add('cm-u-inactive');
            } else { 
                app.listOrder = 'desc';
                ascIcon.classList.remove('cm-u-inactive');
                descIcon.classList.add('cm-u-inactive');            
            };
        })
    },
    //limpiar el formulario de datos de usuario
    cleanUserDetails: () => {
        userDetailsForm.reset();
        userDetailsFieldName.removeAttribute('value');
        userDetailsFieldLastname.removeAttribute('value');
        userDetailsFieldEmail.removeAttribute('value');
        userDetailsFieldPwd.removeAttribute('value');
        userDetailsFieldPwd2.removeAttribute('value');
        userDetailsFieldForm1read.checked = false;
        userDetailsFieldForm1write.checked = false;
        userDetailsFieldForm2read.checked = false;
        userDetailsFieldForm2write.checked = false;
    },
    //limpiar el formulario de detalles de jugador
    cleanPlayerDetails: () => {
        //console.log("cleanUserDetails");
        playerDetailsForm.reset();
        playerActive.checked = false;
        playerName.removeAttribute('value');
        playerLastname.removeAttribute('value');
        playerLastname2.removeAttribute('value');
        playerAlias.removeAttribute('value');
        playerCountry.removeAttribute('value');
        playerPassportDate.removeAttribute('value');
        playerSocialSecurityNumber.removeAttribute('value');
        playerResidencyToggle.checked = false;
        playerOriginClub.removeAttribute('value');
        playerLeagueOrigin.removeAttribute('value');
        playerNaturalPosition.removeAttribute('value');
        playerWeight.removeAttribute('value');
        playerWinspan.removeAttribute('value');
        playerStandingJump.removeAttribute('value');
        playerRunningJump.removeAttribute('value');
        playerIntermediary1.removeAttribute('value');
        playerStartContractDate.removeAttribute('value');
        playerContractType.removeAttribute('value');
        playerTransferCost.removeAttribute('value');
        playerSalary.removeAttribute('value');
    },
    //asignar un valor concreto a un input desde un dato especifico de un get
    inputSetValue: async (element, resource, id, field) => {    
        const value = await app.getSpecificValueData(resource,id,field)
        .then(function (response) {
            console.log(response);
            console.log("response ID: "+response.id);
            element.value = response[field];
            element.setAttribute('data-id',response.id);
        })
        .catch(function (error) {
            console.warn(error);
        });
    },
    //reestilizar y añadir funcionalidad a los input files
    manageFileInputs: () => {
        console.log('manageFileInputs');
        const params = new URLSearchParams(document.location.search);
        const playerID = params.get('player');
        const fileUploadContainer = document.querySelector('#fileUploadContainer');
        const firstRow = document.querySelector('#pictureInputRow1');
        let uploadInputItems = document.querySelectorAll('.fileUploadRow');
        let nrInputFileItems;
        const firstRowAddBtn = firstRow.querySelector('.idPIctureAdd');

        //añadir un campo nuevo si pulsas el boton de añadir en el primer campo
        firstRowAddBtn.addEventListener('click', event =>{
            event.preventDefault();  
            //cuento las filas que hay
            nrInputFileItems = uploadInputItems.length;
            //si hay menos de 5 puedes añadir, si no paras y desactivas la funcion
            handleAddRowFunction(nrInputFileItems);
            //añades la funcionalidad para manejar los archivos y de los botones
            handleNewRows();   
        })
        //ver cuantas rows de imagen tiene y no permitir añadir más de 5
        const handleAddRowFunction = (nrInputFileItems)=>{
            nrInputFileItems++; 
            if (nrInputFileItems < 5) {           
                app.addIdImageRow(nrInputFileItems);
            } else if (nrInputFileItems == 5) {
                app.addIdImageRow(nrInputFileItems);
                firstRowAddBtn.classList.add('cm-o-icon-button-small--disabled');
                firstRowAddBtn.classList.remove('cm-o-icon-button-small--secondary');
                firstRow.removeEventListener('click', handleAddRowFunction);
            }    
        }

        //manejar las nuevas lineas insertadas y añadirles los eventos correspondientes
        const handleNewRows = ()=>{
            uploadInputItems = document.querySelectorAll('.fileUploadRow');

            uploadInputItems.forEach(item => {
                const inputUpload = item.querySelector('.pictureInput');
                const inputUploadName = item.querySelector('.pictureInputName');
                const inputDeleteBtn = item.querySelector('.idPIctureDelete');
    
                //ver si el input cambia para ponerle el nombre al span, etc
                inputUpload.addEventListener("change", ()=>{                    
                    const inputImage = inputUpload.files[0]; 
                    inputUploadName.innerText = inputImage.name;
                    inputDeleteBtn.classList.remove('cm-o-icon-button-small--disabled');
                    inputDeleteBtn.classList.add('cm-o-icon-button-small--secondary');
                    //inputDeleteBtn.onclick = function(){ handleUploadDeleteEvent(); };
                });
                //si estoy añadiendo un jugador nuevo el botón de delete aparecerá desactivado al principio
                //si estoy editando un jugador el boton de delete aparecerá activado para posibilitar "borrar" fotos
                if (playerID != 'new'){
                   //miro si el campo span tiene contenido distinto al default y habilito el botón de delete
                   if (inputUploadName.innerText !== 'Click to select') {
                    inputDeleteBtn.classList.remove('cm-o-icon-button-small--disabled');
                    inputDeleteBtn.classList.add('cm-o-icon-button-small--secondary');
                    } 
                } 
    
                const handleUploadDeleteEvent = ()=>{
                    if (inputUpload.files[0] !== undefined) {
                        let inputImage = inputUpload.files[0]; 
                        inputUpload.files = null;
                        inputUpload.value = ''; 
                        inputImage.name = '';               
                        inputUploadName.innerText = 'Click to select';
                        inputDeleteBtn.classList.add('cm-o-icon-button-small--disabled');
                        inputDeleteBtn.classList.remove('cm-o-icon-button-small--secondary');
                    } else {
                        inputUploadName.innerText = 'Click to select';
                        inputDeleteBtn.classList.add('cm-o-icon-button-small--disabled');
                        inputDeleteBtn.classList.remove('cm-o-icon-button-small--secondary');
                    }
                }
    
                inputDeleteBtn.addEventListener('click', event=>{
                    event.preventDefault();
                    console.log(inputUploadName.innerText);
                    if (inputUploadName.innerText !== 'Click to select') {
                        handleUploadDeleteEvent();
                    }
                })
            });
        }
        handleNewRows(); 
    },
    //añadir nueva fila ID image
    addIdImageRow: (i)=>{
        const fileUploadContainer = document.querySelector('#fileUploadContainer');
        let nr = i;
        nr === undefined ? nr=1: nr = i; 

        const idImageRow = document.createElement('div');
        idImageRow.classList.add('cm-l-form-panel__row');
        idImageRow.classList.add('fileUploadRow');
        idImageRow.setAttribute('id','pictureInputRow'+nr);
        const idImageLabel = document.createElement('label');
        idImageLabel.classList.add('panel-field-long');
        idImageLabel.setAttribute('for','idPicture'+nr);
        const firstSpan = document.createElement('span');
        firstSpan.innerText = 'ID image '+nr;
        const fileUploadDiv = document.createElement('div');
        fileUploadDiv.classList.add('cm-c-field-icon');
        fileUploadDiv.classList.add('fileUpload');
        const fileUploadInput = document.createElement('input');
        fileUploadInput.classList.add('cm-c-field-icon__input');
        fileUploadInput.classList.add('pictureInput');
        fileUploadInput.setAttribute('id','idPicture'+nr);
        fileUploadInput.setAttribute('name','idPicture'+nr);
        fileUploadInput.setAttribute('type','file');
        fileUploadInput.setAttribute('style','diplay:none;');
        const fileUploadSpan = document.createElement('span');
        fileUploadSpan.classList.add('pictureInputName');
        fileUploadSpan.innerText = 'Click to select';
        const asssistanceSpan = document.createElement('span');
        asssistanceSpan.classList.add('assistance');
        asssistanceSpan.setAttribute('aria-live','polite');
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('cm-o-icon-button-small--disabled');
        deleteBtn.classList.add('cm-c-field-icon__button');
        deleteBtn.classList.add('idPIctureDelete');
        const deleteBtnSpan = document.createElement('span');
        deleteBtnSpan.classList.add('material-symbols-outlined');
        deleteBtnSpan.innerText = 'delete';

        deleteBtn.appendChild(deleteBtnSpan);
        asssistanceSpan.appendChild(deleteBtn);
        if (nr === 1) {
            const addBtn = document.createElement('button');
            addBtn.classList.add('cm-o-icon-button-small--secondary');
            addBtn.classList.add('cm-c-field-icon__button');
            addBtn.classList.add('idPIctureAdd');
            const addBtnSpan = document.createElement('span');
            addBtnSpan.classList.add('material-symbols-outlined');
            addBtnSpan.innerText = 'add_a_photo';

            addBtn.appendChild(addBtnSpan);
            asssistanceSpan.append(' ');
            asssistanceSpan.appendChild(addBtn);
        }    
        fileUploadDiv.appendChild(fileUploadInput);
        fileUploadDiv.appendChild(fileUploadSpan);
        idImageLabel.appendChild(firstSpan);
        idImageLabel.appendChild(fileUploadDiv);
        idImageLabel.appendChild(asssistanceSpan);
        idImageRow.appendChild(idImageLabel);
        fileUploadContainer.appendChild(idImageRow);

    },
    //poner error a un campo
    setInputFieldError: (input,error) => {
        const inputLabel = input.parentNode;
        inputLabel.classList.add('error');
        const errorMsg = document.createElement('span');
        errorMsg.classList.add('error');
        errorMsg.innerHTML = error;
        inputLabel.appendChild(errorMsg);
    },
    //varias
    variousUtils: ()=> {
        //faking focus state for search and select fields w/ icon
        const searchWithIconFields = document.querySelectorAll('.cm-c-field-icon__input');
        const selectWithIconFields = document.querySelectorAll('.cm-c-select-icon__select');
        searchWithIconFields.forEach(field => {
            field.addEventListener('focus', event => {
                const fieldContainer = field.closest('.cm-c-field-icon');
                fieldContainer.classList.add('cm-c-field-icon--focus');
                //playerLeagueOriginContainer.classList.remove('error');
            });
            field.addEventListener('focusout', event => {
                const fieldContainer = field.closest('.cm-c-field-icon');
                fieldContainer.classList.remove('cm-c-field-icon--focus');

            });
        });
        selectWithIconFields.forEach(field => {
            field.addEventListener('focus', event => {
                const fieldContainer = field.closest('.cm-c-select-icon');
                fieldContainer.classList.add('cm-c-select-icon--focus');

            });
            field.addEventListener('focusout', event => {
                const fieldContainer = field.closest('.cm-c-select-icon');
                fieldContainer.classList.remove('cm-c-select-icon--focus');

            });
        });
    }
}
app.init();


