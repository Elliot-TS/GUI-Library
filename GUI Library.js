// For a live demo, see https://www.khanacademy.org/computer-programming/gui-library-2/6497064445034496

/** FUNCTIONS **/
var merge = function () {
   var args = arguments;
   var hash = {};
   var arr = [];
   for (var i = 0; i < args.length; i++) {
        for (var j = 0; j < args[i].length; j++) {
            if (hash[args[i][j]] !== true) {
                arr[arr.length] = args[i][j];
                hash[args[i][j]] = true;
            }
        }
    }
    return arr;
};
var isObject = function (a) {
    return a.constructor === Object;
};
var isArray = function (a) {
    return a.constructor === Array;
};
var Default = function (val, def) {
    if (val === undefined) {
        return def;
    }
    else if (def === undefined) {
        return val;
    }
    else if ((isObject(val) || isArray(val)) &&
             (!isObject(def) && !isArray(def))) {
        return val;
    }
    else if (isObject(val) && isObject(def)) {
        var newVal = {};
        var keys = merge(Object.keys(val), Object.keys(def));
        for (var i = 0; i < keys.length; i ++) {
            newVal[keys[i]] = Default(val[keys[i]], def[keys[i]]);
        }
        return newVal;
    }
    else if (isArray(val) && isArray(def)) {
        var newVal = [];
        for (var i = 0; i < max(val.length, def.length); i++) {
            newVal[i] = Default(val[i], def[i]);
        }
        return newVal;
    }
    else {
        return val;
    }
};


// Color Tools
var randomHSB = function (alpha, hue, sat, bright) {
    alpha = alpha || [];
    hue = hue || [];
    sat = sat || [];
    bright = bright || [];
    alpha[0] = alpha[0] || 0;
    alpha[1] = alpha[1] || 255;
    hue[0] = hue[0] || 0;
    hue[1] = hue[1] || 255;
    sat[0] = sat[0] || 0;
    sat[1] = sat[1] || 255;
    bright[0] = bright[0] || 0;
    bright[1] = bright[1] || 255;
    pushStyle ();
    colorMode (HSB);
    var c = color (random(hue[0],hue[1]), random(sat[0],sat[1]), random(bright[0],bright[1]), random(alpha[0],alpha[1]));
    popStyle ();
    return c;
};
var hsbaLift = function (c, h, s, b, a) {
    h = h || 0;
    s = s || 0;
    b = b || 0;
    a = a || 0;
    pushStyle ();
    colorMode (HSB);
    var col = color (
        constrain(hue(c)+h,0,255), 
        constrain(saturation(c)+s,0,255), 
        constrain(brightness(c)+b,0,255), 
        constrain(alpha(c)+a,0,255)
    );
    popStyle ();
    return col;
};

// Mouse Transform Functions
// from https://www.khanacademy.org/computer-programming/mouse-transform-functions-that-make-life-easier/4572667338326016
var mousePushed = false;
var mouseTransforms = {
    translation : [0,0],
    scale : [1,1],
    rotation : 0
};
var preMouseTransforms = {
    translation : [0,0],
    scale : [1,1],
    rotation : 0
};
var pushMouseLayers = [];

var pushMouse = function () {
    // Add the mouse position to pushMouseLayers
    pushMouseLayers.push ([mouseX, mouseY]);
    
    // Push mouse translation
    preMouseTransforms.translation[0] = mouseTransforms.translation[0];
    preMouseTransforms.translation[1] = mouseTransforms.translation[1];
    
    // Push mouse scale
    preMouseTransforms.scale[0] = mouseTransforms.scale[0];
    preMouseTransforms.scale[1] = mouseTransforms.scale[1];
    
    // Push mouse rotation
    preMouseTransforms.rotation = mouseTransforms.rotation;
};
var popMouse = function () {
    // Delete the mouse position from pushMouseLayers and set the mouse position to the last layer
    var mpos = pushMouseLayers.pop();
    mouseX = mpos[0];
    mouseY = mpos[1];
    
    // Clear mouse translation
    mouseTransforms.translation[0] = preMouseTransforms.translation[0];
    mouseTransforms.translation[1] = preMouseTransforms.translation[1];
    
    // Clear mouse scale
    mouseTransforms.scale[0] = preMouseTransforms.scale[0];
    mouseTransforms.scale[1] = preMouseTransforms.scale[1];
    
    // Clear mouse rotation
    mouseTransforms.rotation = preMouseTransforms.rotation;
};
var resetMouse = function () {
    // Reset the mouse position
    mouseX = pushMouseLayers[0][0];
    mouseY = pushMouseLayers[0][1];
    pushMouseLayers = [];
    
    // Clear mouse translation
    mouseTransforms.translation[0] = 0;
    mouseTransforms.translation[1] = 0;
    
    // Clear mouse scale
    mouseTransforms.scale[0] = 1;
    mouseTransforms.scale[1] = 1;
    
    // Clear mouse rotation
    mouseTransforms.rotation = 0;
};


// When the preventApply arguments are passed as true, then the mouse's transforms will not apply until applyMouseTransforms() is called.  This can be useful if there are multiple mouse transforms that may be set in different orders but should be applied in a sensible order

var applyMouseTranslation = function () {
    mouseX += mouseTransforms.translation[0];
    mouseY += mouseTransforms.translation[1];
};
var applyMouseScale = function () {
    mouseX *= mouseTransforms.scale[0];
    mouseY *= mouseTransforms.scale[1];
};
var applyMouseRotation = function () {
    var a = mouseTransforms.rotation;
    var mx = mouseX * cos(mouseTransforms.rotation) - mouseY * sin(mouseTransforms.rotation);
    var my = mouseY * cos(mouseTransforms.rotation) + mouseX * sin(mouseTransforms.rotation);
    
    mouseX = mx;
    mouseY = my;
};
var applyMouseTransform = function () {
    // Translate
    applyMouseTranslation ();
    
    // Scale
    applyMouseScale ();
    
    // Rotate
    applyMouseRotation ();
};

var translateMouse = function (x,y, preventApply) {
    // Assign default values to x and y
    x = x || 0; y = y || 0;
    
    // Translate the mouse
    mouseTransforms.translation[0] = x;
    mouseTransforms.translation[1] = y;
    
    // Apply Translation
    if (!preventApply) { applyMouseTranslation (); }
};
var scaleMouse = function (xScale,yScale, preventApply) {
    // Assign a default value to xScale and yScale
    xScale = xScale || 0;  yScale = yScale || xScale;
    
    // Scale the mouse
    mouseTransforms.scale[0] = xScale;
    mouseTransforms.scale[1] = yScale;
    
    if (!preventApply) { applyMouseScale (); }
};
var rotateMouse = function (angle, preventApply) {
    // Assign a default value for angle
    angle = angle || 0;
    
    // Rotate
    mouseTransforms.rotation = angle;
    
    // Apply Rotation
    
    if (!preventApply) { applyMouseRotation (); }
};

