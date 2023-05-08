//Data
const api = axios.create({
    //baseURL: 'https://gorest.co.in/public/v2/',
    baseURL: 'https://64492e4ae7eb3378ca41f493.mockapi.io/api/v1/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        //'api_key': API_KEY,
    }
});

//Utils

//pagination and sorting parameters
let currentListPage = 1;
let listLimit = 10;
let listSortBy = 'id';
let listOrder = 'desc';
let searchTerm = '';

//añadir la paginación a las tablas con listados
const paginateList = (users, container) =>{
    const count = users.count;
    const maxPages = Math.ceil(count/listLimit);
    container.innerHTML = '';
    // console.log('<------- paginateList');
    // console.log('añadir paginacion para: '+count);
    // console.log('limite listado: '+listLimit);
    // console.log('paginas: '+maxPages);
    //construir la tabla de paginación
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('cm-l-tabledata__footer');
    paginationContainer.classList.add('cm-u-spacer-mt-medium');
    const paginationCellBack = document.createElement('div');
    paginationCellBack.classList.add('tablecell-long');
    const paginationCellInfo = document.createElement('div');
    paginationCellInfo.classList.add('tablecell-long');
    paginationCellInfo.classList.add('cm-u-centerText');
    paginationCellInfo.textContent = `Page ${currentListPage} of ${maxPages}`;
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
        const goNextBtn = container.querySelector('#goNextPage');
        const goPrevBtn = container.querySelector('#goPrevPage');
        const goNextBtnActive = goNextBtn.classList.contains('cm-o-icon-button-small--primary');
        const goPrevBtnActive = goPrevBtn.classList.contains('cm-o-icon-button-small--primary');

        if (goNextBtnActive) {
            goNextBtn.addEventListener('click',()=>{
                console.log('searchTerm: '+searchTerm);
                currentListPage++;
                if (location.hash.startsWith('#manageUsers')){ getUsers({page:currentListPage});}
                else if (location.hash.startsWith('#manageTeam')){ getPlayers({page:currentListPage})}
                else if (location.search.startsWith('?searchUser=')){ filterUsers(searchTerm, {page:currentListPage, limit:5})}
            })
        }
    
        if (goPrevBtnActive) {
            console.log('searchTerm: '+searchTerm);
            goPrevBtn.addEventListener('click',()=>{
                currentListPage--;
                if (location.hash.startsWith('#manageUsers')){ getUsers({page:currentListPage});}
                else if (location.hash.startsWith('#manageTeam')){ getPlayers({page:currentListPage})}
                else if (location.search.startsWith('?searchUser=')){ filterUsers(searchTerm, {page:currentListPage, limit:5})}
            })
        }
    }

    if (maxPages > 1 && currentListPage === 1) {
        // console.log('estoy al principio');
        paginationButtonForward.classList.remove('cm-o-icon-button-small--primary');
        paginationButtonForward.classList.add('cm-o-icon-button-small--primary');
        paginationButtonBack.classList.remove('cm-o-icon-button-small--primary');
        paginationButtonBack.classList.add('cm-o-icon-button-small--disabled');
        activatePagination();
    } else if (maxPages > 1 && currentListPage === maxPages) {
        // console.log('estoy al final');
        paginationButtonForward.classList.remove('cm-o-icon-button-small--primary');
        paginationButtonForward.classList.add('cm-o-icon-button-small--disabled');
        paginationButtonBack.classList.remove('cm-o-icon-button-small--disabled');
        paginationButtonBack.classList.add('cm-o-icon-button-small--primary');
        activatePagination();
    } else if (maxPages > 1 && currentListPage < maxPages) {
        // console.log('estoy en medio');
        paginationButtonBack.classList.remove('cm-o-icon-button-small--disabled');
        paginationButtonBack.classList.add('cm-o-icon-button-small--primary');
        activatePagination();
    } else {
        // console.log('solo hay una página');
        if (location.hash.startsWith('#manageUsers')){tablePaginationUsers.innerHTML = '';}
        else if (location.hash.startsWith('#manageTeam')){tablePaginationPlayers.innerHTML = '';}
    }
}
//funcionalidad de reordenar los elementos de un listado por campo
sortBtns.forEach(btn => {
    //span que cuelgan del botón y que muestran los iconos descendentes o ascendentes
    const descIcon = btn.querySelector(':scope > span.sortIcon--desc');
    const ascIcon = btn.querySelector(':scope > span.sortIcon--asc');  

    btn.addEventListener('click', event => {
        //oculto todos los iconos de todos los botones en cada click
        sortBtns.forEach(btn =>{ 
            const descIcon = btn.querySelector(':scope > span.sortIcon--desc');
            const ascIcon = btn.querySelector(':scope > span.sortIcon--asc');  
            ascIcon.classList.add('cm-u-inactive');
            descIcon.classList.add('cm-u-inactive'); 
        });        
        //muestro el icono correspondiente para el botón que se pulsa
        if (listOrder === 'desc'){ 
            listOrder = 'asc';
            descIcon.classList.remove('cm-u-inactive');
            ascIcon.classList.add('cm-u-inactive');
        } else { 
            listOrder = 'desc';
            ascIcon.classList.remove('cm-u-inactive');
            descIcon.classList.add('cm-u-inactive');            
        };
        //recojo el nombre del campo
        const sortField = btn.getAttribute('data-field');
        //llamo a la api para que filtre por ese campo
        if (location.hash.startsWith('#manageUsers')){ 
            getUsers({page:currentListPage, sortBy:sortField, order:listOrder});
        } else if (location.hash.startsWith('#manageTeam')){ 
            console.log('llamo a getPlayers');
            getPlayers({page:currentListPage, sortBy:sortField, order:listOrder});
        }        
    })
})
//listar usuarios
const listUsers = (users,container,{clean = true} = {}) => {
    //console.log('list users');
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
            location.hash='#editUser='+btn.getAttribute('data-userId');
        })
    })
}
//listar los detalles de usuario
const listUserDetails = (user) => {
    userDetailsTitle.textContent = 'Edit user';
    userDetailsFieldName.setAttribute('value',user.userName);
    userDetailsFieldLastname.setAttribute('value',user.userLastname);
    userDetailsFieldEmail.setAttribute('value',user.userEmail);
    if (user.userForm1read === 'on'){userDetailsFieldForm1read.checked = true;}
    if (user.userForm1write === 'on'){userDetailsFieldForm1write.checked = true;}
    if (user.userForm2read === 'on'){userDetailsFieldForm2read.checked = true;}
    if (user.userForm2write === 'on'){userDetailsFieldForm2write.checked = true;}
}
//limpiar el formulario de detalles de usuario
const cleanUserDetails = () => {
    //console.log("cleanUserDetails");
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
}
//listar resultados de busqueda
const listSearchResults = (results,container,searchTerm,{clean = true} = {}) => {
    searchTerm = searchTerm;
    if(clean) {
        container.innerHTML = '';
    }

    if (results.count === 0) {
        container.innerHTML = 'No results. Try again.';
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
    searchUserInModalInput.value = searchTerm;

    const editUserBtns = document.querySelectorAll('#editUserDetailsBtn');

    if (location.search.startsWith('?searchUser=')){
        editUserBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                let uri = window.location.toString();
                let clean_uri = uri.substring(0,uri.indexOf("?")); 
                window.history.replaceState({},document.title,clean_uri);
                modalContainer.classList.add('cm-u-inactive');
                location.hash='#editUser='+btn.getAttribute('data-userId');
            })
        })
    } else if (location.search.startsWith('?searchPlayer=')) {
        editUserBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                let uri = window.location.toString();
                let clean_uri = uri.substring(0,uri.indexOf("?")); 
                window.history.replaceState({},document.title,clean_uri);
                modalContainer.classList.add('cm-u-inactive');
                location.hash='#editPlayer='+btn.getAttribute('data-userId');
            })
        })
    } 
}
//listar plantilla de jugadores
const listPlayers = (players,container,{clean = true}={}) => {
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
        if(player.active) {
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
            console.log('edit player:'+btn.getAttribute('data-playerid'));
            location.hash='#editPlayer='+btn.getAttribute('data-playerid');
        })
    })
}
//listar detalles de jugador
const listPlayerDetails = (player) => {
    if (player.active === 'on'){playerActive.checked = true;}
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
    if (player.sixMonthsResidency === 'on'){playerResidencyToggle.checked = true;}
    playerOriginClub.setAttribute('value',player.clubFrom);
    playerLeagueOrigin.setAttribute('value',player.leagueFrom);
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
}
//limpiar el formulario de detalles de jugador
const cleanPlayerDetails = () => {
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
}


