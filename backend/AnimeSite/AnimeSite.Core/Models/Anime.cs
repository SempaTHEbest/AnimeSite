namespace AnimeSite.Core.Models;

public class Anime
{
    private Anime(Guid id, string title, string description, string imageUrl, double rating, string studio, string status, string type, DateTime releaseDate, int? totalEpisodes)
    {
        Id = id;
        Title = title;
        Description = description;
        ImageUrl = imageUrl;
        Rating = rating;
        Studio = studio;
        Status = status;
        Type = type;
        ReleaseDate = releaseDate; 
        TotalEpisodes = totalEpisodes;
    }
    
    public Guid Id { get; }
    public string Title { get; }
    public string Description { get; }
    public string ImageUrl { get; }
    public double Rating { get; }
    public string Studio { get; }
    public string Status { get; }
    public string Type { get; }
    public DateTime ReleaseDate { get; } 
    public int? TotalEpisodes { get; }
    
    public IReadOnlyCollection<Genre> Genres { get; set; } = new List<Genre>();
    public IReadOnlyCollection<Episode> Episodes { get; set; } = new List<Episode>();

    public static (Anime anime, string Error) Create(Guid id, string title, string description, string imageUrl,
        double rating, string studio, string status, string type, DateTime releaseDate, int? totalEpisodes) // <<< Зміни тут
    {
        var error = string.Empty;
        
        if (string.IsNullOrWhiteSpace(title))
        {
            error += "Title is required. ";
        }
        if (string.IsNullOrWhiteSpace(studio))
        {
            error += "Studio is required. ";
        }
        if (rating < 0.0 || rating > 10.0)
        {
            error += "Rating must be between 0.0 and 10.0. ";
        }
        if (releaseDate == default) 
        {
             error += "Release Date is required. ";
        }
        
        if (!string.IsNullOrEmpty(error))
        {
            return (null!, error.Trim());
        }
        
        var anime = new Anime(id, title, description, imageUrl, rating, studio, status, type, releaseDate, totalEpisodes);

        return (anime, error);
    }
}