namespace AnimeSite.DataAccess.Entities;

public class WatchHistoryEntity
{
    public Guid UserId { get; set; }
    public Guid EpisodeId { get; set; }
    public DateTime WatchedDate { get; set; }
    
    public UserEntity User { get; set; } = null!;
    public EpisodeEntity Episode { get; set; } = null!;
}