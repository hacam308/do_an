var fromId = sessionStorage.getItem("from_id");
var toId = sessionStorage.getItem("to_id");
var categoryId = sessionStorage.getItem("category");
var reload = sessionStorage.getItem("reload");
var idAnnotation = sessionStorage.getItem("idAnnotation");
var hiddenImage = "", filter = "";

window.onload = function () {
    $.ajax({
        data: { fromId: fromId, toId: toId, categoryId: categoryId },
        url: "/Image/FilterCategory",
        method: "GET",
        success: function (res) {
            if (res.annotations.length == 0) {
                reload = 1;
                alert("Not have any image match your search");
            } else {
                res.images.forEach(element => {
                    var imagePath = "\\wwwroot\\Images\\" + element.file_name;
                    hiddenImage += "<img src=\"" + imagePath + "\" hidden height=\"100px\" id=\"" + element.file_name + "\" />";
                    document.getElementById("abc").innerHTML = hiddenImage;
                    res.annotations.forEach(item => {
                        if (element.id == item.image_id) {
                            filter += "<a onClick=\"sessionStorage.idAnnotation ="+ item.id + "\";\" href=\"../Image/EditImage/" + element.id + "\">";
                            filter += "<canvas id = \"" + item.id + "\"></canvas>"
                            filter += "</a>";
                        }
                    })
                });
                document.getElementById("filter").innerHTML = filter;
                res.images.forEach(element => {
                    var image = document.getElementById(element.file_name);
                    res.annotations.forEach(item => {
                        if (element.id == item.image_id) {
                            let canvas = document.getElementById(item.id);
                            let ctx = canvas.getContext('2d');
                            //canvas.width = item.bbox[2] + 10;
                            //canvas.height = item.bbox[3] + 10;
                            canvas.width = 150 + 10;
                            canvas.height = 150 + 10;
                            ctx.drawImage(image, item.bbox[0], item.bbox[1], item.bbox[2], item.bbox[3], 5, 5, 150, 150);
                            //ctx.drawImage(image, item.bbox[0], item.bbox[1], item.bbox[2], item.bbox[3], 5, 5, item.bbox[2], item.bbox[3]);
                        }
                    });
                });
            }
            if (idAnnotation != -1 && reload != 0) {
                let canvas2 = document.getElementById(idAnnotation);
                canvas2.style.border = '2px solid red';
                window.scrollTo(canvas2.offsetLeft, canvas2.offsetTop);
            }
            if (reload == 0) {
                window.setTimeout('location.reload()', 600); //Reloads
                sessionStorage.setItem("reload", 1);
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}