function _smooth(html) {
  return (
    Object.assign(html`<form style="font: 12px var(--sans-serif); display: flex; flex-direction: column; justify-content: center; min-height: 33px;"><label style="display: flex; align-items: center;">${Object.assign(html`<input style="margin: 0 0.4em 0 0;" type=checkbox name=i>`, { checked: true, onclick() { this.form.value = this.checked; this.form.dispatchEvent(new CustomEvent("input")); } })}${document.createTextNode("smooth contours")}`, { value: true })
  )
}

function _color(d3, data) {
  return (
    d3.scaleSequential(d3.interpolateGreys).domain(d3.extent(data.values)).nice()
  )
}


function _contours(d3, data, smooth) {
  return (
    d3.contours().size([data.width, data.height]).smooth(smooth)
  )
}

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
  var scale = 13.218390804597702

  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  var r = _chart(width, height, d3, scale, 2000, thresholds, contour, data, color, canvas)

  setInterval(() => {
    r.next()
  }, 100)
})


function* _chart(width,height,d3,scale,duration,thresholds,contours,data,color, canvas)
{
  const r = width / height;
  // const context = DOM.context2d(width, wide ? height : width * r);
  canvas.height = height * scale
  canvas.width = width * scale
  const context = canvas.getContext('2d')

  let wide = true
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