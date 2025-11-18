namespace AnimeSite.DataAccess.Entities;

public class AnimeGenreEntity
{
    public  Guid AnimeId { get; set; }
    public Guid  GenreId { get; set; }

    public AnimeEntity Anime { get; set; } = null!;
    public GenreEntity Genre { get; set; } = null!;
}