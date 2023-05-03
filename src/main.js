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

const listUsers = (users,container,{clean = true} = {}) => {

    if(clean) {
        container.innerHTML = '';
    }

    users.forEach(user => {
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

const listSearchResults = (results,container,searchTerm,{clean = true} = {}) => {
    console.log(results);
    if(clean) {
        container.innerHTML = '';
    }

    if (results.length === 0) {
        container.innerHTML = 'No results. Try again.';
    }    

    results.forEach(result => {
        console.log('name'+result.userName);
        const resultRow = document.createElement('div');
        resultRow.classList.add('cm-l-tabledata__row');
        const cellName = document.createElement('div');
        cellName.classList.add('tablecell-long');
        cellName.textContent = result.userName + ' ' + result.userLastname;
        const btnCell = document.createElement('div');
        btnCell.classList.add('tablecell-auto');
        const editUserBtn = document.createElement('button');
        editUserBtn.classList.add('cm-o-button-cat-small--primary');
        editUserBtn.setAttribute('id','editUserDetailsBtn');
        editUserBtn.setAttribute('data-userId',result.id);
        editUserBtn.textContent = "Edit";
        btnCell.appendChild(editUserBtn);

        resultRow.appendChild(cellName);
        resultRow.appendChild(btnCell);
        container.appendChild(resultRow);
        
    });
    modalBig.classList.remove('cm-u-inactive');
    modalContainer.classList.remove('cm-u-inactive');
    console.log(searchUserInModal);
    searchUserInModal.value = searchTerm;

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

const listPlayers = (players,container,{clean = true}={}) => {
    if(clean) {
        container.innerHTML = '';
    }

    players.forEach(player => {
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

const getUsers = async () => {
    //const res = await fetch('https://gorest.co.in/public/v2/users');
    const { data } = await api('/users');
    //console.log(data);
    const users = data;

    listUsers(users,usersListContainer);
}

const getUser = async (userID) => {
    const { data } = await api('/users/'+userID);
    const player = data;
    listUserDetails(player);
}

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

const deleteUser = async(userID) => {    
    const deleteUser = await api.delete('/users/'+userID)
    .then(response => {
        location.hash = "#manageUsers";
    }).catch(e => {
        console.log(e);
    });
    
}

const filterUsers = async (searchTerm) => {
    const { data } = await api.get('/users?search='+searchTerm);
    const results = data;    
    listSearchResults(results,searchResultsListContainer,searchTerm);
}

const getPlayers = async () => {
    const { data } = await api('/players');
    const players = data;
    listPlayers(players,playersListContainer);
}

const getPlayer = async (playerID) => {
    const { data } = await api('/players/'+playerID);
    const user = data;
    listPlayerDetails(user);
}

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


const deletePlayer = async(playerID) => {    
    const deleteUser = await api.delete('/players/'+playerID)
    .then(response => {
        location.hash = "#manageTeam";
    }).catch(e => {
        console.log(e);
    });
    
}

const filterPlayers = async (searchTerm) => {
    const { data } = await api.get('/players?search='+searchTerm);
    const results = data;    
    listSearchResults(results,searchResultsListContainer,searchTerm);
}