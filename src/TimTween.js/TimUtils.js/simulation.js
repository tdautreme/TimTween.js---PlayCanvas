(function(Tim) {
    Tim.Simulation = function() {
        // Properties
        this._timeScale = 1;
        this._isPlaying = false;
        this._parentSimulation = undefined;
        this._deltaTime;

        // Events
        this.onUpdate = new Tim.Event(this);
        this.onPlay = new Tim.Event(this);
        this.onPause = new Tim.Event(this);
        this.onIsPlayingChanged = new Tim.Event(this);
    }

    Object.defineProperty(Tim.Simulation.prototype, 'deltaTime', {
        get () {
            return this._deltaTime;
        }, set (value) {
            this._deltaTime = value;
        }
    });

    Object.defineProperty(Tim.Simulation.prototype, 'timeScale', {
        get () {
            return this._timeScale;
        }, set (value) {
            this._timeScale = value;
        }
    });

    Object.defineProperty(Tim.Simulation.prototype, 'isPlaying', {
        get () {
            return this._isPlaying;
        }, set (value) {
            this.setIsPlaying(value);
        }
    });

    Object.defineProperty(Tim.Simulation.prototype, 'parentSimulation', {
        get () {
            return this._parentSimulation;
        }, set (value) {
            if (this.parentSimulation !== undefined && this.isPlaying === true)
                this.parentSimulation.onUpdate.removeListener(this._update, this);
            this._parentSimulation = value;
            if (this.parentSimulation !== undefined && this.isPlaying === true)
                this.parentSimulation.onUpdate.addListener(this._update, this);
        }
    });

    Tim.Simulation.prototype.update = function (deltaTime) {}

    Tim.Simulation.prototype._update = function (deltaTime) {
        this.deltaTime = deltaTime * this.timeScale;
        this.update(this.deltaTime);
        this.onUpdate.trigger(this.deltaTime);
    }

    Tim.Simulation.prototype.play = function () {
        if (this.setIsPlaying(true) === false)
            return;
        this.onPlay.trigger();
    }

    Tim.Simulation.prototype.pause = function () {
        if (this.setIsPlaying(false) === false)
            return;
        this.onPause.trigger();
    }

    Tim.Simulation.prototype.setIsPlaying = function (isPlaying) {
        if (this.isPlaying === isPlaying)
            return false;
        this._isPlaying = isPlaying;
        if (this.parentSimulation !== undefined) {
            if (isPlaying)
                this.parentSimulation.onUpdate.addListener(this._update, this);
            else
                this.parentSimulation.onUpdate.removeListener(this._update, this);
        }
        this.onIsPlayingChanged.trigger(isPlaying);
        return true;
    }
})(window.Tim = window.Tim || {});
