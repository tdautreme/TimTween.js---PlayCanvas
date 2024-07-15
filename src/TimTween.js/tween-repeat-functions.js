(function(Tim) {
    Tim.Tween = Tim.Tween || {};

    Tim.Tween.Repeat = {};

    Tim.Tween.Repeat.Restart = function (t) {
        return Math.moduloUpperBoundInclusive(t, 1);
    }

    Tim.Tween.Repeat.Yoyo = function (t) {
        return Math.moduloYoyo(t, 1, Math.moduloUpperBoundInclusive);
    }
})(window.Tim = window.Tim || {});