var pushMatrix2 = function () {
    pushMatrix ();
    pushMouse ();
};
var popMatrix2 = function () {
    popMouse ();
    popMatrix ();
};

var translate2 = function (x,y) {
    translate (x,y);
    translateMouse (-x,-y);
};
var scale2 = function (x,y, origin) {
    if (origin !== undefined) {
        translate2 (-origin[0], -origin[1]);
    }
    scale (x,y);
    scaleMouse (1/x,1/y);
    if (origin !== undefined) {
        translate2 (origin[0], origin[1]);
    }
};
var rotate2 = function (a, origin) {
    if (origin !== undefined) {
        translate2 (-origin[0],-origin[1]);
    }
    rotate (a);
    rotateMouse (-a);
    if (origin !== undefined) {
        translate2 (origin[0],origin[1]);
    }
};

// Surround the transform functions that you want to be performed around some origin with these functions.  translateFunc is set by default to translate2.  If you don't want the mouse being transformed as well, manually set the translateFunc to translate
var pushOriginLayers = [];
var pushOrigin = function (x,y, translateFunc) {
    translateFunc = translateFunc || translate2;
    pushOriginLayers.push ({func:translateFunc,x:x,y:y});
    translateFunc (x,y);
};
var popOrigin = function () {
    var pol = pushOriginLayers[pushOriginLayers.length-1];
    pol.func (-pol.x,-pol.y);
    pushOriginLayers.pop();
};

// For checking if the mouse is inside a rounded rectangle
// From https://www.khanacademy.org/computer-programming/rectangle-button-with-rounded-borders/6275532856770560?qa_expand_key=ag5zfmtoYW4tYWNhZGVteXIlCxIIVXNlckRhdGEYqMN5DAsSCEZlZWRiYWNrGICA0c2J6M0KDA
// Checks if a point is inside a quadratic bezier
var inBezier = function (x,y, x0,y0, x1,y1, x2,y2) {
    var a = (
                (y1 - y2) *
                (x - x2) +
                (x2 - x1) *
                (y - y2)
            ) / 
            (
                (y1 - y2) *
                (x0 - x2) +
                (x2 - x1) *
                (y0 - y2)
            );
    var b = (
                (y2 - y0) *
                (x - x2) +
                (x0 - x2) *
                (y - y2)
            ) / 
            (
                (y1 - y2) *
                (x0 - x2) +
                (x2 - x1) *
                (y0 - y2)
            );
    var c = 1 - a - b;
    var t = 1 / (1 + sqrt(a/c));
    var Mt = [
        x0*(1-t)*(1-t) + 2*x1*t*(1-t) + x2*t*t,
        y0*(1-t)*(1-t) + 2*y1*t*(1-t) + y2*t*t
    ];
    
    return (x1-Mt[0])*(x1-Mt[0]) + (y1-Mt[1])*(y1-Mt[1]) <= (x1-x)*(x1-x) + (y1-y)*(y1-y);
};
// Checks if a point is inside a rectangle (supports round corners)
// Assumes rectMode is CORNER
var inRect = function (x,y, rx,ry, w,h, r1,r2,r3,r4) {
    // Give the Radiuses Default Values
    var s = min(w,h) / 2;
    r1 = r1 === undefined ? 0  : constrain(r1, 0, s);
    r2 = r2 === undefined ? r1 : constrain(r2, 0, s);
    r3 = r3 === undefined ? r2 : constrain(r3, 0, s);
    r4 = r4 === undefined ? r1 : constrain(r4, 0, s);
    
    // For each corner, if the radius is 0, then check whether the point is inside that corner.  If the radius is not 0, then check whether the point is within the bezier curve.
    var a = r1 === 0 ?
            (x >= rx && y >= ry) :
            inBezier(x,y, rx+r1,ry, rx,ry, rx,ry+r1);
    var b = r2 === 0 ?
            (x <= rx+w && y >= ry) :
            inBezier(x,y, rx+w-r2,ry, rx+w,ry, rx+w,ry+r2);
    var c = r3 === 0 ?
            (x <= rx+w && y <= ry+h) :
            inBezier(x,y, rx+w-r3,ry+h, rx+w,ry+h, rx+w,ry+h-r3);
    var d = r4 === 0 ?
            (x >= rx && y <= ry+h) :
            inBezier(x,y, rx+r4,ry+h, rx,ry+h, rx,ry+h-r4);
    return  a && b && c && d; // Return whether the point is within each corner
};

/** VARIABLES **/
var _FONTS = {
    sans : createFont("sans"),
};

var _COLORS = {
    black : color(0, 0, 0),
    gray : color(148, 148, 148),
    darkGray : color(94, 94, 94),
    cream : color(240, 239, 232),
    white : color(255, 255, 255),
    blue : color(76, 151, 255),
    transparent : color(0,0,0,1),
};

