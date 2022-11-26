function _color(d3,data){
  return(
    d3.scaleSequential(d3.interpolateGreys).domain(d3.extent(data.values)).nice()
  )
}

function _contours(d3,width,height){return(
  d3.contours().size([width, height])
)}
  

fetch('./volcano.json').then((res) => {
  return res.json()
}).then((data) => {
  var color = _color(d3, data)
  var thresholds = color.ticks(20)
  console.log(thresholds)

  // var wide = Generators.observe(notify => {
  //   let wide;
  //   function resized() {
  //     let w = innerWidth > 640;
  //     if (w !== wide) notify(wide = w);
  //   }
  //   resized();
  //   addEventListener("resize", resized);
  //   return () => removeEventListener("resize", resized);
  // })
  var width = data.width
  var height = data.height

  var path = d3.geoPath()
  var contour = d3.contours().size([width, height])

  var r =  _chart(d3, true, width, height, thresholds, path, contour, data, color)
  
  let g
  let i = 0
  while (i < thresholds.length) {
    g = r.next().value
    i++
  }
  document.querySelector('body').appendChild(g)
})


function* _chart(d3,wide,width,height,thresholds,path,contours,data,color)
{
  const svg = d3.create("svg")
      .attr("viewBox", wide ? [0, 0, width, height] : [0, 0, height, width])
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("width", "calc(100% + 28px)")
      .style("height", "auto");

  // d3.select('body')
  //   .append(svg)

  const g = svg.append("g")
      .attr("transform", wide ? null : `
        rotate(90 ${width/2},${height/2})
        translate(${(width - height) / 2},${(width - height) / 2})
      `)
      .attr("stroke", "white")
      .attr("stroke-width", 0.03);
  
  // thresholds.forEach(async (threshold) => {
  //   g.append("path")
  //       .attr("d", path(contours.contour(data.values, threshold)))
  //       .attr("fill", color(threshold));

  //   await svg.node()
  // })
  for (const threshold of thresholds) {
    g.append("path")
        .attr("d", path(contours.contour(data.values, threshold)))
        .attr("fill", color(threshold));

    yield svg.node();
  }

}