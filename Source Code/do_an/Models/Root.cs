using Newtonsoft.Json;

namespace do_an.Models
{
    public class Root
    {
        public List<Image> images { get; set; }
        public List<Category> categories { get; set; }
        public List<Annotation> annotations { get; set; }

        public Root()
        {

        }

        public Root(List<Image> _images, List<Category> _categorie, List<Annotation> _annotations)
        {
            this.images = _images;
            this.categories = _categorie;
            this.annotations = _annotations;
        }


        public Root init()
        {
            Root root = new Root();
            using (StreamReader r = new StreamReader(@"wwwroot\annotation.json"))
            {
                string json = r.ReadToEnd();
                root = JsonConvert.DeserializeObject<Root>(json);
            }
            return root;
        }

        public void deleteJson()
        {
            string rootFolder = @"wwwroot\annotation.json";
            string authorsFile = "annotation.json";
            try
            {
                // Check if file exists with its full path    
                if (File.Exists(Path.Combine(rootFolder, authorsFile)))
                {
                    // If file found, delete it    
                    File.Delete(Path.Combine(rootFolder, authorsFile));
                }
            }
            catch (IOException ioExp)
            {
                Console.WriteLine(ioExp.Message);
            }
        }

        public void writeJson(Root _data)
        {
            using (StreamWriter file = File.CreateText(@"wwwroot\annotation.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                //serialize object directly into file stream
                serializer.Serialize(file, _data);
            }
        }

        public void UpdateAnnotation(List<Annotation> annotations, Annotation update_anno)
        {
            for(int i = 0; i < this.annotations.Count; i++)
            {
                if(annotations[i].id == update_anno.id)
                {
                    annotations[i].UpdateBbox(update_anno);
                    break;
                }
            }
        }
    }
}
