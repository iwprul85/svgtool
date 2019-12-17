var xmlns = "http://www.w3.org/2000/svg";

var Menu = (function () {
    function Menu(settings) {
        this.settings = settings;
    }   
    return Menu;
}());


var SvgTools = (function () {
    function SvgTools() {
        this.originalMousePosition = null;
        this.lastMousePosition = null;
        this.currentMousePosition = null;
        this.createdObject = null;
        this.svg = createSvgField();
        // svg 영역 이벤트 처리
        this.addEventListener(this.svg);

        var menu = this.createMenu();
        // var _menu = document.getElementsByClassName("shape").item(0);
        var editor = document.createElement("div");
        editor.appendChild(menu); 
        editor.appendChild(this.svg);
        var myNodeName = document.getElementById("svgField");
        console.log(myNodeName);
        myNodeName.appendChild(editor);
    }

    createSvgField = function () {
        var svgField = document.createElementNS(xmlns, "svg");

        svgField.setAttribute("id", "svgFile");
        svgField.setAttribute("style", "border:1px solid black;");
        svgField.setAttribute("width", "100%");
        svgField.setAttribute("height", "800px");
        
        return svgField;
    };

    SvgTools.prototype.addEventListener = function (svg) {
        svg.addEventListener("mousedown", this.onMouseDown.bind(this));
        svg.addEventListener("mousemove", this.onMouseMove.bind(this));
        svg.addEventListener("mouseup", this.onMouseUp.bind(this));
    };
    
    SvgTools.prototype.createMenu = function () {
        this.menuSettings = {
            shape: "circle",
            color: "black",
            fill: "none",
            size: 3
        };
        var menu = new Menu(this.menuSettings);


        menu.setColors(["black", "red", "blue", "yellow", "grey", "purple"]);
        menu.setFills(["none", "black", "red", "blue", "yellow", "grey", "purple"]);
        menu.setSizes([1, 2, 3, 4, 5, 6]);
        menu.setShapes(["rect", "line", "circle", "ellipse", "polygon"]);

        return menu.getElement();
    };


    // 각 div영역별 버튼을 child로 달고, 메뉴 리턴
    Menu.prototype.getElement = function () {
        // console.log("this : ", this);
        var _this = this;
        var menu = document.createElement("div");
        menu.classList.add("menu"); // class menu 추가

        Object.keys(this.settings)
            .map(function (setting) {
                var div = document.createElement("div");
                _this[setting + "s"].map(function (button) {
                    return div.appendChild(button);
                }, false);
            menu.appendChild(div);
            
        });
        return menu;
    };

    SvgTools.prototype.onMouseMove = function (event) {;
        if (this.originalMousePosition === null)
            return;
        this.lastMousePosition = this.currentMousePosition;
        this.currentMousePosition = { 
            x: event.offsetX,
            y: event.offsetY
        };
        this.updateCurrentObject();
    };


    SvgTools.prototype.onMouseUp = function () {   
        this.originalMousePosition = null; 
        this.lastMousePosition = null;
    };

    SvgTools.prototype.onMouseDown = function (event) {
        console.log('onMouseDown');
        this.createdObject = document.createElementNS(xmlns, this.menuSettings.shape);
        this.createdObject.setAttributeNS(null, "fill", this.menuSettings.fill);
        this.createdObject.setAttributeNS(null, "stroke", this.menuSettings.color);
        this.createdObject.setAttributeNS(null, "stroke-width", String(this.menuSettings.size));
        this.svg.appendChild(this.createdObject);
        this.originalMousePosition = this.lastMousePosition = this.currentMousePosition = {
            x: event.offsetX,
            y: event.offsetY
        };
        switch (this.menuSettings.shape) {
            case "polygon" :
                var startPoint = this.currentMousePosition.x + " " + this.currentMousePosition.y;
                this.createdObject.setAttributeNS(null, "points", startPoint);
        }

    };

    SvgTools.prototype.updateCurrentObject = function () {
        var topLeft = {
            x: Math.min(this.currentMousePosition.x, this.originalMousePosition.x),
            y: Math.min(this.currentMousePosition.y, this.originalMousePosition.y)
        };
        var bottomRight = {
            x: Math.max(this.currentMousePosition.x, this.originalMousePosition.x),
            y: Math.max(this.currentMousePosition.y, this.originalMousePosition.y)
        };
        switch (this.menuSettings.shape) {
            case "line":
                this.createdObject.setAttributeNS(null, "x1", this.originalMousePosition.x);
                this.createdObject.setAttributeNS(null, "y1", this.originalMousePosition.y);
                this.createdObject.setAttributeNS(null, "x2", this.currentMousePosition.x);
                this.createdObject.setAttributeNS(null, "y2", this.currentMousePosition.y);
                break;
            case "rect":
                this.createdObject.setAttributeNS(null, "x", topLeft.x);
                this.createdObject.setAttributeNS(null, "y", topLeft.y);
                this.createdObject.setAttributeNS(null, "width", bottomRight.x - topLeft.x);
                this.createdObject.setAttributeNS(null, "height", bottomRight.y - topLeft.y);
                break;
            case "circle":
                this.createdObject.setAttributeNS(null, "cx", (topLeft.x + bottomRight.x) / 2);
                this.createdObject.setAttributeNS(null, "cy", (topLeft.y + bottomRight.y) / 2);
                var radius = (bottomRight.x - topLeft.x) / 2;
                this.createdObject.setAttributeNS(null, "r", radius);
                break;
            case "ellipse":
                this.createdObject.setAttributeNS(null, "cx", (topLeft.x + bottomRight.x) / 2);
                this.createdObject.setAttributeNS(null, "cy", (topLeft.y + bottomRight.y) / 2);
                this.createdObject.setAttributeNS(null, "rx", (bottomRight.x - topLeft.x) / 2);
                this.createdObject.setAttributeNS(null, "ry", (bottomRight.y - topLeft.y) / 2);
                break;
            case "polygon" :
                var points = this.createdObject.getAttribute("points") + ",";
                console.log("points값 : ", points);
                points += this.currentMousePosition.x;
                points += " ";
                points += this.currentMousePosition.y;

                this.createdObject.setAttributeNS(null, "points", points);
                
        }
    };
    return SvgTools;
}());


