function polar_to_cartesian(r, t) {
    //radians to degrees, requires the t*pi/180
    var x = r * Math.cos((t * Math.PI / 180));
    var y = r * Math.sin((t * Math.PI / 180));
    return [x, y];
};


function init(h, w, data) {
    $('#title').text(document.title);

    var labelTopOffset = 20;
    var labelLeftOffset = 25;

    var wedges = [1, .85, .65, .4];
    var labels = ["Avoid",  "Discuss", "Trial", "Adopt"];
    var colours = ["#e6ccff", "#cc99ff", "#a64dff", "#6f5499"];


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

    for( var s = 3;s>=0;s--) {

        /**
         * Create a list of items for this sector,
         * remove duplicates due to versions.
         * It relies on the fact that the items are ordered
         */
        var items = [];
        var lastId=-1;
        for( var l=0;l<data.length;l++) {
            if( data[l].status==labels[s] && data[l].id!=lastId) {
                items.push(data[l]);
                lastId=data[l].id;
            }
        }


        /**
         * Draw the items on the chart
         */
        var itemsPerRow = items.length;

        var angle = 80 / itemsPerRow;
        var numRows = 1;

        while (angle < 10) {
            numRows += 1;
            itemsPerRow = Math.ceil(items.length / numRows);
            angle = 80 / itemsPerRow;
        }


        var index = s;
        var outer = w * wedges[index];
        var inner = w * ( index == 3 ? 0.1 : wedges[index + 1]);
        var spacing = (outer - inner) / (numRows + 1);

        var itemNum = 0;

        for (var row = 1; row <= numRows; row++) {
            var t = 10.0;
            var r = inner + (spacing * row);

            for (var i = 0; itemNum < items.length && i < itemsPerRow; i++) {
                var item = items[itemNum];

                var point = polar_to_cartesian(r, t);

                radar.add(pv.Dot)
                    .event("click", function() {
                        self.location = "#tech" + this.techNumber();
                    })
                    .strokeStyle("#900")
                    .fillStyle("#900")
                    .left(point[0])
                    .bottom(point[1])
                    .shape(item.state == "new" ? "triangle" : "circle")
                    .size(100)
                    .title(item.name)
                    .def("techNumber", item.num);

                radar.add(pv.Label)
                    .left(point[0])
                    .bottom(point[1] - 6)
                    .textAlign("center")
                    .textStyle("white")
                    .text(item.num);

                t += angle;
                itemNum += 1;
            }
        }
    }


    radar.anchor('radar');
    radar.render();

};