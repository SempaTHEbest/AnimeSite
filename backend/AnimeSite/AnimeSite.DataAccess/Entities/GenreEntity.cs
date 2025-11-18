namespace AnimeSite.DataAccess.Entities;

public class GenreEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    public ICollection<AnimeGenreEntity> AnimeGenres { get; set; } = new List<AnimeGenreEntity>();
}