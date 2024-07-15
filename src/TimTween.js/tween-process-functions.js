(function(Tim) {
    Tim.Tween = Tim.Tween || {};
    Tim.Tween.Process = Tim.Tween.Process || {};

    // --- Abstract ---
    Tim.Tween.Process.Abstract = function() {}
    Tim.Tween.Process.Abstract.prototype.process = function(database, progress) {}

    // --- Database Interpolation ---
    Tim.Tween.Process.Interpolation = function (interpolationFunction = Math.Lerp) {
        Tim.Tween.Process.Abstract.call(this);
        this.interpolationFunction = interpolationFunction;
    }

    Tim.Tween.Process.Interpolation.prototype = Object.create(Tim.Tween.Process.Abstract.prototype);
    Tim.Tween.Process.Interpolation.prototype.constructor = Tim.Tween.Process.Interpolation;

    Tim.Tween.Process.Interpolation.prototype.process = function(database, progress) {
        for (let i = 0; i < database.length; i++) {
            let propertyReference = database[i];
            let fromValue = propertyReference.fromDataGetSet.getter();
            let toValue = propertyReference.toDataGetSet.getter();
            let outputValue = this.interpolationFunction(fromValue, toValue, progress);
            propertyReference.dataGetSet.setter(outputValue);
        }
    }

    // --- Slerp ---
    Tim.Tween.Process.Slerp = function() {
        Tim.Tween.Process.Abstract.call(this);
    }

    Tim.Tween.Process.Slerp.prototype = Object.create(Tim.Tween.Process.Abstract.prototype);
    Tim.Tween.Process.Slerp.prototype.constructor = Tim.Tween.Process.Slerp;

    Tim.Tween.Process.Slerp.prototype.process = function(database, progress) {
        t = Math.clamp(progress, 0, 1);

        // Initialize database copy
        let databaseFromTo = []
        for (let i = 0; i < database.length; i++)
            databaseFromTo.push({from: database[i].fromDataGetSet.getter(), to: database[i].toDataGetSet.getter()});

        // Compute the cosine of the angle between the two quaternions
        let dot = 0;
        for (let i = 0; i < database.length; i++)
            dot += databaseFromTo[i].from * databaseFromTo[i].to;

        // If the dot product is negative, the quaternions have opposite handed-ness
        // and slerp won't take the shorter path. So we'll invert one quaternion.
        if (dot < 0.0) {
            for (let i = 0; i < database.length; i++)
                databaseFromTo[i].to = -databaseFromTo[i].to;
            dot = -dot;
        }

        // Calculate coefficients
        const EPSILON = 0.0001;
        if (dot > 1 - EPSILON) {
            // If the angle is very small, use linear interpolation to avoid division by zero
            for (let i = 0; i < database.length; i++)
                database[i].dataGetSet.setter(databaseFromTo[i].from + t * (databaseFromTo[i].to - databaseFromTo[i].from));

            // Normalize the result
            let magnitude = 0;
            for (let i = 0; i < database.length; i++)
                magnitude += database[i].dataGetSet.getter() * database[i].dataGetSet.getter();
            magnitude = Math.sqrt(magnitude);
            if (magnitude === 0){
                for (let i = 0; i < database.length; i++)
                    database[i].dataGetSet.setter(0);
            } else {
                let inverseMagnitude = 1.0 / magnitude;
                for (let i = 0; i < database.length; i++)
                    database[i].dataGetSet.setter(database[i].dataGetSet.getter() * inverseMagnitude);
            }
        } else {
            // Standard slerp
            const theta = Math.acos(dot); // theta is the angle between the quaternions
            // const sinTheta = Math.sin(theta); // compute the sine of theta
            const sinTheta = Math.sqrt(1.0 - dot * dot); // compute the sine of theta

            // Perform the spherical linear interpolation
            const a = Math.sin((1.0 - t) * theta) / sinTheta;
            const b = Math.sin(t * theta) / sinTheta;

            for (let i = 0; i < database.length; i++)
                database[i].dataGetSet.setter(a * databaseFromTo[i].from + b * databaseFromTo[i].to);
        }
    }
})(window.Tim = window.Tim || {});
