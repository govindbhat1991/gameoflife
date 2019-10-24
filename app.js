(function () {
    "use strict";
    var gameOfLife = {
        maxCellRows: 0,
        iteration: 0,
        interval: null,
        items: [],
        applyState: function (x, y) {
            var returnValue = 0;
            var presetPopulated = [
                [this.maxCellRows / 2, this.maxCellRows / 2],
                [this.maxCellRows / 2, this.maxCellRows / 2 + 1],
                [this.maxCellRows / 2 + 1, this.maxCellRows / 2 + 1],
                [this.maxCellRows / 2, this.maxCellRows / 2 + 2],
                [this.maxCellRows / 2 - 1, this.maxCellRows / 2 + 2],
                [this.maxCellRows / 2 - 2, this.maxCellRows / 2 + 1],
                [this.maxCellRows / 2 - 2, this.maxCellRows / 2 + 4],
                [this.maxCellRows / 2 - 3, this.maxCellRows / 2 + 2],
                [this.maxCellRows / 2 - 3, this.maxCellRows / 2 + 3],
                [this.maxCellRows / 2 - 3, this.maxCellRows / 2 + 4]
            ];
            presetPopulated.map(element => {
                if (element[0] == x && element[1] == y) {
                    returnValue = 1;
                    return false;
                }
            });
            return returnValue;
        },

        highLightCells: function () {
            var rowEles = document.getElementById('table').children;
            this.items.map((element, index) => {
                element.map((innerElement, innerIndex) => {
                    if (innerElement.state) {
                        rowEles[index].children[innerIndex].style.backgroundColor = "#833b3b";
                    } else {
                        rowEles[index].children[innerIndex].style.backgroundColor = "#666";
                    }
                });
            });
        },

        getNeighbour: function () {
            this.items.map((element, index) => {
                element.map((innerElement, innerIndex) => {
                    var neighbour = {};

                    if (0 <= innerElement.x - 1) neighbour.top = this.items[innerElement.x - 1][innerElement.y].state;
                    if (innerElement.x + 1 < this.maxCellRows) neighbour.bottom = this.items[innerElement.x + 1][innerElement.y].state;
                    if (0 <= innerElement.y - 1) neighbour.left = this.items[innerElement.x][innerElement.y - 1].state;
                    if (innerElement.y + 1 < this.maxCellRows) neighbour.right = this.items[innerElement.x][innerElement.y + 1].state;
                    if ((0 <= innerElement.x - 1) && (0 <= innerElement.y - 1)) neighbour.topLeft = this.items[innerElement.x - 1][innerElement.y - 1].state;
                    if ((0 <= innerElement.x - 1) && (innerElement.y + 1 < this.maxCellRows)) neighbour.topRight = this.items[innerElement.x - 1][innerElement.y + 1].state;
                    if ((innerElement.x + 1 < this.maxCellRows) && (0 <= innerElement.y - 1)) neighbour.bottomLeft = this.items[innerElement.x + 1][innerElement.y - 1].state;
                    if ((innerElement.x + 1 < this.maxCellRows) && (innerElement.y + 1 < this.maxCellRows)) neighbour.bottomRight = this.items[innerElement.x + 1][innerElement.y + 1].state;

                    innerElement.neighbour = neighbour;
                });
            });
        },

        nextState: function () {
            var newRow = [];
            var tempItems = [];

            this.items.map((element, index) => {
                newRow = element.map((innerElement, innerIndex) => {
                    var chance = Object.values(innerElement.neighbour).reduce((total, value) => {
                        return total + value;
                    });
                    if (chance < 2 || chance > 3) {
                        innerElement.state = 0;
                    }
                    else if (chance == 3) {
                        innerElement.state = 1;
                    }
                    return {
                        x: innerElement.x,
                        y: innerElement.y,
                        state: innerElement.state,
                        neighbour: innerElement.neighbour
                    }
                });
                tempItems.push(newRow);
            });
            this.items = [];
            this.items = [...tempItems];
        },

        clickCell: function () {
            var self = this;
            var cells = document.getElementsByClassName('cells');
            var myFunction = function () {
                var dataRow = this.getAttribute('data-row'),
                    dataColumn = this.getAttribute('data-column'),
                    rowEles = document.getElementById('table').children;
                if (self.items[dataRow][dataColumn].state) {
                    self.items[dataRow][dataColumn].state = 0;
                    rowEles[dataRow].children[dataColumn].style.backgroundColor = "#666";
                } else {
                    self.items[dataRow][dataColumn].state = 1;
                    rowEles[dataRow].children[dataColumn].style.backgroundColor = "#833b3b";
                }
            };
            Array.from(cells).forEach(element => {
                element.addEventListener('click', myFunction);
            });
        },

        drawCells: function () {
            var test = 0;
            var appendElemts = '',
                table = document.getElementById('table'),
                tableDimenssion = table.clientWidth;
            while(table.firstChild) {
                table.removeChild(table.firstChild);
                this.items = [];
            }
            for (var i = 0; i < this.maxCellRows; i++) {
                var rows = [],
                    rowElement = document.createElement('div');
                rowElement.style.height = (tableDimenssion/this.maxCellRows)+'px';
                rowElement.classList.add('row');
                for (var j = 0; j < this.maxCellRows; j++) {
                    var value = {},
                        element = document.createElement('div');
                    element.classList.add('cells');
                    element.style.width = (tableDimenssion/this.maxCellRows)+'px';
                    element.setAttribute('data-row', i);
                    element.setAttribute('data-column', j);
                    rowElement.appendChild(element);
                    value.x = i;
                    value.y = j;
                    value.state = 0 || this.applyState(value.x, value.y);
                    rows.push(value);
                }
                table.appendChild(rowElement);
                this.items.push(rows);
            }
            this.clickCell();
            this.getNeighbour();
            this.highLightCells();
        },

        next: function() {
            this.pause();
            this.getNeighbour();
            this.nextState();
            this.highLightCells();
        },

        play: function () {
            this.interval = setInterval(() => {
                this.getNeighbour();
                this.nextState();
                this.highLightCells();
            }, this.iteration);
        },

        pause: function () {
            clearInterval(this.interval);
        },

        speedInc: function () {
            this.iteration -= 50;
            this.pause(this);
            this.play(this);
        },

        speedDec: function () {
            this.iteration += 50;
            this.pause(this);
            this.play(this);
        },

        cellsInc: function () {
            this.maxCellRows += 10;
            this.drawCells();
        },

        cellsDec: function () {
            if (this.maxCellRows > 10) {
                this.maxCellRows -= 10;
                this.drawCells();
            }
        },

        control: function () {
            var next = document.getElementById('next'),
                play = document.getElementById('play'),
                pause = document.getElementById('pause'),
                speedInc = document.getElementById('speedinc'),
                speedDec = document.getElementById('speeddec'),
                cellsInc = document.getElementById('cellsinc'),
                cellsDec = document.getElementById('cellsdec');
            next.addEventListener('click', () => { this.next() }, false);
            play.addEventListener('click', () => { this.play() }, false);
            pause.addEventListener('click', () => { this.pause() }, false);
            speedInc.addEventListener('click', () => { this.speedInc() }, false);
            speedDec.addEventListener('click', () => { this.speedDec() }, false);
            cellsInc.addEventListener('click', () => { this.cellsInc() }, false);
            cellsDec.addEventListener('click', () => { this.cellsDec() }, false);
        },

        init: function (options) {
            this.maxCellRows = options.maxCellRows;
            this.iteration = options.iteration;
            this.drawCells();
            this.control();
        }
    };

    gameOfLife.init({
        maxCellRows: 60,
        iteration: 500
    });

})();
