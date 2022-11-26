// https://observablehq.com/@d3/contours-smooth@242
function _1(md){return(
md`# Smooth Contours

[*contours*.smooth](https://github.com/d3/d3-contour/blob/master/README.md#contours_smooth) applies linear interpolation to the computed contour lines. This is useful for low-density data such as the [Maungawhau elevation dataset](/@d3/volcano-contours) shown here. Enabled by default, you may want to disable smoothing for faster contour computation on [high-density data](/@d3/geotiff-contours).`
)}

function _smooth(html){return(
Object.assign(html`<form style="font: 12px var(--sans-serif); display: flex; flex-direction: column; justify-content: center; min-height: 33px;"><label style="display: flex; align-items: center;">${Object.assign(html`<input style="margin: 0 0.4em 0 0;" type=checkbox name=i>`, {checked: true, onclick() { this.form.value = this.checked; this.form.dispatchEvent(new CustomEvent("input")); }})}${document.createTextNode("smooth contours")}`, {value: true})
)}

function* _chart(width,height,DOM,wide,d3,scale,duration,thresholds,contours,data,color)
{
  const r = width / height;
  const context = DOM.context2d(width, wide ? height : width * r);

  if (!wide) {
    context.translate(width / 2, height / 2);
    context.rotate(Math.PI / 2);
    context.translate(-height / 2, -width / 2);
    context.scale(r, r);
  }

  const path = d3.geoPath(null, context);

  context.scale(scale, scale);
  context.lineWidth = 0.5 / scale;
  context.strokeStyle = "#fff";

  while (true) {
    const t = (performance.now() / duration) % 1;

    for (const [a, b] of d3.pairs(thresholds)) {
      const d = a * (1 - t) + b * t;
      context.beginPath();
      path(contours.contour(data.values, d));
      context.fillStyle = color(d);
      context.fill();
      context.stroke();
    }

    yield context.canvas;
  }
}


function _contours(d3,data,smooth){return(
d3.contours().size([data.width, data.height]).smooth(smooth)
)}

function _height(data,width){return(
Math.round(data.height / data.width * width)
)}

function _scale(width,data){return(
width / data.width
)}

function _duration(){return(
2000
)}

function _wide(Generators,innerWidth,addEventListener,removeEventListener){return(
Generators.observe(notify => {
  let wide;
  function resized() {
    let w = innerWidth > 640;
    if (w !== wide) notify(wide = w);
  }
  resized();
  addEventListener("resize", resized);
  return () => removeEventListener("resize", resized);
})
)}

function _color(d3,data){return(
d3.scaleSequential(d3.interpolateGreys).domain(d3.extent(data.values)).nice()
)}

function _thresholds(color){return(
color.ticks(20)
)}

function _data(FileAttachment){return(
FileAttachment("volcano.json").json()
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["volcano.json", {url: new URL("./volcano.json", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof smooth")).define("viewof smooth", ["html"], _smooth);
  main.variable(observer("smooth")).define("smooth", ["Generators", "viewof smooth"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["width","height","DOM","wide","d3","scale","duration","thresholds","contours","data","color"], _chart);
  main.variable(observer("contours")).define("contours", ["d3","data","smooth"], _contours);
  main.variable(observer("height")).define("height", ["data","width"], _height);
  main.variable(observer("scale")).define("scale", ["width","data"], _scale);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer("wide")).define("wide", ["Generators","innerWidth","addEventListener","removeEventListener"], _wide);
  main.variable(observer("color")).define("color", ["d3","data"], _color);
  main.variable(observer("thresholds")).define("thresholds", ["color"], _thresholds);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
