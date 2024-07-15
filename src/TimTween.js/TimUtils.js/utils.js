var Tim = Tim || {};
Tim.Utils = Tim.Utils || {};

Math.lerp = function(a, b, t) {
    return a + (b - a) * t;
};

Math.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

Math.moduloWithNegativeSupport = function(value, mod) {
    return (value % mod + mod) % mod;
};

Math.moduloUpperBoundInclusive = function(value, mod, moduloFunction = Math.moduloWithNegativeSupport) {
    let result = moduloFunction(value, mod);
    if (result === 0 && Number.isInteger(value / mod))
        return mod;
    return result;
};

Math.moduloYoyo = function(value, mod, moduloFunction = Math.moduloUpperBoundInclusive) {
    let remainder = moduloFunction(value, 2 * mod);
    if (remainder > mod) {
        remainder = 2 * mod - remainder;
    }
    return remainder;
};

Tim.Utils.checkHaveProperty = function(dataArray, property) {
    return dataArray.every(obj => obj.hasOwnProperty(property));
}

Tim.Utils.checkSameType = function(dataArray) {
    if (dataArray.length === 0)
        return true;
    const dataType = typeof dataArray[0];
    return dataArray.every(item => typeof item === dataType);
};
