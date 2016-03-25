function init(h, w) {
    $('#title').text(document.title);

    var labelTopOffset = 20;
    var labelLeftOffset = 25;

    var wedges = [1, .85, .65, .4];
    var labels = ["Hold", "Trial", "Assess", "Adopt"];
    var colours = ["#ccf", "#aaf", "#77f", "#55f"]

    var data = {
        "category" : "Adopt",
        "items": [
            {"name": "Java", state: "nochange", num: 1},
            {"name": "Scala", state: "nochange", num: 2},
            {"name": "NodeJS", state: "new", num: 3},
            {"name": "Java", state: "nochange", num: 4},
            {"name": "Scala", state: "nochange", num: 5},
            {"name": "NodeJS", state: "new", num: 6},
            {"name": "Java", state: "nochange", num: 7},
            {"name": "Scala", state: "nochange", num: 8},
            {"name": "NodeJS", state: "new", num: 9},
            {"name": "Java", state: "nochange", num: 10},
            {"name": "Scala", state: "nochange", num: 11},
            {"name": "NodeJS", state: "new", num: 12},
            {"name": "Scala", state: "nochange", num: 13},
            {"name": "NodeJS", state: "new", num: 14},
            {"name": "Java", state: "nochange", num: 15},
            {"name": "Scala", state: "nochange", num: 16},
            {"name": "NodeJS", state: "new", num: 17},
            {"name": "Java", state: "nochange", num: 18},
            {"name": "Scala", state: "nochange", num: 19},
            {"name": "NodeJS", state: "new", num: 20}
        ]
    };

    var radar = new pv.Panel()
        .width(w)
        .height(h)
        .canvas('radar')


    for (var i = 0; i < wedges.length; i++) {
        /**
         * Wedges
         */
        radar.add(pv.Wedge)
            .data([90])
            .left(0)
            .bottom(0)
            .strokeStyle('#333')
            .fillStyle(colours[i])
            .outerRadius(w * wedges[i])
            .angle(function (d) {
                d * Math.PI / 180
            });

        radar.add(pv.Label)
            .left(labelLeftOffset)
            .top(w * (1 - wedges[i]) + labelTopOffset)
            .textAlign("center")
            .textStyle("white")
            .text(labels[i]);
    }

    /**
     * Axis x
     */
    radar.add(pv.Line)
        .data([0, w])
        .lineWidth(2)
        .left(function (d) {
            return d;
        })
        .bottom(0)
        .strokeStyle("#900");

    /**
     * Axis y
     */
    radar.add(pv.Line)
        .data([0, h])
        .lineWidth(2)
        .left(0)
        .bottom(function (d) {
            return d;
        })
        .strokeStyle("#900");


    /**
     * Draw the items on the chart
     */
    var itemsPerRow = data.items.length;

    var angle=80/itemsPerRow;
    var numRows = 1;

    while( angle < 10 ) {
        numRows +=1;
        itemsPerRow = Math.ceil( data.items.length / numRows);
        angle=80/itemsPerRow;
    }


    var index = labels.indexOf(data.category);
    var outer = w * wedges[index];
    var inner = w * ( index==3 ? 0.1 : wedges[index+1]);
    var spacing = (outer-inner)/(numRows+1);

    var itemNum = 0;

    for(var row = 1;row<=numRows;row++) {
        var t = 10.0;
        var r = inner + (spacing*row);

        for (var i = 0; itemNum<data.items.length && i < itemsPerRow; i++) {
            var item = data.items[itemNum];

            var point = polar_to_cartesian(r, t);

            radar.add(pv.Dot)
                .strokeStyle("#900")
                .fillStyle("#900")
                .left(point[0])
                .bottom(point[1])
                .shape(item.state == "new" ? "triangle" : "circle")
                .size(100);

            radar.add(pv.Label)
                .left(point[0])
                .bottom(point[1] - 6)
                .textAlign("center")
                .textStyle("white")
                .text(item.num);

            t += angle;
            itemNum +=1;
        }
    }


    radar.anchor('radar');
    radar.render();

};