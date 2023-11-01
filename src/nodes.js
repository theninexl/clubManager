const $ = (idEl) => document.querySelector(idEl);

//sections-layouts
export const mainHeader = $('.cm-l-header');
export const usersListSection = $('#usersList');
export const userDetailsSection = $('#userDetails');
export const playersListSection = $('#playersList');
export const playerDetailsSection = $('#playerDetails');

//containers and lists
export const notificationsListContainer = $('#notificationsListContainer');
export const usersListContainer = $('#usersListContainer');
export const playersListContainer = $('#playersListContainer');
export const modalContainer = $('.cm-c-modal');
export const searchResultsListHeaderContainer = $('#searchResultsListHeaderContainer');
export const searchResultsListContainer = $('#searchResultsListContainer');
export const tablePaginationNotifications = $('#tablePaginationNotifications');
export const tablePaginationUsers = $('#tablePaginationUsers');
export const tablePaginationPlayers = $('#tablePaginationPlayers');
export const tablePaginationSearchResults = $('#tablePaginationSearchResults');

//common elements
export const logo = $('.cm-o-logo');
export const activeUserBtn = $('#activeUserBtn');
export const activeUserLogoutBtn = $('#activeUserLogoutBtn');
export const userUnreadNotifs = $('#userUnreadNotifs');
export const notifsBtn = $('#notifsBtn');
export const manageUsersBtn = $('#manageUsersBtn');
export const userDetailsTitle = $('#userDetailsTitle');
export const playerDetailsTitle = $('#playerDetailsTitle');
export const addUsersBtn = $('#addUsersBtn');
export const addPlayersBtn = $('#addPlayersBtn');
export const manageTeamBtn = $('#manageTeamBtn');
export const modalSmall = $('#modalSmall');
export const modalBig = $('#modalBig');
export const modalBigListTitle = $('#modalBigListTitle')
export const modalContainerBg = $('.cm-c-modal-background');
export const searchUsersBtn = $('#searchUsersBtn');
export const searchPlayersBtn = $('#searchPlayersBtn');
export const searchInModalBtn = $('#searchInModalBtn');
export const manageMastersBtn = $('#manageMastersBtn');
export const sortBtns = document.querySelectorAll('.cm-o-sortButton');

//salary widget
export const salaryWidget = $('.cm-c-salary-widget');
export const salaryWidgetTotal = $('.salaryTotal');
export const salaryWidgetUsed = $('.salaryUsed');
export const salaryBar = $('.salaryWidgetBar--limit');

//forms and form buttons

//loginForm fields
export const loginPageForm = $('#loginPageForm');
export const loginPageSubmitBtn = $('#loginPageSubmitBtn');
export const loginEmail = $('#loginEmail');
export const loginPwd = $('#loginPwd');

//searchForm Fields
export const searchUser = $('#searchUser');
export const searchUsersForm = $('#searchUsersForm');
export const searchPlayersForm = $('#searchPlayersForm');
export const searchInModalInput = $('#searchInModalInput');
export const searchPlayer = $('#searchPlayer');

//userDetails Fields
export const userDetailsForm = $('#userDetailsForm');
export const userDetailsFormUpdateBtn = $('#userDetailsFormUpdateBtn');
export const userDetailsFormDeleteBtn = $('#userDetailsFormDeleteBtn');
export const userDetailsCancelBtn = $('#userDetailsCancelBtn');
export const userDetailsFieldUsername = $('#userUsername');
export const userDetailsFieldName = $('#userName');
export const userDetailsFieldLastname = $('#userLastname');
export const userDetailsFieldEmail = $('#userEmail');
export const userDetailsFieldPwd = $('#userPwd');
export const userDetailsFieldPwd2 = $('#userPwd2');
export const userDetailsFieldSalaryLimit = $('#userSalaryLimit');
export const userDetailsFieldForm1read = $('#userForm1read');
export const userDetailsFieldForm1write = $('#userForm1write');
export const userDetailsFieldForm2read = $('#userForm2read');
export const userDetailsFieldForm2write = $('#userForm2write');
export const userDetailsFormAddBtn = $('#userDetailsFormAddBtn');

