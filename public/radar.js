function init(h, w) {
    $('#title').text(document.title);

    var labelTopOffset = 20;
    var labelLeftOffset = 25;

    var wedges = [ 1 ,.75 ,.5 ,.25 ];
    var labels = [ "Hold" , "Trial" , "Assess" , "Adopt"];
    var colours = [ "#ccf" , "#aaf" , "#77f" , "#55f"]

    var radar = new pv.Panel()
        .width(w)
        .height(h)
        .canvas('radar')


    for( var i=0;i<wedges.length;i++) {
        console.log("Drawing");
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
            .top(w * (1- wedges[i]) + labelTopOffset)
            .textAlign("center")
            .textStyle("white")
            .text( labels[i] );
    }

    /**
     * Axis x
     */
    radar.add(pv.Line)
        .data([ 0 , w ])
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
        .data([ 0 , h ])
        .lineWidth(2)
        .left(0)
        .bottom(function (d) {
            return d;
        })
        .strokeStyle("#900");





//Quadrant Ledgends
//    var radar_quadrant_ctr = 1;
//    var quadrantFontSize = 18;
//    var headingFontSize = 14;
//    var lastQuadrant = '';
//    var spacer = 6;
//    var fontSize = 10;
//    var total_index = 1;
//
////TODO: Super fragile: re-order the items, by radius, in order to logically group by the rings.
//    for (var i = 0; i < radar_data.length; i++) {
//        //adjust top by the number of headings.
//        if (lastQuadrant != radar_data[i].quadrant) {
//            radar.add(pv.Label)
//                .left(radar_data[i].left)
//                .top(radar_data[i].top)
//                .text(radar_data[i].quadrant)
//                .strokeStyle(radar_data[i].color)
//                .fillStyle(radar_data[i].color)
//                .font(quadrantFontSize + "px sans-serif");
//
//            lastQuadrant = radar_data[i].quadrant;
//
//        }
//
//        var itemsByStage = _.groupBy(radar_data[i].items, function (item) {
//            return Math.floor(item.pc.r / 100)
//        });
//        var offsetIndex = 0;
//        for (var stageIdx in _(itemsByStage).keys()) {
//
//            if (stageIdx > 0) {
//                offsetIndex = offsetIndex + itemsByStage[stageIdx - 1].length + 1;
//                console.log("offsetIndex = " + itemsByStage[stageIdx - 1].length, offsetIndex);
//            }
//
//            radar.add(pv.Label)
//                .left(radar_data[i].left + headingFontSize)
//                .top(radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + (offsetIndex * fontSize))
//                .text(radar_arcs[stageIdx].name)
//                .strokeStyle('#cccccc')
//                .fillStyle('#cccccc')
//                .font(headingFontSize + "px Courier New");
//
//            radar.add(pv.Label)
//                .left(radar_data[i].left)
//                .top(radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + (offsetIndex * fontSize))
//                .strokeStyle(radar_data[i].color)
//                .fillStyle(radar_data[i].color)
//                .add(pv.Dot)
//                .def("i", radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + spacer + (offsetIndex * fontSize))
//                .data(itemsByStage[stageIdx])
//                .top(function () {
//                    return ( this.i() + (this.index * fontSize) );
//                })
//                .shape(function (d) {
//                    return (d.movement === 't' ? "triangle" : "circle");
//                })
//                .cursor(function (d) {
//                    return ( d.url !== undefined ? "pointer" : "auto" );
//                })
//                .event("click", function (d) {
//                    if (d.url !== undefined) {
//                        self.location = d.url
//                    }
//                })
//                .size(fontSize)
//                .angle(45)
//                .anchor("right")
//                .add(pv.Label)
//                .text(function (d) {
//                    return radar_quadrant_ctr++ + ". " + d.name;
//                });
//
//            radar.add(pv.Dot)
//                .def("active", false)
//                .data(itemsByStage[stageIdx])
//                .size(function (d) {
//                    return ( d.blipSize !== undefined ? d.blipSize : 70 );
//                })
//                .left(function (d) {
//                    var x = polar_to_raster(d.pc.r, d.pc.t)[0];
//                    //console.log("name:" + d.name + ", x:" + x);
//                    return x;
//                })
//                .bottom(function (d) {
//                    var y = polar_to_raster(d.pc.r, d.pc.t)[1];
//                    //console.log("name:" + d.name + ", y:" + y);
//                    return y;
//                })
//                .title(function (d) {
//                    return d.name;
//                })
//                .cursor(function (d) {
//                    return ( d.url !== undefined ? "pointer" : "auto" );
//                })
//                .event("click", function (d) {
//                    if (d.url !== undefined) {
//                        self.location = d.url
//                    }
//                })
//                .angle(Math.PI)  // 180 degrees in radians !
//                .strokeStyle(radar_data[i].color)
//                .fillStyle(radar_data[i].color)
//                .shape(function (d) {
//                    return (d.movement === 't' ? "triangle" : "circle");
//                })
//                .anchor("center")
//                .add(pv.Label)
//                .text(function (d) {
//                    return total_index++;
//                })
//                .textBaseline("middle")
//                .textStyle("white");
//
//
//        }
//    }

    radar.anchor('radar');
    radar.render();

};