(function(Tim) {
    Tim.Tween = Tim.Tween || {};

    Tim.Tween.Manager = function() {
        this.simulation = new Tim.Simulation();
    }

    Tim.Tween.Manager.singleton = new Tim.Tween.Manager();
})(window.Tim = window.Tim || {});