//playerDetails Fields
export const playerDetailsForm = $('#playerDetailsForm');
export const playerOriginClubSearchBtn = $('#playerOriginClubSearchBtn');
export const playerLeagueOriginSearchBtn = $('#playerLeagueOriginSearchBtn');
export const playerDetailsFormAddBtn = $('#playerDetailsFormAddBtn');
export const playerDetailsFormUpdateBtn = $('#playerDetailsFormUpdateBtn');
export const playerDetailsFormDeleteBtn = $('#playerDetailsFormDeleteBtn');
export const playerDetailsCancelBtn = $('#playerDetailsCancelBtn');
export const playerActive = $('#playerActive');
export const playerName = $('#playerName');
export const playerLastname = $('#playerLastname');
export const playerLastname2 = $('#playerLastname2');
export const playerAlias = $('#playerAlias');
export const playerCountry = $('#playerCountry');
export const playerPassportNumber = $('#playerPassportNumber');
export const playerPassportDate = $('#playerPassportDate');
export const playerIdNumber = $('#playerIdNumber');
export const playerIdDate = $('#playerIdDate');
export const playerSocialSecurityNumber = $('#playerSocialSecurityNumber');
export const playerResidencyToggle = $('#playerResidencyToggle');
export const playerOriginClub = $('#playerOriginClub');
export const playerLeagueOrigin = $('#playerLeagueOrigin');
export const playerNaturalPosition = $('#playerNaturalPosition');
export const playerHeight = $('#playerHeight');
export const playerWeight = $('#playerWeight');
export const playerWinspan = $('#playerWinspan');
export const playerStandingJump = $('#playerStandingJump');
export const playerRunningJump = $('#playerRunningJump');
export const playerIntermediary1 = $('#playerIntermediary1');
export const playerStartContractDate = $('#playerStartContractDate');
export const playerEndContractDate = $('#playerEndContractDate');
export const playerContractType = $('#playerContractType');
export const playerTransferCost = $('#playerTransferCost');
export const playerSalary = $('#playerSalary');
export const playerCategory = $('#playerCategory');

//Masters page
export const manageMastersHeadtoolTitle = $('#manageMastersHeadtoolTitle');
export const manageTeamsBtn = $('#manageTeamsBtn');
export const manageIntermBtn = $('#manageIntermBtn');
export const teamsListSection = $('#teamsListSection');
export const teamsListContainer = $('#teamsListContainer');
export const tablePaginationTeams = $('#tablePaginationTeams');
export const intermediariesListSection = $('#intermediariesListSection');
export const intermediariesListContainer = $('#intermediariesListContainer');
export const tablePaginationIntermediaries = $('#tablePaginationIntermediaries');
export const addMastersItemBtn = $('#addMastersItemBtn');

//Masters Add/edit Team page
export const teamsDetailsTitle = $('#teamsDetailsTitle');
export const teamsDetailsForm = $('#teamsDetailsForm');
export const teamsDetailsTeamName = $('#teamsDetailsTeamName');
export const teamsDetailsTeamLeague = $('#teamsDetailsTeamLeague');
export const teamsDetailsLeagueCountry = $('#teamsDetailsLeagueCountry');
export const teamsDetailsContact1Name = $('#teamsDetailsContact1Name');
export const teamsDetailsContact1Phone = $('#teamsDetailsContact1Phone');
export const teamsDetailsContact1Email = $('#teamsDetailsContact1Email');
export const teamsDetailsContact1Alias = $('#teamsDetailsContact1Alias');
export const teamsDetailsContact2Name = $('#teamsDetailsContact2Name');
export const teamsDetailsContact2Phone = $('#teamsDetailsContact2Phone');
export const teamsDetailsContact2Email = $('#teamsDetailsContact2Email');
export const teamsDetailsContact2Alias = $('#teamsDetailsContact2Alias');
export const teamsDetailsContact3Name = $('#teamsDetailsContact3Name');
export const teamsDetailsContact3Phone = $('#teamsDetailsContact3Phone');
export const teamsDetailsContact3Email = $('#teamsDetailsContact3Email');
export const teamsDetailsContact3Alias = $('#teamsDetailsContact3Alias');
export const teamsDetailsTeamLeagueSearchBtn = $('#teamsDetailsTeamLeagueSearchBtn');
export const teamsDetailsFormAddBtn = $('#teamsDetailsFormAddBtn');
export const teamsDetailsFormUpdateBtn = $('#teamsDetailsFormUpdateBtn');
export const teamsDetailsFormDeleteBtn = $('#teamsDetailsFormDeleteBtn');
export const teamsDetailsFormCancelBtn = $('#teamsDetailsFormCancelBtn');

//Masters add/edit Intermediary page
export const intermsDetailsTitle = $('#intermsDetailsTitle');
export const intermsDetailsForm = $('#intermsDetailsForm');
export const intermsDetailsName = $('#intermsDetailsName');
export const intermsDetailsLastname = $('#intermsDetailsLastname');
export const intermsDetailsEmail1 = $('#intermsDetailsEmail1');
export const intermsDetailsPhone1 = $('#intermsDetailsPhone1');
export const intermsDetailsNumber = $('#intermsDetailsNumber');
export const intermsDetailsErp = $('#intermsDetailsErp');
export const intermsDetailsFormAddBtn = $('#intermsDetailsFormAddBtn');
export const intermsDetailsFormUpdateBtn = $('#intermsDetailsFormUpdateBtn');
export const intermsDetailsFormDeleteBtn = $('#intermsDetailsFormDeleteBtn');
export const intermsDetailsFormCancelBtn = $('#intermsDetailsFormCancelBtn');
export const managedPlayersListContainer = $('#managedPlayersListContainer');
export const tablePaginationmanagedPlayers = $('#tablePaginationmanagedPlayers');