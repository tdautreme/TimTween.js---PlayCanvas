(function () {
    // Bind PlayCanvas update to TimTweenManager update
    pc.AppBase.prototype.bindTimTweenManager = function () {
        this.on("update", function (dt) {
            Tim.Tween.Manager.singleton.simulation._update(dt);
        });
    };
    
    // Sortcut to app
    pc.AppBase.prototype.timTween = function (data) {
        return new Tim.Tween.Do(data);
    };

    // Sortcut to entity
    pc.Entity.prototype.timTween = function (data) {
        let tween = this._app.timTween(data);
        this.once('destroy', tween.stop, tween);
        return tween;
    };

    // Sortcut to script
    pc.ScriptType.prototype.timTween = function(data) {
        return this.entity.timTween(data);
    }

    // Bind PlayCanvas to TimTweenManager
    let appBase = pc.AppBase.getApplication();
    if (appBase)
        appBase.bindTimTweenManager();
})();