/** GUI COMPONENTS **/
/* Component - A generic component */
var Component = function (data) { 
    // Gives data default value
    var d = Default(data, {
        text : {
            message : "Button",
            font : _FONTS.sans,
            size : 15,
            align : [CENTER, CENTER],
            color : {
                main : _COLORS.black,
            }
        },
        rect : {
            position : [0, 0],
            size : [100, 50],
            margin : [10], // [all] || [top/bottom, left/right] || [top, left/right, bottom] || [top, left, bottom, right]
            display : "block", // also "inline" and "none"
        },
        shape : {
            radius : [10, 10, 10, 10], // can also take a single number if all radiuses are the same
            align: CORNER,
            smooth : true,
            // background : undefined, // get(x,y,wid,hei) of the background image.
            color : {
                fill : true,
                _mainDefault : _COLORS.gray,
            },
            outline : {
                thickness : 1,
                color : {
                    main : _COLORS.black,
                },
            },
        },
        event : {
            clicked : false,
            released: false,
            dragged : false,
            pressed : false,
            hovered : false,
            toggled : false,
            focused : false,
            stickyClick : false, // keeps clicked true after the click event is called
            keyPressed : false,
            keys : {}, // stores the key.toString() of the pressed keys
            keyCodes : {}, // stores the keyCode of the pressed keys
        },
        transform : {
            rotation : 0,
            translation : [0,0],
            scale : 1,
            origin : [0,0],
            originMode : "relative", // also "absolute"
        },
        mouseScheme : {
            hovered : 'pointer',
            dragging : 'grab',
            rectHovered : 'default',
            rectPressed : 'default',
        },
        percision : 1, // e.g. for a circle, the distance away from the center of the circle that the mouse has to be is percision * the radius of  the circle
    });
    
    Object.assign(this, d);
    // Fill in default colors
    // text
    {
        this.text.color.hovered = Default(
            this.text.color.hovered,
            this.text.color.main
        );
        this.text.color.pressed = Default(
            this.text.color.pressed,
            this.text.color.hovered
        );
        this.text.color.clicked = Default(
            this.text.color.clicked,
            this.text.color.pressed
        );
        this.text.color.dragged = Default(
            this.text.color.dragged,
            this.text.color.pressed
        );
    }
    // shape
    {
        var mainColor;
        if (this.shape.background === undefined) {
            mainColor = this.shape.color._mainDefault;
        }
        else {
            mainColor = _COLORS.transparent;
        }
        this.shape.color.main = Default(
            this.shape.color.main,
            mainColor
        );
        this.shape.color.hovered = Default(
            this.shape.color.hovered,
            hsbaLift(
                this.shape.color.main,
                0,0,20,0
            )
        );
        this.shape.color.pressed = Default(
            this.shape.color.pressed,
            hsbaLift(
                this.shape.color.main,
                0,0,-20,0
            )
        );
        this.shape.color.clicked = Default(
            this.shape.color.clicked,
            this.shape.color.pressed
        );
        this.shape.color.dragged = Default(
            this.shape.color.dragged,
            this.shape.color.pressed
        );
    }
    // shape.outline
    {
        this.shape.outline.color.hovered = Default(
            this.shape.outline.color.hovered,
            this.shape.outline.color.main
        );
        this.shape.outline.color.pressed = Default(
            this.shape.outline.color.pressed,
            this.shape.outline.color.hovered
        );
        this.shape.outline.color.clicked = Default(
            this.shape.outline.color.clicked,
            this.shape.outline.color.pressed
        );
        this.shape.outline.color.dragged = Default(
            this.shape.outline.color.dragged,
            this.shape.outline.color.pressed
        );
    }
    
    // Fill in default margin
    this.rect.margin[1] = Default(this.rect.margin[1], this.rect.margin[0]);
    this.rect.margin[2] = Default(this.rect.margin[2], this.rect.margin[0]);
    this.rect.margin[3] = Default(this.rect.margin[3], this.rect.margin[1]);
    
    // Fill in default text leading
    this.text.leading = Default(
        this.text.leading,
        this.text.size
    );
    
    // Fill in default mouseScheme
    this.mouseScheme.pressed = Default(
        this.mouseScheme.pressed,
        this.mouseScheme.hovered
    );
    this.mouseScheme.clicked = Default(
        this.mouseScheme.clicked,
        this.mouseScheme.pressed
    );
    this.mouseScheme.dragged = Default(
        this.mouseScheme.dragged,
        this.mouseScheme.pressed
    );
    
    // Events
    this.hoveredEvents = [];
    this.pressedEvents = [];
    this.clickedEvents = [];
    this.toggledEvents = [];
    this.draggedEvents = [];
    this.keyPressedEvents = [];
    this.keyReleasedEvents = [];
    
    // Sub-Components
    this.components = [];
    this.parent = null;
    
    // True rect
    this.getTrueRect();
};
Component.prototype = {
    drawUnder : function () {}, // draw anything that needs to be drawn before the main shape is colored (i.e. the slider bar behind the slider button thing
    drawShape : function () {
        rectMode (CORNER);
        if (typeof this.shape.radius === "object") {
            rect (
                this.trueRect.left,
                this.trueRect.top,
                
                this.trueRect.width,
                this.trueRect.height,
                
                this.shape.radius[0],
                this.shape.radius[1],
                this.shape.radius[2],
                this.shape.radius[3]
            );
        }
        else {
            rect (
                this.trueRect.left,
                this.trueRect.top,
                
                this.trueRect.width,
                this.trueRect.height,
                
                this.shape.radius
            );
        }
    }, // draw the main shape of the component
    drawText : function () {
        text (this.text.message, this.trueRect.left, this.trueRect.top, this.trueRect.width, this.trueRect.height);
    }, // draw the text
    draw : function () {
        if (this.rect.display === "none") { return; }
        // TRANSFORM
        pushMatrix2();
        var ox =    this.transform.origin[0] +
                    (this.transform.originMode === "absolute" ?
                        0 :
                        this.trueRect.left);
        var oy =    this.transform.origin[1] +
                    (this.transform.originMode === "absolute" ?
                        0 :
                        this.trueRect.top);
        pushOrigin(ox,oy);
        
        translate2(
            this.transform.translation[0],
            this.transform.translation[1]
        );
        rotate2(this.transform.rotation);
        
        if (typeof this.transform.scale === "object") {
            scale2(
                this.transform.scale[0],
                this.transform.scale[1]
            );
        }
        else {
            scale2(
                this.transform.scale
            );
        }
        popOrigin();
        
        pushStyle();
        
        // SHAPE
        {
            // Smooth
            if (this.shape.smooth) {
                smooth();
            }
            else {
                noSmooth();
            }
            
            // Draw anything that goes under the button and doesn't have any the below determined colors
            this.drawUnder();
            
            // Draw the background
            if (this.shape.background !== undefined) {
                var back = get(this.trueRect.left, this.trueRect.top,this.trueRect.width,this.trueRect.height);
                fill(0);
                rect(this.trueRect.left,this.trueRect.top,this.trueRect.width,this.trueRect.height);
                fill(255);
                this.drawShape();
                
                var imgMask = get(this.trueRect.left,this.trueRect.top,this.trueRect.width,this.trueRect.height);
                image(back, this.trueRect.left,this.trueRect.top);
                
                this.shape.background.mask(imgMask);
                
                image(this.shape.background, this.trueRect.left, this.trueRect.top, this.trueRect.width,this.trueRect.height);
            }
            
            // Colors
            if (this.event.clicked) {
                if (this.shape.color.fill) {fill(this.shape.color.clicked);}
                stroke (this.shape.outline.color.clicked);
            }
            else if (this.event.pressed) {
                if (this.shape.color.fill) {fill (this.shape.color.pressed);}
                stroke(this.shape.outline.color.pressed);
            }
            else if (this.event.hovered) {
                if (this.shape.color.fill) {fill (this.shape.color.hovered);}
                stroke (this.shape.outline.color.hovered);
            }
            else {
                if (this.shape.color.fill) {fill (this.shape.color.main);}
                stroke (this.shape.outline.color.main);
            }
            // Stroke
            strokeWeight (this.shape.outline.thickness);
            if (this.shape.outline.thickness === 0) { noStroke(); }
            
            // Shape
            this.drawShape();
        }
        // TEXT
        {
            // Colors
            if (this.event.clicked) {
                fill (this.text.color.clicked);
            }
            else if (this.event.pressed) {
                fill (this.text.color.pressed);
            }
            else if (this.event.hovered) {
                fill (this.text.color.hovered);
            }
            else {
                fill (this.text.color.main);
            }
            
            // Text Set-Up
            textFont (this.text.font, this.text.size);
            textLeading (this.text.leading);
            textAlign (this.text.align[0], this.text.align[1]);
            
            this.drawText();
    }
        
        // Draw Sub-components
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].draw();
        }
        
        popStyle();
        popMatrix2();
    },
    
    onHovered : function(){
        for (var i = 0; i < this.hoveredEvents.length; i ++) {
            this.hoveredEvents[i].call(this);
        }
    },
    onPressed : function(){
        for (var i = 0; i < this.pressedEvents.length; i ++) {
            this.pressedEvents[i].call(this);
        }
    },
    onClicked : function(){
        for (var i = 0; i < this.clickedEvents.length; i ++) {
            this.clickedEvents[i].call(this);
        }
    },
    onToggled : function(){
        for (var i = 0; i < this.toggledEvents.length; i ++) {
            this.toggledEvents[i].call(this);
        }
    },
    onDragged : function(){
        for (var i = 0; i < this.draggedEvents.length; i ++) {
            this.draggedEvents[i].call(this);
        }
    },
    
    onKeyPressed : function(){
        this.event.keys[key.toString()] = true;
        this.event.keyCodes[keyCode] = false;
        for (var i = 0; i < this.keyPressedEvents.length; i ++) {
            this.keyPressedEvents[i].call(this);
        }
    },
    onKeyReleased : function(){
        this.events.keys[key.toString()] = false;
        this.events.keyCodes[keyCode] = false;
        for (var i = 0; i < this.keyReleasedEvents.length; i ++) {
            this.keyReleasedEvents[i].call(this);
        }
    },
    
    transformMouse : function () {
        // Transform the mouse the match the button's transformation
        var ox =    this.transform.origin[0] +
                    (this.transform.originMode === "absolute" ?
                        0 :
                        this.trueRect.left);
        var oy =    this.transform.origin[1] +
                    (this.transform.originMode === "absolute" ?
                        0 :
                        this.trueRect.top);
        
        pushOrigin(-ox,-oy, translateMouse);
        
        translateMouse(
            -this.transform.translation[0],
            -this.transform.translation[1]
        );
        rotateMouse(-this.transform.rotation);
        if (typeof this.transform.scale === "object") {
            scaleMouse(
                1/this.transform.scale[0],
                1/this.transform.scale[1]
            );
        }
        else {
            scaleMouse(
                1/this.transform.scale
            );
        }
        
        
        popOrigin();
    },
    checkHovered : function () {
        this.transformMouse();
        var r1,r2,r3,r4;
        if (typeof this.shape.radius === "object") {
            r1 = this.shape.radius[0];
            r2 = this.shape.radius[1];
            r3 = this.shape.radius[2];
            r4 = this.shape.radius[3];
        }
        else {
            r1 = this.shape.radius;
            r2 = r1;
            r3 = r1;
            r4 = r1;
        }
        var inside = inRect(
            mouseX, mouseY,
            
            this.trueRect.left, this.trueRect.top,
            this.trueRect.width, this.trueRect.height,
            
            r1, r2, r3, r4
        );
        
        this.event.hovered = inside;
        this.event.rectHovered = inside;
        
        return inside;
    },
    checkPressed : function () {
        this.checkHovered();
        
        this.event.pressed = this.event.hovered && mouseIsPressed;
        
        return this.event.pressed;
    },
    checkClicked : function () {
        if (this.event.clicked && this.event.pressed) {
            this.event.clicked = false; // unclick it
        }
        else {
            this.event.clicked = this.event.pressed;
        }
        
        return this.event.clicked;
    },
    checkToggled : function () {
        if (this.event.hovered) { this.event.toggled = this.event.clicked && !this.event.toggled; }
        return this.event.toggled;
    },
    
    mouseMoved : function () {
        strokeWeight(10);
        pushMouse();
        this.checkHovered();
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].mouseMoved();
        }
        if (this.event.hovered) { this.onHovered(); }
        popMouse();
        
    },
    mousePressed : function () {
        pushMouse();
        this.checkPressed();
        if (this.event.pressed) { this.event.focused = true; }
        else { this.event.focused = false; }
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].mousePressed();
        }
        
        if (this.event.pressed) { this.onPressed(); }
        popMouse();
    },
    mouseReleased : function () {
        pushMouse();
        this.checkClicked();
        this.checkToggled();
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].mouseReleased();
        }
        if (this.event.clicked) { this.onClicked(); }
        if (!this.event.stickyClick) {
            this.event.clicked = false;
        }
        if (this.event.hovered) { this.onToggled(); }
        
        this.event.pressed = false;
        this.event.dragged = false;
        
        popMouse();
    },
    mouseDragged : function () {
        pushMouse();
        this.transformMouse();
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].mouseDragged();
        }
        if (this.event.pressed) { this.onDragged(); }
        popMouse();
    },
    keyPressed : function () {
        if (this.event.focused === false){return;}
        this.event.keyPressed = true;
        
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].keyPressed();
        }
        this.onKeyPressed();
    },
    keyReleased : function () {
        this.event.keyPressed = false;
        if (this.event.focused === false){return;}
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].keyReleased();
        }
        this.onKeyReleased();
    },
    
    
    getTrueRect : function () {
        var px = (this.parent !== null) ? this.parent.trueRect.left : 0;
        var py = (this.parent !== null) ? this.parent.trueRect.top : 0;
        
        if (this.shape.align === CORNER) {
            this.trueRect = {
                top : this.rect.position[1] + py,
                right : this.rect.position[0] + this.rect.size[0] + px,
                bottom : this.rect.position[1] + this.rect.size[1] + py,
                left : this.rect.position[0] + px,
                width : this.rect.size[0],
                height : this.rect.size[1],
            };
        }
        else if (this.shape.align === CENTER) {
            this.trueRect = {
                top : this.rect.position[1] - this.rect.size[1] / 2 + py,
                right : this.rect.position[0] + this.rect.size[0] / 2 + px,
                bottom : this.rect.position[1] + this.rect.size[1] / 2 + py,
                left : this.rect.position[0] - this.rect.size[0] / 2 + px,
                width : this.rect.size[0],
                height : this.rect.size[1]
            };
        }
        else if (this.shape.align === RADIUS) {
            this.trueRect = {
                top : this.rect.position[1] - this.rect.size[1] + py,
                right : this.rect.position[0] + this.rect.size[0] + px,
                bottom : this.rect.position[1] + this.rect.size[1] + py,
                left : this.rect.position[0] - this.rect.size[0] + px,
                width : this.rect.size[0] * 2,
                height : this.rect.size[1] * 2
            };
        }
        else { // this.shape.align === CORNERS
            this.trueRect = {
                top : this.rect.position[1] + py,
                right : this.rect.size[0] + px,
                bottom : this.rect.size[1] + py,
                left : this.rect.position[0] + px,
                width : this.rect.size[0] - this.rect.position[0],
                height : this.rect.size[1] - this.rect.position[1]
            };
        }
        
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].getTrueRect();
        }
        return this.trueRect;
    },
    setTrueRect : function (trueRect, adjustSize) {
        // Adjust the size or positions on each side depending on what information is given in trueRect
        if (adjustSize && trueRect !== undefined) {
            if (trueRect.width === undefined) {
                trueRect.width = (trueRect.right === undefined ? 
                                    this.trueRect.right :
                                    trueRect.right) -
                                (trueRect.left === undefined ?
                                    this.trueRect.left :
                                    trueRect.left);
            }
            if (trueRect.height === undefined) {
                trueRect.height = (trueRect.bottom === undefined ? 
                                    this.trueRect.bottom :
                                    trueRect.bottom) -
                                (trueRect.top === undefined ?
                                    this.trueRect.top :
                                    trueRect.top);
            }
        }
        else if (trueRect !== undefined) {
            if (trueRect.top === undefined) {
                trueRect.top = (trueRect.bottom === undefined ?
                                    this.trueRect.bottom :
                                    trueRect.bottom) -
                                (trueRect.height === undefined ?
                                    this.trueRect.height :
                                    trueRect.height);
            }
            if (trueRect.right === undefined) {
                trueRect.right = (trueRect.left === undefined ?
                                    this.trueRect.left :
                                    trueRect.left) +
                                (trueRect.width === undefined ?
                                    this.trueRect.width :
                                    trueRect.width);
            }
            if (trueRect.bottom === undefined) {
                trueRect.bottom = (trueRect.top === undefined ?
                                    this.trueRect.top :
                                    trueRect.top) +
                                (trueRect.height === undefined ?
                                    this.trueRect.height :
                                    trueRect.height);
            }
            if (trueRect.left === undefined) {
                trueRect.left = (trueRect.right === undefined ?
                                    this.trueRect.right :
                                    trueRect.right) -
                                (trueRect.width === undefined ?
                                    this.trueRect.width :
                                    trueRect.width);
            }
        }
        this.trueRect = Default(trueRect, this.trueRect);
        
        var px = (this.parent !== null) ? this.parent.trueRect.left : 0;
        var py = (this.parent !== null) ? this.parent.trueRect.top : 0;
        
        this.rect.size = [
            this.trueRect.width,
            this.trueRect.height
        ];
        
        if (this.shape.align === CORNER) {
            this.rect.position = [
                this.trueRect.left - px,
                this.trueRect.top - py
            ];
        }
        else if (this.shape.align === CENTER) {
            this.rect.position = [
                this.trueRect.left - this.trueRect.width / 2 - px,
                this.trueRect.top - this.trueRect.height / 2 - py
            ];
        }
        else if (this.shape.align === RADIUS) {
            this.rect.position = [
                this.trueRect.left - this.trueRect.width - px,
                this.trueRect.top - this.trueRect.height - py
            ];
            this.rect.size[0] *= 2;
            this.rect.size[1] *= 2;
        }
        else { // this.shape.align === CORNERS
            this.rect.position = [
                this.trueRect.left - px,
                this.trueRect.top - py
            ];
            this.rect.size = [
                this.trueRect.right - px,
                this.trueRect.bottom - py
            ];
        }
        
        
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].getTrueRect();
        }
    },
};

