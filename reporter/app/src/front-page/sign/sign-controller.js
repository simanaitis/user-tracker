module.exports = ['$state', 'UserService', '$uibModal', function ($state, UserService, $uibModal) {

    var vm = this,
        modalInstance;

    vm.signIn = function () {
        $uibModal.open({
            templateUrl: 'app/src/front-page/sign/sign-in.html',
            size: 'sm',
            controller: function ($uibModalInstance) {
                this.signIn = signIn;
                modalInstance = $uibModalInstance;
            },
            controllerAs: 'vm'
        });
    };

    vm.signUp = function () {
        $uibModal.open({
            templateUrl: 'app/src/front-page/sign/sign-up.html',
            size: 'sm',
            controller: function ($uibModalInstance) {
                this.signUp = signUp;
                modalInstance = $uibModalInstance;
            },
            controllerAs: 'vm'
        });
    };

    var signIn = function (name, password, remmember) {
        if (name && password) {
            UserService.signInUser(name, password, remmember).then(_onAuthSuccess, _onAuthError);
        } else {
            alertify.error('Both fields are required');
        }
    };

    var signUp = function (name, password, email, remmember) {
        if (name && password) {
            UserService.signUpUser(name, password, email, remmember).then(_onAuthSuccess, _onAuthError);
        } else {
            alertify.error('Both fields are required');
        }
    };

    function _onAuthSuccess() {
        modalInstance.close();
        $state.go('dashboard.hosts');
    }

    function _onAuthError(error) {
        alertify.error(error);
    }
}];