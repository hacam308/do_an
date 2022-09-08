var categoryId = sessionStorage.getItem("category");
var idAnnotation = sessionStorage.getItem("idAnnotation");
if (categoryId != -1) {
    $('#Category').val(categoryId);
}

var arr = [];


var width = window.innerWidth;
var height = window.innerHeight;

var container = document.querySelector('#containerImage');

var stage = new Konva.Stage({
    container: 'containerImage',
    width: 1920,
    height: 1080,
});

var layer = new Konva.Layer();
var img = document.getElementById("Image");
var rect1 = new Konva.Rect({
    x: 0,
    y: 0,
    width: img.width,
    height: img.height,
    fillPatternImage: img,
});
layer.add(rect1);
stage.add(layer);
var url = window.location.pathname;
var image_id = url.substring(url.lastIndexOf('/') + 1);

window.onload = function () {
    $(document).ready(function () {
        $.ajax({
            data: { image_id, image_id },
            url: "/Image/getAnnotation",
            method: "GET",
            success: function (res) {
                drawBox(res, value, layer);
                if (idAnnotation != -1) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].attrs.id == idAnnotation) {
                            arr[i].fill('white');
                            tr.nodes([arr[i]]);
                            break;
                        }
                    }
                }
                categories.onchange = function () {
                    $.ajax({
                        data: { image_id, image_id },
                        url: "/Image/getAnnotation",
                        method: "GET",
                        success: function (res) {
                            arr = [];
                            layer.removeChildren();
                            layer.add(rect1);
                            //stage.add(layer);
                            tr.nodes([]);
                            value = categories.options[categories.selectedIndex].value;
                            addLayerSelection();
                            drawBox(res, value, layer);
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    });
                };
                //console.log(res)
            },
            error: function (err) {
                console.log(err.responseText);
            }
        });
    });
}

var tr = new Konva.Transformer();
layer.add(tr);

var colors = ['#3333ff', '#ff3300', '#ff00ff', '#00ff00', '#66ffff', '#9900ff'];
var categories = document.getElementById("Category");
var value = categories.options[categories.selectedIndex].value;



function drawBox(annatations, value, layer) {
    let i = 0;
    for (let item of annatations) {
        if (value == -1) {
            arr[i] = new Konva.Rect({
                x: item.bbox[0],
                y: item.bbox[1],
                width: item.bbox[2],
                height: item.bbox[3],
                fill: colors[item.category_id],
                draggable: true,
                name: 'rect',
                id: String(item.id),
                opacity: 0.5,
            });
            layer.add(arr[i]);
            arr[i].zIndex(1);
            tr.nodes([arr[i]]);
            i++;
        } else if (item.category_id == value) {
            arr[i] = new Konva.Rect({
                x: item.bbox[0],
                y: item.bbox[1],
                width: item.bbox[2],
                height: item.bbox[3],
                fill: colors[item.category_id],
                draggable: true,
                name: 'rect',
                id: String(item.id),
                opacity: 0.5,
            });
            layer.add(arr[i]);
            arr[i].zIndex(1);
            tr.nodes([arr[i]]);
            i++;
        }
    }
    tr.nodes([]);
}

function addLayerSelection() {
    layer.add(tr);
    // add a new feature, lets add ability to draw selection rectangle
    var selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false,
    });
    layer.add(selectionRectangle);

    // clicks should select/deselect shapes
    stage.on('click tap', function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
            return;
        }

        // if click on empty area - remove all selections
        if (e.target === stage) {
            tr.nodes([]);
            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName('rect')) {
            return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            tr.nodes([]);
            tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            const nodes = tr.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            nodes.splice(nodes.indexOf(e.target), 1);
            tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // add the node into selection
            const nodes = tr.nodes().concat([e.target]);
            tr.nodes(nodes);
        }
    });
}
addLayerSelection();


var btnSave = document.getElementById("btn_save");
btnSave.onclick = function () {
    tr.nodes([]);
    var json = stage.toJSON();
    console.log(json);
    $.ajax({
        type: 'POST',
        url: '/Image/UpdateAnnotation',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: { annotation_json: json, image_id: image_id},
        success: function (result) {
            alert('Successfully received Data ');
            console.log(result);
        },
        error: function (err) {
            console.log("loi roi");
            console.log(err.responseText);
            console.log(err)
        }
    })
};

var btnCancel = document.getElementById("btn_cancel");

btnCancel.onclick = function () {
    sessionStorage.setItem("reload", 0);
    history.back();
}