/* GUI - A GUI window */
var GUI = function (data) {
    var d = Default(data, {
        text : {
            message : "Window",
            align : [CENTER, TOP],
        },
        rect : {
            padding : [20], // same as margin
            maxSize : [width, height],
        },
        shape : {
            color : {
                _mainDefault : _COLORS.darkGray
            }
        },
    });
    var mainColor;
    if (d.shape.background === undefined) {
        mainColor = d.shape.color._mainDefault;
    }
    else {
        mainColor = _COLORS.transparent;
    }
    d.shape.color.main = Default(
        d.shape.color.main,
        mainColor
    );
    d.shape.color.hovered = Default(
        d.shape.color.hovered,
        d.shape.color.main
    );
    d.shape.color.pressed = Default(
        d.shape.color.pressed,
        d.shape.color.hovered
    );
    Component.call(this, d);
    
    // Fill in default padding
    this.rect.padding[1] = Default(this.rect.padding[1], this.rect.padding[0]);
    this.rect.padding[2] = Default(this.rect.padding[2], this.rect.padding[0]);
    this.rect.padding[3] = Default(this.rect.padding[3], this.rect.padding[1]);
    
    // Rows of components
    this.rows = [[]];
};
Object.assign(GUI.prototype, Component.prototype, {
    getTallestFromRow : function (row) {
        var tallest = 0;
        for (var i = 0; i < this.rows[row].length; i ++) {
            tallest = max(tallest, this.rows[row][i].trueRect.bottom + this.rows[row][i].rect.margin[2]);
        }
        return tallest;
    },
    addComponent : function (component, keepPosition) {
        if (keepPosition !== true) {
            component.rect.position = [0,0];
            component.getTrueRect();
        }
        component.parent = this;
        this.components.push(component);
        
        // Find the component's actual position
        this.setComponentPosition(this.components.length - 1);
    },
    setComponentPosition : function (componentIndex) {
        var component = this.components[componentIndex];
        
        var left = this.trueRect.left + this.rect.padding[3];
        var top = this.trueRect.top + this.rect.padding[0];
        var farRight = this.trueRect.right;
        var farBottom = this.trueRect.bottom;
        var pRight = this.rect.padding[1];
        var pBottom = this.rect.padding[2];
        
        var x = left;
        var y = top;
        var row = this.rows.length - 2;
        var tallest = top;
        
        if (row >= 0) {
            for (var i = 0; i < this.rows[row].length; i ++) {
                var comp = this.rows[row][i];
                if (comp.rect.display === "none") { continue; }
                tallest = max(tallest, this.rows[row][i].trueRect.bottom + this.rows[row][i].rect.margin[2]);
            }
            y = tallest;
        }
        row ++;
        
        for (var i = 0; i < this.rows[row].length; i ++) {
            var comp = this.rows[row][i];
            if (comp.rect.display === "none") { continue; }
            tallest = max(tallest, comp.trueRect.bottom + comp.rect.margin[2]);
        }
        
        if (component.rect.display === "inline") {
            var comp = this.rows[row][this.rows[row].length - 1];
            if (comp !== undefined) {
                x = comp.trueRect.right + comp.rect.margin[1];
                if (x + component.rect.size[0] + component.rect.margin[3] >
                    this.rect.maxSize[0] + this.trueRect.left - this.rect.padding[1])
                {
                    x = left;
                    y = tallest;
                }
            }
        }
        else {
            y = tallest;
        }
        
        
        x += component.rect.margin[3];
        y += component.rect.margin[0];
        
        component.setTrueRect({
            left : x,
            top : y
        });
        
        farRight = max(component.trueRect.right + component.rect.margin[1] + pRight, farRight);
        farBottom = max(component.trueRect.bottom + component.rect.margin[2] + pBottom, farBottom);
        this.setTrueRect({
            right : farRight,
            bottom : farBottom
        }, true);
        
        
        
        this.rows[this.rows.length - 1].push(component);
        
        if (component.rect.display !== "inline") {
            this.rows.push([]);
        }
    },
    adjustComponentPositions : function () {
        this.rows = [[]];
        for (var i = 0; i < this.components.length; i ++) {
            this.setComponentPosition(i);
        }
    },
});
var _GUIs = [];