Menu.prototype.setShapes = function (shapes) {
    console.log('(Menu)Menu.prototype.setShapes');
    var _this = this;
    this.shapes = shapes.map(function (str) {
        console.log(str);
        var button = document.createElement("button");
        console.log("button : ", button);
        button.addEventListener("click", function (event) {
            return _this.onClick("shape", str);
        }, false);
        button.textContent = str;
        button.id = str;
        return button;
    });
    console.log("this.shapes : ", this.shapes);
};

Menu.prototype.setColors = function (colors) {
    console.log('(Menu)Menu.prototype.setColors');
    var _this = this;
    this.colors = colors.map(function (str) {
        var button = document.createElement("button");
        button.addEventListener("click", function (event) {
            return _this.onClick("color", str);
        }, false);
        button.style.setProperty("border-color", str);
        button.textContent = str;
        button.value = str;
        return button;
    });
};

Menu.prototype.onClick = function (setting, value) {
    console.log("setting : ", setting);
    console.log("value : ", value);
    this.settings[setting] = value;
    console.log("onClick의 this : ", this);
};

Menu.prototype.setFills = function (colors) {
    console.log('(Menu)Menu.prototype.setFills');
    var _this = this;
    this.fills = colors.map(function (str) {
        var button = document.createElement("button");
        button.addEventListener("click", function (event) {
            return _this.onClick("fill", str);
        }, false);
        button.style.setProperty("background-color", str);
        button.textContent = str;
        button.value = str;
        return button;
    });
};

Menu.prototype.setSizes = function (sizes) {
    console.log('sizes');
    var _this = this;
    this.sizes = sizes.map(function (number) {
        var button = document.createElement("button");
        button.addEventListener("click", function (event) {
            return _this.onClick("size", number);
     }, false);
        button.textContent = String(number);
        button.value = String(number);
        return button;
    });
};

new SvgTools();
