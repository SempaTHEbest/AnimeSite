namespace AnimeSite.Core.Models;

public class WatchHistory
{
    private WatchHistory(Guid userId, Guid episodeId, DateTime watchedDate)
    {
        UserId = userId;
        EpisodeId = episodeId;
        WatchedDate = watchedDate;
    }

    public Guid UserId { get; }
    public Guid EpisodeId { get; }
    public DateTime WatchedDate { get; }

    public static WatchHistory Create(Guid userId, Guid episodeId)
    {
        return new WatchHistory(userId, episodeId, DateTime.UtcNow);
    }
}