//Api calls

//obtener usuarios
const getUsers = async ({page = currentListPage, limit = listLimit, sortBy = 'id', order = 'asc'} = {}) => {
    //console.log('getUsers: page:'+page+' limit:'+listLimit+' sortBy:'+sortBy+' order:'+order);
    const { data } = await api('/users',{ params: { page: page, limit: listLimit, sortBy:sortBy, order:order } });
    const users = data;
    listLimit = limit;
    // console.log('get users');
    // console.log(data);
    listUsers(users,usersListContainer);
    paginateList(users, tablePaginationUsers);
}
//obtener detalles usuario
const getUser = async (userID) => {
    const { data } = await api('/users/'+userID);
    const player = data;
    listUserDetails(player);
}
//añadir nuevo usuario
const addNewUser = async () => {
    const newUserData = new FormData(userDetailsForm);
    const data = {};
    newUserData.forEach((value, key) => data[key] = value);
    const postNewUser = await api.post('/users', {
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
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?")); 
        window.history.replaceState({},document.title,clean_uri);
        location.hash = "#manageUsers";
      })
      .catch(function (error) {
        console.warn(error);
      });

}
//actualizar usuario existente
const updateUser = async (userID) => {
    const updatedUserData = new FormData(userDetailsForm);
    const data = {};
    updatedUserData.forEach((value, key) => data[key] = value);

    const updateUserData = await api.put('/users/'+userID, {
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
        location.hash = "#manageUsers";
      })
      .catch(function (error) {
        console.warn(error);
      });

}
//borrar usuario
const deleteUser = async(userID) => {    
    const deleteUser = await api.delete('/users/'+userID)
    .then(response => {
        location.hash = "#manageUsers";
    }).catch(e => {
        console.log(e);
    });
    
}
//filtrar usuarios por busqueda
const filterUsers = async (searchTerm, {page = 1, limit = listLimit, sortBy = 'id', order = 'asc'} = {}) => {
    listLimit = limit;
    const { data } = await api.get('/users?search='+searchTerm,{ params: { page: currentListPage, limit: listLimit, sortBy:sortBy, order:order } });
    const results = data;        
    listSearchResults(results,searchResultsListContainer,searchTerm);
    if (results.count > 0) {
        paginateList(results, tablePaginationSearchResults);
    }    
}
//obtener jugadores
const getPlayers = async ({page = currentListPage, sortBy = 'id', order = 'asc'} = {}) => {
    const { data } = await api('/players',{ params: { page: page, limit:listLimit, sortBy:sortBy, order:order } });
    const players = data;
    listPlayers(players,playersListContainer);
    paginateList(players, tablePaginationPlayers);
}
//obtener detalles jugador
const getPlayer = async (playerID) => {
    const { data } = await api('/players/'+playerID);
    const user = data;
    listPlayerDetails(user);
}
//añadir nuevo jugador
const addNewPlayer = async () => {
    console.log('hit add new player');
    const newPlayerData = new FormData(playerDetailsForm);
    const data = {};
    newPlayerData.forEach((value, key) => data[key] = value);
    console.log(data);
    
    const postNewPlayer = await api.post('/players', {
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
        //console.log(response);
        let uri = window.location.toString();
        let clean_uri = uri.substring(0,uri.indexOf("?")); 
        window.history.replaceState({},document.title,clean_uri);
        location.hash = "#manageTeam";
      })
      .catch(function (error) {
        console.warn(error);
      });

}
//actualizar jugador existente
const updatePlayer = async (playerID) => {
    const updatedPlayerData = new FormData(playerDetailsForm);
    const data = {};
    updatedPlayerData.forEach((value, key) => data[key] = value);

    const updatePlayerrData = await api.put('/players/'+playerID, {
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
        //console.log(response);
        location.hash = "#manageTeam";
      })
      .catch(function (error) {
        console.warn(error);
      });

}
//borrar jugador
const deletePlayer = async(playerID) => {    
    const deleteUser = await api.delete('/players/'+playerID)
    .then(response => {
        location.hash = "#manageTeam";
    }).catch(e => {
        console.log(e);
    });
    
}
//filtrar jugadores por busqueda
const filterPlayers = async (searchTerm) => {
    const { data } = await api.get('/players?search='+searchTerm);
    const results = data;    
    listSearchResults(results,searchResultsListContainer,searchTerm);
}