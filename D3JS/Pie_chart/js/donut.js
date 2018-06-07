/*
 *    donutChart.js
 *    Mastering Data Visualization with D3.js
 *    FreedomCorp Dashboard
 */

DonutChart = function (_parentElement, _yv, _legendArray, _title, _data) {
    this.parentElement = _parentElement;
    this.legendArray = _legendArray;
    this.yv = _yv;
    this.title = _title;
    this.data = _data;
    this.initVis();
};

DonutChart.prototype.initVis = function () {
    var vis = this;
    vis.margin = {
        left: 40,
        right: 100,
        top: 40,
        bottom: 10
    };
    vis.width = +$(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = +$(vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
    vis.radius = Math.min(vis.width, vis.height) / 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2) - 50) +
            ", " + (vis.margin.top + (vis.height / 2)) + ")");
    vis.tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function (d) {
            console.log(d);
            return d.data[vis.yv];
        })
    vis.svg.call(vis.tip)
    vis.pie = d3.pie()
        .value(function (d) {
            return d[vis.yv];
        })
        .sort(null);

    vis.arc = d3.arc()
        .innerRadius(vis.radius - (vis.radius / 4))
        .outerRadius(vis.radius);

    vis.g.append("text")
        .attr("class", "title")
        .attr("y", -10 - (vis.height / 2))
        .attr("x", -10)
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text(vis.title)

    vis.color = d3.scaleOrdinal(["red", "green", "grey", "blue"]);

    vis.addLegend();
    vis.wrangleData(vis.yv);
}

DonutChart.prototype.wrangleData = function (_yv) {
    var vis = this;

    // sizeNest = d3.nest()
    // 	.key(function(d){
    // 		return d.company_size
    // 	})
    // 	.entries(calls)

    // vis.data = sizeNest.map(function(size){
    //     return {
    //         value: size.key,
    //         count: size.values.length
    //     }
    // })
    vis.yv = _yv;
    vis.updateVis();
}

DonutChart.prototype.updateVis = function () {
    var vis = this;

    vis.path = vis.g.selectAll("path")
        .data(vis.pie(vis.data));
    console.log("Hello")
    vis.path.attr("class", "update arc")
        .transition()
        .duration(750)
        .attrTween("d", arcTween);

    vis.path.enter().append("path")
        .attr("class", "enter arc")
        .attr("fill", function (d) {
            console.log(d)
            return vis.color(d.data[vis.yv]);
        })
        .on("mouseover", vis.tip.show)
        .on("mouseout", vis.tip.hide)
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
    vis.enterArc = d3.selectAll(".enter.arc")
        .append("title")
    // Only want to attach this once!
    vis.enterArc.text(function (d) {
        return d.data[vis.yv]
    })

    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function (t) {
            return vis.arc(i(t));
        };
    }

}

DonutChart.prototype.addLegend = function () {
    var vis = this;

    var legend = vis.g.append("g")
        .attr("transform", "translate(" + (vis.width - (vis.width / 10) - 30) + ", " + (vis.height / 2 - vis.margin.top - 30) + ")");

    var legends = [];
    for (let i = 0; i < vis.legendArray.length; i++) {
        legends.push({
            label: vis.legendArray[i],
            color: vis.color(vis.legendArray[i])
        })

    }

    var legendRow = legend.selectAll(".legendRow")
        .data(legends)
        .enter().append("g")
        .attr("class", "legendRow")
        .attr("transform", function (d, i) {
            return "translate(" + 0 + ", " + (i * 20) + ")"
        });

    legendRow.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function (d) {
            return d.color;
        });

    legendRow.append("text")
        .attr("class", "legendText")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .text(function (d) {
            return d.label;
        });
}