/* Button */
var Button = Component; // Since the generic component is literally just an ordinary button

/* Circle Button */
// Dependencies: Component
var CircleButton = function (data) {
    Component.call(this, Default(data, {
        shape : {
            color : {},
        },
        text : {
            message : "Circle\nButton",
            size : 12,
        },
        rect : {
            size : [50,50],
        },
        percision : 1,
    }));
    
    this.shape.color.halo = Default(
        this.shape.color.halo,
        color (
            hsbaLift(this.shape.color.main, 0,0,-100,0),
            50
        )
    );
    
};
Object.assign(CircleButton.prototype, Component.prototype, {
    drawUnder : function () {
        if (this.percision > 1 && this.event.hovered) {
            fill(this.shape.color.halo);
            ellipseMode(CORNER);
            noStroke();
            var w = this.trueRect.width * this.percision;
            var h = this.trueRect.height * this.percision;
            ellipse(
                this.trueRect.left - (w - this.trueRect.width) / 2,
                this.trueRect.top - (h - this.trueRect.height) / 2, 
                
                w, 
                h
            );
        }
    },
    drawShape : function () {
        ellipseMode(CORNER);
        ellipse(
            this.trueRect.left, 
            this.trueRect.top, 
            
            this.trueRect.width, 
            this.trueRect.height
        );
    },
    checkHovered : function () {
        this.transformMouse();
        
        var rx = this.trueRect.width / 2;
        var ry = this.trueRect.height / 2;
        var h = this.trueRect.left + rx;
        var k = this.trueRect.top + ry;
        rx *= this.percision;
        ry *= this.percision;
        
        var inside=((ry*ry) * (mouseX - h)*(mouseX - h) +
                    (rx*rx) * (mouseY - k)*(mouseY - k)) <= rx*rx * ry*ry;
        
        this.event.hovered = inside;
        this.event.rectHovered = inside;
        return inside;
    },
});

