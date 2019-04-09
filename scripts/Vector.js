class Vector {
    xVal = 0;
    yVal = 0;

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
    
    getEuclids(vector) {
        var dx = this.xVal - vector.x;
        var dy = this.yVal - vector.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}