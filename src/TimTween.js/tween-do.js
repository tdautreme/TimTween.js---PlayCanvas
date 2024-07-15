(function(Tim) {
    Tim.Tween = Tim.Tween || {};

    Tim.Tween.Do = function (data) {
        // Initialize simulation (parent class)
        Tim.Simulation.call(this);
        this.parentSimulation = Tim.Tween.Manager.singleton.simulation;

        // Check data type
        this._dataType = typeof data;
        if (this._dataType !== "object" && this._dataType !== "number")
            throw new Error("data type must be object or number");

        // Default values
        this._data = Tim.Tween.Do.encapsulateDataIfNeeded(data);
        this._fromData = JSON.parse(JSON.stringify(this._data));
        this._easeFunction = Tim.Tween.Ease.Linear;
        this._interpolationFunction = Math.lerp;
        this._inputProgress = 0;
        this._outputProgress = 0;
        this._isReversed = false;
        this._repeatCount = 0;
        this._repeatFunction = Tim.Tween.Repeat.Restart;
        this._repeatCountYoyoStepBool = false;
        this._previousInputProgressStep = 0;
        this._isLooping = false;
        this._process = new Tim.Tween.Process.Interpolation(Math.lerp);

        // Events declaration
        this.onProgressChanged = new Tim.Event(this);
        this.onUpdate = new Tim.Event(this);
        this.onComplete = new Tim.Event(this);
        this.onStepComplete = new Tim.Event(this);

        this._constructorInitialized = true;
    }

    Tim.Tween.Do.prototype = Object.create(Tim.Simulation.prototype);
    Tim.Tween.Do.prototype.constructor = Tim.Tween.Do;

    Tim.Tween.Do.prototype.to = function(to, duration) {
        if (this._constructorInitialized === undefined)
            return;
        if (typeof to !== this._dataType)
            throw new Error("\"to\" must be same type as \"data\" (" + this._dataType + ")");
        this._toData = to;
        this._duration = duration;
        this._database = Tim.Database.parseObject(this._data, this._fromData, this._toData);
        this._toInitialized = true;
        return this;
    }

    // Get Set
    Object.defineProperty(Tim.Tween.Do.prototype, 'data', {
        get: function() {
            if (typeof this._data === "object")
                return this._data;
            else if (typeof this._data === "number")
                return this._data.value;
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'simulation', {
        get: function() {
            return this._simulation;
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'process', {
        get: function() {
            return this._process;
        },
        set: function(value) {
            this.setProcess(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'easeFunction', {
        get: function() {
            return this._easeFunction;
        },
        set: function(value) {
            this.setEaseFunction(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'inputProgress', {
        get: function() {
            return this._inputProgress;
        },
        set: function(value) {
            this.setInputProgress(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'outputProgress', {
        get: function() {
            return this._outputProgress;
        },
        set: function(value) {
            this.setOutputProgress(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'progress', {
        get: function() {
            return this.outputProgress;
        },
        set: function(value) {
            this.inputProgress = value;
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'duration', {
        get: function() {
            return this._duration;
        },
        set: function(value) {
            this._duration = value;
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'isReversed', {
        get: function() {
            return this._isReversed;
        },
        set: function(value) {
            this.setIsReversed(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'isLooping', {
        get: function() {
            return this._isLooping;
        },
        set: function(value) {
            this.setIsLooping(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'repeatCount', {
        get: function() {
            return this._repeatCount;
        },
        set: function(value) {
            this.setRepeatCount(value);
        }
    });

    Object.defineProperty(Tim.Tween.Do.prototype, 'repeatFunction', {
        get: function() {
            return this._repeatFunction;
        },
        set: function(value) {
            this.setRepeatFunction(value);
        }
    });


    // Methods
    Tim.Tween.Do.prototype.setInputProgress = function(inputProgress) {
        if (this.inputProgress === inputProgress)
            return this;
        this._inputProgress = inputProgress;
        return this._updateOutputProgress();
    }

    Tim.Tween.Do.prototype.setOutputProgress = function(outputProgress) {
        if (this.outputProgress === outputProgress)
            return this;
        this._outputProgress = outputProgress;
        let ret = this.updateData();
        this.onProgressChanged.trigger(this.outputProgress);
        return ret;
    }

    Tim.Tween.Do.prototype.loop = function(isLooping) {
        return this.setIsLooping(isLooping);
    }
    Tim.Tween.Do.prototype.setIsLooping = function(isLooping) {
        if (this.isLooping === isLooping)
            return this;
        this._isLooping = isLooping;
        return this;
    }

    Tim.Tween.Do.prototype.repeat = function(repeatCount) {
        if (repeatCount < 0)
            throw new Error("Loop must be greater than 0");
        return this.setRepeatCount(repeatCount);
    }
    Tim.Tween.Do.prototype.setRepeatCount = function(repeatCount) {
        if (this.repeatCount === repeatCount)
            return this;
        this._repeatCount = repeatCount;
        return this._updateOutputProgress();
    }

    Tim.Tween.Do.prototype.repeatType = function(repeatFunction) {
        return this.setRepeatFunction(repeatFunction);
    }
    Tim.Tween.Do.prototype.setRepeatFunction = function(repeatFunction) {
        if (this.repeatFunction === repeatFunction)
            return this;
        this._repeatFunction = repeatFunction;
        return this._updateOutputProgress();
    }

    Tim.Tween.Do.prototype.setIsReversed = function(isReversed) {
        if (this.isReversed === isReversed)
            return this;
        this._isReversed = isReversed;
        return this._updateOutputProgress();
    }

    Tim.Tween.Do.prototype.easing = function(easeFunction) {
        return this.setEaseFunction(easeFunction);
    }
    Tim.Tween.Do.prototype.setEaseFunction = function (easeFunction) {
        if (this.easeFunction === easeFunction)
            return this;
        this._easeFunction = easeFunction;
        return this.updateData();
    }

    Tim.Tween.Do.prototype.setProcess = function (process) {
        if (this.process === process)
            return this;
        this._process = process;
        return this.updateData();
    }

    Tim.Tween.Do.encapsulateDataIfNeeded = function(data) {
        if (typeof data === "object")
            return data;
        else
            return { value: data };
    }

    Tim.Tween.Do.prototype.play = function() {
        if (this._toInitialized === undefined)
            return;
        this.isPlaying = true;
        return this;
    }

    Tim.Tween.Do.prototype.stop = function() {
        this.isPlaying = false;
        return this;
    }

    Tim.Tween.Do.prototype._computeNewProgress = function (progress) {
        progress = this.repeatFunction(progress);
        progress = Math.clamp(progress, 0, 1);
        if (this.isReversed)
            progress = 1 - progress;
        return progress;
    }

    Tim.Tween.Do.prototype._updateOutputProgress = function() {
        let isCompleted = false;
    
        let completedSteps = 0;
        if (this.inputProgress < this._previousInputProgressStep)
            this._previousInputProgressStep = Math.floor(this.inputProgress);
        else if (Math.floor(this.inputProgress) != this._previousInputProgressStep) {
            let inputProgressStep = Math.floor(this.inputProgress);
            completedSteps = inputProgressStep - this._previousInputProgressStep;
            this._previousInputProgressStep = inputProgressStep;

            // Manage repeat and loop
            let realRepeatCount = this.isLooping ? -1 : this.repeatCount;
            if (realRepeatCount >= 0)
            {
                let newRepeatCount = this.repeatCount - completedSteps;
                if (newRepeatCount < 0)
                {
                    isCompleted = true;
                    let excess = newRepeatCount + 1; // is negative
                    this._inputProgress += excess; // is -=
                    this._inputProgress = Math.round(this._inputProgress);
                    newRepeatCount = 0; 
                }
                this.repeatCount = newRepeatCount;
            }
        }

        this.outputProgress = this._computeNewProgress(this.inputProgress);

        for (let i = 0; i < completedSteps; i++)
            this.onStepComplete.trigger();

        if (isCompleted) {
            this.onComplete.trigger();
            this.isPlaying = false;
        }
        return this;
    }

    Tim.Tween.Do.prototype.update = function(deltaTime) {
        this.inputProgress += (deltaTime / this.duration);
        this.onUpdate.trigger(deltaTime);
    }

    Tim.Tween.Do.prototype.updateData = function () {
        let progress = this.easeFunction(this.progress);
        this.process.process(this._database, progress);
        return this;
    }
})(window.Tim = window.Tim || {});