/* Node */
// Dependencies: CircleButtomn
var Node = function (data) {
    var d = Default(data, {
        text : {
            message : "",
        },
        rect : {
            size : [10,10],
        },
        valueX : 25,
        valueY : 25,
        percisionX : 1,
        percisionY : 1,
        valueConstraints : {
            minimumX : 0,
            maximumX : 100,
            minimumY : 0,
            maximumY : 100,
        },
        positionConstraints : {
            minimumX : 0,
            maximumX : 100,
            minimumY : 0,
            maximumY : 100,
        },
    });
    CircleButton.call(this, d);
    
    this.draggedEvents.push(this.onDraggedEvent);
};
Object.assign(Node.prototype, CircleButton.prototype, {
    drawText : function () {},
    updatePosition : function () {
        var minvx = this.valueConstraints.minimumX;
        var maxvx = this.valueConstraints.maximumX;
        var minvy = this.valueConstraints.minimumY;
        var maxvy = this.valueConstraints.maximumY;
        
        if (minvx === maxvx) {
            this.rect.position[0] = this.positionConstraints.minimumX;
        }
        else {
            this.rect.position[0] = map(
                this.valueX,
                minvx,
                maxvx,
                this.positionConstraints.minimumX,
                this.positionConstraints.maximumX
            );
        }
        
        if (minvy === maxvy) {
            this.rect.position[1] = this.valueConstraints.minimumY;
        }
        else {
            this.rect.position[1] = map(
                this.valueY,
                this.valueConstraints.minimumY,
                this.valueConstraints.maximumY,
                this.positionConstraints.minimumY,
                this.positionConstraints.maximumY
            );
        }
        this.getTrueRect();
    },
    onDraggedEvent : function () {
        pushMouse();
        this.transformMouse();
        
        var sx = this.parent.trueRect.left;
        var sy = this.parent.trueRect.top;
        var ex = this.parent.trueRect.right;
        var ey = this.parent.trueRect.bottom;
        var mx = mouseX;
        var my = mouseY;
        this.valueX = map(mx,
            sx + this.rect.size[0], 
            ex - this.rect.size[0],
            this.valueConstraints.minimumX, 
            this.valueConstraints.maximumX
        );
        this.valueY = map(my,
            sy + this.rect.size[1] / 2, 
            ey - this.rect.size[1] / 2,
            this.valueConstraints.minimumY, 
            this.valueConstraints.maximumY
        );
        this.valueX = constrain(
            this.valueX,
            this.valueConstraints.minimumX,
            this.valueConstraints.maximumX
        );
        this.valueY = constrain(
            this.valueY,
            this.valueConstraints.minimumY,
            this.valueConstraints.maximumY
        );
        
        this.valueX = round(this.valueX / this.percisionX) * this.percisionX;
        this.valueY = round(this.valueY / this.percisionY) * this.percisionY;
        this.updatePosition();
        popMouse();
    },
});

