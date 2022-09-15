using do_an.Models;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.Dynamic;
using System.IO;

namespace do_an.Controllers
{
    public class ImageController : Controller
    {
        Root items = new Root();
        public IActionResult Index()
        {
            items = items.init();
            return View(items);
        }

        public ActionResult OpenImage(int Id)
        {
            items = items.init();

            var image = items.images.Where(i => i.id == Id).FirstOrDefault();
            return View(image);
        }

        public ActionResult EditImage(int Id)
        {
            items = items.init();

            var image = items.images.Where(i => i.id == Id).FirstOrDefault();
            return View(image);
        }

        public IActionResult FilterImage()
        {
            return View();
        }

        public JsonResult FilterCategory(int fromId, int toId, int categoryId)
        {
            items = items.init();
            var arrCategory = (from category in items.categories
                         where categoryId == category.id
                         select category).ToList();
            var arrAnnotation = (from annotation in items.annotations
                                where annotation.image_id >= fromId
                                where annotation.image_id <= toId
                                where annotation.category_id == categoryId
                                select annotation).ToList();
            var arrImage = (from image in items.images
                           where image.id >= fromId
                           where image.id <= toId
                           select image).ToList();

            return Json(new Root(arrImage,arrCategory,arrAnnotation));
        }

        public JsonResult getAnnotation(int image_id)
        {
            items = items.init();
            var result = from item in items.annotations
                         where item.image_id == image_id
                         select item;

            return Json(result);
        }
        public static bool HasProperty(dynamic obj, string name)
        {
            Type objType = obj.GetType();

            if (objType == typeof(ExpandoObject))
            {
                return ((IDictionary<string, object>)obj).ContainsKey(name);
            }

            return objType.GetProperty(name) != null;
        }


        [HttpPost]
        public async Task<IActionResult> UpdateAnnotation(string annotation_json, int image_id)
        {
            dynamic config = JsonConvert.DeserializeObject<ExpandoObject>(annotation_json, new ExpandoObjectConverter());
            items = items.init();
            List<Annotation> list_anno = items.annotations.Where(i => i.image_id == image_id).ToList();
            dynamic temp;
            foreach (var rect in ((IEnumerable<dynamic>)config.children))
            {
                temp = rect.children;
                //dynamic temp1 = temp[4].attrs;
                foreach(var item in temp)
                {
                    try
                    {
                        dynamic update_bbox = item.attrs;
                        foreach (var item_anno in list_anno)
                        {
                            if (HasProperty(update_bbox, "x") && HasProperty(update_bbox, "id"))
                            {
                                if (update_bbox.id == item_anno.id.ToString())
                                {
                                    item_anno.bbox[0] = update_bbox.x;
                                    item_anno.bbox[1] = update_bbox.y;
                                    if (HasProperty(update_bbox, "scaleX") && HasProperty(update_bbox, "scaleY"))
                                    {
                                        item_anno.bbox[2] = (double)(update_bbox.width * update_bbox.scaleX);
                                        item_anno.bbox[3] = (double)(update_bbox.height * update_bbox.scaleY);
                                        item_anno.area = (double)(item_anno.bbox[2] * item_anno.bbox[3]);
                                    }else if(HasProperty(update_bbox, "scaleX"))
                                    {
                                        item_anno.bbox[2] = (double)(update_bbox.width * update_bbox.scaleX);
                                        //item_anno.bbox[3] = (double)(update_bbox.height * update_bbox.scaleY);
                                        item_anno.area = (double)(item_anno.bbox[2] * item_anno.bbox[3]);
                                    }
                                    items.UpdateAnnotation(items.annotations, item_anno);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }
            //var itemmm = items.annotations;
            items.deleteJson();
            items.writeJson(items);
            return this.Ok("Form Data received!");
        }
    }
}

