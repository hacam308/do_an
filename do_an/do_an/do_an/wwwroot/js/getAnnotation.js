window.onload = function () {
    var url = window.location.pathname;
    var image_id = url.substring(url.lastIndexOf('/') + 1);
    $(document).ready(function () {
        $.ajax({
            data: { image_id, image_id },
            url: "/Image/getAnnotation",
            method: "GET",
            success: function (res) {
                drawBox(ctx, res, value);
                categories.onchange = function () {
                    value = categories.options[categories.selectedIndex].value;
                    ctx.drawImage(img, 0, 0);
                    drawBox(ctx, res, value);
                    console.log(value);
                };
                console.log(res)
            },
            error: function (err) {
                console.log(err)
            }
        });
    });



    // Retrieve <canvas> element <- (1)

    var canvas = document.getElementById('ImageCanvas');

    if (!canvas) {

        console.log('Failed to retrieve the <canvas> element');

        return;

    }
    var img = document.getElementById("Image");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match

    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)

    ctx.drawImage(img, 0, 0);

}

var colors = ['#3333ff', '#ff3300', '#ff00ff', '#00ff00', '#66ffff', '#9900ff'];
var categories = document.getElementById("Category");
var value = categories.options[categories.selectedIndex].value;


function drawBox(ctx, annatations, value) {
    for (var item of annatations) {
        if (value == -1) {
            ctx.beginPath();
            ctx.rect(item.bbox[0], item.bbox[1], item.bbox[2], item.bbox[3]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors[item.category_id];
            ctx.closePath();
            ctx.stroke();
        } else if (item.category_id == value) {
            ctx.beginPath();
            ctx.rect(item.bbox[0], item.bbox[1], item.bbox[2], item.bbox[3]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors[item.category_id];
            ctx.closePath();
            ctx.stroke();
        }
    }
}