/* Slider */
// Dependencies: Node -> CircleButton
var Slider = function (data) {
    var d = Default(data, {
        rect : {
            size : [150, 25],
        },
        shape : {
            thickness : 5,
            color : {},
        },
        value : 25,
        minimum : 0,
        maximum : 100,
        percision : 1,
        knob : {
            text : {
                message : true,
            },
            rect : {
                size : [],
            },
            valueConstraints : {},
            positionConstraints : {},
        },
    });
    if (d.rect.size[0] < d.rect.size[1]) {
        d.rect.display = Default(d.rect.display, "inline");
    }
    
    // Default colors
    d.shape.color.hovered = Default(d.shape.color.hovered, d.shape.color.main);
    d.shape.color.pressed = Default(d.shape.color.pressed, d.shape.color.hovered);
    
    Component.call(this, d);
    
    // Slider Values
    this.getTrueRect();
    this.setSliderData();
    
    // Knob
    this.knob.rect.size = Default(this.knob.rect.size, [this.rect.short, this.rect.short]);
    this.knob.percisionX = this.percision;
    this.knob.percisionY = this.percision;
    if (this.rect.horizontal) {
        this.knob.valueConstraints = {
            minimumX : this.minimum,
            maximumX : this.maximum,
            minimumY : 0,
            maximumY : 0
        };
        this.knob.positionConstraints = {
            minimumX : 0,
            maximumX : this.rect.length - this.trueRect.height / 2,
            minimumY : 0,
            maximumY : 0
        };
        this.knob.valueX = this.value;
        this.knob.valueY = 0;
    }
    else {
        this.knob.valueConstraints = {
            minimumY : this.minimum,
            maximumY : this.maximum,
            minimumX : 0,
            maximumX : 0
        };
        this.knob.positionConstraints = {
            minimumY : 0,
            maximumY : this.rect.length - this.trueRect.width / 2,
            minimumX : 0,
            maximumX : 0
        };
        this.knob.valueX = 0;
        this.knob.valueY = this.value;
    }
    
    this.knob = new Node(this.knob);
    this.knob.parent = this;
    this.components.push(this.knob);
    
    this.knob.drawText = this.drawKnobText;
    this.knob.draggedEvents.push(function() {
        this.parent.value = this.parent.rect.horizontal ?
                            this.valueX :
                            this.valueY;
    });
};
Object.assign(Slider.prototype, Component.prototype, {
    setSliderData : function () {
        this.range = this.maximum - this.mimimum;
        this.rect.long = max(this.trueRect.width, this.trueRect.height);
        this.rect.short = min(this.trueRect.width, this.trueRect.height);
        this.rect.horizontal = this.trueRect.width >= this.trueRect.height;
        this.rect.length = this.rect.long - this.rect.short / 2;
    },
    drawShape : function () {
        if (this.event.clicked) {
            stroke (this.shape.color.clicked);
        }
        else if (this.event.pressed) {
            stroke (this.shape.color.pressed);
        }
        else if (this.event.hovered) {
            stroke (this.shape.color.hovered);
        }
        else {
            stroke (this.shape.color.main);
        }
        strokeWeight (this.shape.thickness);
        line(
            this.trueRect.left + this.rect.short / 2,
            this.trueRect.top + this.rect.short / 2,
            
            this.trueRect.right - this.rect.short / 2,
            this.trueRect.bottom - this.rect.short / 2
        );
        this.knob.updatePosition();
    },
    drawText : function () {},
    
    drawKnobText : function () {
        if (this.text.message === true) {
            text(this.parent.value, this.trueRect.left, this.trueRect.top, this.trueRect.width, this.trueRect.height);
        }
    },
});

/* Radio */
// Dependencies: GUI, CircleButton
var Radio = function (data) {
    var d = Default(data, {
        text : {
            message : "",
        },
        shape : {
            color : {
                main : color(255, 255, 255, 0),
            },
            outline: {
                thickness : 0,
            },
        },
        radios : [
            {
                message : "Value 1",
                toggled : false,
            },
            {
                message : "Value 2",
                toggled : true,
            },
            {
                message : "Value 3",
                toggled : false,
            },
            {
                message : "Value 4",
                toggled : false,
            }
        ],
        radioData : {
            text : {
                align : [LEFT, CENTER],
            },
            shape : {
                color : {
                    toggled : color(144, 181, 232),
                },
            },
            rect : {
                size : [15,15],
            },
            percision : 2,
        },
    });
    GUI.call(this, d);
    
    // Add the radio buttons
    for (var i = 0; i < this.radios.length; i ++) {
        var radio = new CircleButton(this.radioData);
        radio.text.message = this.radios[i].message;
        radio.event.toggled = this.radios[i].toggled;
        
        radio.drawText = this.drawRadioText;
        radio.drawShape = this.drawRadioShape;
        radio.onToggled = this.radioOnToggled;
        
        this.addComponent(radio);
    }
};
Object.assign(Radio.prototype, GUI.prototype, {
    drawRadioText : function () {
        textAlign(LEFT, CENTER);
        text (this.text.message, this.trueRect.left + this.rect.size[0] + textAscent(), this.trueRect.top + this.rect.size[1]/2);
    },
    drawRadioShape : function () {
        ellipseMode(CORNER);
        if (this.event.toggled) { fill(this.shape.color.toggled); }
        ellipse(
            this.trueRect.left, 
            this.trueRect.top, 
            
            this.trueRect.width, 
            this.trueRect.height
        );
    },
    radioOnToggled : function () {
        var radios = this.parent.components;
        for (var i = 0; i < radios.length; i ++) {
            if (!radios[i].event.hovered) {radios[i].event.toggled = false; }
        }
    },
});

