namespace AnimeSite.DataAccess.Entities;

public class AnimeEntity
{
    public Guid Id { get; set; }
    
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string ImageUrl { get; set; }
    
    public double Rating { get; set; }
    
    public required string Studio { get; set; }
    public required string Status { get; set; }
    public required string Type { get; set; }
    
    public DateTime ReleaseDate { get; set; } 
    public int? TotalEpisodes { get; set; } 

    public ICollection<AnimeGenreEntity> AnimeGenres { get; set; } = new List<AnimeGenreEntity>();
    public ICollection<EpisodeEntity> Episodes { get; set; } = new List<EpisodeEntity>();
}