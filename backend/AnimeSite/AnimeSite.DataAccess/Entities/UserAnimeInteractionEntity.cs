namespace AnimeSite.DataAccess.Entities;

public class UserAnimeInteractionEntity
{
    public Guid UserId { get; set; }
    public Guid AnimeId { get; set; }
    
    public int? Rating { get; set; }
    public bool IsWatchLater { get; set; }

    public UserEntity User { get; set; } = null!;
    public AnimeEntity Anime { get; set; } = null!;
}