namespace do_an.Models
{
    public class Annotation
    {
        public List<double> bbox { get; set; }
        public int category_id { get; set; }
        public int image_id { get; set; }
        public int iscrowd { get; set; }
        public double area { get; set; }
        public int person_id { get; set; }
        public int cam_id { get; set; }
        public int id { get; set; }

        public void UpdateBbox(Annotation annotation)
        {
            this.bbox = annotation.bbox;
            this.area = annotation.area;
        }
    }
}