/* Checkbox */
// Dependencies: GUI, Button
var Checkbox = function (data) {
    var d = Default(data, {
        text : {
            message : "",
        },
        shape : {
            color : {
                main : color(255, 255, 255, 0),
            },
            outline: {
                thickness : 0,
            },
        },
        checkboxes : [
            {
                message : "Value 1",
                toggled : false,
            },
            {
                message : "Value 2",
                toggled : true,
            },
            {
                message : "Value 3",
                toggled : false,
            },
            {
                message : "Value 4",
                toggled : false,
            }
        ],
        checkboxData : {
            text : {
                align : [LEFT, CENTER],
            },
            shape : {
                color : {
                    toggled : color(144, 181, 232),
                },
                radius : 2,
            },
            rect : {
                size : [18,18],
            },
            percision : 2,
        },
    });
    GUI.call(this, d);
    
    // Add the checkbox buttons
    for (var i = 0; i < this.checkboxes.length; i ++) {
        var checkbox = new Button(this.checkboxData);
        checkbox.text.message = this.checkboxes[i].message;
        checkbox.event.toggled = this.checkboxes[i].toggled;
        
        checkbox.drawText = this.drawCheckboxText;
        checkbox.drawShape = this.drawCheckboxShape;
        
        this.addComponent(checkbox);
    }
};
Object.assign(Checkbox.prototype, GUI.prototype, {
    drawCheckboxText : function () {
        textAlign(LEFT, CENTER);
        text (this.text.message, this.trueRect.left + this.rect.size[0] + textAscent(), this.trueRect.top + this.rect.size[1]/2);
    },
    drawCheckboxShape : function () {
        if (this.event.toggled) { fill(this.shape.color.toggled); }
        rectMode (CORNER);
        if (typeof this.shape.radius === "object") {
            rect (
                this.trueRect.left,
                this.trueRect.top,
                
                this.trueRect.width,
                this.trueRect.height,
                
                this.shape.radius[0],
                this.shape.radius[1],
                this.shape.radius[2],
                this.shape.radius[3]
            );
        }
        else {
            rect (
                this.trueRect.left,
                this.trueRect.top,
                
                this.trueRect.width,
                this.trueRect.height,
                
                this.shape.radius
            );
        }
    },
});

/* Textbox */
// Dependencies: Button
var Textbox = function (data) {
    var d = Default(data, {
        text : {
            message : "",
        },
    });
    Component.call(this, d);
    
    this.keyPressedEvents.push(this.keyPressedEvent);
};
Object.assign(Textbox.prototype, Component.prototype, {
    keyPressedEvent : function () {
        println("hi");
        this.text.message += key.toString();
    },
});


/* DotGraph */
// Dependencies: Node
var DotGraph = function (data) {
    var d = Default(data, {
        text : {
            message : "Graph (x, y)",
            align : [CENTER, BOTTOM],
            size : 20,
            color : {},
        },
        rect : {
            size : [150, 150],
        },
        shape : {
            thickness : 5,
            radius : [0,0,0,0],
            color : {
                //main : _COLORS.gray
            },
        },
        nodeData : {
            valueConstraints : {
                minimumX : 0,
                maxminumX : 100,
                minimumY : 0,
                maximumY : 100,
            },
            positionConstraints : {
                minimumX : 0,
                maximumY : 0,
            },
            rect : {
                size : [10,10],
            },
            percision : 2,
        },
        nodes : [
            [25, 25],
        ],
    });
    
    // Default colors
    d.shape.color.hovered = Default(d.shape.color.hovered, d.shape.color.main);
    d.shape.color.pressed = Default(d.shape.color.pressed, d.shape.color.hovered);
    d.text.color.main = Default(
        d.text.color.main,
        color(0,0,0,70)
    );
    // Default position constraints
    d.nodeData.positionConstraints.maximumX = d.rect.size[0] - d.nodeData.rect.size[0];
    d.nodeData.positionConstraints.maximumY = d.rect.size[1] - d.nodeData.rect.size[1];
    
    Component.call(this, d);
    
    // Create dots
    for (var i = 0; i < this.nodes.length; i ++) {
        var node = new Node(this.nodeData);
        node.valueX = this.nodes[i][0];
        node.valueY = this.nodes[i][1];
        node.updatePosition();
        this.components.push(node);
        node.parent = this;
    }
    
    if (this.nodes.length === 1) {
        this.pressedEvents.push(function() {
            this.components[0].event.pressed = true;
            this.components[0].onDragged();
        });
    }
};
Object.assign(DotGraph.prototype, Component.prototype, {
    mouseDragged : function (sub) {
        pushMouse();
        this.transformMouse();
        for (var i = 0; i < this.components.length; i ++) {
            this.components[i].mouseDragged(true);
            if (this.components[i].event.pressed) { break; }
        }
        if (this.event.pressed) { this.onDragged(); }
        popMouse();
    },
});

var gui = new GUI({
    text : {
        message : "Demo",
    },
    shape : {
        radius : 0,
        outline : {
            thickness : 0,
        },
    },
});
_GUIs.push(gui);

var btn = new Button({
    rect : {
        size : [150,60],
    },
    shape : {
        radius : [0, 30, 10, 60],
        outline : {
            thickness : 0
        },
    },
    text : {
        size : 25,
    },
});
gui.addComponent(btn);
var slider = new Slider({
    maximum : 255,
    value : 200,
    transform : {
        rotation : 10,
        origin: [75,13],
    },
});
gui.addComponent(slider);

var graph = new DotGraph({
    text : {
        message : "Color (hue, sat)",
        size : 18,
    },
    nodeData : {
        valueConstraints : {
            maximumX : 255,
            maximumY : 255,
        },
    },
    nodes : [
        [162, 53],
    ],
    id : 10
});
gui.addComponent(graph);

var checkbox = new Checkbox({});
gui.addComponent(checkbox);

var gui2 = new GUI({
    text : {
        message : "Demo",
    },
    shape : {
        radius : 0,
        outline : {
            thickness : 0,
        },
    },
    rect : {
        position : [210,0]
    },
});
_GUIs.push(gui2);

var radio = new Radio();
gui2.addComponent(radio);

var txt = new Textbox();
gui2.addComponent(txt);

draw = function() {
    colorMode(HSB);
    background(graph.components[0].valueX, graph.components[0].valueY, slider.value);
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].draw();}
};
mouseMoved = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].mouseMoved();}
};
mousePressed = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].mousePressed();}
};
mouseReleased = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].mouseReleased();}
};
mouseDragged = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].mouseDragged();}
};

keyPressed = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].keyPressed();}
};
keyReleased = function () {
    for (var g = 0; g < _GUIs.length; g++) {_GUIs[g].keyReleased();}
};
