(function(Tim) {
    Tim.Tween = Tim.Tween || {};

    Tim.Tween.Ease = {};

    Tim.Tween.Ease.Linear = function(k) {
        return k;
    }

    Tim.Tween.Ease.QuadraticIn = function(k) {
        return k * k;
    }

    Tim.Tween.Ease.QuadraticOut = function(k) {
        return k * (2 - k);
    }

    Tim.Tween.Ease.QuadraticInOut = function(k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
    }

    Tim.Tween.Ease.CubicIn = function(k) {
        return k * k * k;
    }

    Tim.Tween.Ease.CubicOut = function(k) {
        return --k * k * k + 1;
    }

    Tim.Tween.Ease.CubicInOut = function(k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k;
        return 0.5 * ((k -= 2) * k * k + 2);
    }

    Tim.Tween.Ease.QuarticIn = function(k) {
        return k * k * k * k;
    }

    Tim.Tween.Ease.QuarticOut = function(k) {
        return 1 - (--k * k * k * k);
    }

    Tim.Tween.Ease.QuarticInOut = function(k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k;
        return -0.5 * ((k -= 2) * k * k * k - 2);
    }

    Tim.Tween.Ease.QuinticIn = function(k) {
        return k * k * k * k * k;
    }

    Tim.Tween.Ease.QuinticOut = function(k) {
        return --k * k * k * k * k + 1;
    }

    Tim.Tween.Ease.QuinticInOut = function(k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }

    Tim.Tween.Ease.SineIn = function(k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return 1 - Math.cos(k * Math.PI / 2);
    }

    Tim.Tween.Ease.SineOut = function(k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return Math.sin(k * Math.PI / 2);
    }

    Tim.Tween.Ease.SineInOut = function(k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    Tim.Tween.Ease.ExponentialIn = function(k) {
        return k === 0 ? 0 : Math.pow(1024, k - 1);
    }

    Tim.Tween.Ease.ExponentialOut = function(k) {
        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    }

    Tim.Tween.Ease.ExponentialInOut = function(k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }

    Tim.Tween.Ease.CircularIn = function(k) {
        return 1 - Math.sqrt(1 - k * k);
    }

    Tim.Tween.Ease.CircularOut = function(k) {
        return Math.sqrt(1 - (--k * k));
    }

    Tim.Tween.Ease.CircularInOut = function(k) {
        if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }

    Tim.Tween.Ease.ElasticIn = function(k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    Tim.Tween.Ease.ElasticOut = function(k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
    }

    Tim.Tween.Ease.ElasticInOut = function(k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }

    Tim.Tween.Ease.BackIn = function(k) {
        var s = 1.70158;
        return k * k * ((s + 1) * k - s);
    }

    Tim.Tween.Ease.BackOut = function(k) {
        var s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    }

    Tim.Tween.Ease.BackInOut = function(k) {
        var s = 1.70158 * 1.525;
        if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }

    Tim.Tween.Ease.BounceOut = function(k) {
        if (k < (1 / 2.75)) {
            return 7.5625 * k * k;
        } else if (k < (2 / 2.75)) {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        } else if (k < (2.5 / 2.75)) {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    }

    Tim.Tween.Ease.BounceIn = function(k) {
        return 1 - TimTween.Ease.BounceOut(1 - k);
    }

    Tim.Tween.Ease.BounceInOut = function(k) {
        if (k < 0.5) return TimTween.Ease.BounceIn(k * 2) * 0.5;
        return TimTween.Ease.BounceOut(k * 2 - 1) * 0.5 + 0.5;
    }
})(window.Tim = window.Tim || {});
