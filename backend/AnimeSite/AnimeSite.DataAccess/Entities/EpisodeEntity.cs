namespace AnimeSite.DataAccess.Entities;

public class EpisodeEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; } =  string.Empty;
    public string Summary { get; set; } = string.Empty;
    public int SeasonNumber { get; set; }
    public int EpisodeNumber { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string EpisodeLink { get; set; } =  string.Empty;
    
    public Guid AnimeId { get; set; }
    public AnimeEntity Anime { get; set; } = null!;
}