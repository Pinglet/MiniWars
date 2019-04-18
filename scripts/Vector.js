class Vector {
    constructor(x, y) {
        this.xVal = x;
        this.yVal = y;
    }

    get x() {
        return this.xVal;
    }

    get y() {
        return this.yVal;
    }

    set x(value) {
        this.xVal = value;
    }

    set y(value) {
        this.yVal = value;
    }

    sameVector(vector) {
        return (this.x === vector.x && this.y === vector.y);
    }
    
    getEuclids(vector) {
        var dx = this.xVal - vector.x;
        var dy = this.yVal - vector.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}

module.exports = Vector;