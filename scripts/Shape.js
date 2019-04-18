var TwoPi = Math.PI*2;

module.exports = {

    Shape: this,

    // Client use
    pushCxt(cxt, obj) {
        cxt.save();
        cxt.translate(obj.x, obj.y);
        cxt.rotate(-obj.rotation);
    },

    // Client use
    popCxt(cxt) {
        cxt.restore();
    },

    "Square": {
        draw(cxt, obj) {
            Shape.pushCxt(cxt, obj);
            cxt.fillStyle = "white";
            cxt.fillRect(-obj.size*0.5, -obj.size*0.5, obj.size, obj.size);
            Shape.popCxt(cxt);
        }
    },
    
    "Circle": {
        draw(cxt, obj) {
            cxt.fillStyle = "white";
            cxt.beginPath();
            cxt.arc(obj.x, obj.y, obj.size*0.5, 0, TwoPi);
            cxt.fill();
        }
    },
    
    "Bullet": {
        draw(cxt, obj) {
            cxt.fillStyle = "yellow";
            cxt.fillRect(obj.x-obj.size*0.5, obj.y-obj.size*5*0.5, obj.size, obj.size*5);
        }
    },

    // Server use
    isCollide(obj1, obj2) {
        var radii = (obj1.size + obj2.size)*0.5;
        var xdiff = obj1.pos.x - obj2.pos.x;
        var ydiff = obj1.pos.y - obj2.pos.y;
        var dis = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
        return dis <= radii ? {radii, xdiff, ydiff} : false;
    },

    resolveCollision(obj1, obj2, {radii, xdiff, ydiff}) {
        var length = Math.sqrt(xdiff*xdiff + ydiff*ydiff) || 1;
        var xunit = xdiff / length;
        var yunit = ydiff / length;
        var radiisum = radii + 1;
        obj1.pos.x = obj2.pos.x + (radiisum * xunit || 1); 
        obj1.pos.y = obj2.pos.y + (radiisum * yunit || 1);
    }
}