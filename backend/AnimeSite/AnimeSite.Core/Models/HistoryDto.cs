namespace AnimeSite.Core.Models;

public class HistoryDto
{
    public Guid AnimeId { get; set; }
    public string AnimeTitle { get; set; } = string.Empty;
    public string AnimeImageUrl { get; set; } = string.Empty;
    public int? TotalEpisodes { get; set; }
    
    public Guid EpisodeId { get; set; }
    public int EpisodeNumber { get; set; }
    
    public DateTime WatchedDate { get; set; }
}