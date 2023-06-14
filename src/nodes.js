const $ = (idEl) => document.querySelector(idEl);

//sections-layouts
const mainHeader = $('.cm-l-header');
const usersListSection = $('#usersList');
const userDetailsSection = $('#userDetails');
const playersListSection = $('#playersList');
const playerDetailsSection = $('#playerDetails');

//containers and lists
const notifsContainer = $('#notifsList');
const usersListContainer = $('#usersListContainer');
const playersListContainer = $('#playersListContainer');
const modalContainer = $('.cm-c-modal');
const searchResultsListHeaderContainer = $('#searchResultsListHeaderContainer');
const searchResultsListContainer = $('#searchResultsListContainer');
const tablePaginationUsers = $('#tablePaginationUsers');
const tablePaginationPlayers = $('#tablePaginationPlayers');
const tablePaginationSearchResults = $('#tablePaginationSearchResults');

//elements
const logo = $('.cm-o-logo');
const notifsBtn = $('#notifsBtn');
const manageUsersBtn = $('#manageUsersBtn');
const userDetailsTitle = $('#userDetailsTitle');
const playerDetailsTitle = $('#playerDetailsTitle');
const addUsersBtn = $('#addUsersBtn');
const addPlayersBtn = $('#addPlayersBtn');
const manageTeamBtn = $('#manageTeamBtn');
const modalSmall = $('#modalSmall');
const modalBig = $('#modalBig');
const modalBigListTitle = $('#modalBigListTitle')
const modalContainerBg = $('.cm-c-modal-background');
const searchUsersBtn = $('#searchUsersBtn');
const searchPlayersBtn = $('#searchPlayersBtn');
const searchInModalBtn = $('#searchInModalBtn');
const sortBtns = document.querySelectorAll('.cm-o-sortButton');

//forms and form buttons

//loginForm fields
const loginPageForm = $('#loginPageForm');
const loginPageSubmitBtn = $('#loginPageSubmitBtn');
const loginEmail = $('loginEmail');
const loginPwd = $('loginPwd');

//searchForm Fields
const searchUser = $('#searchUser');
const searchUsersForm = $('#searchUsersForm');
const searchPlayersForm = $('#searchPlayersForm');
const searchInModalInput = $('#searchInModalInput');
const searchPlayer = $('#searchPlayer');

//userDetails Fields
const userDetailsForm = $('#userDetailsForm');
const userDetailsFormUpdateBtn = $('#userDetailsFormUpdateBtn');
const userDetailsFormDeleteBtn = $('#userDetailsFormDeleteBtn');
const userDetailsCancelBtn = $('#userDetailsCancelBtn');
const userDetailsFieldName = $('#userName');
const userDetailsFieldLastname = $('#userLastname');
const userDetailsFieldEmail = $('#userEmail');
const userDetailsFieldPwd = $('#userPwd');
const userDetailsFieldPwd2 = $('#userPwd2');
const userDetailsFieldForm1read = $('#userForm1read');
const userDetailsFieldForm1write = $('#userForm1write');
const userDetailsFieldForm2read = $('#userForm2read');
const userDetailsFieldForm2write = $('#userForm2write');
const userDetailsFormAddBtn = $('#userDetailsFormAddBtn');

//playerDetails Fields
const playerDetailsForm = $('#playerDetailsForm');
const playerOriginClubSearchBtn = $('#playerOriginClubSearchBtn');
const playerLeagueOriginSearchBtn = $('#playerLeagueOriginSearchBtn');
const playerDetailsFormAddBtn = $('#playerDetailsFormAddBtn');
const playerDetailsFormUpdateBtn = $('#playerDetailsFormUpdateBtn');
const playerDetailsFormDeleteBtn = $('#playerDetailsFormDeleteBtn');
const playerDetailsCancelBtn = $('#playerDetailsCancelBtn');
const playerActive = $('#playerActive');
const playerName = $('#playerName');
const playerLastname = $('#playerLastname');
const playerLastname2 = $('#playerLastname2');
const playerAlias = $('#playerAlias');
const playerCountry = $('#playerCountry');
const playerPassportNumber = $('#playerPassportNumber');
const playerPassportDate = $('#playerPassportDate');
const playerIdNumber = $('#playerIdNumber');
const playerIdDate = $('#playerIdDate');
const playerSocialSecurityNumber = $('#playerSocialSecurityNumber');
const playerResidencyToggle = $('#playerResidencyToggle');
const playerOriginClub = $('#playerOriginClub');
const playerLeagueOrigin = $('#playerLeagueOrigin');
const playerNaturalPosition = $('#playerNaturalPosition');
const playerHeight = $('#playerHeight');
const playerWeight = $('#playerWeight');
const playerWinspan = $('#playerWinspan');
const playerStandingJump = $('#playerStandingJump');
const playerRunningJump = $('#playerRunningJump');
const playerIntermediary1 = $('#playerIntermediary1');
const playerStartContractDate = $('#playerStartContractDate');
const playerEndContractDate = $('#playerEndContractDate');
const playerContractType = $('#playerContractType');
const playerTransferCost = $('#playerTransferCost');
const playerSalary = $('#playerSalary');