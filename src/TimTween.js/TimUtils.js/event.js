var Tim = Tim || {};

Tim.Event = function(methodReturn = this) {
    this._listenersContextual = [];
    this._listeners = [];
    this._methodReturn = methodReturn;
}

Tim.Event.prototype.addListener = function(callback, context) {
    if (context == undefined)
        this._listeners.push(callback);
    else
        this._listenersContextual.push([context, callback, callback.bind(context)]);
    return this._methodReturn;
}

Tim.Event.prototype.removeListener = function(callback, context) {
    if (context == undefined)
        this._listeners = this._listeners.filter(x => x !== callback);
    else
        this._listenersContextual = this._listenersContextual.filter(([x, y, z]) => x !== context || y !== callback);
    return this._methodReturn;
}

Tim.Event.prototype.trigger = function(params) {
    this._listenersContextual.forEach(([x, y, z]) => z(params));
    this._listeners.forEach(callback => callback(params));
    return this._methodReturn;
}
